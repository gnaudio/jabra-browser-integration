import * as jabra from "jabra-browser-integration";
import { connect } from "react-redux";

const mapStateToProps = ({ flex }) => ({
  available: flex.worker.activity.available
});

const CallState = ({ available, callState, activeDevice }) => {
  if (!activeDevice) return null;

  if (available && callState === "incoming") {
    jabra.ring();
    return null;
  }

  if (available && callState === "accepted") {
    jabra.offHook();
    return null;
  }

  jabra.onHook();

  return null;
};

export default connect(mapStateToProps)(CallState);
