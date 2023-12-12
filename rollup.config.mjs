import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import pkg from "./package.json" assert { type: "json" };

let externalModules = pkg.peerDependencies
    ? Object.keys(pkg.peerDependencies)
    : [];

let localModules = ["dom", "components", "transitions"];

let plugins = [
    resolve({
        extensions: [".mjs", ".js"],
    }),
    typescript(),
    svelte({
        include: "src/components/**/*.svelte",
    }),
];

function module_defs() {
    return localModules.map((mod) => {
        return {
            input: `src/${mod}/index.ts`,
            output: [
                {
                    dir: `./dist/`,
                    entryFileNames: `${mod}/index.js`,
                    format: "esm",
                },
            ],
            external: (id) =>
                [
                    ...externalModules,
                    ...localModules
                        .filter((m) => m != mod)
                        .map((m) => `../${m}`),
                ].some((prefix) => id.startsWith(prefix)),
            plugins: plugins,
        };
    });
}

export default [
    {
        input: "src/index.ts",
        output: [
            {
                dir: "./dist",
                entryFileNames: "index.js",
                format: "esm",
            },
        ],
        external: (id) =>
            [...externalModules, ...localModules.map((m) => `./${m}`)].some(
                (prefix) => id.startsWith(prefix)
            ),
        plugins: plugins,
    },
    ...module_defs(),
];
