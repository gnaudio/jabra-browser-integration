/// <reference path="../../JavaScriptLibrary/jabra.browser.integration-2.0.d.ts" />

// DOM loaded
document.addEventListener('DOMContentLoaded', function () {
  const deviceSelector = document.getElementById('deviceSelector');
  const changeActiveDeviceBtn = document.getElementById('changeActiveDeviceBtn');

  // Use the Jabra library
  jabra.init().then(() => {
    toastr.info("Jabra library initialized successfully");

    // Setup device list initially.
    setupDevices();
  }).catch((msg) => {
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
    toastr.info("Accept call from the device");
  });

  jabra.addEventListener("endcall", (event) => {
    toastr.info("End call from the device");
  });

  jabra.addEventListener("flash", (event) => {
    toastr.info("Flash from the device");
  });

  document.getElementById('ring').onclick = function () {
    jabra.ring();
  }
  document.getElementById('offhook').onclick = function () {
    jabra.offHook();
  }
  document.getElementById('onhook').onclick = function () {
    jabra.onHook();
  }
  document.getElementById('mute').onclick = function () {
    jabra.mute();
  }
  document.getElementById('unmute').onclick = function () {
    jabra.unmute();
  }
  document.getElementById('hold').onclick = function () {
    jabra.hold();
  }
  document.getElementById('resume').onclick = function () {
    jabra.resume();
  }

  // Refresh device list automatically when devices are inserted/removed:
  jabra.addEventListener(["device attached", "device detached"] , (event) => {
    setupDevices();
  });

  // Helper to update device list.
  function setupDevices() {
    while (deviceSelector.options.length > 0) {
      deviceSelector.remove(0);
    }

    jabra.getDevices().then((devices) =>
      devices.forEach(device => {
        var opt = document.createElement('option');
        opt.value = device.deviceID;
        opt.innerHTML = device.deviceName;
        deviceSelector.appendChild(opt);
      })
    );
  }

  // Change active device when user asks:
  changeActiveDeviceBtn.onclick = () => {
    let id = deviceSelector.value;

    jabra.setActiveDeviceId(id).then(() => {
      toastr.info("Active device set to " + deviceSelector.options[deviceSelector.selectedIndex].text + " (id # " + id + ")");
    });
  };

}, false);