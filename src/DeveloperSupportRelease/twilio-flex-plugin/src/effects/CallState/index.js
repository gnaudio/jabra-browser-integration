import React from "react";
import { jabra } from "@gnaudio/twilio-flex-call-control-plugin";
import { connect } from "react-redux";

class CallState extends React.Component {
  listeningToCallNoise = false;
  handleCallNoise = () => {
    const { callState } = this.props;

    if (callState !== "accepted") return;
    const event = this.props.analytics.events.newest("txacousticlevel");

    if (!event) return;

    function inRange(start, end) {
      return (event.value - start) * (event.value - end) <= 0;
    }

    const color = inRange(0, 40)
      ? 0x00ff00
      : inRange(40, 45)
      ? 0xffff00
      : inRange(45, 70)
      ? 0xff0000
      : 0xff0000;

    jabra.setRemoteMmiLightAction(
      jabra.RemoteMmiType.MMI_TYPE_DOT3,
      color,
      jabra.RemoteMmiSequence.MMI_LED_SEQUENCE_ON
    );
  };

  render() {
    const { activeDevice, supportsMMI, callState, analytics } = this.props;

    if (!activeDevice || !supportsMMI || !analytics) return null;

    if (!this.listeningToCallNoise) {
      analytics.addEventListener("txacousticlevel", this.handleCallNoise);
      this.listeningToCallNoise = true;
    }

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
  }
}

const mapStateToProps = ({ jabra }) => ({
  activeDevice: jabra.devices.active,
  supportsMMI: jabra.devices.mmi,
  callState: jabra.call.state,
  analytics: jabra.devices.active
    ? jabra.devices.analytics[jabra.devices.active.deviceID]
    : null
});

export default connect(mapStateToProps)(CallState);
