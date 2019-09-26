import { connect } from "react-redux";

const Analytics = ({ activeDevice, analytics, callState }) => {
  if (!activeDevice || !analytics) return null;

  if (callState === "accepted") {
    analytics.start();
  } else {
    analytics.stop();
  }

  return null;
};

const mapStateToProps = ({ jabra }) => ({
  activeDevice: jabra.devices.active,
  analytics: jabra.devices.active
    ? jabra.devices.analytics[jabra.devices.active.deviceID]
    : null,
  callState: jabra.call.state
});

export default connect(mapStateToProps)(Analytics);
