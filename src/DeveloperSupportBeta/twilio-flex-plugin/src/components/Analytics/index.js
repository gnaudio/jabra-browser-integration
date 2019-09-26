import React from "react";
import * as S from "./styles";
import { ArmPosition } from "./scenes/ArmPosition";
import { Stats } from "./scenes/Stats";
import { AcousticLevel } from "./scenes/AcousticLevel";
import { connect } from "react-redux";

const Analytics = ({ analytics }) => (
  <S.Analytics>
    {analytics && (
      <>
        <ArmPosition analytics={analytics} />
        <Stats analytics={analytics} />
        <AcousticLevel analytics={analytics} />
      </>
    )}
  </S.Analytics>
);

const mapStateToProps = ({ jabra }) => ({
  analytics: jabra.devices.active
    ? jabra.devices.analytics[jabra.devices.active.deviceID]
    : null
});

export default connect(mapStateToProps)(Analytics);
