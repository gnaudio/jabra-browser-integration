import React from "react";
import { connect } from "react-redux";

import CallState from "./CallState";

const CallControl = connect(({ jabra }) => ({ jabra }))(({ jabra }) => {
  return (
    <>
      <CallState
        callState={jabra.call.state}
        activeDevice={jabra.devices.active}
      ></CallState>
    </>
  );
});

export default CallControl;
