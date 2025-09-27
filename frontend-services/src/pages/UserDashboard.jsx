import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  RefreshCw,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Download,
  UserPlus,
} from "lucide-react";
import * as userApi from "../api/users.api";

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive

  // Fetch all the users from the API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getAllUsers();
      setCustomers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  // Filter and search logic
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone_number.includes(searchQuery);

    const matchesFilter =
      filterStatus === "all" || customer.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    if (status) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
        Inactive
      </span>
    );
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((customer) => customer.id !== id));
    }
  };

  const handleEdit = (customer) => {
    console.log("Edit customer:", customer);
  };

  const handleExport = () => {
    console.log("Exporting customer data...");
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Customer Management
                </h2>
                <p className="text-slate-400 mt-1">
                  Manage your gaming cafe customers and track their activity
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>

                <button className="inline-flex items-center justify-center rounded-lg bg-[#1173d4] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1173d4]/90 transition-colors">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Customer
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  className="block w-full rounded-lg border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-400 focus:border-[#1173d4] focus:ring-[#1173d4]"
                  placeholder="Search customers by name, email, or phone..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-lg border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white focus:border-[#1173d4] focus:ring-[#1173d4]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto rounded-lg shadow border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-800">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      scope="col"
                    >
                      Customer
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      scope="col"
                    >
                      Contact
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      scope="col"
                    >
                      Status
                    </th>
                    <th className="relative px-6 py-3" scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-[#1173d4] flex items-center justify-center text-white font-semibold">
                              {customer.first_name[0]}
                              {customer.last_name[0]}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {customer.first_name} {customer.last_name}
                              </div>
                              <div className="text-sm text-slate-400">
                                @{customer.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">
                            <div className="flex items-center gap-2 mb-1">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {customer.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-slate-500" />
                              {customer.phone_number}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(customer.is_active)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="text-[#1173d4] hover:text-[#1173d4]/80 mr-4 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Users className="w-12 h-12 text-slate-600" />
                          <p className="text-slate-400 text-lg">
                            {searchQuery
                              ? "No customers found"
                              : "No customers yet"}
                          </p>
                          <p className="text-slate-500 text-sm">
                            {searchQuery
                              ? "Try adjusting your search"
                              : "Add customers to get started"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
