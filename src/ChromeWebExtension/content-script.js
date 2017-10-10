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

  // From page script
  window.addEventListener("message", function (event) {
    if (event.source === window &&
        event.data.direction &&
        event.data.direction === "jabra-headset-extension-from-page-script") {
      window.chrome.runtime.sendMessage({ message: event.data.message });
    }
  });

  // From background script
  window.chrome.runtime.onMessage.addListener(
    function (request) {
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