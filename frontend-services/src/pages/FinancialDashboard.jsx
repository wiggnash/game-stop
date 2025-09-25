import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  PieChart,
  BarChart3,
  Wallet,
  CreditCard,
  ShoppingCart,
  Gamepad2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const FinancialDashboard = () => {
  const [timePeriod, setTimePeriod] = useState("weekly"); // daily, weekly, monthly
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFinancialData({
        totalRevenue: 12500,
        totalExpenses: 4200,
        netProfit: 8300,
        revenueChange: 15,
        expensesChange: -5,
        profitChange: 20,
        revenueBreakdown: [
          { category: "Gaming Sessions", amount: 8500, percentage: 68 },
          { category: "Snack Sales", amount: 4000, percentage: 32 },
        ],
        expenseAnalysis: [
          { type: "Rent", amount: 1500, percentage: 36 },
          { type: "Utilities", amount: 1200, percentage: 29 },
          { type: "Supplies", amount: 1500, percentage: 36 },
        ],
        dailyRevenue: [
          { day: "Mon", amount: 1800 },
          { day: "Tue", amount: 1650 },
          { day: "Wed", amount: 1900 },
          { day: "Thu", amount: 1750 },
          { day: "Fri", amount: 2200 },
          { day: "Sat", amount: 2400 },
          { day: "Sun", amount: 1900 },
        ],
        topGamingServices: [
          { service: "PlayStation 5", revenue: 4200, sessions: 85 },
          { service: "PC Gaming", revenue: 3100, sessions: 62 },
          { service: "Xbox Series X", revenue: 1200, sessions: 24 },
        ],
        paymentMethods: [
          { method: "Cash", amount: 5500, percentage: 44 },
          { method: "Credit Card", amount: 4200, percentage: 34 },
          { method: "UPI/Digital", amount: 2800, percentage: 22 },
        ],
      });
      setLoading(false);
    }, 500);
  }, [timePeriod]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleExport = () => {
    console.log("Exporting financial report...");
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col bg-[#101922]">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 text-[#1173d4] animate-spin" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#101922]">
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Financial Dashboard
                </h2>
                <p className="text-slate-400 mt-1">
                  Overview of your cafe's financial performance
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-slate-800 p-1">
                  <button
                    onClick={() => setTimePeriod("daily")}
                    className={`py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                      timePeriod === "daily"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setTimePeriod("weekly")}
                    className={`py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                      timePeriod === "weekly"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setTimePeriod("monthly")}
                    className={`py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                      timePeriod === "monthly"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                </div>

                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleExport}
                  className="inline-flex items-center justify-center rounded-lg bg-[#1173d4] px-4 py-2 text-sm font-medium text-white hover:bg-[#1173d4]/90 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 p-6 rounded-lg shadow-sm border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-400">
                    Total Revenue
                  </p>
                  <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mt-1">
                  ${financialData.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-emerald-500 mt-2 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{financialData.revenueChange}%</span>
                </p>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-lg shadow-sm border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-400">
                    Total Expenses
                  </p>
                  <div className="h-10 w-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mt-1">
                  ${financialData.totalExpenses.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-red-500 mt-2 flex items-center gap-1">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>{Math.abs(financialData.expensesChange)}%</span>
                </p>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-lg shadow-sm border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-400">
                    Net Profit
                  </p>
                  <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mt-1">
                  ${financialData.netProfit.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-emerald-500 mt-2 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{financialData.profitChange}%</span>
                </p>
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-slate-900/50 p-6 rounded-lg shadow-sm border border-slate-800">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Revenue Trend
                  </h3>
                  <p className="text-3xl font-bold text-white mt-1">
                    ${financialData.totalRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-slate-400">Last 7 Days</p>
                    <p className="text-sm font-medium text-emerald-500 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>{financialData.revenueChange}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="mt-6">
                <div className="flex items-end justify-between h-48 gap-4">
                  {financialData.dailyRevenue.map((day, index) => {
                    const maxAmount = Math.max(
                      ...financialData.dailyRevenue.map((d) => d.amount),
                    );
                    const height = (day.amount / maxAmount) * 100;
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-full bg-[#1173d4] rounded-t-lg transition-all hover:bg-[#1173d4]/80 relative group"
                          style={{ height: `${height}%`, minHeight: "20px" }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${day.amount}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                          {day.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Revenue Breakdown and Expense Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Breakdown */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-white" />
                  <h3 className="text-xl font-bold text-white">
                    Revenue Breakdown
                  </h3>
                </div>
                <div className="overflow-x-auto bg-slate-900/50 rounded-lg shadow-sm border border-slate-800">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3" scope="col">
                          Category
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Amount
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.revenueBreakdown.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-800 hover:bg-slate-800/50"
                        >
                          <th
                            className="px-6 py-4 font-medium text-white whitespace-nowrap"
                            scope="row"
                          >
                            <div className="flex items-center gap-2">
                              <Gamepad2 className="w-4 h-4 text-[#1173d4]" />
                              {item.category}
                            </div>
                          </th>
                          <td className="px-6 py-4 text-slate-300">
                            ${item.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-slate-300">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[100px]">
                                <div
                                  className="bg-[#1173d4] h-2 rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                              <span>{item.percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Expense Analysis */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-white" />
                  <h3 className="text-xl font-bold text-white">
                    Expense Analysis
                  </h3>
                </div>
                <div className="overflow-x-auto bg-slate-900/50 rounded-lg shadow-sm border border-slate-800">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3" scope="col">
                          Expense Type
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Amount
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.expenseAnalysis.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-800 hover:bg-slate-800/50"
                        >
                          <th
                            className="px-6 py-4 font-medium text-white whitespace-nowrap"
                            scope="row"
                          >
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-red-400" />
                              {item.type}
                            </div>
                          </th>
                          <td className="px-6 py-4 text-slate-300">
                            ${item.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-slate-300">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[100px]">
                                <div
                                  className="bg-red-500 h-2 rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                              <span>{item.percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Top Gaming Services and Payment Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Gaming Services */}
              <div className="bg-slate-900/50 p-6 rounded-lg shadow-sm border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <Gamepad2 className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">
                    Top Gaming Services
                  </h3>
                </div>
                <div className="space-y-4">
                  {financialData.topGamingServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {service.service}
                        </p>
                        <p className="text-xs text-slate-400">
                          {service.sessions} sessions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-400">
                          ${service.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-slate-900/50 p-6 rounded-lg shadow-sm border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">
                    Payment Methods
                  </h3>
                </div>
                <div className="space-y-4">
                  {financialData.paymentMethods.map((method, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {method.method}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[150px]">
                            <div
                              className="bg-[#1173d4] h-2 rounded-full"
                              style={{ width: `${method.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-400">
                            {method.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          ${method.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialDashboard;
