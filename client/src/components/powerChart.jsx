import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

function PowerChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#8884d8"
          name="Predicted"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#82ca9d"
          name="Actual"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default PowerChart;
