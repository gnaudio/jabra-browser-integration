# Overview
This software package from Jabra helps developers to make solutions, where basic headset call control can be used from within a browser app using JavaScript. Since it is not possible to access USB devices directly from JavaScript, this library provides a solution of getting a route from the JavaScript to the Jabra USB device. The API is a JavaScript library with a facade that hides implementation details. Basic call control is defined by off-hook/on-hook, ringer, mute/unmute and hold/resume. With these features, it is possible to implement a softphone app on a website. Combined with the WebRTC technology it is possible to create a softphone that only requires one small software component installed locally on the computer, while the business logic is implemented in JavaScript.

## System requirements
With current internal implementation of this software package, the following systems are supported. 

### Jabra devices
All professional Jabra headsets and Jabra speakerphones are supported. I.e. the Jabra Evolve series, the Jabra Pro series, the Jabra Biz series, and the Jabra Speak series.

### Operating system support
The following desktop operating systems are supported:

| Operating system  | Version            | 
| ----------------- |:------------------:| 
| Windows 64 bit    | Windows 7 or newer | 
| Windows 32 bit    | Windows 7 or newer | 
| macOS             | Sierra             | 

### Browser support
Google Chrome web browser - stable channel - 32 bit and 64 bit, if supported by the operating system. 

## Using the library 
Developers must use the JavaScript library file: jabra.browser.integration-0.2.js 
The library internally checks for dependencies – and will report this to the app using the library. An example: The Jabra library is initialized and an error callback function is called with this text and a link: “You need to use this Extension and then reload this page”. Note that a future version could change the internal implementation and that removes/adds new requirements. 

### Web site
A web site with documentation, developer tools and a softphone demo: 

https://gnaudio.github.io/jabra-browser-integration/

### The API
The JavaScript library must be initialized using this function: 
```javascript
jabra.init(onSuccess, onFailure, onNotify) 
```
Example use of the library:

https://gnaudio.github.io/jabra-browser-integration/development/

Basic functions: 

| Function          | Description        | 
| ----------------- |------------------| 
| ` jabra.ring() `    | Activate ringer (if supported) on the Jabra Device  | 
| ` jabra.offHook() `    | Change state to in-a-call   | 
| ` jabra.onHook() `    | Change state to idle (not-in-a-call)  | 
| ` jabra.mute() `    | Mutes the microphone (if supported)   | 
| ` jabra.unmute() `    | Unmutes the microphone (if supported)   | 
| ` jabra.hold() `    | Change state to held (if supported)   | 
| ` jabra.resume() `    | Change state from held to OffHook (if supported)   |

Callback values from the library (registered during library initialization):

