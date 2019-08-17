import { FlexPlugin, loadPlugin } from "flex-plugin";
import * as jabra from "jabra-browser-integration";
import memoize from "memoize-one";
import React from "react";

import DeviceIndicator from "./components/DeviceIndicator";
import {
  reducer,
  setInstalled,
  setInitialized,
  setActiveDevice,
  removeActiveDevice,
  setCallState
} from "./state";

const { MMI_TYPE_DOT3, MMI_TYPE_DOT4 } = jabra.RemoteMmiType;
const { MMI_LED_SEQUENCE_ON, MMI_LED_SEQUENCE_OFF } = jabra.RemoteMmiSequence;
const { MMI_ACTION_UP } = jabra.RemoteMmiActionInput;

class Plugin extends FlexPlugin {
  constructor() {
    super("JabraControlPlugin");
  }

  init(flex, manager) {
    this.flex = flex;
    this.manager = manager;

    // Add redux reducer to flex store
    this.manager.store.addReducer("jabraControl", reducer);
    // Subscribe to changes to the redux store
    this.manager.store.subscribe(() => this.handleStateChange());

    // Add Jabra device indicator to main menu
    flex.MainHeader.Content.add(
      <DeviceIndicator key="jabra-device-indicator" />,
      {
        align: "end",
        sortOrder: -1
      }
    );

    (async () => {
      // Initialize Jabra SDK
      await this.handleInitialization();
      // Start Jabra device detection
      await this.handleDeviceDetection();

      // Run handleReservation if a reservation exists or is created
      this.manager.workerClient.reservations.forEach(this.handleReservation);
      this.manager.workerClient.on(
        "reservationCreated",
        this.handleReservation
      );

      // Toggle activity on DOT4 click events
      this.onDotClick(MMI_TYPE_DOT4, () => {
        if (this.manager.workerClient.activity.available) {
          this.flex.Actions.invokeAction("SetActivity", {
            activityName: "Unavailable"
          });
        } else {
          this.flex.Actions.invokeAction("SetActivity", {
            activityName: "Available"
          });
        }
      });
    })();
  }

  handleInitialization = async () => {
    // Initialize SDK
    await jabra.init();

    // Check if installation is OK
    if ((await jabra.getInstallInfo()).installationOk)
      this.manager.store.dispatch(setInstalled());

    this.manager.store.dispatch(setInitialized());
  };

  handleDeviceDetection = async () => {
    // Get active device
    const activeDevice = await jabra.getActiveDevice();

    const handleDeviceAttachment = async device => {
      // Set MMI focus on device, to allow light controls
      this.setMMIFocus(device);

      // Attempt to set device as Twilio input and output device, this will
      // throw an exception if attempted on http instead of https, hence the
      // try/catch
      try {
        const { deviceInfo } = await jabra.getUserDeviceMediaExt({
          audio: true
        });

        await this.manager.voiceClient.audio.setInputDevice(
          deviceInfo.browserAudioInputId
        );

        await this.manager.voiceClient.audio.speakerDevices.set(
          deviceInfo.browserAudioOutputId
        );

        console.info(
          `Successfully set ${deviceInfo.deviceName} as active device`
        );
      } catch (error) {
        console.log(error);
      }

      this.manager.store.dispatch(setActiveDevice(device));
    };

    const handleDeviceDetachment = () => {
      this.manager.store.dispatch(removeActiveDevice());
    };

    // Check if activeDevice exists
    if (Object.keys(activeDevice).length > 0) {
      await handleDeviceAttachment(activeDevice);
    } else {
      handleDeviceDetachment();
    }

    jabra.addEventListener("device attached", event => {
      handleDeviceAttachment(event.data);
    });

    jabra.addEventListener("device detached", () => {
      handleDeviceDetachment();
    });
  };

  handleReservation = reservation => {
    // Ignore non-voice reservations
    if (reservation.task.taskChannelUniqueName !== "voice") return;

    if (["pending"].includes(reservation.status))
      this.handleCallIncoming(reservation);

    if (["wrapping"].includes(reservation.status))
      this.handleCallWrapping(reservation);

    reservation.on("accepted", this.handleCallAccepted);
    reservation.on("wrapup", this.handleCallWrapping);
    reservation.on("completed", this.handleCallCompleted);
    reservation.on("canceled", this.handleCallCanceled);
    reservation.on("rescinded", this.handleCallRescinded);
  };

  handleCallIncoming = reservation => {
    this.manager.store.dispatch(setCallState("incoming"));

    jabra.ring();

    // When accept call is clicked, accept call in Twilio
    jabra.addEventListener("acceptcall", () => {
      this.flex.Actions.invokeAction("AcceptTask", {
        sid: reservation.sid
      });
      this.flex.Actions.invokeAction("SelectTask", {
        sid: reservation.sid
      });
    });
  };

  handleCallAccepted = reservation => {
    this.manager.store.dispatch(setCallState("accepted"));

    const connection = this.manager.voiceClient.activeConnection();

    jabra.offHook();

    connection.on("mute", muted => {
      if (muted) jabra.mute();
      else jabra.unmute();
    });

    jabra.addEventListener("endcall", () => {
      connection.disconnect();
    });

    // When mute is clicked on Jabra headset, one must also call
    // jabra.mute/jabra.unmute accordingly, this is handled by the
    // connection.on("mute") listener
    jabra.addEventListener("mute", () => {
      this.manager.voiceClient.activeConnection().mute(true);
    });

    jabra.addEventListener("unmute", () => {
      this.manager.voiceClient.activeConnection().mute(false);
    });
  };

  handleCallWrapping = reservation => {
    this.manager.store.dispatch(setCallState("wrapping"));

    jabra.onHook();

    this.onDotClick(
      MMI_TYPE_DOT3,
      () => {
        reservation.complete();
      },
      true
    );
  };

  handleCallCompleted = reservation => {
    this.manager.store.dispatch(setCallState("none"));

    jabra.onHook();
  };

  handleCallCanceled = reservation => {
    this.manager.store.dispatch(setCallState("none"));

    jabra.onHook();
  };

  handleCallRescinded = reservation => {
    this.manager.store.dispatch(setCallState("none"));

    jabra.onHook();
  };

  handleStateChange = () => {
    const state = this.manager.store.getState();
    const { flex, jabraControl } = state;

    if (jabraControl.initialized) {
      this.handleActiveDeviceChange(jabraControl.activeDevice);

      if (jabraControl.activeDevice) {
        this.handleCallStateChange(jabraControl.callState);
        this.handleAvailabilityChange(flex.worker.activity.available);
      }
    }
  };

  handleActiveDeviceChange = memoize(activeDevice => {
    setTimeout(() => {
      this.setDOT3Lights();
      this.setDOT4Lights();
    }, 1000);
  });

  handleCallStateChange = memoize(callState => {
    setTimeout(() => {
      this.setDOT3Lights();
      this.setDOT4Lights();
    }, 1000);
  });

  handleAvailabilityChange = memoize(available => {
    this.setDOT4Lights();
  });

  setDOT3Lights = () => {
    const { jabraControl } = this.manager.store.getState();

    if (jabraControl.callState === "wrapping") {
      jabra.setRemoteMmiLightAction(
        MMI_TYPE_DOT3,
        0x0000ff,
        MMI_LED_SEQUENCE_ON
      );
    } else {
      jabra.setRemoteMmiLightAction(
        MMI_TYPE_DOT3,
        0x000000,
        MMI_LED_SEQUENCE_OFF
      );
    }
  };

  setDOT4Lights = () => {
    const { flex } = this.manager.store.getState();
    const { available } = flex.worker.activity;

    jabra.setRemoteMmiLightAction(
      MMI_TYPE_DOT4,
      available ? 0x00ff00 : 0xff0000,
      MMI_LED_SEQUENCE_ON
    );
  };

  setMMIFocus = device =>
    new Promise(resolve => {
      const supportsMMI = device.deviceFeatures.includes(
        jabra.DeviceFeature.RemoteMMIv2
      );

      if (supportsMMI) {
        jabra
          .setMmiFocus(MMI_TYPE_DOT3, true)
          .then(() => jabra.setMmiFocus(MMI_TYPE_DOT4, true))
          .then(() => {
            setTimeout(resolve, 1000);
          });
      }
    });

  onDotClick = (mmiType, callback, useOnce = false) => {
    const handler = ({ data: { type, action } }) => {
      if (type !== mmiType || action !== MMI_ACTION_UP) return;

      callback();

      if (useOnce) jabra.removeEventListener("mmi", handler);
    };

    jabra.addEventListener("mmi", handler);
  };
}

loadPlugin(Plugin);
