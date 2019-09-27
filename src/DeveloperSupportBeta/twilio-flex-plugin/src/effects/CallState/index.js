import { jabra } from "@gnaudio/twilio-flex-call-control-plugin";
import { connect } from "react-redux";

const Wrapping = ({ activeDevice, supportsMMI, callState }) => {
  if (!activeDevice || !supportsMMI) return null;

  try {
    if (callState === "wrapping") {
      jabra.setRemoteMmiLightAction(
        jabra.RemoteMmiType.MMI_TYPE_DOT3,
        0x0000ff,
        jabra.RemoteMmiSequence.MMI_LED_SEQUENCE_ON
      );
    } else {
      setTimeout(() => {
        jabra.setRemoteMmiLightAction(
          jabra.RemoteMmiType.MMI_TYPE_DOT3,
          0x000000,
          jabra.RemoteMmiSequence.MMI_LED_SEQUENCE_OFF
        );
      }, 500);
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

const mapStateToProps = ({ jabra }) => ({
  activeDevice: jabra.devices.active,
  supportsMMI: jabra.devices.mmi,
  callState: jabra.call.state
});

export default connect(mapStateToProps)(Wrapping);
