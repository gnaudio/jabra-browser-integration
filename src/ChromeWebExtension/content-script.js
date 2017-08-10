(function () {

  // From page script
  window.addEventListener("message", function (event) {
    if (event.source == window &&
        event.data.direction &&
        event.data.direction == "jabra-headset-extension-from-page-script") {
      chrome.runtime.sendMessage({ message: event.data.message });
    }
  });

  // From background script
  chrome.runtime.onMessage.addListener(
	  function (request, sender) {
	    if (request.message) {
	      window.postMessage({
	        direction: "jabra-headset-extension-from-content-script",
	        message: request.message
	      },
          "*");
	    }
      if (request.error) {
        window.postMessage({
          direction: "jabra-headset-extension-from-content-script",
          error: request.error
        },
          "*");
      }
	  });

})();