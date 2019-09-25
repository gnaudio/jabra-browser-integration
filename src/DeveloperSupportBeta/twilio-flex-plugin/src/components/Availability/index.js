import React from "react";
import { connect } from "react-redux";
import { jabra, store } from "@gnaudio/twilio-flex-call-control-plugin";
import supportsMMI from "../../utils/supportsMMI";

const jabraConnect = mapStateToProps => Component => {
  const Connection = connect(mapStateToProps)(
    ({ store, children, ...props }) => {
      return React.cloneElement(children, props);
    }
  );

  return props => (
    <Connection store={store}>
      <Component {...props} />
    </Connection>
  );
};

const Availability = ({ available, activeDevice }) => {
  console.log(available, activeDevice);

  if (!activeDevice || !supportsMMI(activeDevice)) return null;

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

  return null;
};

const mapStateToPropsFlex = ({ flex }) => ({
  available: flex.worker.activity.available
});
const mapStateToPropsJabra = ({ jabra }) => ({
  activeDevice: jabra.devices.active
});

export default connect(mapStateToPropsFlex)(
  jabraConnect(mapStateToPropsJabra)(Availability)
);
