import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Check if current path matches the navigation item
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigationItems = [
    { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { path: "/new-session", label: "Sessions", icon: "timer" },
    { path: "/snacks", label: "Snacks", icon: "fastfood" },
    { path: "/users", label: "Customers", icon: "group" },
    { path: "/financial", label: "Reports", icon: "assessment" },
  ];

  return (
    <header className="sticky top-0 z-10 bg-[#101922]/90 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="size-8 text-[#1173d4]">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">GameHub</h1>
            </Link>
          </div>

          {/* Navigation Menu - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors flex items-center gap-2 px-3 py-2 rounded-md ${
                  isActive(item.path)
                    ? "text-[#1173d4] bg-[#1173d4]/10"
                    : "text-slate-300 hover:text-[#1173d4] hover:bg-slate-800/50"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Notifications and User Profile */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#101922] focus:ring-[#1173d4] transition-colors">
              <span className="material-symbols-outlined text-xl">
                notifications
              </span>
              {/* Notification badge */}
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#101922] focus:ring-[#1173d4]"
              >
                <div className="size-8 rounded-full bg-gradient-to-br from-[#1173d4] to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden md:block text-sm font-medium text-slate-300">
                  {user?.username || "User"}
                </span>
                <span className="material-symbols-outlined text-slate-400 text-base">
                  {showUserDropdown
                    ? "keyboard_arrow_up"
                    : "keyboard_arrow_down"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-700">
                    <p className="text-sm font-medium text-white">
                      {user?.username || "User"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {user?.email || "No email"}
                    </p>
                  </div>

                  <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      person
                    </span>
                    Profile
                  </button>

                  <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      settings
                    </span>
                    Settings
                  </button>

                  <div className="border-t border-slate-700 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">
                        logout
                      </span>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md text-slate-400 hover:text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1173d4]">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden border-t border-slate-800 py-2">
          <div className="flex flex-col space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-[#1173d4] bg-[#1173d4]/10"
                    : "text-slate-300 hover:text-[#1173d4] hover:bg-slate-800/50"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Click outside handler for dropdown */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;
