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
  const prodExtensionId = "okpeabepajdgiepelmhkfhkjlhhmofma";

  // Make logLevel variable in sync with storage (updated by options page).
  var logLevel = 1;

  chrome.storage.local.get('logLevel', function(items) {
    logLevel = parseInt(items.logLevel || "1");  
    console.log('background-script: level initialized to ' + logLevel);
    chrome.storage.onChanged.addListener(function(changes, areaName) {
      for (key in changes) {
        var storageChange = changes[key];
        if (key='logLevel' && areaName === 'local' ) {
          logLevel = storageChange.newValue;
          console.log('background-script: log level changed to ' + logLevel);
        }
      }
    });
  });

  // Native messages port
  var port = null;

  // Message from native app
  function onNativeMessageReceived(message) {
    if (message.message.startsWith("Event: Version ")) {
      // Supported versions: 0.5
      if (!(message.message === "Event: Version 0.5")) {
        sendErrorToContentScript("You need to upgrade the <a href='https://gnaudio.github.io/jabra-browser-integration/download'>Jabra Browser Integration Host</a> and reload this page");
        return;
      }
    }
    sendMessageToContentScript(message.message);
  }

  // Send message to native app
  function sendMessageToNativeApp(message) {
    port.postMessage({ message: message });
  }

  // Native app was disconnected
  function onDisconnected() {
    var err = chrome.runtime.lastError ? chrome.runtime.lastError.message : null;

    if (err === "Specified native messaging host not found.") {
      sendErrorToContentScript("You need to install the <a href='https://gnaudio.github.io/jabra-browser-integration/download'>Jabra Browser Integration Host</a> and reload this page");
    } else if (err === "Access to the specified native messaging host is forbidden." && chrome.runtime.id !== prodExtensionId) {
      sendErrorToContentScript("You are running a beta/development version of the Jabra browser extension which lacks access rights to installed native messaging host. Please upgrade your host installation OR manually add this extension id '" + chrome.runtime.id + "' to allowed_origins (in com.jabra.nm.json)");
    } else {
      sendErrorToContentScript(err);
    }
    port = null;
  }

  // Messages from the content-script
  window.chrome.runtime.onMessage.addListener(function (request) {
    // Try to connect to the native app, if not already connected
    if (port == null) {
      var hostName = "com.jabra.nm";
      try {
        port = window.chrome.runtime.connectNative(hostName);
        port.onDisconnect.addListener(onDisconnected);
        port.onMessage.addListener(onNativeMessageReceived);
      }
      catch(err) {
        sendErrorToContentScript(err);
      }
    }

    sendMessageToNativeApp(request.message);
  });

  function sendMessageToContentScript(message) {
    // Messages are always forwarded as they need to be handled (and not just logged).
    window.chrome.tabs.query({
    }, function (tabs) {
      tabs.forEach(function (tab) {
        window.chrome.tabs.sendMessage(tab.id, { message: message });
      });
    });
  }

  function sendErrorToContentScript(err) {
    // Errors always forwarded because api user may needs to handle - so no filtering here.
    window.chrome.tabs.query({
    }, function (tabs) {
      tabs.forEach(function (tab) {
        window.chrome.tabs.sendMessage(tab.id, { error: err });
      });
    });
  }
  
  function sendWarningToContentScript(msg) {
    if (logLevel>=2) {
      window.chrome.tabs.query({
        currentWindow: true, active: true
      }, function (tabs) {
        tabs.forEach(function (tab) {
          window.chrome.tabs.sendMessage(tab.id, { warn: msg });
        });
      });
    }
  }
 
  function sendInfoToContentScript(msg) {
    if (logLevel>=3) {
      window.chrome.tabs.query({
        currentWindow: true, active: true
      }, function (tabs) {
        tabs.forEach(function (tab) {
          window.chrome.tabs.sendMessage(tab.id, { info: msg });
        });
      });
    }
  }

  function sendTraceToContentScript(msg) {
    if (logLevel>=4) {
      window.chrome.tabs.query({
        currentWindow: true, active: true
      }, function (tabs) {
        tabs.forEach(function (tab) {
          window.chrome.tabs.sendMessage(tab.id, { trace: msg });
        });
      });
    }
  }
})();