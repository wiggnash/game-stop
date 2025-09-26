import { useState, useEffect } from "react";
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
import SnackFormModal from "../components/snackDashboard/snackFormModal";
import * as snacksApi from "../api/snacks.api";

const SnacksManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSnack, setEditingSnack] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch snacks from API on component mount
  useEffect(() => {
    fetchSnacks();
  }, []);

  const fetchSnacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await snacksApi.getAllSnacks();
      setSnacks(data);
    } catch (err) {
      console.error("Error fetching snacks:", err);
      setError(err.response?.data?.message || "Failed to fetch snacks");
    } finally {
      setLoading(false);
    }
  };

  const filteredSnacks = snacks.filter(
    (snack) =>
      snack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snack.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snack.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (snack) => {
    if (!snack.is_available) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
          Unavailable
        </span>
      );
    }
    if (snack.stock_quantity <= snack.restock_level) {
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case "DRINKS":
        return "🥤";
      case "SNACKS":
        return "🍿";
      case "MEALS":
        return "🍽️";
      default:
        return "📦";
    }
  };

  const handleAddNew = () => {
    setEditingSnack(null); // No initial data for Add mode
    setShowModal(true);
  };

  const handleEdit = (snack) => {
    setEditingSnack(snack); // Pass snack data for Edit mode
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSnack(null);
  };

  const handleFormSubmit = async (payload, setFormErrors) => {
    setFormLoading(true);

    try {
      if (editingSnack) {
        // Update existing snack - editingSnack has the ID we need!
        await snacksApi.updateSnack(editingSnack.id, payload);
      } else {
        // Create new snack
        await snacksApi.createSnack(payload);
      }

      handleCloseModal();
      // Refresh list after successful operation
      await fetchSnacks();
    } catch (err) {
      console.error("Error saving snack:", err);
      if (err.response?.data) {
        const backendErrors = {};
        Object.keys(err.response.data).forEach((key) => {
          backendErrors[key] = Array.isArray(err.response.data[key])
            ? err.response.data[key][0]
            : err.response.data[key];
        });
        setFormErrors(backendErrors);
      } else {
        alert("Failed to save snack. Please try again.");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this snack?")) {
      try {
        await snacksApi.deleteSnack(id);
        await fetchSnacks(); // Refresh list after deletion
      } catch (err) {
        console.error("Error deleting snack:", err);
        alert("Failed to delete snack. Please try again.");
      }
    }
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
            {/* Header */}
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
                  onClick={handleAddNew}
                  className="inline-flex items-center justify-center rounded-lg bg-[#1173d4] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1173d4]/90 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Snack
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-500" />
              </div>
              <input
                className="block w-full rounded-lg border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-400 focus:border-[#1173d4] focus:ring-[#1173d4]"
                placeholder="Search for snacks by name or category..."
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
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Stock
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
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
                                {getCategoryIcon(snack.category)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {snack.name}
                              </div>
                              <div className="text-sm text-slate-400">
                                {snack.description || "No description"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {snack.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          ${parseFloat(snack.unit_price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {snack.stock_quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(snack)}
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
                      <td colSpan="6" className="px-6 py-16 text-center">
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
            {snacks.filter((s) => s.stock_quantity <= s.restock_level).length >
              0 && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-yellow-500">
                      Low Stock Alert
                    </h3>
                    <p className="text-sm text-yellow-200/80 mt-1">
                      {
                        snacks.filter(
                          (s) => s.stock_quantity <= s.restock_level,
                        ).length
                      }{" "}
                      items are running low on stock.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <SnackFormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingSnack}
        isLoading={formLoading}
      />
    </div>
  );
};

export default SnacksManagement;
