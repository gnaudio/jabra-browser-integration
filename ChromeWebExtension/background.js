(function () {

  // Native messages port
  var port = null;

  // Message from native app
  function onNativeMessageReceived(message) {
    if (message.message.startsWith("Event: Version ")) {
      // Supported versions: 0.5
      if (!(message.message == "Event: Version 0.5")) {
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
    sendErrorToContentScript("You need to install the <a href='https://gnaudio.github.io/jabra-browser-integration/download'>Jabra Browser Integration Host</a> and reload this page");
    port = null;
  }

  // Messages from the content-script
  chrome.runtime.onMessage.addListener(function (request, sender) {
    // Try to connect to the native app, if not already connected
    if (port == null) {
      var hostName = "com.jabra.nm";
      port = chrome.runtime.connectNative(hostName);
      port.onMessage.addListener(onNativeMessageReceived);
      port.onDisconnect.addListener(onDisconnected);
    }
    sendMessageToNativeApp(request.message);
  });

  // Send a message to content-script
  function sendMessageToContentScript(message) {
    chrome.tabs.query({
    }, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(tab.id, { message: message });
      });
    });
  }

  // Send a error-message to content-script
  function sendErrorToContentScript(err) {
    chrome.tabs.query({
    }, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(tab.id, { error: err });
      });
    });
  }

})();