import React from "react";
import { loadPlugin, FlexPlugin } from "flex-plugin";
import {
  jabra,
  store,
  handleReservation,
  Plugin as JabraCallControlPlugin
} from "@gnaudio/twilio-flex-call-control-plugin";
import Analytics from "./components/Analytics";
import AvailabilityEffect from "./effects/Availability";
import CallStateEffect from "./effects/CallState";
import AnalyticsEffect from "./effects/Analytics";
import Elastic from "./elastic";

class Plugin extends FlexPlugin {
  constructor() {
    super("JabraPlugin");
  }

  init(flex, manager) {
    flex.TaskCanvasTabs.Content.add(
      <flex.Tab label="Jabra" key="jabra-analytics">
        <Analytics store={store} />
      </flex.Tab>
    );

    flex.RootContainer.Content.add(
      <AnalyticsEffect key="jabra-effect-analytics" store={store} />
    );

    flex.RootContainer.Content.add(
      <AvailabilityEffect key="jabra-effect-availability" store={store} />
    );

    flex.RootContainer.Content.add(
      <CallStateEffect key="jabra-effect-call-state" store={store} />
    );

    handleReservation({
      manager,
      handleCallIncoming: this.handleCallIncoming,
      handleCallAccepted: this.handleCallAccepted,
      handleCallCanceled: this.handleCallCanceled,
      handleCallCompleted: this.handleCallCompleted,
      handleCallRejected: this.handleCallRejected,
      handleCallRescinded: this.handleCallRescinded,
      handleCallTimeout: this.handleCallTimeout,
      handleCallWrapping: this.handleCallWrapping
    });

    jabra.addEventListener("mmi", ({ data: { type, action } }) => {
      if (
        type !== jabra.RemoteMmiType.MMI_TYPE_DOT4 ||
        action !== jabra.RemoteMmiActionInput.MMI_ACTION_UP
      ) {
        return;
      }

      if (manager.workerClient.activity.available) {
        flex.Actions.invokeAction("SetActivity", {
          activityName: "Unavailable"
        });
      } else {
        flex.Actions.invokeAction("SetActivity", {
          activityName: "Available"
        });
      }
    });
  }

  handleCallIncoming = reservation => {
    // console.log("handleCallIncoming");
  };

  handleCallAccepted = reservation => {
    const {
      jabra: {
        devices: { active, analytics }
      }
    } = store.getState();

    this.elastic = new Elastic(analytics[active.deviceID]);

    // this.elastic.start(reservation);
  };

  handleCallWrapping = reservation => {
    if (this.elastic) this.elastic.stop();

    const handler = ({ data: { type, action } }) => {
      if (
        type !== jabra.RemoteMmiType.MMI_TYPE_DOT3 ||
        action !== jabra.RemoteMmiActionInput.MMI_ACTION_UP
      ) {
        return;
      }

      reservation.complete();

      jabra.removeEventListener("mmi", handler);
    };

    jabra.addEventListener("mmi", handler);
  };

  handleCallCompleted = reservation => {
    // console.log("handleCallCompleted");
  };

  handleCallCanceled = reservation => {
    // console.log("handleCallCanceled");
  };

  handleCallRescinded = reservation => {
    // console.log("handleCallRescinded");
  };

  handleCallRejected = reservation => {
    // console.log("handleCallRejected");
  };

  handleCallTimeout = reservation => {
    // console.log("handleCallTimeout");
  };
}

loadPlugin(JabraCallControlPlugin);
loadPlugin(Plugin);
