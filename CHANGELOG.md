# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.0.28](https://github.com/halfnelson/svelte-native/compare/v1.0.27...v1.0.28) (2024-10-16)


### Bug Fixes

* allow to extend `IntrinsicElements` ([45978dd](https://github.com/halfnelson/svelte-native/commit/45978ddfc0d0072081cbbc8f40c9e9e00073dac9))
* expose `AsComponent` for custom Template classes ([c72688c](https://github.com/halfnelson/svelte-native/commit/c72688cf0130f8ba5c05e0a175ec53f78f927517))
* expose ios / android components (wrapping #if __ANDROID__/__IOS__) ([acc7289](https://github.com/halfnelson/svelte-native/commit/acc72899471ad3760c05e4bb98138e678ebc971a))

### [1.0.27](https://github.com/halfnelson/svelte-native/compare/v1.0.26...v1.0.27) (2024-07-04)


### Bug Fixes

* agnostic `resolveComponentElement` and typings to fit all cases ([e642093](https://github.com/halfnelson/svelte-native/commit/e6420938d2f56c4c70b5b8e13261edfd172796bd))
* call `initializeDom` in dom file because some users might not use top level index ([baa0361](https://github.com/halfnelson/svelte-native/commit/baa036136a53dcbf088bd04dc93569559f5a4522))
* use window.document in all cases ([184475d](https://github.com/halfnelson/svelte-native/commit/184475d827bcb20bd7be06be1f7ec38bd5c595b3))

### [1.0.26](https://github.com/halfnelson/svelte-native/compare/v1.0.25...v1.0.26) (2024-07-02)


### Bug Fixes

* missing exports (sorry for the 3 releases back to back ...) ([8269bbd](https://github.com/halfnelson/svelte-native/commit/8269bbd0be853f011a72bf90664ea29d682a4031))

### [1.0.25](https://github.com/halfnelson/svelte-native/compare/v1.0.24...v1.0.25) (2024-07-02)


### Bug Fixes

* export navigation util methods like `resolveFrame` and `resolveComponentElement` ([019a835](https://github.com/halfnelson/svelte-native/commit/019a835617f15e21415b19737e9107963c93c6dc))

### [1.0.24](https://github.com/halfnelson/svelte-native/compare/v1.0.23...v1.0.24) (2024-07-02)


### Bug Fixes

* allow `backStackEntry` to be passed directly to `goBack` ([8e59028](https://github.com/halfnelson/svelte-native/commit/8e590280832934aaf4ff703e865fb9fbc3d94455))

### [1.0.23](https://github.com/halfnelson/svelte-native/compare/v1.0.21...v1.0.23) (2024-06-26)


### Bug Fixes

* dont crash on exit if no root page instance ([7065006](https://github.com/halfnelson/svelte-native/commit/7065006c05ec9141f0e78fcb9608bce4bb503174))
* update peer deps ([0f23241](https://github.com/halfnelson/svelte-native/commit/0f23241888c6ca3fc9a1a802baff367b5c0e4ea0))

## [1.0.22]
  - fix: dont crash on exit if no root page instance

## [1.0.21]
  - fix: prevent crash on `closeModal` if called without modal

## [1.0.20]
  - fix: transition error handling
  - fix: transition fix
  - chore: fix regression after last changes

## [1.0.19]
  - fix: completely ignore other platforms (ios: or android:)

## [1.0.18]
  - fix(android): allow custom transition on navigation back

## [1.0.17]
  - fix: dont catch and re throw on error or we loose original stack

## [1.0.16]
  - fix: support svelte class directive

## [1.0.15]
  - fix: correctly destroy root element on application exit

## [1.0.14]
  - feat: allow `let:index` in `Template`

## [1.0.13]
  - fix: dont rely on a custom `modalStack` anymore

## [1.0.12]
  - fix: error fix with bezier curves

## [1.0.11]
  - fix: broken typings

## [1.0.10]
  - fix: use `time` method and only set performance if necessary

## [1.0.9]
  - fixed `svelteNative` and `svelteNativeNoFrame` typings. Props parameter type is now inferred from component

## [1.0.8]
  - fixed jsx typings and add missing `layoutChanged` event

## [1.0.7]
  - fix global typings and made typings more generic to infer props from svelte component

## [1.0.6]
  - Fix elements properties change to null/undefined not being seen by N Views

## [1.0.5]
  - Updated type definitions used by language server to resolve issue with "on:tap" style events
  - Updated definitions to include new properties from Nativescript core 8.1.3

## [1.0.4]
  - Fix showModal, not all controls have nativeView

## [1.0.3]
  - Fix typescript types for SvelteComponent and Template

## [1.0.2]
  - Fix detection of external renderer when being bundled by REPL

## [1.0.1]
  - change appendChild logic to match other Nativescript flavours

## [1.0.0]
  - Drop the "beta" suffix, see below betas for changes from 0.9

## [1.0.0-beta.6]
  - revert prior fix and apply a proper fix.

## [1.0.0-beta.5]
  - Fall back to global document when owner not provided to createElement()
  - Fix bug introduced in beta.4 which prevented registration of events for items not derived from View

## [1.0.0-beta.4]
  - Update supported svelte version
  - Internal change which should allow self registration of components to reduce bundle size

## [1.0.0-beta.3]
  - Update to Nativescript 8.1
  - Resolve several problems preventing svelte 3.42.x from working with svelte native
  - Resolve a problem preventing svelte-loader 3.x from working correctly with svelte native

## [1.0.0-beta.2]
  - Change JSX types to use interfaces so they can be extended/augmented
  - Added `shims.d.ts` to fix type errors reporting on `bind:this`

## [1.0.0-beta.1]
  
  - Update JSX types based on latest 8.0.2 fixing some errors in the type definitions

## [1.0.0-beta.0]
  
  - **BREAKING**: BottomNavigation and Tabs are gone, use `@nativescript-community/ui-material-tabs` and `@nativescript-community/ui-material-bottom-navigation` as drop in replacements
  - **BREAKING**: Svelte Native is now case sensitive on attributes, this brings it in line with other frameworks on NativeScript. The types included should give nice autocomplete and hints in VSCode to help.
  - Added RootLayout component
  - Rebuild against NativeScript 8 (changes in NS8 [here](https://blog.nativescript.org/nativescript-8-announcement/#updating-to-nativescript-8)) 
  - Add JSX types for core widgets for better VSCode experience


## [0.9.5]
  - Fix typing for Template element (added $$prop_defs)
  - Initialize Dom on package import so that svelte latches onto our populated global and window shims correctly

## [0.9.4]
  - Only include children that set the same property on parent when calculating index.

## [0.9.3]
  - Fix regression in attribute setter logic

## [0.9.2]
  - Test harness is working again
  - Fixed regression for tabstrip item removal
  - Resolved more property names

## [0.9.1]
  - Nativescript 7 support
  - Resolve [Object object] in listview when using itemTemplateSelector

## [0.8.5]
  - Resolve Formatted string reactivity [#166](https://github.com/halfnelson/svelte-native/issues/166)
  - Prevent resolving of log messages when trace is not enabled

## [0.8.4]
  - Remove calls to deprecated "topmost()"


## [0.8.3]
  - Fix animations by overwriting NativeScripts slightly non-compliant requestAnimationFrame
  - Fix slide animation

## [0.8.2]
  - Fix event bubbling with less monkey patching.
  
## [0.8.1]
  - Fix event bubbling [#124](https://github.com/halfnelson/svelte-native/issues/124)


## [0.8.0]
  - Fix bug in segmented bar (re)creation closes [#118](https://github.com/halfnelson/svelte-native/issues/118) and [#119](https://github.com/halfnelson/svelte-native/issues/119)
  - Correctly handle multiple child text nodes
  - Added ability to override nativescript tags with your own. Closes [#105](https://github.com/halfnelson/svelte-native/issues/105) 
  - Swap to @nativescript/core from tns-core-modules. Closes [#103](https://github.com/halfnelson/svelte-native/issues/103) 
  - Internal logger now skips evaluation of template strings when logging is disabled
  - Upgrade to nativescript 6.4
  - Upgrade to svelte 3.19.*
  

## [0.7.3]
  - provide timestamp to requestAnimationFrame shim,fixes transition problems with svelte 3.16+


## [0.7.2]
  - use most recent patch of svelte and tns-core-modules instead of most recent minor, this should help prevent breakages by upstream dependencies
  - Require svelte 3.16.*
  - Detect nativescripts own requestAnimationFrame polyfill and don't try to overwrite
  

## [0.7.1]
  - Fix Tabs component rendering on iOS
  - Fix Tabs component on start page crashes app on iOS

## [0.7.0]
  - Support for Nativescript 6.2
  - Clear history when frame direct child change causes a navigation, closes [#96](https://github.com/halfnelson/svelte-native/issues/96)

## [0.6.1]
  - Restored custom TabStrip element implementation to work around [problem with tabstripitem view creation](https://github.com/NativeScript/NativeScript/issues/7608)

## [0.6.0]

### Breaking Changes
  - Renamed NativeElementNode to NativeViewElementNode and added a parent class NativeElementNode which handles nativescript entities not derived from View
  - Removed "meta" legacy onInsert and Remove hook container

### Added
  - support for `prop:` directive to set the value of the containing node to the nativeView of the current node e.g `<gridLayout prop:mainContent>` for sideDrawer
  - Added a parameter to NativeElementNode that configures the prop: behaviour and defines the correct casing of any property
  - Added a parameter `setsParentProp` to NativeElementNode that specifies a property on the perent node to set to constructed element when inserted.
  - Added registerNativeViewElement and registerNativeConfigElement exports. These help change:
```
  registerElement('myTag', () => new NativeViewElementNode('myTag', require('some-tns-plugin/mytag').MyTag))
```
into
```
  registerNativeViewElement('myTag', () => require('some-tns-plugin/mytag').MyTag )
```
  - Added `svelteNativeNoFrame` which allows you to launch your app without an implicit root frame. Great for when you are using RadSidebar


### Changes
  - Refactored property name normalization to cache based on object prototype so we aren't walking all defined properties every time we get or set.
  - Use the new 'scoped styles' boolean parameter when calling addCss if we don't detect any :global() styles. This should improve perf.
  
  
## [0.5.3]
  - Add support for itemTemplateSelector closes [#86](https://github.com/halfnelson/svelte-native/issues/86)

## [0.5.2]
  - Fix frame not found by Id [#82](https://github.com/halfnelson/svelte-native/issues/82)

## [0.5.1]
  - Fix animations when using latest svelte

## [0.5.0]
  - Updated to [NativeScript 6.1](https://www.nativescript.org/blog/nativescript-6.1-kotlin-support-is-here)
  - Support Tabs, TabStrip, and Bottom Navigation components

## [0.4.3]
  - Support sveltes new dev document.dispatch calls
  - Update to svelte 3.12.1

## [0.4.2]
  - Update to svelte 3.7.1 and add workaround for https://github.com/sveltejs/svelte/issues/3364

## [0.4.1]
  - Pin against svelte 3.6.1 to resolve #44 while waiting for https://github.com/sveltejs/svelte/issues/3354

## [0.4.0] - 
  - Built against latest svelte 3.6.7 and Nativescript 6.0

## [0.3.4] - 2019-06-15
  - ListItem template components are now created with `intro: true`

## [0.3.3] - 2019-05-22

### Fixed
  - mounting with anchor uses correct index during insert (fixes #30)

## [0.3.2] - 2019-05-16

### Fixed
  - class: directives now work with falsy values

### Changed
  - Bumped Nativescript to 5.4
  - Bumped Svelte to 3.4
  - Updated unit tests to use bundled svelte components instead of compiling as part of test.

## [0.3.1] - 2019-04-30

### Added
  - Removed console log spam and added to a NativeScript trace category exported as `DomTraceCategory`

## [0.3.0] - 2019-04-23

### Added
 - Introduced a Changelog

### Changed
 - Bumped versions to use freshly released Svelte 3.0.0
