import React, { useState, useEffect } from "react";
import { Map, Marker } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapComponent = () => {
  const [mapData, setMapData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/get_india_data")
      .then((response) => response.json())
      .then((data) => setMapData(data))
      .catch((error) => console.error("Error loading India data:", error));
  }, []);

  const handleRegionClick = (region) => {
    fetch("/get_region_churn_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `region=${region}`,
    })
      .then((response) => response.json())
      .then((data) => setSelectedRegion(data))
      .catch((error) => console.error("Error:", error));
  };

  const getMetricClass = (value, warningThreshold, goodThreshold) => {
    if (value < warningThreshold) return "text-red-500";
    if (value < goodThreshold) return "text-yellow-500";
    return "text-green-500";
  };

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="w-screen h-screen relative" onMouseMove={handleMouseMove}>
      {mapData && (
        <Map
          mapLib={maplibregl}
          initialViewState={{
            longitude: 78.9629,
            latitude: 20.5937,
            zoom: 4,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://demotiles.maplibre.org/style.json"
        >
          {mapData.features.map((feature) => (
            <Marker
              key={feature.properties.Region}
              longitude={feature.geometry.coordinates[0]}
              latitude={feature.geometry.coordinates[1]}
              onClick={() => handleRegionClick(feature.properties.Region)}
            >
              <div
                className="marker transition-all duration-300 ease-in-out hover:scale-110"
                style={{
                  backgroundColor: "black",
                  opacity: Math.max(
                    0.3,
                    feature.properties.Churn_Risk_Score / 10
                  ),
                  width: `${Math.max(10, feature.properties.CPR_NO / 100)}px`,
                  height: `${Math.max(10, feature.properties.CPR_NO / 100)}px`,
                  borderRadius: "50%",
                  cursor: "pointer",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                  border: "2px solid black",
                }}
                onMouseEnter={() => setHoveredRegion(feature.properties)}
                onMouseLeave={() => setHoveredRegion(null)}
              />
            </Marker>
          ))}
          {hoveredRegion && (
            <div
              className="absolute bg-white bg-opacity-90 p-2 rounded-lg shadow-lg max-w-md z-10 text-black"
              style={{
                left: mousePosition.x,
                top: mousePosition.y,
                transform: "translate(10px, 10px)",
              }}
            >
              <h3 className="text-sm font-bold mb-2">{hoveredRegion.Region}</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left pr-2">Metric</th>
                    <th className="text-left">Average Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(hoveredRegion).map(([key, value]) => {
                    if (key !== "Region") {
                      return (
                        <tr key={key}>
                          <td className="pr-2">{key.replace(/_/g, " ")}:</td>
                          <td
                            className={
                              key === "Churn_Risk_Score"
                                ? getMetricClass(value, 5, 7)
                                : key === "Customer_Satisfaction_Score"
                                ? getMetricClass(value, 3, 4)
                                : key === "Loyalty_Score"
                                ? getMetricClass(value, 6, 8)
                                : key === "Engagement_Score"
                                ? getMetricClass(value, 6, 8)
                                : ""
                            }
                          >
                            {typeof value === "number"
                              ? value.toFixed(2)
                              : value}
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            </div>
          )}
          {selectedRegion && (
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg max-w-md">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-blue-600">
                  {selectedRegion.Region} Information
                </h2>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  onClick={() => setSelectedRegion(null)}
                >
                  ✕
                </button>
              </div>
              <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(selectedRegion).map(([key, value]) => (
                      <tr
                        key={key}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="py-2 pr-4 font-medium text-gray-700">
                          {key.replace(/_/g, " ")}
                        </td>
                        <td
                          className={`py-2 ${
                            key === "Churn_Risk_Score"
                              ? getMetricClass(value, 5, 7)
                              : key === "Customer_Satisfaction_Score"
                              ? getMetricClass(value, 3, 4)
                              : key === "Loyalty_Score"
                              ? getMetricClass(value, 6, 8)
                              : key === "Engagement_Score"
                              ? getMetricClass(value, 6, 8)
                              : key === "Policy_Renewal_Status"
                              ? getMetricClass(value, 0.7, 0.85)
                              : "text-gray-800"
                          } font-semibold`}
                        >
                          {typeof value === "number" ? value.toFixed(2) : value}
                          {key === "Policy_Renewal_Status" && "%"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Map>
      )}
    </div>
  );
};

export default MapComponent;
