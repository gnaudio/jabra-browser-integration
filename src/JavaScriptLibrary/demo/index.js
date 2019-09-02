const elements = {
  playback: document.getElementById("playback")
};

(async () => {
  // Initialize the jabra browser SDK
  await jabra.init();

  // Retrieve installation info
  const installationInfo = await jabra.getInstallInfo();

  // Throw error if installation is incomplete
  if (!installationInfo.installationOk)
    throw new Error("Browser SDK installation incomplete. Please (re)install");

  // Get active device
  const activeDevice = await jabra.getActiveDevice();

  // Check if active device exists
  if (!activeDevice || Object.keys(activeDevice).length === 0)
    throw new Error("Couldn't find any active device");

  // Check if device supports RemoteMMiv2
  if (!activeDevice.deviceFeatures.includes(jabra.DeviceFeature.RemoteMMIv2))
    throw new Error("Device doesn't support required feature: RemoteMMiv2");

  const { stream, deviceInfo } = await jabra.getUserDeviceMediaExt({});

  // Setup audio element for playback
  if (elements.playback) {
    elements.playback.srcObject = stream;
    elements.playback.muted = false;
    await jabra.trySetDeviceOutput(elements.playback, deviceInfo);
  }

  console.log("bootstrap completed");

  const analytics = new jabra.Analytics();

  analytics.start();

  const handleSpeechEvent = event => {
    console.log(event);
  };

  analytics.on("txspeech", handleSpeechEvent);
  analytics.on("rxspeech", handleSpeechEvent);

  setInterval(() => {
    console.log(analytics.getSpeechStatus());
  }, 5000);
})();
