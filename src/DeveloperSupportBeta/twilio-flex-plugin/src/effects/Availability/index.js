import React from "react";
import { jabra } from "@gnaudio/twilio-flex-call-control-plugin";
import { connect } from "react-redux";

const Availability = ({ available, supportsMMI, callState, activeDevice }) => {
  if (!activeDevice || !supportsMMI) return null;

  try {
    if (available) {
      jabra.setRemoteMmiLightAction(
        jabra.RemoteMmiType.MMI_TYPE_DOT4,
        0x00ff00,
        jabra.RemoteMmiSequence.MMI_LED_SEQUENCE_ON
      );
    } else {
      jabra.setRemoteMmiLightAction(
        jabra.RemoteMmiType.MMI_TYPE_DOT4,
        0xff0000,
        jabra.RemoteMmiSequence.MMI_LED_SEQUENCE_ON
      );
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

const mapStateToPropsFlex = ({ flex }) => ({
  available: flex.worker.activity.available
});

const mapStateToPropsJabra = ({ jabra }) => ({
  activeDevice: jabra.devices.active,
  supportsMMI: jabra.devices.mmi,
  callState: jabra.call.state
});

export default connect(mapStateToPropsJabra)(({ store, ...props }) =>
  React.createElement(connect(mapStateToPropsFlex)(Availability), props)
);
