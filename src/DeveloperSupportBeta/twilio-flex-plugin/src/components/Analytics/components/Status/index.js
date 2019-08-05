import React from "react";
import * as S from "./styles";
import types from "../../constants/types";

export const Status = ({ status }) => (
  <div>
    <Type
      value={status.isTXSpeaking}
      label={types["txspeech"].label}
      color={types["txspeech"].color}
    />
    <Type
      value={status.isRXSpeaking}
      label={types["rxspeech"].label}
      color={types["rxspeech"].color}
    />
    <Type
      value={status.isCrosstalking}
      label={types["crosstalk"].label}
      color={types["crosstalk"].color}
    />
    <Type
      value={status.isSilent}
      label={types["silence"].label}
      color={types["silence"].color}
    />
  </div>
);

const Type = ({ value, label, color }) => (
  <S.Type>
    <S.Indicator color={color} value={value} />
    <S.Label>{label}</S.Label>
  </S.Type>
);
