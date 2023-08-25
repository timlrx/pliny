# pliny

## 0.1.2

### Patch Changes

- a19ed9f: upgrade kbar version
- 79ed1c1: Expose onSearchDocumentsLoad for kbar and allow searchDocumentsPath to be false
- 9ff4d94: render shortcut key in kbar item

## 0.1.2-beta.1

### Patch Changes

- 9ff4d94: render shortcut key in kbar item

## 0.1.2-beta.0

### Patch Changes

- a19ed9f: upgrade kbar version
- 79ed1c1: Expose onSearchDocumentsLoad for kbar and allow searchDocumentsPath to be false

## 0.1.1

### Patch Changes

- 306917e: Improve kbar styling
  Simplify kbar component
  Add new KBarButton and AlgoliaButton wrapper which toggles their respective modals on click event
- dbe5de2: add use client directive

## 0.1.1-beta.1

### Patch Changes

- dbe5de2: add use client directive

## 0.1.1-beta.0

### Patch Changes

- 306917e: Improve kbar styling
  Simplify kbar component
  Add new KBarButton and AlgoliaButton wrapper which toggles their respective modals on click event

## 0.1.0

### Minor Changes

- 1faee5c: bump package dependencies

### Patch Changes

- 245b6d3: make algolia search input focus style more specific
- e669506: Split all files except ui components so that they are default exported
- 23d9149: Remove dynamic load of comments
- 72932a3: Use default export for components

  Named export breaks react server components. See https://github.com/vercel/next.js/issues/51593

- 21080de: Fix newsletter route handlers
- 44a6f19: Use official giscus component which fixes styling issues
- 3533d4f: Fix algolia styles
- 75533d5: fix bleed full mode
- c41211e: Improve typing of contentlayer utility functions and filter posts only in prod
- 1e82c4e: update google analytics to follow ga4 recommendations
- 7f2539a: Remove functions superseded in next 13 or new set up
- e0aa18c: Expose option to configure host for analytics scripts
- 562605b: Fix algolia css specificity issues with tailwind
- 7d2f6b3: update algolia component
- 86b57e7: Export example css for algolia
- 33d15e3: Remove next/dynamic from search component
  Remove redundant context components
  load kbar data in advance and refactor code
- 7f71035: Fix newsletter typo
- 459c5d8: Update to use next 13 app dir navigation router
- 3e31a82: Add support for newsletter route handler
- 9f87280: Fix kbar fetch to load relative to base url and add back starting actions
- 1fe37b1: Add back code splitting and add use client at the chunk level
- 4ba59d6: fix allCoreContent logic

## 0.1.0-beta.13

### Patch Changes

- 245b6d3: make algolia search input focus style more specific
- 4ba59d6: fix allCoreContent logic

## 0.1.0-beta.12

### Patch Changes

- 75533d5: fix bleed full mode
- c41211e: Improve typing of contentlayer utility functions and filter posts only in prod

## 0.1.0-beta.11

### Patch Changes

- e0aa18c: Expose option to configure host for analytics scripts
- 562605b: Fix algolia css specificity issues with tailwind

## 0.1.0-beta.10

### Patch Changes

- 9f87280: Fix kbar fetch to load relative to base url and add back starting actions

## 0.1.0-beta.9

### Patch Changes

- e669506: Split all files except ui components so that they are default exported

## 0.1.0-beta.8

### Patch Changes

- 1fe37b1: Add back code splitting and add use client at the chunk level

## 0.1.0-beta.7

### Patch Changes

- 33d15e3: Remove next/dynamic from search component
  Remove redundant context components
  load kbar data in advance and refactor code
- 7f71035: Fix newsletter typo

## 0.1.0-beta.6

### Patch Changes

- 21080de: Fix newsletter route handlers

## 0.1.0-beta.5

### Patch Changes

- 3e31a82: Add support for newsletter route handler

## 0.1.0-beta.4

### Patch Changes

- 44a6f19: Use official giscus component which fixes styling issues
- 3533d4f: Fix algolia styles

## 0.1.0-beta.3

### Patch Changes

- 23d9149: Remove dynamic load of comments
- 86b57e7: Export example css for algolia

## 0.1.0-beta.2

### Patch Changes

- 7d2f6b3: update algolia component

## 0.1.0-beta.1

### Minor Changes

- 72932a3: Use default export for components

  Named export breaks react server components. See https://github.com/vercel/next.js/issues/51593

- 7f2539a: Remove functions superseded in next 13 or new set up
- 459c5d8: Update to use next 13 app dir navigation router
- bump package dependencies

## 0.0.11-beta.0

### Patch Changes

- 1e82c4e: update google analytics to follow ga4 recommendations

## 0.0.10

### Patch Changes

- 15d4529: fix sitemap regex
- cca397f: add use client directive

## 0.0.9

### Patch Changes

- a82f661: update to next 13
- e174c43: improve accessibility

## 0.0.9-beta.0

### Patch Changes

- a82f661: update to next 13
- e174c43: improve accessibility

## 0.0.8

### Patch Changes

- 37f2f43: add mailchimp as dependency

## 0.0.7

### Patch Changes

- 479ed29: release new version

## 0.0.6

### Patch Changes

- 85377ed: module resolution
- 1d9d815: update build config
- 280d784: try publishing locally
- 47009e9: revert kbar changes
- 5f95b6e: modify package.json exports
- a6ea8ac: upgrade to react 18
- c7d833b: remove dynamic load for comments
- 64ea789: fix react hoisting issues

## 0.0.6-beta.5

### Patch Changes

- c7d833b: remove dynamic load for comments

## 0.0.6-beta.4

### Patch Changes

- 280d784: try publishing locally
- a6ea8ac: upgrade to react 18

## 0.0.6-beta.2

### Patch Changes

- 64ea789: fix react hoisting issues

## 0.0.6-beta.1

### Patch Changes

- 85377ed: module resolution

## 0.0.6

### Patch Changes

- 6fa9098: export modules from root and use only named exports
- 724b402: update dependencies

## 0.0.5

### Patch Changes

- d8cada5: Fix sitemap glob and replace tsx file extension

## 0.0.4

### Patch Changes

- b7a89c6: add posthog analytics integration

## 0.0.3

### Patch Changes

- b59e129: add search component with algolia integration
- 6b5d0a4: add kbar option to search component
- a6215f8: fix issues with comments dynamic import and add back id tag
- 9b9f193: update tsup to v6.1.2

## 0.0.2

### Patch Changes

- 6f5b8c3: - Add contentlayer config to paths
  - Add utility function to detect contentlayer parts in installer
  - Add contentlayer document type transform helper codemod
  - Pass cli args to transformers
  - Add contentlayer transform codemod to add-blog recipe
  - Sync starter blog with v1.5.6 in secondary repo
