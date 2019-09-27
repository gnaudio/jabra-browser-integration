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
import { KibanaView, KibanaButton } from "./components/Kibana";
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

    flex.SideNav.Content.add(<KibanaButton key="jabra-kibana-button" />);

    flex.ViewCollection.Content.add(
      <flex.View name="jabra-kibana-view" key="jabra-kibana-view">
        <KibanaView />
      </flex.View>
    );

    handleReservation({
      manager,
      handleCallAccepted: this.handleCallAccepted,
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

  handleCallAccepted = reservation => {
    const {
      jabra: {
        devices: { active, analytics }
      }
    } = store.getState();

    if (!active) return;

    this.elastic = new Elastic(analytics[active.deviceID]);

    this.elastic.start(reservation);
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
}

loadPlugin(JabraCallControlPlugin);
loadPlugin(Plugin);
