import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Eda from "./Eda.js";
import Sentiment from "./Sentiment.js";
import RFMAnalysis from "./RFMAnalysis.js";
import Churn from "./Churn.js";
import CustomerDashboard from "./CustomerDashboard.js";
import { CanvasRevealEffect } from "./canvas-reveal-effect.js";
import { Button } from "./Button.js";
import {
  ChevronLeft,
  LogOut,
  ChevronRight,
  BarChart2,
  TrendingUp,
  Users,
  RefreshCw,
  User,
  Globe,
  Car,
  FileText,
} from "lucide-react";
import MapComponent from "./MapComponent.js";
import "antd/dist/reset.css";
import CarDamageAssessment from "./CarDamageAssessment.js";
import Review from "./Review.js";

const Analysis = ({ onLogout }) => {
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  const handleBack = () => {
    setSelectedInsight(null);
  };

  const insights = useMemo(
    () => [
      {
        title: "Insight views",
        description: "EDA view to analyse the K-insure optics",
        icon: BarChart2,
      },
      {
        title: "Sentiment Analysis",
        description: "Analyze customer sentiment",
        icon: TrendingUp,
      },
      {
        title: "Customer Segmentation",
        description: "Segment customers based on behavior",
        icon: Users,
      },
      {
        title: "Attrition",
        description: "Predict and analyze customer churn",
        icon: RefreshCw,
      },
      {
        title: "Individual Customer view",
        description: "Detailed view of individual customers",
        icon: User,
      },
      {
        title: "Geographical view",
        description: "Analyze data across different regions",
        icon: Globe,
      },
      {
        title: "Cost detection for vehicle damage",
        description: "Estimate repair costs for vehicle damage",
        icon: Car,
      },
      {
        title: "Document Review",
        description: "Review automation",
        icon: FileText,
      },
    ],
    []
  );

  const InsightBox = React.memo(
    ({ title, description, icon: Icon, onClick }) => {
      const [hovered, setHovered] = React.useState(false);

      return (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg cursor-pointer w-full h-full flex flex-col justify-between relative overflow-hidden group"
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <CanvasRevealEffect
                  animationSpeed={3}
                  containerClassName="bg-blue-600"
                  colors={[[59, 130, 246]]}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative z-10 flex flex-col h-full">
            <div className="text-4xl mb-2 transform transition-transform duration-300 group-hover:scale-110">
              <Icon className="w-8 h-8 text-slate-200" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-100">
              {title}
            </h3>
            <p className="text-xs text-gray-400 flex-grow">{description}</p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 flex items-center"
            >
              <span className="text-blue-400 font-semibold mr-1 text-xs">
                Learn more
              </span>
              <ChevronRight
                className="w-3 h-3 text-blue-400"
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </motion.div>
      );
    }
  );

  const renderFooter = () => (
    <footer className="w-full max-w-7xl mx-auto mt-16 text-xs">
      <div className="flex flex-wrap justify-center gap-8 mb-6">
        <div className="w-40">
          <h3 className="font-semibold mb-2 text-center">Products</h3>
          <ul className="space-y-1 text-center">
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Health Insurance
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Travel Insurance
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Home Insurance
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Auto Insurance
              </a>
            </li>
          </ul>
        </div>
        <div className="w-40">
          <h3 className="font-semibold mb-2 text-center">Services</h3>
          <ul className="space-y-1 text-center">
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Claims Processing
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Policy Management
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Risk Assessment
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Customer Support
              </a>
            </li>
          </ul>
        </div>
        <div className="w-40">
          <h3 className="font-semibold mb-2 text-center">Resources</h3>
          <ul className="space-y-1 text-center">
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Documentation
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                API Reference
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Tutorials
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Blog
              </a>
            </li>
          </ul>
        </div>
        <div className="w-40">
          <h3 className="font-semibold mb-2 text-center">Company</h3>
          <ul className="space-y-1 text-center">
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Careers
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Press
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="w-40">
          <h3 className="font-semibold mb-2 text-center">Legal</h3>
          <ul className="space-y-1 text-center">
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Terms of Service
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Cookie Policy
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                GDPR Compliance
              </a>
            </li>
          </ul>
        </div>
        <div className="w-40">
          <h3 className="font-semibold mb-2 text-center">Connect</h3>
          <ul className="space-y-1 text-center">
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                X
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/kanini/"
                className="text-gray-400 hover:text-white"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Facebook
              </a>
            </li>
            <li>
              <a href=" " className="text-gray-400 hover:text-white">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 text-xs">
          Copyright © 2024 K-Insure Inc. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2 md:mt-0 text-xs">
          <a href=" " className="text-gray-400 hover:text-white">
            Terms of Use
          </a>
          <a href=" " className="text-gray-400 hover:text-white">
            Privacy Policy
          </a>
          <a href=" " className="text-gray-400 hover:text-white">
            Agreements and Guidelines
          </a>
        </div>
      </div>
      <br />
    </footer>
  );

  return (
    <>
      <div className="min-h-screen bg-black text-white relative flex flex-col font-raleway">
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap");

          body {
            font-family: "Raleway", sans-serif;
          }

          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #000000;
          }
          ::-webkit-scrollbar-thumb {
            background: #ffffff;
            border-radius: 3px;
          }
        `}</style>
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
              ></motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {selectedInsight ? (
          <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900">
            <Button
              onClick={handleBack}
              className="absolute top-4 left-4 z-10"
              variant="outline"
            >
              <ChevronLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back
            </Button>
            {selectedInsight === "Insight views" && <Eda />}
            {selectedInsight === "Sentiment Analysis" && <Sentiment />}
            {selectedInsight === "Customer Segmentation" && <RFMAnalysis />}
            {selectedInsight === "Attrition" && <Churn />}
            {selectedInsight === "Individual Customer view" && (
              <CustomerDashboard />
            )}
            {selectedInsight === "Geographical view" && <MapComponent />}
            {selectedInsight === "Cost detection for vehicle damage" && (
              <CarDamageAssessment />
            )}
            {selectedInsight === "Document Review" && <Review />}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-screen"
          >
            <header className="py-6 px-8 flex justify-between items-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg sticky top-0 z-10">
              <motion.h1
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl font-extrabold text-center flex-grow bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-200"
              >
                K-Insure Analysis
              </motion.h1>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="px-6 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center"
              >
                <LogOut className="mr-2 h-5 w-5" aria-hidden="true" /> Logout
              </Button>
            </header>

            <main className="flex-grow container mx-auto px-8 py-12">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {insights.slice(0, 6).map((insight, index) => (
                  <InsightBox
                    key={index}
                    title={insight.title}
                    description={insight.description}
                    icon={insight.icon}
                    onClick={() => setSelectedInsight(insight.title)}
                  />
                ))}
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="grid grid-cols-2 gap-4 mt-4 max-w-2xl mx-auto"
              >
                {insights.slice(6).map((insight, index) => (
                  <InsightBox
                    key={index + 6}
                    title={insight.title}
                    description={insight.description}
                    icon={insight.icon}
                    onClick={() => setSelectedInsight(insight.title)}
                  />
                ))}
              </motion.div>
            </main>
            {renderFooter()}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default React.memo(Analysis);
