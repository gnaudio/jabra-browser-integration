/*
Jabra Browser Integration
https://github.com/gnaudio/jabra-browser-integration

MIT License

Copyright (c) 2020 GN Audio A/S (Jabra)

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
  var logLevel = 2;

  // Sync log level if we have storage permission
  try {
    if (chrome.storage && chrome.storage.local && chrome.storage.onChanged) {
      chrome.storage.local.get('logLevel', function(items) {
        logLevel = parseInt(items.logLevel || "2");
        if (logLevel>=3) { // Log if Loglevel >= Info
          console.log("Log level set to: " + logLevel);
        }
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
    } else {
      // console.warn("Could not access storage to read/watch log level changes");
    }
  } catch (err) {
    console.error("Error during log/level listner setup " + err);
  }

  // From page script (API client)
  window.addEventListener("message", function (event) {
    if (event.source === window &&
        event.data.direction &&
        event.data.direction === "jabra-headset-extension-from-page-script") {

      if (logLevel>=4) { // Log if Loglevel >= Trace
        console.log("Retrived event from page api script: " + JSON.stringify(event.data));
      }

      // Exceptionally, respond directly to logLevel requests since they are unrelated to native host.
      if ( event.data.message === "logLevel") {
        let response = {
          direction: "jabra-headset-extension-from-content-script",
          message: "Event: logLevel " + logLevel,
          requestId: event.data.requestId,
          apiClientId: event.data.apiClientId
        };

        if (logLevel>=4) { // Log if Loglevel >= Trace
          console.log("Sending log message response back to page api script : " + JSON.stringify(response));
        }

        window.postMessage(response, "*");
      } else { // Other requests needs to be passed on to background script.
        let msg = event.data;

        if (logLevel>=4) { // Log if Loglevel >= Trace
          console.log("Sending message to background script: " + JSON.stringify(msg));
        }

        window.chrome.runtime.sendMessage(msg);
      }
    }
  });

  // From background script
  window.chrome.runtime.onMessage.addListener(
    function (response) {
      if (logLevel>=4) { // Log message if Loglevel >= Trace
        console.log("Received response from background script", JSON.stringify(response));
      }

      let msg = response;
      msg.direction = "jabra-headset-extension-from-content-script";

      if (msg.message) {
        if (logLevel>=4) { // Log if Loglevel >= Trace
          console.log("Sending message to page api script : " + JSON.stringify(msg));
        }
      }
      else if (msg.error) {
        if (logLevel>=1) { // Log error if Loglevel >= Error.
          console.log("Sending error message to page api script : " + JSON.stringify(msg));
        }
      }

      if (msg.message || msg.error) {
          // Forward error to api to be handled there if needed.
          window.postMessage(msg, "*");
      } else if (msg.info) {
        if (logLevel>=3) { // Log message if Loglevel >= Info
          console.log(msg.log);
        }
      } 
      else if (msg.trace) {
        if (logLevel>=4) { // Log message if Loglevel >= Trace
          console.log(msg.trace);
        }
      }
      else if (msg.warn) {
        if (logLevel>=2) { // Log message if Loglevel >= Info
          console.log(msg.warn);
        }
      }
  });
})();