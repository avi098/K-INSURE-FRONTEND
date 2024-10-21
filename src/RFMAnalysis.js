import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const RFMAnalysis = () => {
  const [rfmData, setRfmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rfm-analysis");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRfmData(data);
      } catch (error) {
        console.error("Error loading data: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400">Loading</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-xl font-medium text-red-400 bg-gray-800 bg-opacity-50 p-8 rounded-2xl shadow-2xl border border-red-500 border-opacity-30">
          <p>Error</p>
          <p className="mt-2 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!rfmData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-xl font-medium text-gray-300 bg-gray-800 bg-opacity-50 p-8 rounded-2xl shadow-2xl border border-gray-500 border-opacity-30">
          No data available
        </div>
      </div>
    );
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const pieChartData = Object.entries(
    rfmData.all_rfm_rows.reduce((acc, curr) => {
      acc[curr.RFM_Label] = (acc[curr.RFM_Label] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="rfm-analysis bg-black text-white min-h-screen">
      <div className="w-full bg-gradient-to-br from-black to-black p-4 shadow-lg">
        <h1 className="text-4xl md:text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-200">
          Customer Segmentation
        </h1>
      </div>
      <div className="p-2">
        <div className="max-w-4xl mx-auto my-12">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rfm-table">
          <h3 className="text-2xl font-extrabold font-raleway text-center mb-6">
            RFM Segments
          </h3>
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-700 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      CPR_NO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Recency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Monetary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      RFM Label
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {rfmData.all_rfm_rows.map((row, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row.CPR_NO}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row.Recency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row.Frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row.Monetary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row.RFM_Label}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFMAnalysis;
