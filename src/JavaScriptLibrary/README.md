# Overview

This software project from [Jabra](https://www.jabra.com/) helps developers to make solutions, 
where basic headset call control can be used from within a browser app 
using JavaScript. Since it is not possible to access USB devices directly
from JavaScript, this library provides a solution of getting a route from 
the JavaScript to the Jabra USB device. The API is a JavaScript library 
with a facade that hides implementation details. Basic call control is 
defined by off-hook/on-hook, ringer, mute/unmute and hold/resume. With 
these features, it is possible to implement a browser based softphone app.
Combined with the [WebRTC](https://en.wikipedia.org/wiki/WebRTC) technology 
it is possible to create a softphone that only requires small software 
components installed locally on the computer, while the business logic 
is implemented in JavaScript.

# Documentation

For comprehensive documentation (including important additional software requirements, API usage, changelog, license) and API examples etc. please refer to [our github site](https://github.com/gnaudio/jabra-browser-integration)