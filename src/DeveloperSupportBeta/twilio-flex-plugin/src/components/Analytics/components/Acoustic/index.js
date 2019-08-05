import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Line
} from "recharts";

export class Acoustic extends React.Component {
  render = () => {
    const { data } = this.props;

    return (
      <ResponsiveContainer width="100%" height={128}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis width={24} />
          <XAxis height={32} dataKey="time" tick={false} />
          <Tooltip
            separator=""
            labelFormatter={() => ""}
            formatter={value => [`${value} dB`, ""]}
          />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    );
  };
}
