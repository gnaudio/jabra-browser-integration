# Overview
This software package from Jabra helps developers to make solutions, where basic headset call control can be used from within a browser app using JavaScript. Since it is not possible to access USB devices directly from JavaScript, this library provides a solution of getting a route from the JavaScript to the Jabra USB device. The API is a JavaScript library with a facade that hides implementation details. Basic call control is defined by off-hook/on-hook, ringer, mute/unmute and hold/resume. With these features, it is possible to implement a softphone app on a website. Combined with the [WebRTC](https://en.wikipedia.org/wiki/WebRTC) technology it is possible to create a softphone that only requires one small software component installed locally on the computer, while the business logic is implemented in JavaScript.

## Project goals
To create a lightweight solution that enables JavaScript to USB-headset communication.

## System requirements
With current internal implementation of this software package, the following systems are supported. 

### Jabra devices
All professional Jabra headsets and Jabra speakerphones are supported. I.e. the [Jabra Evolve series](https://www.jabra.com/business/office-headsets/jabra-evolve), the Jabra Pro series, the Jabra Biz series, and the [Jabra Speak series](https://www.jabra.com/business/speakerphones/jabra-speak-series).

### Operating system support
The following desktop operating systems are supported:

| Operating system  | Version            | 
| ----------------- | ------------------ | 
| Windows 64 bit    | Windows 7 or newer | 
| Windows 32 bit    | Windows 7 or newer | 
| macOS             | Sierra             | 

### Browser support
Google Chrome web browser - stable channel - 32 bit and 64 bit, if supported by the operating system. 

## Using the library 
Developers must use the JavaScript library file: `jabra.browser.integration-0.2.js` 
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

|           | Description        | 
| ----------------- |------------------| 
| ` jabra.ring() `    | Activate ringer (if supported) on the Jabra Device  | 
| ` jabra.offHook() `    | Change state to in-a-call   | 
| ` jabra.onHook() `    | Change state to idle (not-in-a-call)  | 
| ` jabra.mute() `    | Mutes the microphone (if supported)   | 
| ` jabra.unmute() `    | Unmutes the microphone (if supported)   | 
| ` jabra.hold() `    | Change state to held (if supported)   | 
| ` jabra.resume() `    | Change state from held to OffHook (if supported)   |

Callback values from the library (registered during library initialization):

|           | Description        | 
| ----------------- |------------------| 
| ` jabra.requestEnum.mute `    | Request that the device state should be changed to muted. This must be acknowledged by a Mute command to mute the call.  | 
| ` jabra.requestEnum.unmute `    | Request that the device state should be changed to unmuted. This must be acknowledged by an Unmute command to unmute the call.    | 
| ` jabra.requestEnum.endCall `    | End an active call request. This must be acknowledged by an OnHook command   | 
| ` jabra.requestEnum.acceptCall `    | Accept an incoming call request. This must be acknowledged by an OnHook command.    | 
| ` jabra.requestEnum.rejectCall `    | Reject an incoming call request. This must be acknowledged by an OnHook command to reject the call.   | 
| ` jabra.requestEnum.flash `    | Flash request. This must be acknowledged by a hold or resume command.    |

Device management functions:

|           | Description        | 
| ----------------- |------------------| 
| ` jabra.getActiveDevice() `    | Get the current active Jabra Device   | 
| ` jabra.getDevices() `    | List all attached Jabra Devices   | 
| ` jabra.setActiveDevice(id) `    | Select a new active device  | 

Device management callbacks: 

|           | Description        | 
| ----------------- |------------------| 
| ` jabra.requestEnum.deviceAttached `    | A device has been added   | 
| ` jabra.requestEnum.deviceDetached `    | A device has been removed    | 

### Sequence diagrams
These sequence diagrams shows typical use.

![Sequence diagram](https://raw.githubusercontent.com/gnaudio/jabra-browser-integration/master/docs/outgoing-call-then-end-call.png)

![Sequence diagram](https://raw.githubusercontent.com/gnaudio/jabra-browser-integration/master/docs/incoming-call-then-accept-on-device-then-end-call.png)

![Sequence diagram](https://raw.githubusercontent.com/gnaudio/jabra-browser-integration/master/docs/incoming-call-then-user-rejects.png)

![Sequence diagram](https://raw.githubusercontent.com/gnaudio/jabra-browser-integration/master/docs/mute-unmute-from-device.png)

![Sequence diagram](https://raw.githubusercontent.com/gnaudio/jabra-browser-integration/master/docs/hold-resume-from-device.png)

## Deployment

### How to mass deploy the Jabra Chrome Host in a Windows environment

It is possible to mass deploy the required client side software, in order to remove any client side.

1. Push the Windows installer file `JabraChromeHost0.5.msi` to the clients using your compagny IT deployment tools, i.e. Microsoft System Center Configuration Manager, IBM Tivoli or Symantec Altiris 

2. Push a Registry key to the clients. This could be done by using [Group Policy](https://msdn.microsoft.com/en-us/library/bb742376.aspx) or SCCM.

Registry key details:

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Policies\Google\Chrome\ExtensionInstallForcelist]
"2048"="okpeabepajdgiepelmhkfhkjlhhmofma;https://clients2.google.com/service/update2/crx"
```
