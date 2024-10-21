import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Churn = () => {
  const [formData, setFormData] = useState({
    LOB: "",
    PRODUCT_PLAN: "",
    GENDER: "Male",
    MARITAL_STATUS: "Single",
    PAYMENT_TERM: "",
    Occupation: "",
    Education_Level: "",
    Age: "",
    Income: "",
    Credit_Score: "",
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = Object.keys(formData);
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in the ${field.replace("_", " ")} field.`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/predict",
        formData
      );
      setPredictionResult(response.data.prediction);
    } catch (error) {
      console.error("Error:", error);
      setError(
        "An error occurred while making the prediction. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-gray-800 border border-gray-700 rounded p-1 text-sm focus:ring-1 focus:ring-blue-400 focus:border-transparent transition duration-200 text-white placeholder-gray-500";

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-5xl font-black text-center my-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-200">
        Customer Attrition Prediction
      </h1>
      <br />
      <main className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 backdrop-blur-sm backdrop-filter">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 text-center">
              Customer Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <label htmlFor={key} className="text-sm font-medium mb-1">
                      {key.replace("_", " ")}
                    </label>
                    {key === "LOB" ? (
                      <select
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      >
                        <option value="Select Insurance">
                          Select Insurance
                        </option>
                        <option value="Auto">Auto</option>
                        <option value="Health">Health</option>
                        <option value="Property">Property</option>
                        <option value="Travel">Travel</option>
                      </select>
                    ) : key === "PRODUCT_PLAN" ? (
                      <select
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      >
                        <option value="Select Plan">Select Plan</option>
                        <option value="Basic">Basic</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="Platinum">Platinum</option>
                        <option value="Third Party">Third Party</option>
                      </select>
                    ) : key === "GENDER" ? (
                      <select
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      >
                        <option value="Select Gender">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : key === "MARITAL_STATUS" ? (
                      <select
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      >
                        <option value="Select Marital Status">
                          Select Marital Status
                        </option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    ) : key === "PAYMENT_TERM" ? (
                      <select
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      >
                        <option value="Select Term">Select Term</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Half yearly">Half yearly</option>
                      </select>
                    ) : key === "Education_Level" ? (
                      <select
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      >
                        <option value="Select Education Level">
                          Select Education Level
                        </option>
                        <option value="High School">High School</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Master">Master</option>
                        <option value="PhD">PhD</option>
                      </select>
                    ) : (
                      <input
                        type={
                          ["Age", "Income", "Credit_Score"].includes(key)
                            ? "number"
                            : "text"
                        }
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder={key.replace("_", " ")}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm bg-red-100 border border-red-400 px-2 py-1 rounded relative"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-transparent to-transparent text-white font-bold py-2 px-4 rounded-md transition duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? "Predicting..." : "Predict Churn"}
              </motion.button>
            </form>
          </div>
        </motion.div>

        <div className="w-full max-w-2xl mx-auto mt-6">
          <AnimatePresence>
            {predictionResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden backdrop-blur-sm backdrop-filter">
                  <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 p-3 border-b border-gray-700">
                    Prediction Result
                  </h2>
                  <div className="p-3">
                    <motion.div
                      className={`text-3xl font-bold text-center p-4 rounded-lg ${
                        predictionResult === "Yes"
                          ? "bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500"
                          : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
                      }`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {predictionResult}
                    </motion.div>
                    <motion.p
                      className="text-center mt-4 text-lg font-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {predictionResult === "Yes"
                        ? "The customer is likely to churn."
                        : "The customer is likely to stay."}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Churn;
