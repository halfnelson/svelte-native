const svelteNativePreprocessor = require('svelte-native-preprocessor')
const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  compilerOptions: {
    namespace: "foreign"
  },
  preprocess: [sveltePreprocess(), svelteNativePreprocessor()] 
};