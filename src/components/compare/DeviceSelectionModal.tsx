"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader } from "lucide-react";

interface Device {
  _id: string;
  name: string;
  brand: string;
  modelSlug: string;
  image?: string;
  lowestPrice?: number;
}

interface DeviceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (device: Device) => void;
  excludeDeviceIds?: string[];
}

export function DeviceSelectionModal({
  isOpen,
  onClose,
  onSelect,
  excludeDeviceIds = [],
}: DeviceSelectionModalProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchDevices();
    }
  }, [isOpen]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/devices?limit=100");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Filter out excluded devices
          const filtered = data.data.filter(
            (d: Device) => !excludeDeviceIds.includes(d._id)
          );
          setDevices(filtered);
          setFilteredDevices(filtered);
        }
      }
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredDevices(devices);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = devices.filter(
        (d) =>
          d.name.toLowerCase().includes(lowerQuery) ||
          d.brand.toLowerCase().includes(lowerQuery)
      );
      setFilteredDevices(filtered);
    }
  };

  const handleSelectDevice = (device: Device) => {
    onSelect(device);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  Select a Device
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search */}
              <div className="p-6 border-b">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search devices by name or brand..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Device List */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="animate-spin text-blue-600" size={32} />
                  </div>
                ) : filteredDevices.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      {searchQuery
                        ? "No devices found matching your search"
                        : "No devices available"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDevices.map((device) => (
                      <motion.button
                        key={device._id}
                        onClick={() => handleSelectDevice(device)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex gap-4">
                          {device.image && (
                            <img
                              src={device.image}
                              alt={device.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 font-medium">
                              {device.brand}
                            </p>
                            <h3 className="font-semibold text-gray-900 line-clamp-2">
                              {device.name}
                            </h3>
                            {device.lowestPrice && (
                              <p className="text-blue-600 font-bold mt-1">
                                ₨{device.lowestPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

