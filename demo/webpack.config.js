const webpack = require("@nativescript/webpack");

module.exports = env => {
  webpack.init(env);
  webpack.useConfig("svelte");
  // We want to use svelte-loader for now
  webpack.chainWebpack((config, env) => {
    // target('node') is the default and causes svelte-loader to detect it as a "server" render, disabling HMR 
    config.target('electron-main');

    // svelte-hmr references tns-core-modules, so we shim it here for now
    config.resolve.alias.set('tns-core-modules', '@nativescript/core');

    // the default svelte config uses deprecated svelte-loader-hot, we replace it here while keeping the preprocessor config.
    let opts = null;
    config.module
      .rule("svelte")
      .uses.get("svelte-loader-hot")
      .tap(opt => (opts = opt));
    
    config.module.rule("svelte").clear();
    config.module.rule("svelte").uses.clear();

    const production = env.production === "production";    
    config.module
      .rule("svelte")
      .test(/\.svelte$/)
      .exclude.add(/node_modules/)
      .end()
      .use("svelte-loader")
      .loader("svelte-loader")
      .tap(opt => {
        return {
          compilerOptions: {
              dev: !production,
              namespace: 'foreign'
          },
          preprocess: opts.preprocess,
          hotReload: !production,
          hotOptions: {
            injectCss: false,
            native: true
          }
        };
      });
    return config;
  });

  config = webpack.resolveConfig();
  return config;
};
