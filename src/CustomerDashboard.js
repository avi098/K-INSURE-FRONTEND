import React, { useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./Card.js";
import { Input } from "./Input.js";
import { Button } from "./Button.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table.js";
import { BarChart, LineChart, PieChart } from "./Chart.js";

const Tooltip = ({ children, content }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute z-10 w-48 p-2 mt-2 text-sm text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {content}
      </div>
    </div>
  );
};

const Badge = ({ children, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
    yellow: "bg-yellow-500 text-black",
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
};

const ProgressBar = ({ value, max, label }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-blue-400">{label}</span>
        <span className="text-sm font-medium text-blue-300">{`${value}/${max}`}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, icon, change }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-3xl text-blue-500">{icon}</span>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-400 truncate">
              {label}
            </dt>
            <dd>
              <div className="text-lg font-semibold text-white">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
      {change && (
        <div
          className={`mt-2 flex items-center text-sm ${
            change > 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
        </div>
      )}
    </div>
  );
};

export default function CustomerDashboard() {
  const [lob, setLob] = useState("");
  const [cprNo, setCprNo] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const lobOptions = useMemo(
    () => [
      { value: "Auto", label: "Auto" },
      { value: "Property", label: "Property" },
      { value: "Health", label: "Health" },
      { value: "Travel", label: "Travel" },
    ],
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setCustomerData(null);
      setActiveSection(null);
      setIsLoading(true);

      if (!lob || !cprNo) {
        setError("Please select LOB and enter CPR No.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/customer-dashboard",
          { lob, cpr_no: cprNo }
        );
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        setCustomerData(response.data);
        setActiveSection("info");
      } catch (error) {
        console.error("Error fetching customer info:", error);
        setError(
          error.response?.data?.error ||
            "Failed to fetch customer information. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [lob, cprNo]
  );

  const handlePdfDownload = useCallback(async () => {
    if (!customerData) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-pdf-data",
        { lob, cpr_no: cprNo },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Individual_Customer_View_${cprNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError("Failed to download PDF. Please try again.");
    }
  }, [customerData, lob, cprNo]);

  const CustomerInfoTable = useMemo(() => {
    if (!customerData) return null;
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left font-semibold text-gray-300">
              Field
            </TableHead>
            <TableHead className="text-left font-semibold text-gray-300">
              Value
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(customerData.personal_info).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell className="py-2 text-gray-400">{key}</TableCell>
              <TableCell className="py-2 text-white">{String(value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [customerData]);

  const renderChart = useCallback((data, chartType, options) => {
    const ChartComponent = {
      bar: BarChart,
      line: LineChart,
      pie: PieChart,
    }[chartType];

    const chartData = Array.isArray(data)
      ? data
      : Object.entries(data).map(([name, value]) => ({ name, value }));

    return (
      <div className="w-full h-64 md:h-80 lg:h-96">
        <ChartComponent data={chartData} {...options} />
      </div>
    );
  }, []);

  const renderMetricsContent = useCallback(() => {
    if (!customerData || !customerData.metrics) return null;

    const metricsData = customerData.metrics.table_data;
    const churnRiskScore = metricsData.find(
      (item) => item.metric === "Churn Risk Score"
    ).value;
    const customerName = customerData.metrics.customer_name;
    const lobValue = customerData.metrics.lob;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsData.map((item, index) => (
            <Tooltip key={item.metric} content={`Details about ${item.metric}`}>
              <Stat
                label={item.metric}
                value={item.value.toFixed(2)}
                icon={["📊", "📈", "📉", "🔢"][index % 4]}
                change={(((item.value - 5) / 5) * 100).toFixed(1)}
              />
            </Tooltip>
          ))}
        </div>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-lg">
          <CardHeader className="p-6 border-b border-gray-700">
            <CardTitle className="text-2xl font-bold text-blue-400">
              Customer Lifetime Value and GWP
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderChart(customerData.metrics.chart_data, "pie", {
              index: "metric",
              category: "value",
              colors: ["#4F46E5", "#10B981"],
              valueFormatter: (number) => `₹${number.toFixed(2)}`,
            })}
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-lg">
          <CardContent className="p-6">
            <p className="text-xl text-white leading-relaxed">
              {churnRiskScore < 5 ? (
                <span className="text-red-400 font-semibold">
                  {customerName} is likely to churn
                </span>
              ) : (
                <span className="text-green-400 font-semibold">
                  {customerName} shows high engagement
                </span>
              )}{" "}
              in their {lobValue} insurance.{" "}
              <Badge color={churnRiskScore < 5 ? "red" : "green"}>
                {churnRiskScore < 5 ? "High Risk" : "Low Risk"}
              </Badge>
            </p>
            <ProgressBar
              value={churnRiskScore}
              max={10}
              label="Churn Risk Score"
            />
          </CardContent>
        </Card>
      </div>
    );
  }, [customerData, renderChart]);

  const renderLobSpecificDashboard = useCallback(() => {
    if (!customerData || !customerData.lob_specific_data) return null;

    const { lob_specific_data } = customerData;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-2 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(lob_specific_data)
              .filter(([key, value]) => typeof value !== "object")
              .slice(0, 4)
              .map(([key, value]) => (
                <Tooltip key={key} content={`Details about ${key}`}>
                  <div className="text-center">
                    <p className="text-lg font-semibold">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-3xl font-bold">{value}</p>
                  </div>
                </Tooltip>
              ))}
          </CardContent>
        </Card>

        {lob_specific_data.historical_data &&
          lob_specific_data.historical_data.premium_trend && (
            <Card className="bg-gradient-to-br from-blue-900 to-cyan-900 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Premium Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={lob_specific_data.historical_data.premium_trend}
                  index="date"
                  categories={["value"]}
                  colors={["#6EE7B7"]}
                  valueFormatter={(value) => `$${value}`}
                  yAxisWidth={48}
                />
              </CardContent>
            </Card>
          )}

        {lob_specific_data.historical_data &&
          lob_specific_data.historical_data.claim_history && (
            <Card className="bg-gradient-to-br from-green-900 to-emerald-900 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Claim History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={lob_specific_data.historical_data.claim_history}
                  index="date"
                  categories={["value"]}
                  colors={["#F472B6"]}
                  valueFormatter={(value) => value.toString()}
                  yAxisWidth={48}
                />
              </CardContent>
            </Card>
          )}

        <Card className="col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">LOB Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attribute</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(lob_specific_data)
                  .filter(([key, value]) => typeof value !== "object")
                  .slice(4)
                  .map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">
                        {key.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }, [customerData]);

  const renderInteractionHistoryChart = useCallback(
    () => (
      <div className="space-y-8">
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-2xl font-semibold mb-6 text-blue-400">
            Interaction History
          </h3>
          {renderChart(customerData.interaction_history, "line", {
            index: "date",
            categories: ["interaction_count"],
            colors: ["#10B981"],
            valueFormatter: (number) => number.toString(),
            yAxisWidth: 40,
          })}
        </div>
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-2xl font-semibold mb-6 text-blue-400">
            Engagement History
          </h3>
          {renderChart(customerData.engagement_history, "line", {
            index: "date",
            categories: ["engagement_score"],
            colors: ["#F59E0B"],
            valueFormatter: (number) => number.toFixed(2),
            yAxisWidth: 40,
          })}
        </div>
      </div>
    ),
    [customerData, renderChart]
  );

  const renderRiskFactorsChart = useCallback(() => {
    if (!customerData || !customerData.risk_factors) return null;

    const riskFactors = customerData.risk_factors;
    const riskKeys = Object.keys(riskFactors);
    const riskValues = Object.values(riskFactors);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-2 bg-gradient-to-br from-red-900 to-orange-900 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Risk Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {riskKeys.map((key, index) => (
              <div key={key} className="text-center">
                <p className="text-lg font-semibold">{key}</p>
                <p className="text-3xl font-bold">{riskValues[index]}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Risk Factors Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={riskKeys.map((key, index) => ({
                name: key,
                value: riskValues[index],
              }))}
              index="name"
              categories={["value"]}
              colors={["#EF4444"]}
              valueFormatter={(value) => value.toString()}
              yAxisWidth={48}
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Risk Trend (Simulated)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={[
                { date: "Jan", risk: 3 },
                { date: "Feb", risk: 4 },
                { date: "Mar", risk: 3.5 },
                { date: "Apr", risk: 5 },
                { date: "May", risk: 4.5 },
                { date: "Jun", risk: 4 },
              ]}
              index="date"
              categories={["risk"]}
              colors={["#F59E0B"]}
              valueFormatter={(value) => value.toFixed(1)}
              yAxisWidth={40}
            />
          </CardContent>
        </Card>
      </div>
    );
  }, [customerData]);

  const renderFeedbackChart = useCallback(
    () => (
      <div className="bg-gray-900 p-6 rounded-xl">
        {renderChart(customerData.customer_feedback, "bar", {
          index: "name",
          categories: ["value"],
          colors: ["#8B5CF6"],
          valueFormatter: (number) => number.toFixed(2),
          yAxisWidth: 48,
        })}
      </div>
    ),
    [customerData, renderChart]
  );

  const renderPolicyDetails = useCallback(() => {
    if (!customerData || !customerData.policy_details) return null;

    const { policy_details } = customerData;

    return (
      <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Policy Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {Object.entries(policy_details).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">
                    {key.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }, [customerData]);

  const renderClaimsHistory = useCallback(() => {
    if (!customerData || !customerData.claims_history) return null;

    const { claims_history } = customerData;

    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-green-900 to-teal-900 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Claims Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-semibold">Total Claims</p>
                <p className="text-3xl font-bold">
                  {claims_history.total_claims}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold">Claim Frequency</p>
                <p className="text-3xl font-bold">
                  {claims_history.claim_frequency.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900 to-pink-900 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims_history.recent_claims.map((claim, index) => (
                  <TableRow key={index}>
                    <TableCell>{claim.date}</TableCell>
                    <TableCell>₹{claim.amount}</TableCell>
                    <TableCell>{claim.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }, [customerData]);

  const renderLoyaltyProgram = useCallback(() => {
    if (!customerData || !customerData.loyalty_program) return null;

    const { loyalty_program } = customerData;

    return (
      <Card className="bg-gradient-to-br from-yellow-800 to-orange-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Loyalty Program</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-lg font-semibold">Loyalty Tier</p>
              <p className="text-3xl font-bold">
                {loyalty_program.loyalty_tier}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">Points Earned</p>
              <p className="text-3xl font-bold">
                {loyalty_program.points_earned}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">Rewards Redeemed</p>
              <p className="text-3xl font-bold">
                {loyalty_program.rewards_redeemed}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">Leaderboard Position</p>
              <p className="text-3xl font-bold">
                {loyalty_program.leaderboard_position}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-lg font-semibold">Benefits Available</p>
              <p className="text-xl">{loyalty_program.benefits_available}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [customerData]);

  const renderRiskProfile = useCallback(() => {
    if (!customerData || !customerData.risk_profile) return null;

    const { risk_profile } = customerData;

    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-red-900 to-pink-900 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Risk Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Tooltip content="Overall risk assessment based on various factors">
                <div>
                  <p className="text-lg font-semibold">Risk Assessment Score</p>
                  <p className="text-3xl font-bold">
                    {risk_profile.risk_assessment_score.toFixed(2)}
                  </p>
                </div>
              </Tooltip>
              <Tooltip content="Customer's credit score">
                <div>
                  <p className="text-lg font-semibold">Credit Score</p>
                  <p className="text-3xl font-bold">
                    {risk_profile.credit_score}
                  </p>
                  <Badge
                    color={risk_profile.credit_score > 700 ? "green" : "red"}
                  >
                    {risk_profile.credit_score > 700
                      ? "Good"
                      : "Needs Improvement"}
                  </Badge>
                </div>
              </Tooltip>
              <Tooltip content="Impact of claim history on risk profile">
                <div>
                  <p className="text-lg font-semibold">Claim History Impact</p>
                  <p className="text-3xl font-bold">
                    {risk_profile.claim_history_impact}
                  </p>
                </div>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-900 to-yellow-900 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {risk_profile.risk_factors.map((factor, index) => (
                <li key={index} className="text-lg">
                  {factor}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }, [customerData]);

  const renderFinancialOverview = useCallback(() => {
    if (!customerData || !customerData.financial_overview) return null;

    const { financial_overview } = customerData;

    return (
      <Card className="bg-gradient-to-br from-green-900 to-blue-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-semibold">Customer Lifetime Value</p>
              <p className="text-3xl font-bold">
                ₹{financial_overview.customer_lifetime_value.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">Total Premiums Paid</p>
              <p className="text-3xl font-bold">
                ₹{financial_overview.total_premiums_paid.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">Outstanding Premium</p>
              <p className="text-3xl font-bold">
                ₹{financial_overview.outstanding_premium.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">Account Balance</p>
              <p className="text-3xl font-bold">
                ₹{financial_overview.account_balance.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [customerData]);

  const renderPersonalizedRecommendations = useCallback(() => {
    if (!customerData || !customerData.personalized_recommendations)
      return null;

    const { personalized_recommendations } = customerData;

    return (
      <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {personalized_recommendations.table && (
            <div className="mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    {personalized_recommendations.table.headers.map(
                      (header, index) => (
                        <TableHead key={index} className="text-white font-bold">
                          {header}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personalized_recommendations.table.rows.map((row, index) => (
                    <TableRow key={index}>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          className={`text-white ${
                            cellIndex === 1 ? "font-bold text-green-300" : ""
                          }`}
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {personalized_recommendations.recommendations.length > 0 ? (
            <ul className="list-disc list-inside">
              {personalized_recommendations.recommendations.map(
                (recommendation, index) => (
                  <li key={index} className="text-lg mb-2">
                    {recommendation}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-lg">
              No additional personalized recommendations at this time.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }, [customerData]);

  const renderSectionContent = useCallback(() => {
    if (!customerData || !activeSection) return null;

    const commonCardStyle =
      "bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:border-gray-600";
    const commonTitleStyle =
      "text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500";

    const sectionContent = {
      info: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-700">
            <CardTitle className={commonTitleStyle}>
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">{CustomerInfoTable}</CardContent>
        </Card>
      ),
      metrics: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-800">
            <CardTitle className={commonTitleStyle}>Customer Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-6">{renderMetricsContent()}</CardContent>
        </Card>
      ),
      lobSpecific: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-800">
            <CardTitle
              className={commonTitleStyle}
            >{`${lob}-Specific Dashboard`}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderLobSpecificDashboard()}
          </CardContent>
        </Card>
      ),
      interactions: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-800">
            <CardTitle className={commonTitleStyle}>
              Interaction and Engagement History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderInteractionHistoryChart()}
          </CardContent>
        </Card>
      ),
      risk: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-800">
            <CardTitle className={commonTitleStyle}>Risk Factors</CardTitle>
          </CardHeader>
          <CardContent className="p-6">{renderRiskFactorsChart()}</CardContent>
        </Card>
      ),
      feedback: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-800">
            <CardTitle className={commonTitleStyle}>
              Customer Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">{renderFeedbackChart()}</CardContent>
        </Card>
      ),
      policy: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-800">
            <CardTitle className={commonTitleStyle}>Policy Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">{renderPolicyDetails()}</CardContent>
        </Card>
      ),
      claims: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-800">
            <CardTitle className={commonTitleStyle}>Claims History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">{renderClaimsHistory()}</CardContent>
        </Card>
      ),
      loyalty: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-800">
            <CardTitle className={commonTitleStyle}>Loyalty Program</CardTitle>
          </CardHeader>
          <CardContent className="p-6">{renderLoyaltyProgram()}</CardContent>
        </Card>
      ),
      riskProfile: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-800">
            <CardTitle className={commonTitleStyle}>Risk Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6">{renderRiskProfile()}</CardContent>
        </Card>
      ),
      financial: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-800">
            <CardTitle className={commonTitleStyle}>
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">{renderFinancialOverview()}</CardContent>
        </Card>
      ),
      recommendations: (
        <Card className={commonCardStyle}>
          <CardHeader className="p-6 border-b border-gray-800">
            <CardTitle className={commonTitleStyle}>
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderPersonalizedRecommendations()}
          </CardContent>
        </Card>
      ),
    };

    return sectionContent[activeSection] || null;
  }, [
    activeSection,
    customerData,
    CustomerInfoTable,
    lob,
    renderMetricsContent,
    renderLobSpecificDashboard,
    renderInteractionHistoryChart,
    renderRiskFactorsChart,
    renderFeedbackChart,
    renderPolicyDetails,
    renderClaimsHistory,
    renderLoyaltyProgram,
    renderRiskProfile,
    renderFinancialOverview,
    renderPersonalizedRecommendations,
  ]);

  const menuItems = useMemo(
    () => [
      { key: "info", label: "Customer Info", icon: "👤" },
      { key: "metrics", label: "Metrics", icon: "📊" },
      { key: "lobSpecific", label: "LOB-Specific", icon: "🎯" },
      { key: "interactions", label: "Interactions", icon: "🤝" },
      { key: "risk", label: "Risk Factors", icon: "⚠️" },
      { key: "feedback", label: "Feedback", icon: "💬" },
      { key: "policy", label: "Policy Details", icon: "📋" },
      { key: "claims", label: "Claims History", icon: "🏥" },
      { key: "loyalty", label: "Loyalty Program", icon: "🏅" },
      { key: "riskProfile", label: "Risk Profile", icon: "📈" },
      { key: "financial", label: "Financial Overview", icon: "💰" },
      { key: "recommendations", label: "Recommendations", icon: "💡" },
    ],
    []
  );

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400 text-xl font-semibold">
            Loading customer dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-black text-white">
      <div className="w-full bg-gradient-to-br from-black to-black p-4 shadow-lg">
        <h1 className="text-4xl md:text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-200">
          Customer Analytics
        </h1>
      </div>
      <div className="max-w-7xl mx-auto p-8">
        <form
          onSubmit={handleSubmit}
          className="mb-12 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700"
        >
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Select value={lob} onValueChange={setLob}>
              <SelectTrigger className="w-full md:w-[180px] bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Select LOB" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {lobOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white hover:bg-gray-800"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={cprNo}
              onChange={(e) => setCprNo(e.target.value)}
              placeholder="Enter CPR No"
              className="flex-grow bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-900 bg-opacity-50 rounded-lg border border-red-700"
            >
              <p className="text-red-400 text-center font-semibold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {isLoading && !customerData && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-blue-400 text-lg font-semibold">
                Fetching customer data...
              </p>
            </div>
          </div>
        )}
        {customerData && !isLoading && (
          <div className="flex flex-col lg:flex-row mt-12 space-y-8 lg:space-y-0 lg:space-x-8">
            <div className="w-full lg:w-1/4">
              <nav className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                <ul>
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        onClick={() => setActiveSection(item.key)}
                        variant={
                          activeSection === item.key ? "default" : "ghost"
                        }
                        className={`w-full justify-start py-4 px-6 text-left transition-all duration-300 ${
                          activeSection === item.key
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <span className="mr-3 text-2xl">{item.icon}</span>
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </Button>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>
            <motion.div
              className="w-full lg:w-3/4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderSectionContent()}
              <div className="mt-8">
                <Button
                  onClick={handlePdfDownload}
                  className="w-full bg-gradient-to-r from-black to-black hover:from-gray-700 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                >
                  Download Customer Dashboard PDF
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
