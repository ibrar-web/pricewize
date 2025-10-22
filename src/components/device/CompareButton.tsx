"use client";

import { useState } from "react";
import { useCompare } from "@/lib/hooks";
import { Plus, Check, X } from "lucide-react";
import Link from "next/link";

interface CompareButtonProps {
  deviceId: string;
  deviceName: string;
  deviceBrand: string;
  deviceSlug: string;
  deviceImage?: string;
}

export function CompareButton({
  deviceId,
  deviceName,
  deviceBrand,
  deviceSlug,
  deviceImage,
}: CompareButtonProps) {
  const { addDevice, isComparing, devices, removeDevice } = useCompare();
  const [showCompareModal, setShowCompareModal] = useState(false);
  const isInCompare = isComparing(deviceId);

  const handleAddToCompare = () => {
    addDevice({
      id: deviceId,
      name: deviceName,
      brand: deviceBrand,
      modelSlug: deviceSlug,
      category: "device",
      image: deviceImage,
    });
  };

  const handleRemoveFromCompare = () => {
    removeDevice(deviceId);
  };

  return (
    <>
      {/* Add to Compare Button */}
      <div className="flex gap-3 mb-6">
        {!isInCompare ? (
          <button
            onClick={handleAddToCompare}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Add to Compare
          </button>
        ) : (
          <button
            onClick={handleRemoveFromCompare}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Check size={20} />
            In Compare ({devices.length})
          </button>
        )}

        {devices.length >= 2 && (
          <Link
            href="/compare"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            View Comparison ({devices.length})
          </Link>
        )}
      </div>

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Devices to Compare ({devices.length})
              </h2>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {devices.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No devices added to compare yet
                </p>
              ) : (
                <div className="space-y-3">
                  {devices.map((device) => (
                    <div
                      key={device.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {device.name}
                        </p>
                        <p className="text-sm text-gray-600">{device.brand}</p>
                      </div>
                      <button
                        onClick={() => removeDevice(device.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {devices.length >= 2 && (
                <div className="mt-6 flex gap-3">
                  <Link
                    href="/compare"
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-center"
                  >
                    View Full Comparison
                  </Link>
                  <button
                    onClick={() => setShowCompareModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

