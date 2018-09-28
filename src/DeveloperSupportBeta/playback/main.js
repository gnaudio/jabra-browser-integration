/// <reference path="../../JavaScriptLibrary/jabra.browser.integration-2.0.d.ts" />

let inputStat = document.getElementById("inputStat");
let outputStat = document.getElementById("outputStat");
var player = document.getElementById('player');
var startPlaybackButton = document.getElementById('startPlayback');
var deviceInfo = null;
var self = this;

jabra.init().then(() => jabra.getUserDeviceMediaExt({})).then((streamAndDeviceInfo) => {
  var stream = streamAndDeviceInfo.stream;
  var deviceInfo = streamAndDeviceInfo.deviceInfo;
  self.deviceInfo = deviceInfo;
  inputStat.innerText = jabra.isDeviceSelectedForInput(stream, self.deviceInfo) ? "Jabra input device '" + self.deviceInfo.browserLabel + "' successfully selected" : "Jabra input device '" + self.deviceInfo.browserLabel + "' could not be selected automatically in your browser - please do manually"
  player.srcObject = stream;
  startPlaybackButton.disabled = false;
}).catch(err => {
  if (err.name === "NotFoundError") {
    inputStat.innerText = "Input device not accessible/found";
  } else {
    inputStat.innerText = err.name + ": " + err.message;
  }
});

startPlaybackButton.addEventListener('click', function() {
  player.muted = false;
  jabra.trySetDeviceOutput(player, self.deviceInfo).then(success => {
    outputStat.innerText = success ? "Jabra output device '" + self.deviceInfo.browserLabel + "' successfully selected" : "Jabra output device '" + self.deviceInfo.label + "' could not be selected automatically in your browser - please do manually"
  }).catch(err => {
    outputStat.innerText = err.name + ": " + err.message;
  });
});
