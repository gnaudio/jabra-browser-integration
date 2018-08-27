// DOM loaded
document.addEventListener('DOMContentLoaded', function () {

  // Use the Jabra library
  jabra.init(
    function () {
      toastr.info("Jabra library initialized successfully");
    },
    function(msg) {
      // Add nodes to show the message
      var div = document.createElement("div");
      var att = document.createAttribute("class");
      att.value = "wrapper";
      div.setAttributeNode(att);
      div.innerHTML = msg;
      var br = document.createElement("br");
      var list = document.getElementById("section");
      list.insertBefore(br, list.childNodes[0]);
      list.insertBefore(div, list.childNodes[0]);
    },
    function (req) {
      if (req == jabra.requestEnum.mute) {
        toastr.info("Callback: The device requested to be muted");
      } else if (req == jabra.requestEnum.unmute) {
        toastr.info("Callback: The device requested to be unmuted");
      } else if (req == jabra.requestEnum.deviceAttached) {
        toastr.info("Callback: A device was attached");
      } else if (req == jabra.requestEnum.deviceDetached) {
        toastr.info("Callback: A device was detached");
      } else if (req == jabra.requestEnum.acceptCall) {
        toastr.info("Callback: Accept call from the device");
      } else if (req == jabra.requestEnum.rejectCall) {
        toastr.info("Callback: Reject call from the device");
      } else if (req == jabra.requestEnum.endCall) {
        toastr.info("Callback: End call from the device");
      } else if (req == jabra.requestEnum.flash) {
        toastr.info("Callback: Flash from the device");
      }
    }
  );

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
  document.getElementById('getactivedevice').onclick = function () {
    jabra.getActiveDevice(
      function (id) {
        alert(id);
      }
    );
  }
  document.getElementById('getdevices').onclick = function () {
    jabra.getDevices(
      function(devices) {
        alert(devices);
      }
    );
  }
  document.getElementById('setactivedevice0').onclick = function () {
    jabra.setActiveDevice(0);
  }
  document.getElementById('setactivedevice1').onclick = function () {
    jabra.setActiveDevice(1);
  }
  document.getElementById('setactivedevice2').onclick = function () {
    jabra.setActiveDevice(2);
  }

}, false);