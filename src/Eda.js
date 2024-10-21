import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "./hello.css";

const Eda = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeViz, setActiveViz] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const vizOrder = useMemo(
    () => [
      "churn_rate",
      "churn_gwp",
      "churn_claim",
      "churn_age",
      "churn_payment_mode",
      "churn_payment_mode_dist",
      "churn_lob",
      "loyalty_score_dist",
      "churn_gender",
      "churn_marital",
      "churn_education",
      "churn_satisfaction",
      "churn_region",
      "churn_dependants",
    ],
    []
  );

  const vizTitles = useMemo(
    () => [
      "1. Churn Rate",
      "2. Churn and GWP",
      "3. Churn and Number of claim",
      "4. Churn and Age groups",
      "5. Churn Rate by Payment mode",
      "6. Distribution of Churn Rate by Payment mode",
      "7. Churn Rate by LOB",
      "8. Customer Loyalty Score Distribution",
      "9. Churn Rate by Gender",
      "10. Churn Rate by Marital Status",
      "11. Churn Rate by Education Level",
      "12. Churn Rate by Customer Satisfaction Score",
      "13. Churn Rate by Region",
      "14. Churn Rate by Number Of Dependants",
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/eda");
        setData(response.data);
        setActiveViz(vizOrder[0]);
      } catch (error) {
        console.error("Error loading data: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vizOrder]);

  const renderPlot = useMemo(
    () => (figureData) => {
      if (!figureData || !figureData.data || !figureData.layout) {
        return (
          <div className="text-red-400 font-medium">
            Error: Invalid plot data
          </div>
        );
      }
      return (
        <Plot
          data={figureData.data}
          layout={{
            ...figureData.layout,
            autosize: true,
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            font: { color: "#e0e0e0", family: "Poppins" },
            margin: { l: 40, r: 40, t: 40, b: 40 },
          }}
          config={{ responsive: true, displayModeBar: false }}
          className="w-full h-full"
        />
      );
    },
    []
  );

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

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-xl font-medium text-gray-300 bg-gray-800 bg-opacity-50 p-8 rounded-2xl shadow-2xl border border-gray-500 border-opacity-30">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="App h-screen flex flex-col bg-gradient-to-br from-black to-black text-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 flex-grow flex flex-col h-full relative">
        <h1 className="text-4xl md:text-5xl font-black text-center my-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-200">
          EDA Visualizations
        </h1>

        {/* Hamburger Menu Button */}
        <button
          className="absolute top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white"
          onClick={() => setShowMenu(!showMenu)}
        >
          ☰
        </button>

        {/* Side Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-900 transform ${
            showMenu ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-40 overflow-y-auto`}
        >
          <div className="p-4 mt-16">
            {vizOrder.map((key, index) => (
              <button
                key={key}
                onClick={() => {
                  setActiveViz(key);
                  setShowMenu(false);
                }}
                className={`w-full px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-300 text-left mb-2 ${
                  activeViz === key
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {vizTitles[index]}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col items-center justify-center gap-4 h-full">
          <div className="w-4/5 h-3/4 bg-gray-800 bg-opacity-50 rounded-3xl shadow-2xl overflow-hidden">
            {activeViz && renderPlot(data[activeViz].figure)}
          </div>
          <div className="w-4/5 bg-gray-800 bg-opacity-50 rounded-3xl shadow-2xl overflow-hidden p-4 h-1/5">
            <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Description
            </h2>
            <div className="overflow-y-auto h-[calc(100%-2.5rem)] pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <p className="text-gray-300 text-sm leading-relaxed">
                {activeViz && data[activeViz].finding}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-glow opacity-30 pointer-events-none"></div>
    </div>
  );
};

export default Eda;
