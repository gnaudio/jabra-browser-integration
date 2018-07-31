/*
Jabra Browser Integration
https://github.com/gnaudio/jabra-browser-integration

MIT License

Copyright (c) 2017 GN Audio A/S (Jabra)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
  // Make logLevel variable in sync with storage (updated by options page)
  // and forward changes to page script using a message as well.
  var logLevel = 1;

  chrome.storage.local.get('logLevel', function(items) {
    logLevel = parseInt(items.logLevel || "1");
    window.postMessage({
      direction: "jabra-headset-extension-from-content-script",
      message: "Event: logLevel " + logLevel
    }, "*");
    chrome.storage.onChanged.addListener(function(changes, areaName) {
      for (key in changes) {
        var storageChange = changes[key];
        if (key='logLevel' && areaName === 'local' ) {
          logLevel = storageChange.newValue;
          window.postMessage({
            direction: "jabra-headset-extension-from-content-script",
            message: "Event: logLevel " + logLevel
          }, "*");
        }
      }
    });
  });

  // From page script
  window.addEventListener("message", function (event) {
    if (event.source === window &&
        event.data.direction &&
        event.data.direction === "jabra-headset-extension-from-page-script") {

      var msg = event.data.message;

      if (msg === "logLevel") {
        window.postMessage({
          direction: "jabra-headset-extension-from-content-script",
          message: "Event: logLevel " + logLevel
        }, "*");
      } else {
        if (logLevel>=4) { // Log if Loglevel >= Trace
          console.log("Sending message command to background script: " + msg);
        }

        window.chrome.runtime.sendMessage({ message: msg });
      }
    }
  });

  // From background script
  window.chrome.runtime.onMessage.addListener(
    function (request) {
      if (request.message) {
        if (logLevel>=4) { // Log message if Loglevel >= Trace
          console.log(request.message);
        }
        window.postMessage({
            direction: "jabra-headset-extension-from-content-script",
            message: request.message
          },
          "*");
      }
      else if (request.error) {
        if (logLevel>=1) { // Log error if Loglevel >= Error.
          console.error(request.error);
        }
        // Forward error to api to be handled there if needed.
        window.postMessage({
          direction: "jabra-headset-extension-from-content-script",
          error: request.error
        },
          "*");
      }
      else if (request.info) {
        if (logLevel>=3) { // Log message if Loglevel >= Info
          console.log(request.log);
        }
      } 
      else if (request.trace) {
        if (logLevel>=4) { // Log message if Loglevel >= Trace
          console.log(request.trace);
        }
      }
      else if (request.warn) {
        if (logLevel>=2) { // Log message if Loglevel >= Info
          console.log(request.warn);
        }
      }
  });
})();