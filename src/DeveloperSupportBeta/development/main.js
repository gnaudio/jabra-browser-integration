/// <reference path="../../JavaScriptLibrary/jabra.browser.integration-2.0.d.ts" />

// DOM loaded
document.addEventListener('DOMContentLoaded', function () {
  const deviceSelector = document.getElementById('deviceSelector');
  const changeActiveDeviceBtn = document.getElementById('changeActiveDeviceBtn');

  const ringBtn = document.getElementById('ring');
  const offhookBtn = document.getElementById('offhook');
  const onhookBtn = document.getElementById('onhook');
  const muteBtn = document.getElementById('mute');
  const unmuteBtn = document.getElementById('unmute');
  const holdBtn = document.getElementById('hold');
  const resumeBtn = document.getElementById('resume');

  const noDeviceFound = document.getElementById('noDeviceFound');

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

    // Add nodes to show the error message
    var div = document.createElement("div");
    var att = document.createAttribute("class");
    att.value = "wrapper";
    div.setAttributeNode(att);
    div.innerHTML = msg;
    var br = document.createElement("br");
    var list = document.getElementById("section");
    list.insertBefore(br, list.childNodes[0]);
    list.insertBefore(div, list.childNodes[0]);

    toastr.info(msg);
  }

  // Use the Jabra library - to be sure of the installation we also check it and report errors
  // This installation check is optional but is there to reduce support issues.
  jabra.init().then(() => jabra.getInstallInfo()).then( (installInfo) => { 
    if (installInfo.installationOk) {
      toastr.info("Jabra library initialized successfully");
      // Setup device list and enable/disable buttons according if min 1 jabra device is there.
      return setupDevices().then( () => {
        if (deviceSelector.options.length === 0) {
          noDeviceFound
        }
        // Additional setup here.
      });
    } else { // Installation not ok:
      showError("Installation not ok - Your installation is incomplete, out of date or corrupted.");
    }
  }).catch((err) => {
    showError(err);
  });

  jabra.addEventListener("mute", (event) => {
    toastr.info("The device requested to be muted");
  });

  jabra.addEventListener("unmute", (event) => {
    toastr.info("The device requested to be unmuted");
  });

  jabra.addEventListener("device attached", (event) => {
    toastr.info("A device was attached");
  });

  jabra.addEventListener("device detached", (event) => {
    toastr.info("A device was detached");
  });

  jabra.addEventListener("acceptcall", (event) => {
    toastr.info("Accept call from the device");
  });

  jabra.addEventListener("reject", (event) => {
    toastr.info("Reject call from the device");
  });

  jabra.addEventListener("endcall", (event) => {
    toastr.info("End call from the device");
  });

  jabra.addEventListener("flash", (event) => {
    toastr.info("Flash from the device");
  });

  ringBtn.onclick = function () {
    jabra.ring();
  }

  offhookBtn.onclick = function () {
    jabra.offHook();
  }

  onhookBtn.onclick = function () {
    jabra.onHook();
  }

  muteBtn.onclick = function () {
    jabra.mute();
  }

  unmuteBtn.onclick = function () {
    jabra.unmute();
  }

  holdBtn.onclick = function () {
    jabra.hold();
  }

  resumeBtn.onclick = function () {
    jabra.resume();
  }

  // Refresh device list automatically when devices are inserted/removed:
  jabra.addEventListener(["device attached", "device detached"] , (event) => {
    setupDevices();
  });

  // Helper to update device list returning promise that resolves when finished.
  function setupDevices() {
    while (deviceSelector.options.length > 0) {
      deviceSelector.remove(0);
    }

    return jabra.getDevices().then((devices) => {
      devices.forEach(device => {
        var opt = document.createElement('option');
        opt.value = device.deviceID;
        opt.innerHTML = device.deviceName;
        deviceSelector.appendChild(opt);
      });

      changeActiveDeviceBtn.disabled = (devices.length === 0);
      ringBtn.disabled = (devices.length === 0);
      offhookBtn.disabled = (devices.length === 0);
      onhookBtn.disabled = (devices.length === 0);
      muteBtn.disabled = (devices.length === 0);
      unmuteBtn.disabled = (devices.length === 0);
      holdBtn.disabled = (devices.length === 0);
      resumeBtn.disabled = (devices.length === 0);

      let notificationText = (devices.length === 0) ? "No Jabra device found - Please insert a Jabra Device!" : "";
      noDeviceFound.innerText = notificationText;
    });
  }

  // Change active device when user asks:
  changeActiveDeviceBtn.onclick = () => {
    let id = deviceSelector.value;

    jabra.setActiveDeviceId(id).then(() => {
      toastr.info("Active device set to " + deviceSelector.options[deviceSelector.selectedIndex].text + " (id # " + id + ")");
    }).catch( (err) => {
      toastr.info("Error setting active device " + err)
    });
  };

}, false);