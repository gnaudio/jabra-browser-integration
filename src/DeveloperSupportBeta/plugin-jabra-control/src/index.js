import { FlexPlugin, loadPlugin } from "flex-plugin";
import * as jabra from "jabra-browser-integration";
import React from "react";

import CallControl from "./components/CallControl";
import DeviceIndicator from "./components/DeviceIndicator";
import { initialize, loadDevices, setCallState, store } from "./store";

class Plugin extends FlexPlugin {
  constructor() {
    super("JabraControlPlugin");
  }

  init(flex, manager) {
    this.flex = flex;
    this.manager = manager;

    store.dispatch(initialize());

    jabra.addEventListener("device attached", () => {
      store.dispatch(loadDevices());
    });

    jabra.addEventListener("device detached", () => {
      store.dispatch(loadDevices());
    });

    manager.workerClient.reservations.forEach(this.handleReservation);
    manager.workerClient.on("reservationCreated", this.handleReservation);

    flex.MainHeader.Content.add(
      <DeviceIndicator key="jabra-device-indicator" store={store} />,
      {
        align: "end",
        sortOrder: -1
      }
    );

    flex.RootContainer.Content.add(
      <CallControl key="jabra-call-control" store={store} />
    );
  }

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
    jabra.addEventListener("acceptcall", () => {
      this.flex.Actions.invokeAction("AcceptTask", {
        sid: reservation.sid
      });
      this.flex.Actions.invokeAction("SelectTask", {
        sid: reservation.sid
      });
    });

    store.dispatch(setCallState("incoming"));
  };

  handleCallAccepted = () => {
    const connection = this.manager.voiceClient.activeConnection();

    connection.on("mute", muted => {
      if (muted) jabra.mute();
      else jabra.unmute();
    });

    jabra.addEventListener("endcall", () => {
      connection.disconnect();
    });

    jabra.addEventListener("mute", () => {
      this.manager.voiceClient.activeConnection().mute(true);
    });

    jabra.addEventListener("unmute", () => {
      this.manager.voiceClient.activeConnection().mute(false);
    });

    store.dispatch(setCallState("accepted"));
  };

  handleCallWrapping = () => {
    store.dispatch(setCallState("wrapping"));
  };

  handleCallCompleted = () => {
    store.dispatch(setCallState("none"));
  };

  handleCallCanceled = () => {
    store.dispatch(setCallState("none"));
  };

  handleCallRescinded = () => {
    store.dispatch(setCallState("none"));
  };
}

loadPlugin(Plugin);
