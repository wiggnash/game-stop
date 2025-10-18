import React from "react";
import { XCircle, AlertTriangle, Clock } from "lucide-react";

const EndTime = ({ isOpen, onClose, onConfirm, sessionData, isLoading }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(sessionData);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 rounded-lg shadow-2xl border border-slate-800 w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white">End Session</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-slate-300">
              Are you sure you want to end this gaming session? This action
              cannot be undone.
            </p>

            {sessionData && (
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3 border border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Customer</span>
                  <span className="text-sm font-medium text-white">
                    {sessionData.customer}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Station</span>
                  <span className="text-sm font-medium text-white">
                    {sessionData.station}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">
                    Current Charges
                  </span>
                  <span className="text-sm font-bold text-green-400">
                    ₹{sessionData.charges?.toFixed(2) || "0.00"}
                  </span>
                </div>
                {sessionData.time && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Remaining Time
                    </span>
                    <span className="text-sm font-medium text-orange-400">
                      {sessionData.time}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200">
                Ending the session will finalize all charges and make the
                station available for new customers.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ending...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  End Session
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EndTime;
