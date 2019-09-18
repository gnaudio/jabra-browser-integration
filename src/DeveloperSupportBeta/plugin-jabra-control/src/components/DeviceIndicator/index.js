import React from "react";
import { connect } from "react-redux";

import DeviceSelector from "../DeviceSelector";
import * as S from "./styles";

const Device = ({ store, devices, isInitialized, isInitializing }) => {
  let invalid;

  if (isInitializing) {
    invalid = "Browser SDK initializing...";
  } else if (!isInitialized) {
    invalid = "Browser SDK installation incomplete. Please (re)install";
  } else if (devices.length < 1) {
    invalid = "Couldn't find any Jabra devices";
  }

  return (
    <>
      <S.Base>
        <S.Logo data-tip data-for="jabra-device" invalid={invalid} />
      </S.Base>
      <S.Tooltip id="jabra-device">
        {invalid ? (
          <S.Error>{invalid}</S.Error>
        ) : (
          <DeviceSelector store={store}></DeviceSelector>
        )}
      </S.Tooltip>
    </>
  );
};

const mapStateToProps = ({ jabra }) => ({
  isInitialized: jabra.sdk.isInitialized,
  isInitializing: jabra.sdk.isInitializing,
  devices: jabra.devices.items,
  activeDevice: jabra.devices.activeDevice
});

export default connect(mapStateToProps)(Device);
