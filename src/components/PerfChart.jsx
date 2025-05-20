import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function PerfChart({
  title,
  data,
  xKey,
  yKey,
  xLabel,
  yLabel,
  domain = ['auto', 'auto'],
}) {
  return (
    <div className="graph-container">
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            label={{ value: xLabel, position: 'bottom', offset: 5 }}
          />
          <YAxis
            domain={domain}
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
              offset: -5,
            }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#704ac7"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
