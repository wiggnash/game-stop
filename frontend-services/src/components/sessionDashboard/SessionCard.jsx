import React from "react";
import { Pause, Square, Clock, Coffee, Play } from "lucide-react";

const SessionCard = ({
  session,
  onPause,
  onResume,
  onEnd,
  onAddTime,
  onAddItem,
}) => {
  const getStatusColor = () => {
    switch (session.color) {
      case "green":
        return "border-green-500";
      case "orange":
        return "border-orange-400";
      case "red":
        return "border-red-500";
      case "blue":
        return "border-blue-500";
      default:
        return "border-gray-500";
    }
  };

  const getTimeColor = () => {
    switch (session.color) {
      case "green":
        return "text-green-500";
      case "orange":
        return "text-orange-400";
      case "red":
        return "text-red-500";
      case "blue":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getTopBorderColor = () => {
    switch (session.color) {
      case "green":
        return "bg-green-500";
      case "orange":
        return "bg-orange-400";
      case "red":
        return "bg-red-500";
      case "blue":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPlatformIcon = () => {
    if (session.platform?.includes("PlayStation")) {
      return "🎮";
    } else if (session.platform?.includes("Xbox")) {
      return "🎮";
    } else if (session.platform?.includes("PC")) {
      return "💻";
    }
    return "🎮";
  };

  const handlePauseResume = () => {
    if (session.status === "paused") {
      onResume?.(session);
    } else {
      onPause?.(session);
    }
  };

  const handleEnd = () => {
    onEnd?.(session);
  };

  const handleAddTime = () => {
    onAddTime?.(session);
  };

  const handleAddItem = () => {
    onAddItem?.(session);
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-white/5 border ${getStatusColor()} border-opacity-50 shadow-md ${
        session.status === "urgent" ? "animate-pulse" : ""
      }`}
    >
      {/* Top Status Border */}
      <div
        className={`absolute inset-x-0 top-0 h-1.5 ${getTopBorderColor()}`}
      ></div>

      {/* Main Content */}
      <div className="p-4 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-bold text-white">{session.station}</p>
            <p className="text-sm text-white/60">{session.customer}</p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${getTimeColor()}`}>
              {session.time}
            </p>
            <p className="text-sm font-medium text-white/60">
              ${" "}
              {typeof session.charges === "number"
                ? session.charges.toFixed(2)
                : session.charges}
            </p>
          </div>
        </div>

        {/* Platform Information */}
        <div className="text-sm text-white/80 flex items-center gap-2">
          <span className="text-base">{getPlatformIcon()}</span>
          <span>{session.platform}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto grid grid-cols-4 border-t border-white/10">
        {/* Pause/Resume Button */}
        <button
          onClick={handlePauseResume}
          className={`p-3 transition-colors flex flex-col items-center gap-1 text-xs ${
            session.status === "paused"
              ? "text-blue-500 bg-blue-500/10 hover:bg-blue-500/20"
              : "text-white/60 hover:bg-blue-500/10 hover:text-blue-500"
          }`}
        >
          {session.status === "paused" ? (
            <Play className="w-4 h-4" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
          <span>{session.status === "paused" ? "Resume" : "Pause"}</span>
        </button>

        {/* End Session Button */}
        <button
          onClick={handleEnd}
          className="p-3 text-white/60 hover:bg-blue-500/10 hover:text-blue-500 transition-colors flex flex-col items-center gap-1 text-xs"
        >
          <Square className="w-4 h-4" />
          <span>End</span>
        </button>

        {/* Add Time Button */}
        <button
          onClick={handleAddTime}
          className="p-3 text-white/60 hover:bg-blue-500/10 hover:text-blue-500 transition-colors flex flex-col items-center gap-1 text-xs"
        >
          <Clock className="w-4 h-4" />
          <span>Add Time</span>
        </button>

        {/* Add Item Button */}
        <button
          onClick={handleAddItem}
          className="p-3 text-white/60 hover:bg-blue-500/10 hover:text-blue-500 transition-colors flex flex-col items-center gap-1 text-xs"
        >
          <Coffee className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>
    </div>
  );
};

export default SessionCard;
