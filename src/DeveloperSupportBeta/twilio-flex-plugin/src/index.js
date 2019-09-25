import {
  store,
  Plugin as JabraCallControlPlugin
} from "@gnaudio/twilio-flex-call-control-plugin";
import React from "react";
import { FlexPlugin, loadPlugin } from "flex-plugin";
import Availability from "./components/Availability";
class Plugin extends FlexPlugin {
  constructor() {
    super("Jabra");
  }

  init(flex, manager) {
    flex.RootContainer.Content.add(<Availability key="jabra-availability" />);
  }
}

loadPlugin(JabraCallControlPlugin);
loadPlugin(Plugin);
