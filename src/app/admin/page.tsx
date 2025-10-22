"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks";
import { LoadingOverlay } from "@/components";
import { LogOut, BarChart3, Database, Zap } from "lucide-react";

interface AnalyticsData {
  overview: {
    totalDevices: number;
    totalPrices: number;
    totalPlatforms: number;
  };
  platformStats: Array<{
    name: string;
    isActive: boolean;
    totalListings: number;
    successRate: number;
  }>;
  priceStats: Array<{
    platform: string;
    count: number;
    averagePrice: number;
  }>;
  categoryStats: Array<{
    category: string;
    count: number;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAnalytics();
    }
  }, [isAuthenticated, user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("pricewize_auth_token");

      const response = await fetch("/api/analytics/compare", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  if (authLoading || !isAuthenticated) {
    return <LoadingOverlay isVisible={true} message="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingOverlay isVisible={true} message="Loading analytics..." />
        ) : analytics ? (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Devices</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalDevices}</p>
                  </div>
                  <Database className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Prices</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalPrices}</p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Platforms</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalPlatforms}</p>
                  </div>
                  <Zap className="w-12 h-12 text-yellow-600 opacity-20" />
                </div>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Statistics</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-semibold text-gray-700">Platform</th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-right py-2 px-4 font-semibold text-gray-700">Listings</th>
                      <th className="text-right py-2 px-4 font-semibold text-gray-700">Success Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.platformStats.map((platform) => (
                      <tr key={platform.name} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 text-gray-900">{platform.name}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              platform.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {platform.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right text-gray-900">{platform.totalListings}</td>
                        <td className="py-2 px-4 text-right text-gray-900">{platform.successRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Category Distribution</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.categoryStats.map((category) => (
                  <div key={category.category} className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-600 text-sm capitalize">{category.category}</p>
                    <p className="text-2xl font-bold text-gray-900">{category.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

