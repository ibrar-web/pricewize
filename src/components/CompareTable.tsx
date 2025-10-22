"use client";

export interface CompareTableProps {
  devices: Array<{
    name: string;
    brand: string;
    lowestPrice: string;
    averagePrice: string;
    totalListings: number;
    image?: string;
  }>;
}

export function CompareTable({ devices }: CompareTableProps) {
  if (devices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No devices to compare. Add at least 2 devices.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Device</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Brand</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Lowest Price</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Average Price</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Listings</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-800">{device.name}</td>
              <td className="px-4 py-3 text-gray-600">{device.brand}</td>
              <td className="px-4 py-3 text-right font-semibold text-green-600">{device.lowestPrice}</td>
              <td className="px-4 py-3 text-right text-gray-700">{device.averagePrice}</td>
              <td className="px-4 py-3 text-center text-gray-600">{device.totalListings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

