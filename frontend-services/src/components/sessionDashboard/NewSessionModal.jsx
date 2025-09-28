import { useState, useEffect } from "react";
import { X, User, Monitor, Clock, FileText, AlertCircle } from "lucide-react";
import * as usersApi from "../../api/users.api";

const NewSessionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  stations = [],
  durations = [],
  dropdownError = null,
}) => {
  const [formData, setFormData] = useState({
    userId: "",
    stationId: "",
    durationId: "",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [userResults, setUserResults] = useState([]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        userId: "",
        stationId: "",
        durationId: "",
        notes: "",
      });
      setFormErrors({});
    }
  }, [isOpen]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.userId) {
      errors.userId = "Please select a user";
    }

    if (!formData.stationId) {
      errors.stationId = "Please select a station";
    }

    if (!formData.durationId) {
      errors.durationId = "Please select a duration";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      user_id: parseInt(formData.userId),
      station_id: parseInt(formData.stationId),
      duration_id: parseInt(formData.durationId),
      notes: formData.notes || "",
    };

    onSubmit?.(payload, setFormErrors);
  };

  if (!isOpen) return null;

  const fetchUsers = async (query) => {
    try {
      const users = await usersApi.getUsersWithFilters(query);
      setUserResults(users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/70 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full border border-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#1173d4]/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#1173d4]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  New Gaming Session
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">
                  Start a new session for a customer
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Dropdown Error Message */}
            {dropdownError && (
              <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-500">
                      Failed to Load Options
                    </h3>
                    <p className="text-sm text-red-200/80 mt-1">
                      {dropdownError}
                    </p>
                    <p className="text-xs text-red-200/60 mt-2">
                      Please close the modal and try again, or contact support
                      if the issue persists.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Select Customer <span className="text-red-400">*</span>
                  </div>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={formData.username || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        username: val,
                        userId: "",
                      }));
                      if (val.length >= 3) {
                        fetchUsers(val);
                      } else {
                        setUserResults([]);
                      }
                    }}
                    placeholder="Type username, name, or email..."
                    className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                      formErrors.userId
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-700 focus:ring-[#1173d4]"
                    }`}
                  />

                  {/* Results dropdown */}
                  {userResults.length > 0 && (
                    <ul className="absolute z-50 w-full bg-slate-900 border border-slate-700 rounded-lg mt-1 max-h-60 overflow-auto">
                      {userResults.map((user) => (
                        <li
                          key={user.id}
                          className="px-4 py-2 hover:bg-slate-700 cursor-pointer"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              userId: user.user_id,
                              username: user.username,
                            }));
                            setUserResults([]);
                          }}
                        >
                          <div className="text-white font-medium">
                            {user.username}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {user.first_name} {user.last_name} – {user.email}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {formErrors.userId && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <span className="text-xs">⚠</span> {formErrors.userId}
                  </p>
                )}
              </div>

              {/* Station Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Select Station <span className="text-red-400">*</span>
                  </div>
                </label>
                <select
                  name="stationId"
                  value={formData.stationId}
                  onChange={handleFormChange}
                  disabled={dropdownError || stations.length === 0}
                  className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    formErrors.stationId
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-700 focus:ring-[#1173d4]"
                  }`}
                >
                  <option value="">
                    {stations.length === 0
                      ? "No stations available"
                      : "Choose a station..."}
                  </option>
                  {stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name} : {station.gaming_service_type}
                    </option>
                  ))}
                </select>
                {formErrors.stationId && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <span className="text-xs">⚠</span> {formErrors.stationId}
                  </p>
                )}
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Session Duration <span className="text-red-400">*</span>
                  </div>
                </label>
                <select
                  name="durationId"
                  value={formData.durationId}
                  onChange={handleFormChange}
                  disabled={dropdownError || durations.length === 0}
                  className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    formErrors.durationId
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-700 focus:ring-[#1173d4]"
                  }`}
                >
                  <option value="">
                    {durations.length === 0
                      ? "No durations available"
                      : "Choose duration..."}
                  </option>
                  {durations.map((duration) => (
                    <option key={duration.id} value={duration.id}>
                      {duration.duration} {duration.type}
                    </option>
                  ))}
                </select>
                {formErrors.durationId && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <span className="text-xs">⚠</span> {formErrors.durationId}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notes{" "}
                    <span className="text-slate-500 font-normal">
                      (optional)
                    </span>
                  </div>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1173d4] transition-colors resize-none"
                  placeholder="Add any additional notes about this session..."
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#1173d4] rounded-lg hover:bg-[#1173d4]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Start Session
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSessionModal;
