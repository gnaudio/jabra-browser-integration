![Banner](/docs/beta-banner.png)

# BETA release Overview
This page contains information about current public beta's of the Jabra Browser SDK, which customers can use to test and prepare for new versions in advance. 

**Warning**: The software released here is considered **unstable**, possibly **untested** and **might be updated at any time**. Use at **your own risk**. If you want to use something stable and tested please use our stable [non-beta version](README.md).

For general information about the library please refer to our [main documentation page](README.md)

# BETA Documentation
* [Typescript API definition/documentation](https://gnaudio.github.io/jabra-browser-integration/JavaScriptLibrary/jabra.browser.integration-2.0.d.ts)
* [Changelog](CHANGELOG.md)

# BETA Javascript API
* [Javascript API 2.0 file download link](https://gnaudio.github.io/jabra-browser-integration/JavaScriptLibrary/jabra.browser.integration-2.0.js).

*For the API we adheres to semantic versioning
so increases in the major version component of the version number between releases indicate breaking changes where developers using the software
may need to change their code when updating. Increases in minor version indicates that all changes ought to be backwards compatible.*

# Native Chromehost BETA downloads
| Operating systems             | Chrome host native download             | Description                             |
| ----------------------------- | --------------------------------------- | --------------------------------------- |
| Windows (Windows 7 or newer)  | [JabraChromeHost2.0.msi](https://gnaudio.github.io/jabra-browser-integration/download/JabraChromeHost2.0beta8.msi) | Chromehost 2.0 Beta 8 |
| macOS (El Capitan/Sierra)     | *coming soon* | |

# WebExtension BETA
[![Banner](/docs/ChromeWebStoreBadge.png)](https://chrome.google.com/webstore/detail/jabra-browser-integration/igcbbdnhomedfadljgcmcfpdcoonihfe)

**Important notes about BETA web extension **: 
1. The BETA browser extension should not be active at the same time as the standard release version of the browser extension. Please deactivate or uninstall the stable browser extension before installing the BETA browser extension. Running both extensions simultaneously are NOT supported.

2. If you are testing the browser extension beta together with the old 0.5 non-beta version of the chrome host, you need to give it explicit permission to call into the old chromehost executable. This is easily done by installing
v0.51 of the chromehost which fixes this issue but otherwise contains the same executable. Alternatively, you can manually add the new beta extension id `igcbbdnhomedfadljgcmcfpdcoonihfe` to allowed_origins in file com.jabra.nm.json in the installation directory of the native host. On windows this file is normally located in `C:\Program Files (x86)\JabraChromeHost`. Note, that this security issues only affects the beta - the problem goes away when the official version is released using an update to the non-beta browser extension. New versions of the chrome host will contain this new security setting by default.

# BETA Development tools/demos
* [Call control test](https://gnaudio.github.io/jabra-browser-integration/beta/development/) - test page to try out basic call control in the library
* [Library api test](https://gnaudio.github.io/jabra-browser-integration/beta/test/) - advanced test page that allows detailed testing of individual API calls)
* [Playback demo with auto selection](https://gnaudio.github.io/jabra-browser-integration/beta/playback/) - demo page showing auto selection of jabra device with simple audio playback example
* [WebRTC softphone demo](https://gnaudio.github.io/jabra-browser-integration/beta/webrtc/) - demo that supports mute/unmute/end-call from a Jabra device + jabra device auto selection
* [Amazon Connect client demo](https://gnaudio.github.io/jabra-browser-integration/beta/amazonconnectclient/) - demo showing Jabra and Amazon Connect integration
