import * as Flex from "@twilio/flex-ui";
import * as jabra from "jabra-browser-integration";

export const LOAD_DEVICES = "LOAD_DEVICES";
export const SET_ACTIVE_DEVICE = "SET_ACTIVE_DEVICE";
export const REMOVE_ACTIVE_DEVICE = "REMOVE_ACTIVE_DEVICE";

export const loadDevices = () => async (dispatch, getState) => {
  const { active } = getState().jabra.devices;

  try {
    const devices = await jabra.getDevices();

    // If no active device set the first device as the active one
    if (!active) {
      const device = await jabra.getActiveDevice();

      dispatch(setActiveDevice(device.deviceID));
    }
    // If the devices list no longer contains the active device
    else if (!devices.some(device => device.deviceID === active.deviceID)) {
      // If there is more devices available, set the first one as the new active
      // device
      if (devices.length > 0) {
        dispatch(setActiveDevice(devices[0].deviceID));
      } else {
        dispatch(removeActiveDevice());
      }
    }

    dispatch({ type: LOAD_DEVICES, status: "success", payload: devices });
  } catch (error) {
    dispatch({ type: LOAD_DEVICES, status: "error", payload: error });
  }
};

export const setActiveDevice = id => async dispatch => {
  try {
    await jabra.setActiveDeviceId(id);

    const device = await jabra.getActiveDevice();

    // Set the active jabra device as the device used in Twilio Flex
    if (window.location.protocol === "https:") {
      const manager = Flex.Manager.getInstance();
      const { deviceInfo } = await jabra.getUserDeviceMediaExt({
        audio: true
      });

      await manager.voiceClient.audio.setInputDevice(
        deviceInfo.browserAudioInputId
      );

      await manager.voiceClient.audio.speakerDevices.set(
        deviceInfo.browserAudioOutputId
      );
    }

    dispatch({ type: SET_ACTIVE_DEVICE, status: "success", payload: device });
  } catch (error) {
    dispatch({ type: SET_ACTIVE_DEVICE, status: "error", payload: error });
  }
};

export const removeActiveDevice = () => ({ type: REMOVE_ACTIVE_DEVICE });
