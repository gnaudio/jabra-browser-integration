import React from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

import * as S from "./styles";

const DeviceIndicator = ({ initialized, installed, activeDevice }) => {
  const invalid = !(installed && activeDevice);

  if (!initialized) return null;

  return (
    <>
      <S.Base>
        <S.Logo data-tip data-for="jabra-device" invalid={invalid} />
      </S.Base>
      <ReactTooltip id="jabra-device" place="bottom" effect="solid">
        <span>
          {!installed
            ? "Browser SDK installation incomplete. Please (re)install"
            : !activeDevice
            ? "Couldn't find any active device"
            : activeDevice.deviceName}
        </span>
      </ReactTooltip>
    </>
  );
};

const mapStateToProps = ({
  jabraControl: { installed, initialized, activeDevice }
}) => ({
  installed,
  initialized,
  activeDevice
});

export default connect(mapStateToProps)(DeviceIndicator);
