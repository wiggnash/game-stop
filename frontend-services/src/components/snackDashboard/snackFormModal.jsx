import { useState, useEffect } from "react";
import { X } from "lucide-react";

const SnackFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "SNACKS",
    unit_price: "",
    stock_quantity: "",
    restock_level: 10,
    is_available: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Populate form when editing (when initialData exists)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        category: initialData.category,
        unit_price: initialData.unit_price,
        stock_quantity: initialData.stock_quantity,
        restock_level: initialData.restock_level,
        is_available: initialData.is_available,
      });
    } else {
      // Reset form when adding new (no initialData)
      setFormData({
        name: "",
        description: "",
        category: "SNACKS",
        unit_price: "",
        stock_quantity: "",
        restock_level: 10,
        is_available: true,
      });
    }
    setFormErrors({});
  }, [initialData, isOpen]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (!formData.unit_price || parseFloat(formData.unit_price) <= 0) {
      errors.unit_price = "Valid price is required";
    }

    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      errors.stock_quantity = "Valid stock quantity is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      unit_price: parseFloat(formData.unit_price),
      stock_quantity: parseInt(formData.stock_quantity),
      restock_level: parseInt(formData.restock_level) || 10,
      is_available: formData.is_available,
    };

    // Pass the payload and error setters to parent
    onSubmit(payload, setFormErrors);
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  // Determine if we're in Edit mode or Add mode
  const isEditMode = !!initialData;
  const modalTitle = isEditMode ? "Edit Snack" : "Add New Snack";
  const submitButtonText = isEditMode ? "Update Snack" : "Add Snack";

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
            <h3 className="text-xl font-bold text-white">{modalTitle}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Name and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      formErrors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-700 focus:ring-[#1173d4]"
                    }`}
                    placeholder="Enter snack name"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                      formErrors.category
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-700 focus:ring-[#1173d4]"
                    }`}
                  >
                    <option value="SNACKS">Snacks</option>
                    <option value="DRINKS">Drinks</option>
                    <option value="MEALS">Meals</option>
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1173d4]"
                  placeholder="Enter snack description (optional)"
                />
              </div>

              {/* Price, Stock, Restock Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Unit Price ($) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      formErrors.unit_price
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-700 focus:ring-[#1173d4]"
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.unit_price && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.unit_price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Stock Quantity <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      formErrors.stock_quantity
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-700 focus:ring-[#1173d4]"
                    }`}
                    placeholder="0"
                  />
                  {formErrors.stock_quantity && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.stock_quantity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Restock Level
                  </label>
                  <input
                    type="number"
                    name="restock_level"
                    value={formData.restock_level}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1173d4]"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Availability Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-[#1173d4] bg-slate-800 border-slate-700 rounded focus:ring-[#1173d4]"
                />
                <label className="ml-2 block text-sm text-slate-300">
                  Available for sale
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1173d4] rounded-lg hover:bg-[#1173d4]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : submitButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnackFormModal;
