import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const defaultColors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-2 rounded shadow">
        <p className="text-gray-300">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const BarChart = ({
  data,
  index,
  categories,
  colors = defaultColors,
  valueFormatter,
  ...props
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsBarChart data={data} {...props}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey={index} stroke="#9CA3AF" />
      <YAxis stroke="#9CA3AF" tickFormatter={valueFormatter} />
      <Tooltip content={<CustomTooltip />} />
      {categories.map((category, i) => (
        <Bar
          key={category}
          dataKey={category}
          fill={colors[i % colors.length]}
        />
      ))}
    </RechartsBarChart>
  </ResponsiveContainer>
);

export const LineChart = ({
  data,
  index,
  categories,
  colors = defaultColors,
  valueFormatter,
  ...props
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsLineChart data={data} {...props}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey={index} stroke="#9CA3AF" />
      <YAxis stroke="#9CA3AF" tickFormatter={valueFormatter} />
      <Tooltip content={<CustomTooltip />} />
      {categories.map((category, i) => (
        <Line
          key={category}
          type="monotone"
          dataKey={category}
          stroke={colors[i % colors.length]}
          strokeWidth={2}
          dot={{ r: 4, fill: colors[i % colors.length] }}
        />
      ))}
    </RechartsLineChart>
  </ResponsiveContainer>
);

export const PieChart = ({
  data,
  index,
  category,
  colors = defaultColors,
  valueFormatter,
  ...props
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsPieChart {...props}>
      <Pie
        data={data}
        dataKey={category}
        nameKey={index}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label={({ name, value }) =>
          `${name}: ${valueFormatter ? valueFormatter(value) : value}`
        }
      >
        {data.map((entry, i) => (
          <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend />
    </RechartsPieChart>
  </ResponsiveContainer>
);

export const HeatMap = ({
  data,
  index,
  categories,
  colors = [
    "#67000d",
    "#a50f15",
    "#cb181d",
    "#ef3b2c",
    "#fb6a4a",
    "#fc9272",
    "#fcbba1",
    "#fee0d2",
  ],
  valueFormatter,
  ...props
}) => {
  const minValue = Math.min(
    ...data.map((item) => Math.min(...categories.map((cat) => item[cat])))
  );
  const maxValue = Math.max(
    ...data.map((item) => Math.max(...categories.map((cat) => item[cat])))
  );

  const getColor = (value) => {
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const colorIndex = Math.floor(normalizedValue * (colors.length - 1));
    return colors[colorIndex];
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} layout="vertical" {...props}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis type="number" stroke="#9CA3AF" tickFormatter={valueFormatter} />
        <YAxis dataKey={index} type="category" stroke="#9CA3AF" />
        <Tooltip content={<CustomTooltip />} />
        {categories.map((category, i) => (
          <Bar key={category} dataKey={category} fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry[category])} />
            ))}
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
