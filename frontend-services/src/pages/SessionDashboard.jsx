import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import {
  Search,
  Plus,
  RefreshCw,
  Calendar,
  Clock,
  IndianRupee,
  User,
  Monitor,
  Settings,
  Bell,
} from "lucide-react";
import SessionCard from "../components/sessionDashboard/SessionCard";
import NewSessionModal from "../components/sessionDashboard/NewSessionModal";
import * as sessionsApi from "../api/sessions.api";

// Register all AG Grid community modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Create custom dark theme using the new Theming API
const customDarkTheme = themeQuartz.withParams({
  backgroundColor: "rgb(15 23 42 / 0.5)",
  headerBackgroundColor: "rgb(30 41 59)",
  oddRowBackgroundColor: "transparent",
  rowHoverColor: "rgb(51 65 85 / 0.5)",
  borderColor: "rgb(51 65 85)",
  foregroundColor: "rgb(226 232 240)",
  headerFontSize: 12,
  headerFontWeight: 500,
  fontSize: 14,
  cellHorizontalPaddingScale: 1.2,
  spacing: 8,
  headerTextColor: "rgb(148 163 184)",
});

const SessionDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sessions, setSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pastLoading, setPastLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pastError, setPastError] = useState(null);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    stations: [],
    durations: [],
  });

  const [dropdownError, setDropdownError] = useState(null);

  // Utility functions for session data
  const calculateRemainingTime = (checkInTime, checkOutTime) => {
    const now = new Date();
    const checkOut = new Date(checkOutTime);
    const timeDiff = checkOut.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return "00:00:00";
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateSessionDuration = (checkInTime, checkOutTime) => {
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const timeDiff = checkOut.getTime() - checkIn.getTime();

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSessionColor = (checkInTime, checkOutTime) => {
    const now = new Date();
    const checkOut = new Date(checkOutTime);
    const timeDiff = checkOut.getTime() - now.getTime();
    const minutesLeft = timeDiff / (1000 * 60);

    if (minutesLeft <= 15) return "red";
    if (minutesLeft <= 30) return "orange";
    return "green";
  };

  const transformSessionData = (apiSession) => {
    const remainingTime = calculateRemainingTime(
      apiSession.check_in_time,
      apiSession.check_out_time,
    );
    const color = getSessionColor(
      apiSession.check_in_time,
      apiSession.check_out_time,
    );

    return {
      id: apiSession.id,
      station: apiSession.station__name,
      customer: apiSession.user__username,
      time: remainingTime,
      charges: parseFloat(apiSession.total_session_cost),
      platform: `${apiSession.gaming_service__service_type} Gaming`,
      status: apiSession.session_status.toLowerCase(),
      color: color,
      checkInTime: apiSession.check_in_time,
      checkOutTime: apiSession.check_out_time,
    };
  };

  // AG Grid Column Definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Customer",
        field: "user__username",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
        cellRenderer: (params) => {
          return (
            <div className="flex items-center gap-2 h-full">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-medium">{params.value}</span>
            </div>
          );
        },
      },
      {
        headerName: "Station",
        field: "station__name",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 120,
        cellRenderer: (params) => {
          return (
            <div className="flex items-center gap-2 h-full">
              <Monitor className="w-4 h-4 text-slate-400" />
              <span>{params.value}</span>
            </div>
          );
        },
      },
      {
        headerName: "Platform",
        field: "gaming_service__service_type",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Check In",
        field: "check_in_time",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 180,
        cellRenderer: (params) => {
          return (
            <div className="flex items-center gap-2 h-full">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatDate(params.value)}</span>
            </div>
          );
        },
      },
      {
        headerName: "Duration",
        field: "check_out_time",
        sortable: true,
        flex: 1,
        minWidth: 120,
        cellRenderer: (params) => {
          const duration = calculateSessionDuration(
            params.data.check_in_time,
            params.value,
          );
          return (
            <div className="flex items-center gap-2 h-full">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{duration}</span>
            </div>
          );
        },
      },
      {
        headerName: "Total Cost",
        field: "total_session_cost",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 120,
        cellRenderer: (params) => {
          return (
            <div className="flex items-center gap-2 h-full">
              <IndianRupee className="w-4 h-4 text-green-400" />
              <span className="font-medium text-green-400">
                ${parseFloat(params.value).toFixed(2)}
              </span>
            </div>
          );
        },
      },
      {
        headerName: "Status",
        field: "session_status",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 130,
        cellRenderer: (params) => {
          return (
            <div className="flex items-center justify-center h-full">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                {params.value}
              </span>
            </div>
          );
        },
      },
    ],
    [],
  );

  // AG Grid default column definition
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
    }),
    [],
  );

  // Fetch active sessions
  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionsApi.getActiveSessions();
      const transformedSessions = data.map(transformSessionData);
      setSessions(transformedSessions);
      setError(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch sessions";
      setError(errorMessage);
      console.error("Error fetching active sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch past sessions
  const fetchPastSessions = async () => {
    try {
      setPastLoading(true);
      const data = await sessionsApi.getPastSessions();
      setPastSessions(data);
      setPastError(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch past sessions";
      setPastError(errorMessage);
      console.error("Error fetching past sessions:", err);
    } finally {
      setPastLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchActiveSessions();
    fetchPastSessions();
  }, []);

  // Update timers every second
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSessions((prevSessions) =>
        prevSessions.map((session) => ({
          ...session,
          time: calculateRemainingTime(
            session.checkInTime,
            session.checkOutTime,
          ),
          color: getSessionColor(session.checkInTime, session.checkOutTime),
        })),
      );
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [sessions.length]);

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(
    (session) =>
      session.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.platform.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Session action handlers with API calls
  const handlePause = async (session) => {
    console.log("Pausing session:", session.id);

    // Optimistic update - immediately update UI
    setSessions((prevSessions) =>
      prevSessions.map((s) =>
        s.id === session.id ? { ...s, status: "paused", color: "blue" } : s,
      ),
    );

    try {
      await sessionsApi.pauseSession(session.id);
    } catch (error) {
      // Revert optimistic update on error
      fetchActiveSessions();
      console.error("Error pausing session:", error);
      // TODO: Show user-friendly error notification
    }
  };

  const handleResume = async (session) => {
    console.log("Resuming session:", session.id);

    // Optimistic update
    setSessions((prevSessions) =>
      prevSessions.map((s) =>
        s.id === session.id
          ? {
              ...s,
              status: "active",
              color: getSessionColor(s.checkInTime, s.checkOutTime),
            }
          : s,
      ),
    );

    try {
      await sessionsApi.resumeSession(session.id);
    } catch (error) {
      fetchActiveSessions();
      console.error("Error resuming session:", error);
      // TODO: Show user-friendly error notification
    }
  };

  const handleEnd = async (session) => {
    console.log("Ending session:", session.id);

    // Optimistic update - remove session immediately
    setSessions((prevSessions) =>
      prevSessions.filter((s) => s.id !== session.id),
    );

    try {
      await sessionsApi.endSession(session.id);
      // Refresh past sessions to show the newly completed session
      fetchPastSessions();
    } catch (error) {
      fetchActiveSessions();
      console.error("Error ending session:", error);
      // TODO: Show user-friendly error notification
    }
  };

  const handleAddTime = async (session) => {
    console.log("Adding time to session:", session.id);

    try {
      // TODO: Implement add time modal/dialog to get time amount
      const timeToAdd = 30; // Example: 30 minutes, this should come from user input

      const updatedSessionData = await sessionsApi.addTimeToSession(
        session.id,
        timeToAdd,
      );

      // Update the specific session with new data
      if (updatedSessionData) {
        const updatedSession = transformSessionData(updatedSessionData);
        setSessions((prevSessions) =>
          prevSessions.map((s) => (s.id === session.id ? updatedSession : s)),
        );
      } else {
        // Fallback to full refresh if no response data
        fetchActiveSessions();
      }
    } catch (error) {
      console.error("Error adding time to session:", error);
      // TODO: Show user-friendly error notification
    }
  };

  const handleAddItem = async (session) => {
    console.log("Adding item to session:", session.id);

    try {
      // TODO: Implement add item modal/dialog to select item and quantity
      const itemData = {
        snack_id: 1, // Example: this should come from user selection
        quantity: 1,
      };

      const updatedSessionData = await sessionsApi.addItemToSession(
        session.id,
        itemData,
      );

      // Update the specific session with new charges
      if (updatedSessionData) {
        const updatedSession = transformSessionData(updatedSessionData);
        setSessions((prevSessions) =>
          prevSessions.map((s) => (s.id === session.id ? updatedSession : s)),
        );
      } else {
        // Fallback to full refresh if no response data
        fetchActiveSessions();
      }
    } catch (error) {
      console.error("Error adding item to session:", error);
      // TODO: Show user-friendly error notification
    }
  };

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        setDropdownError(null);
        const data = await sessionsApi.getDropdownOptions();

        setDropdownData({
          stations: data.active_stations || [],
          durations: data.durations || [],
        });
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load dropdown options";
        setDropdownError(errorMessage);
      }
    };

    fetchDropdownOptions();
  }, []);

  const handleNewSession = () => {
    setShowNewSessionModal(true);
  };

  const handleCloseNewSessionModal = () => {
    setShowNewSessionModal(false);
  };

  // Add submit handler for new session (for now just console.log)
  const handleNewSessionSubmit = (payload) => {
    setSessionLoading(true);
    console.log("New session data:", payload);

    // Simulate API call - Replace this with actual API call later
    setTimeout(() => {
      setSessionLoading(false);
      handleCloseNewSessionModal();
      // TODO: Call your create session API here
      // TODO: Refresh sessions list after successful creation
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col bg-slate-900">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">Loading active sessions...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col bg-slate-900">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-white text-lg mb-2">
                  Failed to load sessions
                </p>
                <p className="text-red-400 mb-4">{error}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-900">
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8">
            {/* Top Section */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-white">
                  Active Sessions
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white/60">
                    {sessions.length} active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
                  <input
                    className="w-full rounded-lg bg-white/5 py-2 pl-10 pr-4 text-white placeholder:text-white/50 border-transparent focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleNewSession}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500/90"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Session</span>
                </button>
              </div>
            </div>

            {/* Session Cards Grid */}
            {filteredSessions.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                {filteredSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onPause={handlePause}
                    onResume={handleResume}
                    onEnd={handleEnd}
                    onAddTime={handleAddTime}
                    onAddItem={handleAddItem}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-white text-lg mb-2">
                  {searchQuery ? "No sessions found" : "No active sessions"}
                </p>
                <p className="text-white/60">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Start a new gaming session to see it here"}
                </p>
              </div>
            )}

            {/* Past Sessions Table */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">
                  Recent Completed Sessions
                </h2>
              </div>

              {pastLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-white/60">Loading past sessions...</p>
                </div>
              ) : pastError ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-red-400">{pastError}</p>
                </div>
              ) : pastSessions.length > 0 ? (
                <div style={{ height: "500px", width: "100%" }}>
                  <AgGridReact
                    rowData={pastSessions}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50]}
                    theme={customDarkTheme}
                    domLayout="normal"
                    rowHeight={60}
                    headerHeight={50}
                  />
                </div>
              ) : (
                <div className="text-center py-16 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white text-lg mb-2">
                    No completed sessions
                  </p>
                  <p className="text-white/60">
                    Completed sessions will appear here once customers finish
                    their gaming sessions
                  </p>
                </div>
              )}
            </div>

            <NewSessionModal
              isOpen={showNewSessionModal}
              onClose={handleCloseNewSessionModal}
              onSubmit={handleNewSessionSubmit}
              isLoading={sessionLoading}
              stations={dropdownData.stations}
              durations={dropdownData.durations}
              dropdownError={dropdownError}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SessionDashboard;
