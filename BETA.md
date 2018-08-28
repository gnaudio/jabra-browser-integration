![Banner](/docs/banner.png)

# BETA release Overview
This page contains information about current public beta's of the Jabra Browser SDK, which customers can use to test and prepare for new versions in advance. 

**Warning**: The software released here is considered **unstable**, possibly **untested** and **might be updated at any time**. Use at **your own risk**. If you want to use something stable and tested please use our stable [non-beta version](README.md).

For general information about the library please refer to our [main documentation page](README.md)

# Compatibility
With the exception of the new 2.0 API component usage compared with the 1.2 API component and a beta-only security issue documented under the beta browser extension link below, everything in this release is backwards compatible with old version(s). This means that the updated browser extension and the updated chromehost will work in combination with older versions of other components. It also mean that you can continue to use the old 1.2 API with this release (if you want to miss out on new features and bugfixes).

You need to install ALL updates for all bugfixes and new features to work 100% but existing old features will continue to work when updating just one or two components while you wait for the rest to be updated at a later time. 

We consider compatibility important because changes to API, browser extension and native chromehost are often pushed at different times in different channels. Thus, please report any compatibility issues if found!

# BETA Documentation
* [Typescript API definition/documentation](https://raw.githubusercontent.com/gnaudio/jabra-browser-integration/master/src/JavaScriptLibrary/jabra.browser.integration-1.2.d.ts)
* [Changelog](CHANGELOG.md)

# BETA Javascript API
* [Javascript API 2.0 file download link](https://raw.githubusercontent.com/gnaudio/jabra-browser-integration/master/src/JavaScriptLibrary/jabra.browser.integration-2.0.js).

Notice that this API contains [breaking changes](CHANGELOG.md) compared with previous 1.2 version as evident from the major version.

*For the API we adheres to semantic versioning
so increases in the major version component of the version number between releases indicate breaking changes where developers using the software
may need to change their code when updating. Increases in minor version indicates that all changes ought to be backwards compatible.*

# Native Chromehost BETA downloads
| Operating systems             | Chrome host native download             |
| ----------------------------- | --------------------------------------- |
| Windows (Windows 7 or newer)  | [JabraChromeHost2.0.msi](https://github.com/gnaudio/jabra-browser-integration/blob/master/downloads/JabraChromeHost2.0beta1.msi?raw=true) |
| macOS (El Capitan/Sierra)     | *comming soon* |

# WebExtension BETA
[![Banner](/docs/ChromeWebStoreBadge.png)](https://chrome.google.com/webstore/detail/jabra-browser-integration/igcbbdnhomedfadljgcmcfpdcoonihfe)

**Important note**: If you are testing the browser extension beta together with the old 0.5 non-beta version of the chrome host, you need to give it explicit permission to call into the old chromehost executable. This is done by manually adding the new beta extension id "igcbbdnhomedfadljgcmcfpdcoonihfe" to allowed_origins in file com.jabra.nm.json in the installation directory of the native host. On windows this file is normally located in "C:\Program Files (x86)\JabraChromeHost". Note, that this security issues is only a beta issue - the problem goes away when the official version is released using an update to the non-beta browser extension. New versions of the chrome host will contain this new security setting by default.


# BETA Development tools/demos
* [Call control test](https://raw.githubusercontent.com/gnaudio/jabra-browser-integration/master/src/DeveloperSupportBeta/development/index.html) - testpage to try out call controll in the library
* [Library api test](https://raw.githubusercontent.com/gnaudio/jabra-browser-integration/master/src/DeveloperSupportBeta/test/index.html) - **NEW** testpage that allows detailed testing of individual API calls)
* [Playback demo with autoselection](https://raw.githubusercontent.com/gnaudio/jabra-browser-integration/master/src/DeveloperSupportBeta/playback/index.html) - demo page showing autoselection of jabra device with simple audio playback example
* [WebRTC softphone demo](https://raw.githubusercontent.com/gnaudio/jabra-browser-integration/master/src/DeveloperSupportBeta/webrtc/index.html) - demo that supports mute/unmute/end-call from a Jabra device + jabra device autoselection

# Upgrading API from 1.2 to 2.0
As noted in the [changelog](CHANGELOG.md) all methods now return values using [Javascript promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) rather than callbacks. Also, events are now subscribed to using a `addEventListener(nameSpec, callback)` and `removeEventListenernameSpec, callback)` similar to standard libraries and `requestEnu` is removed.

This means that 1.2 code like this:

```
jabra.init(
  function () {
    // Handle success
  },
  function(msg) { 
   // Handle error
  },
  function (req) {
    if (req == jabra.requestEnum.mute) {
      // Handle mute event
    } else if (req == jabra.requestEnum.unmute) {
      // Handle unmute event.
    } 
  }
);
```

should be converted to 2.0 code like this:

```
jabra.init().then(() => {
 // Handle success
}).catch((err) => {
 // Handle error
});

jabra.addEventListener("mute", (event) => {
 // Handle mute event.
});

jabra.addEventListener("unmute", (event) => {
 // Handle unmute event.
});
```

The above changes were made to better handle a future expansion of events efficiently and to streamline testing and API usage in a modern way. For example the changes made it easy to create our new API test tool.

# Typescript support (new notable BETA feature / documentation)
Added typescript definitions `jabra.browser.integration-2.0.d.ts` of API for detailed documentation, static checking and better IDE support. Refer to this file for detailed documentation about the API, including exactly what each API method expect for parameters and what each method returns.

You can use the typescript file with a [reference path comment](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) on top of your javascript files to get code completion for the Jabra API in many development tools.

# Logging (new notable BETA feature)
In this beta version of the extension, chromehost and api has logging support that can be used
to diagnose errors. 

Logging for javascript components can be seen in the browser developer console for the application and for the background page of the extension (a link is provided under chrome
extensions when developer mode is selected). The log level (how much is being logged) can be controlled by right-clicking on the extension and selecting options.

Logging for all native components (chromehost and platform sdk library) are written to text files. Destination is specified by environment variable LIBJABRA_RESOURCE_PATH or by default to %APPDATA%\JabraSDK on Windows and ~/Library/Application Support/JabraSDK on Mac OS. Log level is specified by the environment variable LIBJABRA_TRACE_LEVEL with possible values "debug", "error", "warning". 


