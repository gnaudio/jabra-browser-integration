# Developer information

This document contains various implementation details of interest to developers and advanced integrators of the browser sdk. Normal users of the Jabra client API should not need this information.

## Setup for local development

The Browser Integration is an interplay between a JavaScript-library, a Chrome Extension and a native ChromeHost installed on your PC. Each of the entities can be developed separately, but often tasks involve testing functitonality across units. To get a seamless development experience, follow the guidelines below. The Jabra team primarily develops on Windows so guidelines tend to skew towards this platform, but should for the most part be applicable on Mac and Linux as well.  

### JavaScript Library

The JavaScript Library can be tested with the test app in `src\DeveloperSupportBeta\test`. The test app will by default install from the remote npm-target, but can be tweaked to use the local build by updating package.json to `"@gnaudio/jabra-browser-integration": "file:../../JavaScriptLibrary"`. Then run `npm i` and `npm run build`.

To start test server, go to `src/` and run `./serve.bat`.

Optionally navigate to `src\JavaScriptLibrary` and run `nmp start`. This will start a file-watcher that will trigger automatic rebuilds of the JavaScript library _and_ the test-app whenever a file is changed.  

### ChromeHost

The ChromeHost executable is built with [CMake](https://cmake.org/). See description under [Building ChromeHost](#-building-chromehost) about how to build from shell. The project can also be setup to build with VS Code using the [CMake Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools). The configuration should match the one described in [Building ChromeHost](#-building-chromehost).

Assuming that the ChromeHost is already installed with the [official installer](https://gnaudio.github.io/jabra-browser-integration/download/JabraChromeHost2.0.0.msi), we can tweak it to open the CMake build instead: Find the installation folder - most likely `C:\Program Files (x86)\JabraChromeHost` and open `com.jabra.nm.json`, change `path` to the location of your CMake build, e.g. `C:/jabra-browser-integration/src/ChromeHost/bin/Debug/jabrachromehost.exe`. The Chrome Extension will now open the CMake'd executable instead. Terminate the jabrachromehost.exe process before rebuilding. 

When `jabrachromehost.exe` runs, the VS Code debugger can be _attached_ to the process. Add this standard configuration to your `launch.json`, and find `jabrachromehost.exe` in the process picker when starting the debugger.


```json
{
    "name": "(Windows) Attach",
    "type": "cppvsdbg",
    "request": "attach",
    "processId": "${command:pickProcess}"
}
```

You should now be able to set breakpoints etc. from VS Code while invoking APIs from the [test app](https://gnaudio.github.io/jabra-browser-integration/release/test/). 

### Chrome Extension

It's rarely necessary to change the Chrome Extension, but if you need to, install it from your local library like this: 

Open Chrome and find the options menu in the upper right corner (kebab icon) > More tools > Extensions. Turn on "Developer mode" (upper right corner). Press "Load unpacked" and select the ChromeWebExtension-folder, e.g. `C:\jabra-browser-integration\src\ChromeWebExtension`. 

Turn off any other "Jabra Browser Integration Extension" that might be installed. You may have to add the Chrome Extension ID (visible in the Extension overview) to `allowed_origins` in `C:\Program Files (x86)\JabraChromeHost\com.jabra.nm.json`.  

## Chromehost executable

The native chromehost executable integrates the Jabra C sdk with browser
through chrome extension. The chromehost executable is written in C++ and 
compiled using the [cmake](https://cmake.org/) build tool.

### Prerequisites 

* Windows: Visual Studio 2017 (command line tools), cmake, [Wix Toolset](https://wixtoolset.org/).

* Mac: Xcode, cmake

* Ubuntu: build-essential, libasound2, [libssl v1.0.2 from ubuntu 18.04](https://packages.ubuntu.com/bionic/libssl1.0.0), cmake


### Building Chromehost
To build open a command shell, CD into src/ChromeHost and enter the following commands:

+ All platforms (unless directory already exist)

```
mkdir build
```

+ Windows:
```
cmake .. -G "Visual Studio 15 2017" -A win32
cmake --build . --target ALL_BUILD --config Release
```

+ Mac/Linux:
```
cmake ..
cmake --build . --config Release
```
_Note_: gcc and g++ for Linux should be version 7 or newer. 

### Building chromehost installers

+ Windows: 
For Windows the installer build using Visual Studio with the [Wix Toolset](https://wixtoolset.org/) extension. The version number must be specified in the outputname in the project file
and in Version attribute in the Product file.

+ Mac:
For MacOS the installer is build 
in 4 steps:
    1. run buildinstaller.sh (done by CI)
    2. run notarize.sh -u <username> -p <password> -f JabraChromeHostxxxx.pkg -b com.jabra.chromehost
    3. run builddiskimage.sh
    4. run notarize.sh -u <username> -p <password> -f JabraChromeHostxxxx.dmg -b com.jabra.chromehost

### Uninstalling chromehost installers

For windows, chromehost can be uninstalled using add/remove programs. 

For MacOS, the [uninstall.sh](../src/InstallermacOS/uninstall.sh) can be used from a shell (sudo required).

## Internal message format between API, Extension and Chromehost

All communication between API, Extension and chromehost is based on message 
passing of basically the same json structure as documented in typescript format below:

General message format:
```typescript
{
           // Used for API and extension communication - not used by chromehost:
           direction?: string,
           // Used for all commands, responses, events. Null or "na" for errors.
           message?: string,
           // Used for errors only.
           error?: string,
           // Command arguments
           args?: any,
           // Response data, not used for requests.
           data?: any, 
           // Unique arbitary ID for each request used to pair requests with results. Empty for device orginating events!
           requestId?: number | string,
           // Unique arbitary ID for each api client instance used to pair requests with requesters. Empty for device orginating events!
           apiClientId?: string,
           // JS client api version.
           version_jsapi?: string,
           // Reserved for non-Jabra clients. Not presently used.
           customClientName?: string
           // Reserved for non-Jabra clients. Not presently used.
           customClientVersion?: string
}
```

The same generic format is used (with variation) for both requests, responses and device events in different layers of the stack.

The actual values used to fillout "requestId" and "apiClientId" in requests are not important but they should be unique across different requests and clients retrospectively. Clients use the values for pairing request messages with response messages. Clients should set these values to some unique values in requests and clients should ignore responses with non-empty(!) values that are different from what is expected.

### Development notes
The best way to learn the exact messages send/returned is to [enable all logging](../README.md#Logging) at 'trace' level and observe communication while using the test tool to issue commands and/or perform device actions.

When interfacing with the Chromehost executable, note that the number of messages and their exact content are likely to change over time. Because of backwards compatability changes to existing messages are most likely to be simple expansions like new fields etc. Integrating code should thus be written in a way so it ignores extra information like unknown fields.

### Chromehost command examples:

The examples shows common request/responses when sending commands. Note that not all commands have arguments, results or event responses.

#### getinstallinfo with result

Request:
```json 
{ 
    "message": "getinstallinfo", 
    "args": {}, 
    "requestId": 3, 
    "apiClientId": "3krfvjxzl"
}
```

Response:
```json 
{ 
    "message": "Event: getinstallinfo", 
    "requestId": 3, 
    "apiClientId": "3krfvjxzl", 
    "data": {
        "chromehost_logpath": "<somepath>\\JabraChromehost.log",
        "version_chromehost": "2.0.0",
        "version_nativesdk": "1.4.0.10"
    }
}
```

#### setmmifocus with response confirmation but no result

Request:
```json 
{ 
    "message": "setmmifocus", 
    "args": { 
        "capture":true, 
        "type":18
    }, 
    "requestId": 6,
    "apiClientId": "2qub8atrm"
}
```

Response:
```json 
{ 
    "message": "Event: setmmifocus", 
    "requestId": 6, 
    "apiClientId": "2qub8atrm", 
    "data": null
}
```

#### offhook without response

Request:
```json 
{ 
    "message": "offhook", 
    "args": {}, 
    "requestId": 7, 
    "apiClientId": "2qub8atrm"
}
```

#### error response
```json 
{
    "apiClientId": "2qub8atrm",
    "data": null,
    "error": "Error: No device",
    "message": "na",
    "requestId": 7
}
```

### Chromehost event examples:

The example(s) below show examples of device events that are orginating from a device or from
physically adding/removing a device (i.e. without a command being issued). Note that apiClientId and requestId are empty for such events.

#### device attach event 

```json 
{
    "data": {
        "batteryCharging":false,
        "batteryLevelInPercent":100,
        "batteryLow":false,
        "deviceConnection":"USB",
        "deviceFeatures":[1003],
        "deviceID":0,
        "deviceName":"Jabra SPEAK 510 USB",
        "errStatus":0,
        "firmwareVersion":"2.25.0",
        "isInFirmwareUpdateMode":false,
        "productID":1058,
        "serialNumber":"xxxxxxxxxxxx",
        "skypeCertified":true,
        "variant":"08-01"
    },
    "message": "Event: device attached",
    "apiClientId":"",
    "requestId":""
}
```

