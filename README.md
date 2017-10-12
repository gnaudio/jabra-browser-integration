![Banner](/docs/banner.png)

# Overview
This software package from Jabra helps developers to make solutions, where basic headset call control can be used from within a browser app using JavaScript. Since it is not possible to access USB devices directly from JavaScript, this library provides a solution of getting a route from the JavaScript to the Jabra USB device. The API is a JavaScript library with a facade that hides implementation details. Basic call control is defined by off-hook/on-hook, ringer, mute/unmute and hold/resume. With these features, it is possible to implement a softphone app on a website. Combined with the [WebRTC](https://en.wikipedia.org/wiki/WebRTC) technology it is possible to create a softphone that only requires one small software component installed locally on the computer, while the business logic is implemented in JavaScript.

## Project goals
* must be able to control a headset from JS
* must be a lightweight solution
* must support the platforms: Windows and macOS

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
| macOS             | El Capitan/Sierra             | 

### Browser support
Google Chrome web browser - stable channel - 32 bit and 64 bit, if supported by the operating system. 

## Using the library 
Developers must use the JavaScript library file: `jabra.browser.integration-0.2.js` 
The library internally checks for dependencies – and will report this to the app using the library. An example: The Jabra library is initialized and an error callback function is called with this text and a link: “You need to use this Extension and then reload this page”. Note that a future version could change the internal implementation and that removes/adds new requirements. 

### Developer web site
A developer web site with developer tools and a softphone demo: 

https://gnaudio.github.io/jabra-browser-integration

### The API

[Application Programming Interface documentation](docs/API.md)

### Downloads
![Banner](/docs/ChromeWebStoreBadge.png)

* [Jabra WebExtension](https://chrome.google.com/webstore/detail/jabra-browser-integration/okpeabepajdgiepelmhkfhkjlhhmofma)
* [Chrome Host](https://gnaudio.github.io/jabra-browser-integration/download)

### Example use

#### Amazon Connect
[Amazon Connect](https://aws.amazon.com/connect) is a self-service, cloud-based contact center service that makes it easy for any business to deliver better customer service at lower cost.

[Amazon Connect](docs/JabraAmazonConnect.md)

## Deployment

Documentation about [deployment](docs/Deployment.md)
