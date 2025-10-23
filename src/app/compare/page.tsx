"use client";

import { useEffect, useState } from "react";
import { useCompare } from "@/lib/hooks";
import { CompareTable, LoadingOverlay } from "@/components";
import { DeviceSelectionModal } from "@/components/compare/DeviceSelectionModal";
import { Trash2, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

interface ComparisonData {
  devices: Array<{
    device: {
      id: string;
      name: string;
      brand: string;
      modelSlug: string;
      category: string;
      image?: string;
    };
    prices: Array<{
      platform: string;
      price: number;
      formattedPrice: string;
      condition: string;
      location: string;
    }>;
    statistics: {
      lowestPrice: string;
      highestPrice: string;
      averagePrice: string;
      totalListings: number;
    };
  }>;
  overallStatistics: {
    lowestPrice: string;
    highestPrice: string;
    averagePrice: string;
    totalListings: number;
  };
}

export default function ComparePage() {
  const { devices, canCompare, clearAll, removeDevice, addDevice } = useCompare();
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (canCompare) {
      fetchComparison();
    }
  }, [devices, canCompare]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError("");

      const deviceIds = devices.map((d) => d.id);
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch comparison");
      }

      const data = await response.json();
      setComparison(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comparison");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDevice = (device: any) => {
    addDevice({
      id: device._id,
      name: device.name,
      brand: device.brand,
      modelSlug: device.modelSlug,
      category: device.category,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Compare Devices</h1>
            </div>
            {devices.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
          <p className="text-gray-600">
            {devices.length === 0
              ? "Add devices to compare"
              : `Comparing ${devices.length} device${devices.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <LoadingOverlay isVisible={loading} message="Loading comparison..." />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!canCompare ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">Add at least 2 devices to compare</p>
            <div className="space-y-4">
              <p className="text-gray-600">
                {devices.length === 0
                  ? "Select devices from our database to compare prices"
                  : `Add ${2 - devices.length} more device${2 - devices.length !== 1 ? "s" : ""} to compare`}
              </p>
              {devices.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-900 font-medium mb-2">Devices added:</p>
                  <ul className="text-blue-800 text-sm space-y-1">
                    {devices.map((d) => (
                      <li key={d.id} className="flex items-center justify-between">
                        <span>• {d.name}</span>
                        <button
                          onClick={() => removeDevice(d.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Plus size={20} />
                  Select Devices
                </button>
                <Link href="/devices" className="inline-block text-blue-600 hover:text-blue-800 font-medium">
                  Browse Devices →
                </Link>
              </div>
            </div>
          </div>
        ) : comparison ? (
          <div className="space-y-8">
            {/* Add More Devices Section */}
            {devices.length < 5 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  💡 Add More Devices
                </h3>
                <p className="text-blue-800 text-sm mb-4">
                  You can compare up to 5 devices. Add more to get a comprehensive comparison.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus size={18} />
                    Add Device
                  </button>
                  <Link
                    href="/devices"
                    className="inline-block px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    Browse Devices
                  </Link>
                </div>
              </div>
            )}

            {/* Overall Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Lowest Price</p>
                  <p className="text-2xl font-bold text-green-600">
                    {comparison.overallStatistics.lowestPrice}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Highest Price</p>
                  <p className="text-2xl font-bold text-red-600">
                    {comparison.overallStatistics.highestPrice}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Average Price</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {comparison.overallStatistics.averagePrice}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Total Listings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {comparison.overallStatistics.totalListings}
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Device Comparison</h2>
              <CompareTable
                devices={comparison.devices.map((d) => ({
                  name: d.device.name,
                  brand: d.device.brand,
                  lowestPrice: d.statistics.lowestPrice,
                  averagePrice: d.statistics.averagePrice,
                  totalListings: d.statistics.totalListings,
                  image: d.device.image,
                }))}
              />
            </div>

            {/* Device Details */}
            <div className="space-y-6">
              {comparison.devices.map((device) => (
                <div key={device.device.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{device.device.name}</h3>
                      <p className="text-gray-600">{device.device.brand}</p>
                    </div>
                    <button
                      onClick={() => removeDevice(device.device.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Lowest Price</p>
                      <p className="text-xl font-bold text-green-600">{device.statistics.lowestPrice}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Average Price</p>
                      <p className="text-xl font-bold text-blue-600">{device.statistics.averagePrice}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Listings</p>
                      <p className="text-xl font-bold text-gray-900">{device.statistics.totalListings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>

      {/* Device Selection Modal */}
      <DeviceSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectDevice}
        excludeDeviceIds={devices.map((d) => d.id)}
      />
    </div>
  );
}

