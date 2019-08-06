import { FlexPlugin, loadPlugin } from "flex-plugin";
import * as jabra from "jabra-browser-integration";
import React from "react";
import {
  setActiveDevice,
  removeActiveDevice,
  setInstalledState,
  setMMIFocus,
  setCallNoise,
  setCallState,
  setInitializedState
} from "./actions";
import { Analytics } from "./components/Analytics";
import { KibanaView, KibanaButton } from "./components/Kibana";
import Device from "./components/Device";
import { jabraReducer } from "./reducers";
import Elastic from "./elastic";

const { MMI_TYPE_DOT3, MMI_TYPE_DOT4 } = jabra.RemoteMmiType;
const { MMI_LED_SEQUENCE_ON, MMI_LED_SEQUENCE_OFF } = jabra.RemoteMmiSequence;
const { MMI_ACTION_UP } = jabra.RemoteMmiActionInput;

const PLUGIN_NAME = "Jabra";

class Plugin extends FlexPlugin {
  analytics = new jabra.Analytics();
  elastic = new Elastic(this.analytics);

  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    // bind flex and manager to be used throughout the entire class
    this.flex = flex;
    this.manager = manager;

    // add the jabraReducer to the redux store
    this.manager.store.addReducer("jabra", jabraReducer);

    // bind change function to redux store state change
    this.manager.store.subscribe(() =>
      this.change(this.manager.store.getState())
    );

    // Hide CRM container
    flex.AgentDesktopView.defaultProps.showPanel2 = false;

    // Add Jabra tab to the task canvas
    flex.TaskCanvasTabs.Content.add(
      <flex.Tab label="Jabra" key="jabra-analytics">
        <Analytics analytics={this.analytics} />
      </flex.Tab>
    );

    // Add Jabra device indicator to main menu
    flex.MainHeader.Content.add(<Device key="jabra-device" />, {
      align: "end",
      sortOrder: -1
    });

    flex.SideNav.Content.add(<KibanaButton key="jabra-kibana-button" />);
    flex.ViewCollection.Content.add(
      <flex.View name="jabra-kibana-view" key="jabra-kibana-view">
        <KibanaView />
      </flex.View>
    );

    (async () => {
      await jabra.init();
      console.log("init");

      this.manager.store.dispatch(setInitializedState(true));

      if ((await jabra.getInstallInfo()).installationOk)
        this.manager.store.dispatch(setInstalledState(true));

      const device = await jabra.getActiveDevice();

      if (Object.keys(device).length > 0) {
        this.manager.store.dispatch(setActiveDevice(device));
        this.setDevice();
      }

      jabra.addEventListener("device attached", event => {
        this.manager.store.dispatch(setActiveDevice(event.data));
        this.setDevice();
      });

      jabra.addEventListener("device detached", () => {
        this.manager.store.dispatch(setMMIFocus(false));
        this.manager.store.dispatch(removeActiveDevice());
      });

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

      manager.workerClient.reservations.forEach(this.handleReservation);

      manager.workerClient.on("reservationCreated", this.handleReservation);

      this.change();
    })();
  }

  change = async () => {
    const state = this.manager.store.getState();

    if (!state.jabra.initialized) return;

    const hasActiveDeviceChanges =
      state.jabra.active_device &&
      this.prevState &&
      this.prevState.jabra.active_device === null;

    const hasCallStateChanges =
      state.jabra.active_device &&
      (!this.prevState ||
        state.jabra.call_state !== this.prevState.jabra.call_state);

    const hasAvailabilityChange =
      !this.prevState ||
      state.flex.worker.activity.available !==
        this.prevState.flex.worker.activity.available;

    const hasCallNoiseChange =
      !this.prevState ||
      state.jabra.call_noise !== this.prevState.jabra.call_noise;

    const setMMIFocus = () =>
      new Promise(resolve => {
        const supportsMMI = state.jabra.active_device.deviceFeatures.includes(
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

    const runCallStateActions = () =>
      new Promise(resolve => {
        const { call_state } = state.jabra;
        if (call_state === "none") jabra.onHook();
        if (call_state === "ringing") jabra.ring();
        if (call_state === "connected") jabra.offHook();
        if (call_state === "wrapping") jabra.onHook();
        setTimeout(resolve, 1000);
      });

    const setAvailabilityLights = () => {
      jabra.setRemoteMmiLightAction(
        MMI_TYPE_DOT4,
        state.flex.worker.activity.available ? 0x00ff00 : 0xff0000,
        MMI_LED_SEQUENCE_ON
      );
    };

    const setNoiseLights = () => {
      const { call_state, call_noise } = state.jabra;

      if (call_state !== "connected") return;

      function inRange(start, end) {
        return (call_noise - start) * (call_noise - end) <= 0;
      }

      const color = inRange(0, 40)
        ? 0x00ff00
        : inRange(40, 45)
        ? 0xffff00
        : inRange(45, 70)
        ? 0xff0000
        : 0xff0000;

      jabra.setRemoteMmiLightAction(MMI_TYPE_DOT3, color, MMI_LED_SEQUENCE_ON);
    };

    const setCallStateLights = () => {
      const { call_state } = state.jabra;
      if (call_state === "none" || call_state === "ringing")
        jabra.setRemoteMmiLightAction(
          MMI_TYPE_DOT3,
          0x000000,
          MMI_LED_SEQUENCE_OFF
        );

      if (call_state === "connected") {
        setNoiseLights();
      }
      if (call_state === "wrapping")
        jabra.setRemoteMmiLightAction(
          MMI_TYPE_DOT3,
          0x0000ff,
          MMI_LED_SEQUENCE_ON
        );
    };

    if (hasActiveDeviceChanges) {
      await setMMIFocus();
      runCallStateActions();
      await setCallStateLights();
      setAvailabilityLights();
    }

    if (hasCallStateChanges) {
      await runCallStateActions();
      await setCallStateLights();
      setAvailabilityLights();
    }

    if (hasAvailabilityChange) {
      setAvailabilityLights();
    }

    if (hasCallNoiseChange) {
      setNoiseLights();
    }

    this.prevState = state;
  };

  setDevice = async () => {
    try {
      const { deviceInfo } = await jabra.getUserDeviceMediaExt({ audio: true });

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
  };

  handleReservation = reservation => {
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
    this.manager.store.dispatch(setCallState("ringing"));

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
    this.analytics.start();

    this.manager.store.dispatch(setCallState("connected"));

    const connection = this.manager.voiceClient.activeConnection();

    const handleCallNoise = () => {
      const event = this.analytics.events.newest("txacousticlevel");
      if (!event) return;
      this.manager.store.dispatch(setCallNoise(event.value));
    };

    this.elastic.start(reservation);

    this.analytics.on("txacousticlevel", handleCallNoise);

    connection.on("mute", muted => {
      if (muted) jabra.mute();
      else jabra.unmute();
    });

    jabra.addEventListener("endcall", () => {
      connection.disconnect();
      this.analytics.off("txacousticlevel", handleCallNoise);
    });

    jabra.addEventListener("mute", () => {
      this.manager.voiceClient.activeConnection().mute(true);
      jabra.mute();
    });

    jabra.addEventListener("unmute", () => {
      this.manager.voiceClient.activeConnection().mute(false);
      jabra.unmute();
    });

    this.change();
  };

  handleCallWrapping = reservation => {
    this.manager.store.dispatch(setCallState("wrapping"));

    this.analytics.stop();
    this.elastic.stop().then(() => {
      this.analytics.clear();
    });

    this.onDotClick(
      MMI_TYPE_DOT3,
      () => {
        reservation.complete();
      },
      true
    );
  };

  handleCallCompleted = () => {
    this.manager.store.dispatch(setCallState("none"));
  };

  handleCallCanceled = () => {
    this.manager.store.dispatch(setCallState("none"));
  };

  handleCallRescinded = () => {
    this.manager.store.dispatch(setCallState("none"));
  };

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
