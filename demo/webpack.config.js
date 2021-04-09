const webpack = require("@nativescript/webpack");

module.exports = env => {
  webpack.init(env);
  webpack.useConfig("svelte");
  config = webpack.resolveConfig();
  return config;
};

