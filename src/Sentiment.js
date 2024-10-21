import React, { useState, useEffect, useMemo, useCallback } from "react";
import Plot from "react-plotly.js";
import { TrendingUp, Menu } from "lucide-react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card.js";

const useVisualizationData = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/visualizations"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error loading data: ", error);
      setError(error.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, fetchData };
};

const parsePlotlyJson = (jsonString) => {
  try {
    return typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
  } catch (error) {
    console.error("Error parsing Plotly JSON:", error);
    return null;
  }
};

const PlotComponent = React.memo(({ figureData, activeViz }) => {
  const parsedFigure = parsePlotlyJson(figureData);

  if (!parsedFigure || !parsedFigure.data || !parsedFigure.layout) {
    return (
      <div className="text-red-400 font-medium">
        Error: Invalid plot data structure
      </div>
    );
  }

  const isTopThemesComparison = activeViz === "top_themes_comparison";

  const layout = {
    ...parsedFigure.layout,
    autosize: true,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { color: "#ffffff", family: "Poppins" },
    margin: isTopThemesComparison
      ? { l: 120, r: 20, t: 30, b: 20 }
      : { l: 40, r: 40, t: 40, b: 40 },
    height: isTopThemesComparison ? 400 : 300,
    width: isTopThemesComparison ? 720 : undefined,
    xaxis: { ...parsedFigure.layout.xaxis, color: "#ffffff" },
    yaxis: { ...parsedFigure.layout.yaxis, color: "#ffffff" },
    legend: { font: { color: "#ffffff" } },
  };

  if (isTopThemesComparison) {
    layout.legend = {
      orientation: "h",
      y: -0.2,
      font: { color: "#ffffff" },
    };
    layout.annotations = [
      {
        x: 0.25,
        y: 1.1,
        xref: "paper",
        yref: "paper",
        text: "Positive Themes",
        showarrow: false,
        font: { size: 14, color: "#ffffff" },
      },
      {
        x: 0.75,
        y: 1.1,
        xref: "paper",
        yref: "paper",
        text: "Negative Themes",
        showarrow: false,
        font: { size: 14, color: "#ffffff" },
      },
    ];
  }

  const updatedData = parsedFigure.data.map((trace) => ({
    ...trace,
    textfont: { color: "#ffffff" },
  }));

  return (
    <Plot
      data={updatedData}
      layout={layout}
      config={{ responsive: true, displayModeBar: false }}
      className="w-full h-full"
    />
  );
});

const Sentiment = () => {
  const [activeViz, setActiveViz] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const { data, error, loading, fetchData } = useVisualizationData();

  const vizOrder = useMemo(
    () => [
      "sentiment_distribution",
      "sentiment_trend",
      "top_themes_comparison",
      "word_cloud",
      "sentiment_by_age_group",
      "churn_insights",
    ],
    []
  );

  const vizTitles = useMemo(
    () => [
      "Sentiment Distribution",
      "Sentiment Trend",
      "Top Feedback Themes",
      "Word Cloud",
      "Sentiment by Age Group",
      "Churn Insights",
    ],
    []
  );

  useEffect(() => {
    if (data) {
      setActiveViz(vizOrder[0]);
    }
  }, [data, vizOrder]);

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
            onClick={fetchData}
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
          Sentiment Analysis
        </h1>

        <button
          className="absolute top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Menu size={24} />
        </button>

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

        <div className="flex-grow flex flex-col items-center justify-center gap-4 h-full mt-8">
          <Card className="w-4/5 bg-gray-800 bg-opacity-50 rounded-3xl shadow-2xl overflow-hidden max-h-[calc(100vh-12rem)]">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">
                {vizTitles[vizOrder.indexOf(activeViz)] || ""}
              </CardTitle>
              <CardDescription className="text-xs">
                {activeViz === "sentiment_distribution" &&
                  "Overall sentiment scores"}
                {activeViz === "sentiment_trend" && "Monthly average sentiment"}
                {activeViz === "top_themes_comparison" &&
                  "Positive vs Negative themes"}
                {activeViz === "word_cloud" && "Frequent words in feedback"}
                {activeViz === "sentiment_by_age_group" &&
                  "Age-based sentiment analysis"}
                {activeViz === "churn_insights" && "Sentiment impact on churn"}
              </CardDescription>
            </CardHeader>
            <CardContent
              className={`h-[calc(100%-8rem)] ${
                activeViz === "top_themes_comparison"
                  ? "flex justify-center items-center"
                  : ""
              }`}
            >
              {activeViz === "word_cloud" ? (
                <img
                  src={`data:image/png;base64,${data[activeViz]}`}
                  alt="Word Cloud"
                  className="max-w-full max-h-full object-contain mx-auto"
                />
              ) : (
                data[activeViz] && (
                  <PlotComponent
                    figureData={data[activeViz]}
                    activeViz={activeViz}
                  />
                )
              )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 text-xs">
              <div className="flex gap-1 font-medium leading-none">
                <TrendingUp className="h-3 w-3" />
                {activeViz === "sentiment_distribution" &&
                  "Trending up by 3.7%"}
                {activeViz === "sentiment_trend" && "Trending up by 2.1%"}
                {activeViz === "top_themes_comparison" &&
                  "5 new themes identified"}
                {activeViz === "word_cloud" && "10 new keywords trending"}
                {activeViz === "sentiment_by_age_group" &&
                  "18-30 age group up by 4.5%"}
                {activeViz === "churn_insights" && "Churn rate down by 2.8%"}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-glow opacity-30 pointer-events-none"></div>
    </div>
  );
};

export default Sentiment;
