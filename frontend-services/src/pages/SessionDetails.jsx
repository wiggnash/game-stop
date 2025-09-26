import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  AlertCircle,
  CreditCard,
  Clock,
  XCircle,
  User,
  Monitor,
  Gamepad2,
  Calendar,
  Coffee,
} from "lucide-react";
import * as sessionsApi from "../api/sessions.api";

const SessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState("00:00:00");

  const handleBack = () => {
    navigate("/dashboard");
  };

  // Fetch session details from API
  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        setLoading(true);
        const data = await sessionsApi.getSessionDetails(id);
        setSessionData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching session details:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load session details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSessionDetails();
    }
  }, [id]);

  // Calculate remaining time
  const calculateRemainingTime = (checkOutTime) => {
    if (!checkOutTime) return "00:00:00";

    const now = new Date();
    const checkOut = new Date(checkOutTime);
    const timeDiff = checkOut.getTime() - now.getTime();

    if (timeDiff <= 0) return "00:00:00";

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Update timer every second
  useEffect(() => {
    if (!sessionData?.check_out_time) return;

    // Initial calculation
    setRemainingTime(calculateRemainingTime(sessionData.check_out_time));

    // Update every second
    const timerInterval = setInterval(() => {
      const newTime = calculateRemainingTime(sessionData.check_out_time);
      setRemainingTime(newTime);

      // Optional: Stop timer when it reaches 00:00:00
      if (newTime === "00:00:00") {
        clearInterval(timerInterval);
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timerInterval);
  }, [sessionData?.check_out_time]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE:
        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      PAUSED:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      COMPLETED:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || styles.ACTIVE}`}
      >
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const styles = {
      COMPLETED:
        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      PENDING:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
      FAILED: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || styles.PENDING}`}
      >
        {status}
      </span>
    );
  };

  const getPaymentMethodDisplay = (method) => {
    const methodMap = {
      CREDIT_CARD: "Credit Card",
      CASH: "Cash",
      UPI: "UPI/Digital",
      DEBIT_CARD: "Debit Card",
    };
    return methodMap[method] || method;
  };

  const handleRecordPayment = () => {
    console.log("Record payment for session:", id);
    // TODO: Implement payment modal
  };

  const handleAddSnacks = () => {
    console.log("Add snacks to session:", id);
    // TODO: Implement add snacks modal
  };

  const handleAddTime = () => {
    console.log("Add time to session:", id);
    // TODO: Implement add time modal
  };

  const handleEndSession = async () => {
    if (window.confirm("Are you sure you want to end this session?")) {
      try {
        await sessionsApi.endSession(id);
        navigate("/dashboard");
      } catch (err) {
        console.error("Error ending session:", err);
        alert("Failed to end session. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#101922]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1173d4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#101922]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl mb-2">
            {error || "Session not found"}
          </p>
          <button
            onClick={handleBack}
            className="text-[#1173d4] hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Combine gaming service and snacks for display
  const allItems = [
    sessionData.gaming_service_item,
    ...sessionData.snacks_items,
  ];

  return (
    <div className="min-h-screen bg-[#101922]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-6">
          <button
            onClick={handleBack}
            className="text-slate-400 hover:text-[#1173d4] flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Sessions
          </button>
          <span className="mx-2 text-slate-500">/</span>
          <span className="text-white">Session Details</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">
              Session #{sessionData.id}
            </h1>
            <p className="text-slate-400 mt-1">
              {sessionData.station_name} | {sessionData.customer_full_name} |{" "}
              {sessionData.game_service}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
              <Edit2 className="w-4 h-4" />
              Edit Session
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Session Summary */}
            <div className="bg-slate-900/50 rounded-lg shadow-sm border border-slate-800">
              <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">
                  Session Summary
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Session ID
                  </span>
                  <span className="font-medium text-white">
                    {sessionData.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Station
                  </span>
                  <span className="font-medium text-white">
                    {sessionData.station_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer
                  </span>
                  <span className="font-medium text-white">
                    {sessionData.customer_full_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    Game Service
                  </span>
                  <span className="font-medium text-white">
                    {sessionData.game_service}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Check In
                  </span>
                  <span className="font-medium text-white">
                    {formatDateTime(sessionData.check_in_time)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status</span>
                  {getStatusBadge(sessionData.session_status)}
                </div>
              </div>
            </div>

            {/* Services & Snacks - Compact Table */}
            <div className="bg-slate-900/50 rounded-lg shadow-sm border border-slate-800">
              <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">
                  Services & Snacks
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-800">
                    <tr>
                      <th className="px-4 py-2.5 text-left">Item</th>
                      <th className="px-4 py-2.5 text-center">Qty</th>
                      <th className="px-4 py-2.5 text-right">Price</th>
                      <th className="px-4 py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {allItems.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-800/50">
                        <td className="px-4 py-2.5 font-medium text-white">
                          {item.item_name}
                        </td>
                        <td className="px-4 py-2.5 text-center text-slate-300">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-300">
                          ${parseFloat(item.unit_price).toFixed(2)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-medium text-white">
                          ${parseFloat(item.total_cost).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {allItems.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-6 text-center text-slate-400"
                        >
                          No items added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment History - Compact Table */}
            <div className="bg-slate-900/50 rounded-lg shadow-sm border border-slate-800">
              <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">
                  Payment History
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-800">
                    <tr>
                      <th className="px-4 py-2.5 text-left">Date</th>
                      <th className="px-4 py-2.5 text-right">Amount</th>
                      <th className="px-4 py-2.5 text-left">Method</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {sessionData.payment_history.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-800/50">
                        <td className="px-4 py-2.5 text-slate-300">
                          {formatDateTime(payment.payment_date)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-medium text-white">
                          ${parseFloat(payment.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-2.5 text-slate-300">
                          {getPaymentMethodDisplay(payment.payment_method)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {getPaymentStatusBadge(payment.payment_status)}
                        </td>
                      </tr>
                    ))}
                    {sessionData.payment_history.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-6 text-center text-slate-400"
                        >
                          No payment records yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes Section */}
            {sessionData.notes && (
              <div className="bg-slate-900/50 rounded-lg shadow-sm border border-slate-800 p-6">
                <h3 className="text-lg font-bold text-white mb-2">Notes</h3>
                <p className="text-slate-300 text-sm">{sessionData.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Time & Charges */}
            <div className="bg-slate-900/50 rounded-lg shadow-sm border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Time & Charges
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-1">Remaining Time</p>
                  <p className="text-4xl font-bold text-orange-500">
                    {remainingTime}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-1">Current Charges</p>
                  <p className="text-4xl font-bold text-white">
                    ${parseFloat(sessionData.total_session_cost).toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRecordPayment}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-base font-bold text-white bg-[#1173d4] rounded-lg hover:bg-[#1173d4]/90 transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                Record Payment
              </button>
            </div>

            {/* Manage Session */}
            <div className="bg-slate-900/50 rounded-lg shadow-sm border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Manage Session
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleAddSnacks}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-800 text-white transition-colors flex items-center gap-3"
                >
                  <Coffee className="w-5 h-5" />
                  Add Snacks
                </button>
                <button
                  onClick={handleAddTime}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-800 text-white transition-colors flex items-center gap-3"
                >
                  <Clock className="w-5 h-5" />
                  Add Time
                </button>
                <button
                  onClick={handleEndSession}
                  className="w-full text-left p-3 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors flex items-center gap-3"
                >
                  <XCircle className="w-5 h-5" />
                  End Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
