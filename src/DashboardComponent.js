import React from "react";
import { motion } from "framer-motion";
import { LogOut, PieChart, BarChart, LineChart } from "lucide-react";

const DashboardComponent = ({ onLogout }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-900 text-white p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="flex items-center px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={20} className="mr-2" />
            Logout
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            title="Total Users"
            value="10,234"
            icon={<PieChart size={24} />}
            color="bg-blue-500"
          />
          <DashboardCard
            title="Revenue"
            value="$1,234,567"
            icon={<BarChart size={24} />}
            color="bg-green-500"
          />
          <DashboardCard
            title="Active Policies"
            value="5,678"
            icon={<LineChart size={24} />}
            color="bg-purple-500"
          />
        </div>
        {/* Add more dashboard content here */}
      </div>
    </motion.div>
  );
};

const DashboardCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`${color} rounded-xl p-6 shadow-lg`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      {icon}
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

export default DashboardComponent;
