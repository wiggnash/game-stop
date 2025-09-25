import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Users,
  RefreshCw,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Clock,
  Filter,
  Download,
  UserPlus,
  TrendingUp,
  Star,
} from "lucide-react";

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive
  const [sortBy, setSortBy] = useState("recent"); // recent, name, spending

  // Mock data - Replace with API call
  useEffect(() => {
    setTimeout(() => {
      setCustomers([
        {
          id: 1,
          username: "alex_morgan",
          first_name: "Alex",
          last_name: "Morgan",
          email: "alex.morgan@email.com",
          phone_number: "+1 234-567-8901",
          total_sessions: 24,
          total_spent: 450.0,
          last_visit: "2024-09-20T14:30:00",
          member_since: "2024-01-15",
          status: "active",
          loyalty_points: 450,
          favorite_platform: "PlayStation 5",
        },
        {
          id: 2,
          username: "mia_hamm",
          first_name: "Mia",
          last_name: "Hamm",
          email: "mia.hamm@email.com",
          phone_number: "+1 234-567-8902",
          total_sessions: 18,
          total_spent: 320.0,
          last_visit: "2024-09-22T10:15:00",
          member_since: "2024-02-20",
          status: "active",
          loyalty_points: 320,
          favorite_platform: "PC",
        },
        {
          id: 3,
          username: "sam_kerr",
          first_name: "Sam",
          last_name: "Kerr",
          email: "sam.kerr@email.com",
          phone_number: "+1 234-567-8903",
          total_sessions: 45,
          total_spent: 890.0,
          last_visit: "2024-09-24T18:45:00",
          member_since: "2023-11-10",
          status: "active",
          loyalty_points: 890,
          favorite_platform: "Xbox Series X",
        },
        {
          id: 4,
          username: "david_beckham",
          first_name: "David",
          last_name: "Beckham",
          email: "david.beckham@email.com",
          phone_number: "+1 234-567-8904",
          total_sessions: 8,
          total_spent: 150.0,
          last_visit: "2024-08-15T12:00:00",
          member_since: "2024-03-05",
          status: "inactive",
          loyalty_points: 150,
          favorite_platform: "PC",
        },
        {
          id: 5,
          username: "zinedine_zidane",
          first_name: "Zinedine",
          last_name: "Zidane",
          email: "zinedine.z@email.com",
          phone_number: "+1 234-567-8905",
          total_sessions: 32,
          total_spent: 620.0,
          last_visit: "2024-09-23T16:20:00",
          member_since: "2024-01-20",
          status: "active",
          loyalty_points: 620,
          favorite_platform: "PlayStation 5",
        },
        {
          id: 6,
          username: "cristiano_r",
          first_name: "Cristiano",
          last_name: "Ronaldo",
          email: "cr7@email.com",
          phone_number: "+1 234-567-8906",
          total_sessions: 67,
          total_spent: 1240.0,
          last_visit: "2024-09-25T20:10:00",
          member_since: "2023-10-01",
          status: "active",
          loyalty_points: 1240,
          favorite_platform: "PlayStation 5",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Filter and search logic
  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone_number.includes(searchQuery);

      const matchesFilter =
        filterStatus === "all" || customer.status === filterStatus;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.first_name.localeCompare(b.first_name);
        case "spending":
          return b.total_spent - a.total_spent;
        case "recent":
        default:
          return new Date(b.last_visit) - new Date(a.last_visit);
      }
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeSinceLastVisit = (dateString) => {
    const lastVisit = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - lastVisit);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
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

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
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

  // Calculate summary stats
  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter((c) => c.status === "active").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.total_spent, 0),
    avgSpending:
      customers.length > 0
        ? customers.reduce((sum, c) => sum + c.total_spent, 0) /
          customers.length
        : 0,
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

                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button className="inline-flex items-center justify-center rounded-lg bg-[#1173d4] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1173d4]/90 transition-colors">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Customer
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Total Customers
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stats.totalCustomers}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Active Customers
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stats.activeCustomers}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Avg. Spending
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      ${stats.avgSpending.toFixed(2)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>

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

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white focus:border-[#1173d4] focus:ring-[#1173d4]"
                >
                  <option value="recent">Recent Visit</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="spending">Total Spending</option>
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
                      Activity
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      scope="col"
                    >
                      Spending
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      scope="col"
                    >
                      Last Visit
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
                          <div className="text-sm text-slate-300">
                            <div className="font-medium">
                              {customer.total_sessions} sessions
                            </div>
                            <div className="text-slate-400 text-xs">
                              {customer.favorite_platform}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-emerald-400">
                            ${customer.total_spent.toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-400">
                            {customer.loyalty_points} pts
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">
                            {getTimeSinceLastVisit(customer.last_visit)}
                          </div>
                          <div className="text-xs text-slate-400">
                            {formatDate(customer.last_visit)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(customer.status)}
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
