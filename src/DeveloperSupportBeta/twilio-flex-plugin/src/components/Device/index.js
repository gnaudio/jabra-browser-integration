import React from "react";
import { connect } from "react-redux";

import ReactTooltip from "react-tooltip";
import * as S from "./styles";

class Device extends React.Component {
  render() {
    const { initialized, installed, active_device } = this.props;
    const invalid = !(installed && active_device);

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
              : !active_device
              ? "Couldn't find any active device"
              : active_device.deviceName}
          </span>
        </ReactTooltip>
      </>
    );
  }
}

const mapStateToProps = state => {
  return state.jabra;
};

export default connect(mapStateToProps)(Device);
