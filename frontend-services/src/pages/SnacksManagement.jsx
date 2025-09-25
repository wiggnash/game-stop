import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  Edit2,
  Trash2,
  DollarSign,
  RefreshCw,
} from "lucide-react";

const SnacksManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - Replace with API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSnacks([
        {
          id: 1,
          name: "Crispy Chips",
          description: "Savory chips with a hint of sea salt",
          price: 2.5,
          stock: 150,
          status: "in_stock",
          image: "🍟",
        },
        {
          id: 2,
          name: "Choco Bar",
          description: "Rich chocolate bar with a creamy filling",
          price: 3.0,
          stock: 80,
          status: "in_stock",
          image: "🍫",
        },
        {
          id: 3,
          name: "Fizz Pop",
          description: "Refreshing soda with a variety of flavors",
          price: 1.75,
          stock: 200,
          status: "in_stock",
          image: "🥤",
        },
        {
          id: 4,
          name: "Power Surge",
          description: "Energy drink to keep you going",
          price: 4.0,
          stock: 50,
          status: "low_stock",
          image: "⚡",
        },
        {
          id: 5,
          name: "Sweet Bites",
          description: "Assorted candies for a sweet treat",
          price: 1.25,
          stock: 120,
          status: "in_stock",
          image: "🍬",
        },
        {
          id: 6,
          name: "Protein Bar",
          description: "Healthy protein-packed snack",
          price: 3.5,
          stock: 5,
          status: "low_stock",
          image: "🥜",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Filter snacks based on search
  const filteredSnacks = snacks.filter(
    (snack) =>
      snack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snack.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status, stock) => {
    if (status === "low_stock" || stock < 20) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
        In Stock
      </span>
    );
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => setLoading(false), 500);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this snack?")) {
      setSnacks(snacks.filter((snack) => snack.id !== id));
    }
  };

  const handleEdit = (snack) => {
    // TODO: Implement edit functionality
    console.log("Edit snack:", snack);
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
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Snack Inventory
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Package className="w-4 h-4" />
                  <span>{snacks.length} items</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center justify-center rounded-lg bg-[#1173d4] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1173d4]/90 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Snack
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-500" />
              </div>
              <input
                className="block w-full rounded-lg border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-400 focus:border-[#1173d4] focus:ring-[#1173d4]"
                placeholder="Search for snacks by name..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Snacks Table */}
            <div className="overflow-x-auto rounded-lg shadow border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-800">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      scope="col"
                    >
                      Item
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      scope="col"
                    >
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      scope="col"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Stock
                      </div>
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
                  {filteredSnacks.length > 0 ? (
                    filteredSnacks.map((snack) => (
                      <tr
                        key={snack.id}
                        className="hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-2xl">
                                {snack.image}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {snack.name}
                              </div>
                              <div className="text-sm text-slate-400">
                                {snack.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          ${snack.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {snack.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(snack.status, snack.stock)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(snack)}
                            className="text-[#1173d4] hover:text-[#1173d4]/80 mr-4 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(snack.id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <AlertTriangle className="w-12 h-12 text-slate-600" />
                          <p className="text-slate-400 text-lg">
                            {searchQuery
                              ? "No snacks found"
                              : "No snacks available"}
                          </p>
                          <p className="text-slate-500 text-sm">
                            {searchQuery
                              ? "Try adjusting your search"
                              : "Add snacks to get started"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Low Stock Alert */}
            {snacks.filter((s) => s.stock < 20).length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-yellow-500">
                      Low Stock Alert
                    </h3>
                    <p className="text-sm text-yellow-200/80 mt-1">
                      {snacks.filter((s) => s.stock < 20).length} items are
                      running low on stock. Consider restocking soon.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SnacksManagement;
