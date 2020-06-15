# Change information.

Here are listed changes for (1) Javascript API, (2) Browser extension and (3) native chromehost installation components.

# 1. JAVASCRIPT API

3.0.0-beta.8 Changed the following
- Various bugfixes.

3.0.0-beta.7 Changed the following in the Javascript API

- Added analytics module (preview)
- Added npm module support.
- Optional string types removed in TS declarations. Clients should now use the correct types instead of strings.
- Added meta-data for APIs.
- Improved API test application to support multiple objects, documentation, alignment with similar node.js test application.

2.0.1. Fixed the following in the Javascript API

- Installation check bug fix - would falsely report that installation was corrupt in some cases.
- Workaround for typescript 3.4 problem.

2.0 Added/changed the following

- Added [typescript](https://www.typescriptlang.org/) definitions `jabra.browser.integration-2.0.d.ts` of API for detailed documentation, static checking and better IDE support. _Tip: Use the typescript file with a [reference path comment](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) on top of your javascript files to get code completion for the Jabra API in many development tools._
- Modern ES5+ promisified Javascript API - All methods now return values using [Javascript promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) rather than callbacks in order to enabled streamlined testing and API usage. This means for instance, the `init()` method now returns a JS promise that user should use then()/catch() on to react on initialization. In addition, methods that performs side-effects return void promises
  to enable clients to synchronize **(breaking change)**.
- Individual subscription to event(s) using `addEventListener(nameSpec, callback)` and `removeEventListenernameSpec, callback)` **(breaking change)**.
- Removed requestEnum. Use of individual subscription event handlers (see above) abolish the need for this enumeration **(breaking change)**.
- `getActiveDevice()` now return a JS object with detailed information rather than a simple number **(breaking change)**.
- `getDevices()` now return a JS array of objects with detailed information rather than a simple string **(breaking change)**.
- `setActiveDevice` renamed to `setActiveDeviceId` to reflect that it takes an ID as argument rather than a detailed object like `getActiveDevice()` returns.
- `getUserDeviceMedia()` has been removed. Use `getUserDeviceMediaExt` instead.
- `getDeviceInfo()` has been deleted. Use ``getActiveDevice(true)` instead.
- Added `getInstallInfo()` that checks and details the current installation.
- Added `setMmiFocus` to do custom button handling for supported devices (MMIv2).
- Added `setRemoteMmiLightAction` to change button colors (MMIv2).
- Added shutdown method (for use in testing).
- Fixed various bugs, incl. a race-condition where incorrect results would be given.
- Better support for multiple devices.
- Added >30 more events.
- Added logging to API, browser extension and chromehost executable.
- Added API test example, updated existing examples for new API version.
- All internals are now hidden away so they can't be accessed by accident.

  1.2 Added jabra device auto detection.

  1.1 Internal release.

  1.0 Original version with call control support.

# 2. BROWSER EXTENSION

2.1 Fixed the following in the Browser extension:
* Added frames support. Enable use in salesforce apps etc.

2.0 Added the following:

0.51 Added the following:
* Security fix to allow being called from beta browser extensions

0.5 Original version with call control support.

# 3. CHROMEHOST:
2.1.0-beta.8 Changed the following
- Updated to C-SDK 1.8.7.11
- Added Mac uninstaller script.
- Removed Mac downgrade check/error.
- Mac installer is now notarized (backported to v2.0.0, v2.0.2, beta7) 

2.1.0-beta7
* Fixed various bugs, incl. chrome device matching, button takeover on mac, ignoring repeated button presses etc. 
* Updated to new C-SDK.

2.0.2 Added permission for 3CX extensions to use chromehost executable.

2.0 Added the following:
* Logging to files similar to native SDK.
* Support for >30 more events.
* Support for more complex input/output needed by new JS API.
* Support for new getInstallInfo command.
* Fixed various bugs, incl. a race-condition where incorrect results would be given.
* Beta support

Notes for MacOS version:
* Supports the released Chrome Extension 2.0 and JavaScript Library 2.0
* Logging to files similar to native SDK.
Note: 
* There is a difference in native SDK version of Chromehost 2.0 for Win and Mac. Native SDK version of Win is v1.4.0.10 and Mac is v1.7.0.0
* Chromehost source is updated to support native SDK v1.7.0.0
* Remote MMI (MMIV2) for Jabra Engage 50 device is not supported in MAC.

0.5 Original version with call control support.
