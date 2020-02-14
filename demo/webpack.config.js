const { join, relative, resolve, sep } = require('path');

const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

const nsWebpack = require('nativescript-dev-webpack');
const nativescriptTarget = require('nativescript-dev-webpack/nativescript-target');
const { NativeScriptWorkerPlugin } = require('nativescript-worker-loader/NativeScriptWorkerPlugin');
const hashSalt = Date.now().toString();
const mergeOptions = require('merge-options');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const svelteNativePreprocessor = require('svelte-native-preprocessor');
const { existsSync } = require('fs');

module.exports = (env, params = {}) => {
    // Add your custom Activities, Services and other android app components here.
    const appComponents = ['tns-core-modules/ui/frame', 'tns-core-modules/ui/frame/activity'].concat(params.appComponents || []);
    console.log('appComponents', appComponents);

    const platform = env && ((env.android && 'android') || (env.ios && 'ios'));
    if (!platform) {
        throw new Error('You need to provide a target platform!');
    }

    const platforms = ['ios', 'android'];
    const projectRoot = params.projectRoot || __dirname;
    console.log('projectRoot', projectRoot);

    let tsconfig = params.tsconfig;
    if (!tsconfig) {
        tsconfig = 'tsconfig.json';
        if (existsSync(resolve(projectRoot, `tsconfig.${platform}.json`))) {
            tsconfig = `tsconfig.${platform}.json`;
        }
    }
    console.log('tsconfig', tsconfig);

    // Default destination inside platforms/<platform>/...
    const dist = resolve(projectRoot, nsWebpack.getAppPath(platform, projectRoot));
    // const appResourcesPlatformDir = platform === 'android' ? 'Android' : 'iOS';

    const {
        // The 'appPath' and 'appResourcesPath' values are fetched from
        // the nsconfig.json configuration file
        // when bundling with `tns run android|ios --bundle`.
        appPath = 'app',
        appResourcesPath = 'app/App_Resources',
        development = false,
        // You can provide the following flags when running 'tns run android|ios'
        snapshot, // --env.snapshot
        uglify, // --env.uglify
        production, // --env.production
        report, // --env.report
        hmr, // --env.hmr
        sourceMap, // --env.sourceMap
        hiddenSourceMap, // --env.hiddenSourceMap
        inlineSourceMap, // --env.inlineSourceMap
        unitTesting, // --env.unitTesting
        verbose, // --env.verbose
        snapshotInDocker, // --env.snapshotInDocker
        skipSnapshotTools, // --env.skipSnapshotTools
        compileSnapshot, // --env.compileSnapshots
        sentry, // --env.sentry
        devlog, // --env.devlog
        adhoc // --env.adhoc
    } = env;

    if (adhoc) {
        env = Object.assign({}, env, {
            production: true,
            sentry: true,
            sourceMap: true,
            uglify: true
        });
    }

    const useLibs = compileSnapshot;
    const isAnySourceMapEnabled = !!sourceMap || !!hiddenSourceMap || !!inlineSourceMap;
    const externals = nsWebpack.getConvertedExternals(env.externals);

    const mode = production ? 'production' : 'development';

    const appFullPath = resolve(projectRoot, appPath);
    const hasRootLevelScopedModules = nsWebpack.hasRootLevelScopedModules({
        projectDir: projectRoot
    });
    const alias = mergeOptions(
        {
            '~': appFullPath,
            '@': appFullPath,
            'svelte-native': 'svelte-native-akylas'
        },
        params.alias || {}
    );
    console.log('Aliases', alias);
    let coreModulesPackageName = 'tns-core-modules';

    if (hasRootLevelScopedModules) {
        coreModulesPackageName = '@nativescript/core';
        alias['tns-core-modules'] = coreModulesPackageName;
    }

    const appResourcesFullPath = resolve(projectRoot, appResourcesPath);

    const entryModule = nsWebpack.getEntryModule(appFullPath, platform);
    const entryPath = `.${sep}${entryModule}`;
    const entries = mergeOptions({ bundle: entryPath }, params.entries || {});
    const areCoreModulesExternal = Array.isArray(env.externals) && env.externals.some(e => e.indexOf('tns-core-modules') > -1);
    if (platform === 'ios' && !areCoreModulesExternal) {
        entries['tns_modules/tns-core-modules/inspector_modules'] = 'inspector_modules';
    }
    console.log(`Bundling application for entryPath ${entryPath}...`);

    const itemsToClean = [`${dist}/**/*`];
    if (platform === 'android') {
        itemsToClean.push(`${join(projectRoot, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'snapshots')}`);
        itemsToClean.push(`${join(projectRoot, 'platforms', 'android', 'app', 'build', 'configurations', 'nativescript-android-snapshot')}`);
    }
    console.log('itemsToClean', itemsToClean);

    const defines = mergeOptions(
        {
            PRODUCTION: !!production,
            process: 'global.process',
            'global.TNS_WEBPACK': 'true',
            'gVars.platform': `"${platform}"`,
            'gVars.isIOS': platform === 'ios',
            'gVars.isAndroid': platform === 'android',
            TNS_ENV: JSON.stringify(mode),
        },
        params.definePlugin || {}
    );
    console.log('defines', defines);

    nsWebpack.processAppComponents(appComponents, platform);
    const config = {
        mode,
        context: appFullPath,
        externals: externals.concat(params.externals || []),
        // stats: 'verbose',
        watchOptions: {
            ignored: [
                appResourcesFullPath,
                // Don't watch hidden files
                '**/.*'
            ]
        },
        target: nativescriptTarget,
        entry: entries,
        output: {
            pathinfo: false,
            path: dist,
            libraryTarget: 'commonjs2',
            filename: '[name].js',
            globalObject: 'global',
            hashSalt
        },
        resolve: {
            extensions: ['.ts', '.mjs', '.js', '.svelte', '.scss', '.css'],
            // Resolve {N} system modules from tns-core-modules
            modules: [resolve(projectRoot, `node_modules/${coreModulesPackageName}`), resolve(projectRoot, 'node_modules'), `node_modules/${coreModulesPackageName}`, 'node_modules'],
            alias,
            // resolve symlinks to symlinked modules
            symlinks: true
        },
        resolveLoader: {
            // don't resolve symlinks to symlinked loaders
            symlinks: false
        },
        node: {
            // Disable node shims that conflict with NativeScript
            http: false,
            timers: false,
            setImmediate: false,
            fs: 'empty',
            crypto: 'empty',
            __dirname: false
        },
        devtool: inlineSourceMap ? 'inline-cheap-source-map' : false,
        optimization: {
            runtimeChunk: 'single',
            noEmitOnErrors: true,
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: 'vendor',
                        chunks: 'all',
                        test: module => {
                            const moduleName = module.nameForCondition ? module.nameForCondition() : '';
                            return (
                                /[\\/]node_modules[\\/]/.test(moduleName) ||
                                /@nativescript\/core/.test(moduleName) ||
                                appComponents.some(comp => comp === moduleName) ||
                                (params.chunkTestCallback && params.chunkTestCallback(moduleName))
                            );
                        },
                        enforce: true
                    }
                }
            },
            minimize: uglify !== undefined ? uglify : production,
            minimizer: [
                new TerserPlugin(
                    mergeOptions(
                        {
                            parallel: true,
                            cache: true,
                            sourceMap: isAnySourceMapEnabled,
                            terserOptions: {
                                ecma: 6,
                                // warnings: true,
                                // toplevel: true,
                                output: {
                                    comments: false,
                                    semicolons: !isAnySourceMapEnabled
                                },
                                compress: {
                                    // The Android SBG has problems parsing the output
                                    // when these options are enabled
                                    collapse_vars: platform !== 'android',
                                    sequences: platform !== 'android',
                                    passes: 2
                                },
                                keep_fnames: true
                            }
                        },
                        params.terserOptions || {}
                    )
                )
            ]
        },
        module: {
            rules: [
                {
                    // test: new RegExp(entryPath + '.(js|ts)'),
                    include: [join(appFullPath, entryPath + '.js'), join(appFullPath, entryPath + '.ts')],

                    use: [
                        // Require all Android app components
                        platform === 'android' && {
                            loader: 'nativescript-dev-webpack/android-app-components-loader',
                            options: { modules: appComponents }
                        },

                        {
                            loader: 'nativescript-dev-webpack/bundle-config-loader',
                            options: {
                                // registerPages: true, // applicable only for non-angular apps
                                loadCss: !snapshot, // load the application css if in debug mode
                                unitTesting,
                                appFullPath,
                                projectRoot,
                                ignoredFiles: nsWebpack.getUserDefinedEntries(entries, platform)
                            }
                        }
                    ].filter(loader => Boolean(loader))
                },
                {
                    test: /\.(ts|css|scss|html|xml)$/,
                    use: 'nativescript-dev-webpack/hmr/hot-loader'
                },

                { test: /\.(html|xml)$/, use: 'nativescript-dev-webpack/xml-namespace-loader' },

                {
                    test: /\.css$/,
                    use: 'nativescript-dev-webpack/css2json-loader'
                },

                {
                    test: /\.scss$/,
                    exclude: /\.module\.scss$/,
                    use: [
                        {
                            loader: 'nativescript-dev-webpack/css2json-loader',
                            options: { useForImports: true }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                },
                {
                    test: /\.module\.scss$/,
                    use: [
                        { loader: 'css-loader', options: { url: false } },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                },
                // {
                //     test: /\.js$/,
                //     // exclude: /node_modules/,
                //     use: [
                //         {
                //             loader: 'string-replace-loader',
                //             options: {
                //                 search: '\\/\\*\\* @class \\*\\/',
                //                 replace: '/*@__PURE__*/',
                //                 flags: 'g'
                //             }
                //         }
                //     ]
                // },
                {
                    test: /\.mjs$/,
                    type: 'javascript/auto'
                },
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            configFile: resolve(tsconfig),
                            transpileOnly: true,
                            allowTsInNodeModules: true,
                            compilerOptions: {
                                sourceMap: isAnySourceMapEnabled,
                                declaration: false
                            }
                        }
                    }
                },
                {
                    test: /\.svelte$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'svelte-loader-hot',
                            options: {
                                preprocess: require('svelte-preprocess')(
                                    Object.assign(
                                        {
                                            typescript: {
                                                compilerOptions: {
                                                    module: 'es6'
                                                }
                                            }
                                        },
                                        svelteNativePreprocessor()
                                    )
                                ),
                                hotReload: true,
                                hotOptions: {
                                    native: true
                                }
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            // Define useful constants like TNS_WEBPACK
            new webpack.EnvironmentPlugin(
                mergeOptions(
                    {
                        NODE_ENV: JSON.stringify(mode), // use 'development' unless process.env.NODE_ENV is defined
                        DEBUG: false
                    },
                    params.environmentPlugin || {}
                )
            ),
            new webpack.DefinePlugin(defines),
            // Remove all files from the out dir.
            new CleanWebpackPlugin({
                dangerouslyAllowCleanPatternsOutsideProject: true,
                dry: false,
                verbose: !!verbose,
                cleanOnceBeforeBuildPatterns: itemsToClean
            }),
            // Copy assets to out dir. Add your own globs as needed.
            new CopyWebpackPlugin(
                [
                    { from: 'fonts/!(ios|android)/**/*', to: 'fonts', flatten: true },
                    { from: 'fonts/*', to: 'fonts', flatten: true },
                    { from: `fonts/${platform}/**/*`, to: 'fonts', flatten: true },
                    { from: '**/*.+(jpg|png)' },
                    { from: 'assets/**/*' }
                ].concat(params.copyPlugin || []),
                {
                    ignore: [`${relative(appPath, appResourcesFullPath)}/**`]
                }
            ),
            // we use platform name to identify ios/android files in Sentry
            new nsWebpack.GenerateNativeScriptEntryPointsPlugin('bundle'),

            // For instructions on how to set up workers with webpack
            // check out https://github.com/nativescript/worker-loader
            new NativeScriptWorkerPlugin(),
            new nsWebpack.PlatformFSPlugin({
                platform,
                platforms
            }),
            // Does IPC communication with the {N} CLI to notify events when running in watch mode.
            new nsWebpack.WatchStateLoggerPlugin()
        ]
    };

    if (hiddenSourceMap || sourceMap) {
        
            config.plugins.push(
                new webpack.SourceMapDevToolPlugin(
                    mergeOptions(
                        {
                            noSources: true
                            //  fileContext:params.sourceMapPublicPath
                            // publicPath: params.sourceMapPublicPath || '~/',
                            // fileContext:sourceMapsDist,
                            // noSources:true,
                            // moduleFilenameTemplate: info => {
                            //     let filePath = info.identifier;
                            //     console.log( 'filePath', filePath);
                            //     if (filePath.startsWith('./')) {
                            //         filePath = './app' + filePath.slice(1);
                            //     }
                            //     // if (filePath.startsWith('file:///')) {
                            //     //     filePath = './app' + filePath.slice(1);
                            //     // }
                            //     return filePath.replace('file:///', '');
                            // }
                        },
                        params.sourceMapPlugin || {}
                    )
                )
            );
    }

    if (unitTesting) {
        config.module.rules.push(
            {
                test: /-page\.js$/,
                use: 'nativescript-dev-webpack/script-hot-loader'
            },
            {
                test: /\.(ts|css|scss|html|xml)$/,
                use: 'nativescript-dev-webpack/hmr/hot-loader'
            },

            {
                test: /\.(html|xml)$/,
                use: 'nativescript-dev-webpack/xml-namespace-loader'
            }
        );
    }

    if (!!report) {
        // Generate report files for bundles content
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false,
                reportFilename: resolve(projectRoot, 'report', 'report.html')
            })
        );
    }

    if (!!snapshot) {
        const options = mergeOptions(
            {
                chunk: 'vendor',
                requireModules: ['tns-core-modules/bundle-entry-points'],
                projectRoot,
                targetArchs: params.targetArchs,
                snapshotInDocker,
                skipSnapshotTools,
                useLibs
            },
            params.snapshotPlugin
        );
        config.plugins.push(new nsWebpack.NativeScriptSnapshotPlugin(Object.assign(options, { webpackConfig: config })));
    }

    if (!!hmr) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    if (!!production) {
        config.plugins.push(
            new ForkTsCheckerWebpackPlugin({
                tsconfig: resolve(tsconfig),
                async: false,
                useTypescriptIncrementalApi: true,
                checkSyntacticErrors: true,
                memoryLimit: 4096,
                workers: 1
            })
        );
    }

    return config;
};
