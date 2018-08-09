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
    if (logLevel>=3) { // Log if Loglevel >= Info
      console.log("Log level set to: " + logLevel);
    }
    window.postMessage({
      direction: "jabra-headset-extension-from-content-script",
      message: "Event: logLevel " + logLevel
    }, "*");
    chrome.storage.onChanged.addListener(function(changes, areaName) {
      for (key in changes) {
        var storageChange = changes[key];
        if (key='logLevel' && areaName === 'local' ) {
          logLevel = storageChange.newValue;
          if (logLevel>=3) { // Log if Loglevel >= Info
            console.log("Log level changed to: " + logLevel);
          }
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

      if (logLevel>=4) { // Log if Loglevel >= Trace
        console.log("Retrived event from page api script: " + JSON.stringify(event.data));
      }

      if ( event.data.message === "logLevel") {
        let msg = {
          direction: "jabra-headset-extension-from-content-script",
          message: "Event: logLevel " + logLevel,
          requestId: event.data.requestId,
          apiClientId: event.data.apiClientId
        };

        if (logLevel>=4) { // Log if Loglevel >= Trace
          console.log("Sending message back to page api script : " + JSON.stringify(msg));
        }

        window.postMessage(msg, "*");
      } else {
        let msg = { 
          message: event.data.message,
          requestId: event.data.requestId,
          apiClientId: event.data.apiClientId
        };

        if (logLevel>=4) { // Log if Loglevel >= Trace
          console.log("Sending message  to background script: " + JSON.stringify(msg));
        }

        window.chrome.runtime.sendMessage( msg );
      }
    }
  });

  // From background script
  window.chrome.runtime.onMessage.addListener(
    function (response) {
      if (logLevel>=4) { // Log message if Loglevel >= Trace
        console.log("Received response from background script", JSON.stringify(response));
      }
      if (response.message) {
        let msg = {
          direction: "jabra-headset-extension-from-content-script",
          message: response.message,
          requestId: response.requestId,
          apiClientId: response.apiClientId
        };
        if (logLevel>=4) { // Log if Loglevel >= Trace
          console.log("Sending message to page api script : " + JSON.stringify(msg));
        }
        window.postMessage(msg, "*");
      }
      else if (response.error) {
        let msg = {
          direction: "jabra-headset-extension-from-content-script",
          error: response.error,
          requestId: response.requestId,
          apiClientId: response.apiClientId
        };
        if (logLevel>=1) { // Log error if Loglevel >= Error.
          console.log("Sending error message to page api script : " + JSON.stringify(msg));
        }
        // Forward error to api to be handled there if needed.
        window.postMessage(msg, "*");
      }
      else if (response.info) {
        if (logLevel>=3) { // Log message if Loglevel >= Info
          console.log(response.log);
        }
      } 
      else if (response.trace) {
        if (logLevel>=4) { // Log message if Loglevel >= Trace
          console.log(response.trace);
        }
      }
      else if (response.warn) {
        if (logLevel>=2) { // Log message if Loglevel >= Info
          console.log(response.warn);
        }
      }
  });
})();