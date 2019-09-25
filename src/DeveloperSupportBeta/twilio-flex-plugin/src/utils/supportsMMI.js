import * as jabra from "@gnaudio/jabra-browser-integration";

export default function supportsMMI(activeDevice) {
  return activeDevice.deviceFeatures.includes(jabra.DeviceFeature.RemoteMMIv2);
}
