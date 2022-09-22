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
  console.log('Service worker start time:', new Date());

  // Declare all known extension IDs.
  const prodExtensionId = "okpeabepajdgiepelmhkfhkjlhhmofma";
  const betaExtensionId = "igcbbdnhomedfadljgcmcfpdcoonihfe";
  const developmentExtensionIds = ["klapphmlodmhfolphohgkmimlkpcindc", "pdllnhakddjgdeneapddiignmafookpp"]
  
  var manifestData = chrome.runtime.getManifest();

  // Identify what we know about the actual extension running.
  let extensionId = chrome.runtime.id;
  let extensionType;
  if (extensionId === prodExtensionId) {
    extensionType = "production";
  } else if (extensionId === betaExtensionId){
    extensionType = "beta";
  } else if (developmentExtensionIds.includes(extensionId)) {
    extensionType = "development";
  } else {
    extensionType = "unknown";
  }

  let extensionTitle = (extensionType == "production") ? ("Jabra Integration Extension " + manifestData.version_name) : ("Jabra Integration Extension (" + extensionType + ") " + manifestData.version_name);

  // Set title dynamically and clear badge - if we have been granted permission to do it.
  try {
    if (chrome.browserAction) {
      if (chrome.browserAction.setBadgeText) {
        chrome.browserAction.setBadgeText({text: ''});
      }
      if (chrome.browserAction.setBadgeBackgroundColor) {
        chrome.browserAction.setBadgeBackgroundColor({color: '#ffffff'});
      }
      if (chrome.browserAction.setTitle) {
        chrome.browserAction.setTitle({title: extensionTitle});
      }
    }
  } catch (err) {
    console.error("Could not change badge/title: " + err);
  }

  // Make logLevel variable in sync with storage (updated by options page).
  var logLevel = 2;

  // Sync log level if we have storage permission
  try {
    chrome.permissions.contains({
      permissions: ['storage']
    }, (allowed) => {
      if (allowed && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get('logLevel', function(items) {
          logLevel = parseInt(items.logLevel || "2");
          chrome.storage.onChanged.addListener(function(changes, areaName) {
            for (key in changes) {
              var storageChange = changes[key];
              if (key='logLevel' && areaName === 'local' ) {
                logLevel = storageChange.newValue;
              }
            }
          });
        });
      } else {
        // console.warn("Could not access storage to read/watch log level changes");
      }
    });
  } catch (err) {
    console.error("Error during log/level listener setup " + err);
  }

  // Native messages port
  var port = null;

  // Message from native app
  function onNativeMessageReceived(response) {
    if (logLevel>=4) { // Log if Loglevel >= Trace
      console.log("Recived message from native chromehost process: " + JSON.stringify(response));
    }

    // !! Delete key code from earlier versions here that we don't want going forward 
    //    but that future versions need to know about for compatability:
    //    The old code would:
    // 1) Break if response did not return a message (like an error).
    // 2) Require that an Event: Version would returned 0.5.

    sendMessageToContentScript(response);
  }

  function ensureString(obj) {
    if (obj) {
      return (typeof obj === 'string' || obj instanceof String) ? obj : obj.toString();
    } else {
      return "";
    }
  }

  // Send message to native app
  function sendMessageToNativeApp(request) {
    // Make sure all required entries are strings as expected by native app.
    let msg = JSON.parse(JSON.stringify(request));
    msg.message = ensureString(msg.message);
    msg.requestId = ensureString(msg.requestId);
    msg.apiClientId = ensureString(msg.apiClientId);

    if (logLevel>=4) { // Log if Loglevel >= Trace
      console.log("Sending request to native chromehost process: " + JSON.stringify(msg));
    }
    port.postMessage(msg);
  }

  // Messages from the content-script
  chrome.runtime.onMessage.addListener((request) => {
    // Try to connect to the native app, if not already connected
    if (port == null) {
      var hostName = "com.jabra.nm";
      try {
        port = chrome.runtime.connectNative(hostName);
        port.onDisconnect.addListener(() => {
          var err = chrome.runtime.lastError ? chrome.runtime.lastError.message : null;
          if (err === "Specified native messaging host not found.") {
            let errTxt = "You need to install the <a href='" +  ((extensionType!=="production") ? "https://github.com/gnaudio/jabra-browser-integration/blob/master/BETA.md#native-chromehost-beta-downloads" : "https://github.com/gnaudio/jabra-browser-integration#native-chromehost-downloads") + "'>Jabra Browser Integration Host " + ((extensionType!=="production") ? "(" + extensionType + " version)" : "") + "</a> and reload this page";
            sendErrorToContentScript(errTxt, request);
          } else if (err === "Access to the specified native messaging host is forbidden." && extensionId !== prodExtensionId) {
            sendErrorToContentScript("You are running a beta/development version of the Jabra browser extension which lacks access rights to installed native messaging host. Please upgrade your native host installation OR manually add this extension id '" + extensionId + "' to allowed_origins (in file com.jabra.nm.json in the installation directory of the native host", request);
          } else {
            sendErrorToContentScript(err, request);
          }
          port = null;
        });
        port.onMessage.addListener(onNativeMessageReceived);
      }
      catch(err) {
        sendErrorToContentScript(err);
      }
    }

    if (logLevel>=4) { // Log if Loglevel >= Trace
      console.log("Received request from content script: " + JSON.stringify(request));
    }

    sendMessageToNativeApp(request);
  });

  // Send response with message or error to content script.
  function sendMessageToContentScript(response) {
    let msg = response;

    // For install info and version commands, we need to add appropiate things only the 
    // background script knows about like chrome extension version number, extensionId etc.
    if (msg.message === "Event: getinstallinfo") {
      msg.data = msg.data || {};
      msg.data.version_browserextension = manifestData.version_name;
      msg.data.browserextension_id =  extensionId;
      msg.data.browserextension_type = extensionType
    } else if (msg.message.startsWith("Event: Version")) {
      msg.data = msg.data || {};
      msg.data.version_browserextension = manifestData.version_name;

      // TODO: Full compatability check.
      let isInstallOk = (msg.data.version_chromehost && msg.data.version_nativesdk);
      if (!isInstallOk) {
        // For backwards compatability, we can't report this to the API client
        // as it expect version response first.
        console.warn("Chromehost installation incomplete / needs update");
        
        // Display warning about incomptability if we have persmission:
        try {
          if (chrome.browserAction) {
            if (chrome.browserAction.setBadgeText) {
              chrome.browserAction.setBadgeText({text: '!'});
            }
            if (chrome.browserAction.setBadgeBackgroundColor) {
              chrome.browserAction.setBadgeBackgroundColor({color: '#ff0000'});
            }
            if (chrome.browserAction.setTitle) {
              chrome.browserAction.setTitle({title: extensionTitle + " - incomplete / needs update"});
            }
          }
        } catch (err) {
          console.error("Could not change badge/title: " + err);
        }
      }
    }

    // Add error field if there is one:
    if (msg.error) {
      if (logLevel>=1) { // Log if Loglevel >= Error
        console.log("Sending error to content script: " + JSON.stringify(msg) );
      }
    }  
    
    if (msg.message) {
      if (logLevel>=4) { // Log if Loglevel >= Trace
        console.log("Sending message to content script: " + JSON.stringify(msg) );
      }
    }

    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs
          .sendMessage(tab.id, msg)
          .catch(() => {
            // Catch and silence: "Error: Could not establish connection. Receiving end does not exist."
          }); 
      });
    });
  }

  function sendErrorToContentScript(errStr, request = null) {
    // Errors always forwarded because api user may needs to handle - so no filtering here.
    let msg = {
      error: errStr,
      message: 'na', // For backwards compatibility with <2.0 API that expects this to be non-null.
      requestId: request ? request.requestId : null,
      apiClientId: request ? request.apiClientId : null,
    };

    if (logLevel>=1) { // Log if Loglevel >= Error
      console.log("Sending error to content script: " + JSON.stringify(msg));
    }

    chrome.tabs.query({
    }, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(tab.id, msg);
      });
    });
  }
})();