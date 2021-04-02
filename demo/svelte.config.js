const svelteNativePreprocessor = require('svelte-native-preprocessor')
const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  preprocess: [sveltePreprocess(), svelteNativePreprocessor()] 
};