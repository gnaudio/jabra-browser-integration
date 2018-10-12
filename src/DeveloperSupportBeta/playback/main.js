/// <reference path="../../JavaScriptLibrary/jabra.browser.integration-2.0.d.ts" />

let inputStat = document.getElementById("inputStat");
let outputStat = document.getElementById("outputStat");
var player = document.getElementById('player');
var startPlaybackButton = document.getElementById('startPlayback');
var deviceInfo = null;
var self = this;

function showError(err) {
  let msg;
  if (err.name === "CommandError" && err.errmessage === "Unknown cmd" && err.command === "getinstallinfo" ) {
    msg = "Could not lookup installation info - Your installation is incomplete, out of date or corrupted.";
  } else if (err instanceof Error) {
    msg = err.toString();
  } else if ((typeof err === 'string') || (err instanceof String)) {
    msg = err; 
  } else {
    msg = JSON.stringify(err);
  }

  // Add nodes to show the message
  var div = document.createElement("div");
  var att = document.createAttribute("class");
  att.value = "wrapper";
  div.setAttributeNode(att);
  div.innerHTML = msg;
  var br = document.createElement("br");
  var list = document.getElementById("subTitles");
  list.insertBefore(br, list.childNodes[0]);
  list.insertBefore(div, list.childNodes[0]);
}

// Use the Jabra library - to be sure of the installation we also check it and report errors
// This installation check is optional but is there to reduce support issues.
jabra.init().then(() => jabra.getInstallInfo()).then( (installInfo) => {
  if (installInfo.installationOk) {
    return jabra.getUserDeviceMediaExt({}).then(({stream, deviceInfo}) => {
      self.deviceInfo = deviceInfo;
      inputStat.innerText = jabra.isDeviceSelectedForInput(stream, self.deviceInfo) ? "Jabra input device '" + self.deviceInfo.browserLabel + "' successfully selected" : "Jabra input device '" + self.deviceInfo.browserLabel + "' could not be selected automatically in your browser - please do manually"
      player.srcObject = stream;
      startPlaybackButton.disabled = false;
    });
  } else {
    return Promise.reject(new Error("Installation incomplete or out of date - can not run example"));
  }
}).catch(err => {
  if (err.name === "CommandError" && err.errmessage === "Unknown cmd" && err.command === "getinstallinfo" ) {
    showError("Could not lookup installation info - Your installation is incomplete, out of date or corrupted.");
  } else if (err.name === "NotFoundError") {
    showError("Input device not accessible/found");
  } else {
    showError(err.name + ": " + err.message);
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
