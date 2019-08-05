import React from "react";
import { Cell, Pie, PieChart } from "recharts";
import * as S from "./styles";

const types = {
  txspeech: {
    label: "Agent talking",
    color: "#ffeaa7"
  },
  rxspeech: {
    label: "Contact talking",
    color: "#55efc4"
  },
  crosstalk: {
    label: "Crosstalk",
    color: "#ff7675"
  },
  silence: {
    label: "Silence",
    color: "#b2bec3"
  }
};

export const Overview = ({ status, overview }) => {
  const data = [
    {
      value: overview.txSpeechTime,
      name: types["txspeech"].label,
      color: types["txspeech"].color
    },
    {
      value: overview.rxSpeechTime,
      name: types["rxspeech"].label,
      color: types["rxspeech"].color
    },
    {
      value: overview.crosstalkTime,
      name: types["crosstalk"].label,
      color: types["crosstalk"].color
    },
    {
      value: overview.silenceTime,
      name: types["silence"].label,
      color: types["silence"].color
    }
  ];

  return (
    <S.Overview>
      <S.Statuses>
        <Status
          value={status.isTXSpeaking}
          label={types["txspeech"].label}
          color={types["txspeech"].color}
        />
        <Status
          value={status.isRXSpeaking}
          label={types["rxspeech"].label}
          color={types["rxspeech"].color}
        />
        <Status
          value={status.isCrosstalking}
          label={types["crosstalk"].label}
          color={types["crosstalk"].color}
        />
        <Status
          value={status.isSilent}
          label={types["silence"].label}
          color={types["silence"].color}
        />
      </S.Statuses>
      <PieChart width={96} height={96}>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={32}
          outerRadius={48}
          paddingAngle={5}
        >
          {data.map(entry => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </S.Overview>
  );
};

const Status = ({ value, label, color }) => (
  <S.Status>
    <S.StatusIndicator color={color} value={value} />
    <S.StatusLabel value={value}>{label}</S.StatusLabel>
  </S.Status>
);
