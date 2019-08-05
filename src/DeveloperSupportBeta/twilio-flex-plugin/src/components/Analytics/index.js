import React from "react";
import * as S from "./styles";
import { ArmPosition } from "./scenes/ArmPosition";
import { Stats } from "./scenes/Stats";
import { AcousticLevel } from "./scenes/AcousticLevel";

export const Analytics = ({ analytics }) => (
  <S.Analytics>
    <ArmPosition analytics={analytics} />
    <Stats analytics={analytics} />
    <AcousticLevel analytics={analytics} />
  </S.Analytics>
);
