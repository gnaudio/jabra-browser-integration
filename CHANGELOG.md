# Change information.

Here are listed changes for (1) Javascript API, (2) Browser extension and (3) native chromehost installation. 

# 2.1 Version (browser extension)

2.1 Fixed the following in the Browser extension:
* Added frames support. Enable use in salesforce apps etc.

# 2.0.1 Version (API only)

2.0.1. Fixed the following in the Javascript API
* Installation check bug fix - would falsely report that installation was corrupt in some cases.
* Workaround for typescript 3.4 problem.

# 2.0 Version

## 1/3 Javascript API changes :

2.0 Added/changed the following
* Added [typescript](https://www.typescriptlang.org/) definitions `jabra.browser.integration-2.0.d.ts` of API for detailed documentation, static checking and better IDE support. *Tip: Use the typescript file with a [reference path comment](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) on top of your javascript files to get code completion for the Jabra API in many development tools.* 
* Modern ES5+ promisified Javascript API - All methods now return values using [Javascript promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) rather than callbacks in order to enabled streamlined testing and API usage. This means for instance, the `init()` method now returns a JS promise that user should use then()/catch() on to react on initialization. In addition, methods that performs side-effects return void promises
to enable clients to synchronize **(breaking change)**.
* Individual subscription to event(s) using `addEventListener(nameSpec, callback)` and `removeEventListenernameSpec, callback)` **(breaking change)**.
* Removed requestEnum. Use of individual subscription event handlers (see above) abolish the need for this enumeration **(breaking change)**.
* `getActiveDevice()` now return a JS object with detailed information rather than a simple number **(breaking change)**.
* `getDevices()` now return a JS array of objects with detailed information rather than a simple string **(breaking change)**.
* `setActiveDevice` renamed to `setActiveDeviceId` to reflect that it takes an ID as argument rather than a detailed object like `getActiveDevice()` returns.
* `getUserDeviceMedia()` has been removed. Use `getUserDeviceMediaExt` instead.
* `getDeviceInfo()` has been deleted. Use ``getActiveDevice(true)` instead.
* Added `getInstallInfo()` that checks and details the current installation.    
* Added `setMmiFocus` to do custom button handling for supported devices (MMIv2).
* Added `setRemoteMmiLightAction` to change button colors (MMIv2).
* Added shutdown method (for use in testing).
* Fixed various bugs, incl. a race-condition where incorrect results would be given.
* Better support for multiple devices.
* Added >30 more events.
* Added logging to API, browser extension and chromehost executable.
* Added API test example, updated existing examples for new API version.
* All internals are now hidden away so they can't be accessed by accident.

1.2 Added jabra device auto detection.

1.1 Internal release.

1.0 Original version with call control support.

## 2/3 Browser extension changes:

2.0 Added the following:
* Support for passing complex input/output as needed by new JS API.
* Fixed various bugs, incl. a race-condition where incorrect results would be given.
* Support for new getInstallInfo command.
* Added logging support, configurable using new UI.

0.5 Original version with call control support.

## 3/3 Chomehost changes:
2.0 Added the following:
* Logging to files similar to native SDK.
* Support for >30 more events.
* Support for more complex input/output needed by new JS API.
* Support for new getInstallInfo command.
* Fixed various bugs, incl. a race-condition where incorrect results would be given.
* Beta support

2.0 Release for MAC
* Supports the released Chrome Extension 2.0 and JavaScript Library 2.0
* Logging to files similar to native SDK.
Note: 
* There is a difference in native SDK version of Chromehost 2.0 for Win and Mac. Native SDK version of Win is v1.4.0.10 and Mac is v1.7.0.0
* Chromehost source is updated to support native SDK v1.7.0.0
* Remote MMI (MMIV2) for Jabra Engage 50 device is not supported in MAC.

# 0.51 Release

0.51 Added the following:
* Security fix to allow being called from beta browser extensions

# 0.5 Release

0.5 Original version with call control support.