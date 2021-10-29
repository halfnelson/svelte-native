---
title: Svelte-Native 1.0.0
description: What's new in Svelte Native 1.0
pubdate: 2021-10-29
author: Halfnelson
authorURL: https://twitter.com/halfnelson_au/
---

We have just shipped Svelte Native 1.0.0. Most changes are under the hood but there are some breaking changes:

## Breaking Changes

### Element attributes are now **Case Sensitive**.

Previously Svelte would force all of the attributes to lowercase when compiling. This meant that Svelte Native had to try to find the correct case for the property by introspection
during runtime. This was slow and introduces errors. Svelte has merged a change where you can mark your component as `namespace="foreign"`. This tells the compiler to retain the correct casing, allowing svelte native to remove the expensive lookup. 


### Requires SvelteNativePreprocessor 1.0.0

Due to the requirement of marking Svelte Native components as `foreign`, a new version of `SvelteNativePreprocessor` was required. This new version no longer injects the `tns` namespace into your components. Instead you should have `namespace: foreign` in your `svelte.config.js`


### Updated `svelte.config.js`

To support the new version of Svelte Native, your project should have a svelte.config.js. The one from the default template looks like

```js
const sveltePreprocess = require('svelte-preprocess')
const svelteNativePreprocessor = require('svelte-native-preprocessor')

module.exports = {
  compilerOptions: {
    namespace: "foreign"
  },
  preprocess: [ sveltePreprocess(), svelteNativePreprocessor() ]
}
```

The important parts are the `namespace` and the presence of `svelteNativePreprocessor()`

### Stronger Types for attributes

As part of this deploy, we now ship typescript types for the built in components. This means you should now get red squiggles for unrecognised attributes when using the Svelte Language Server.

![Red Squiggles](/media/blog/squiggles.png) 

### Nativescript 8.0 Support

This version of Svelte Native supports the latest and greatest Nativescript 8.0, this means that the `BottomNavigation` and `Tabs` components are gone. We are working on documenting their community written replacements, but in the short term you can still use the old legacy `TabView`

