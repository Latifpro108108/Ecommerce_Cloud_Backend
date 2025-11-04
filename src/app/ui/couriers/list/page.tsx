"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaSearch, FaTruck } from "react-icons/fa";
import { toast } from "react-toastify";

type Courier = {
  id: string;
  courierName: string;
  phoneNumber: string;
  email?: string;
  region: string;
  isActive: boolean;
};

const GHANA_REGIONS = [
  "Greater Accra", "Ashanti", "Western", "Eastern", "Central",
  "Northern", "Upper East", "Upper West", "Volta", "Brong-Ahafo",
  "Oti", "Bono East", "Ahafo", "Savannah", "North East", "Western North"
];

export default function CouriersListPage() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    loadCouriers();
  }, []);

  async function loadCouriers() {
    setLoading(true);
    try {
      const res = await fetch("/api/couriers");
      if (res.ok) {
        const data = await res.json();
        setCouriers(data.data?.couriers || []);
      }
    } catch (error) {
      toast.error("Failed to load couriers");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete courier "${name}"?`)) return;

    try {
      const res = await fetch(`/api/couriers/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Courier deleted successfully");
        loadCouriers();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete courier");
      }
    } catch (error) {
      toast.error("Failed to delete courier");
    }
  }

  const filteredCouriers = couriers.filter((courier) => {
    const matchesSearch =
      courier.courierName.toLowerCase().includes(search.toLowerCase()) ||
      courier.phoneNumber.includes(search) ||
      courier.email?.toLowerCase().includes(search.toLowerCase());

    const matchesRegion = !selectedRegion || courier.region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Couriers</h1>
          <p className="text-gray-600 mt-1">{filteredCouriers.length} couriers found</p>
        </div>
        <Link
          href="/ui/couriers/new"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          + Add Courier
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search couriers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">All Regions</option>
              {GHANA_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Couriers Grid */}
      {filteredCouriers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <FaTruck className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No couriers found</h3>
          <p className="text-gray-500 mb-6">
            {search || selectedRegion ? "Try adjusting your filters" : "Start by adding your first courier"}
          </p>
          <Link
            href="/ui/couriers/new"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Add Courier
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCouriers.map((courier) => (
            <div key={courier.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2 text-gray-900">{courier.courierName}</h3>
                  {courier.isActive ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/ui/couriers/edit/${courier.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit className="text-lg" />
                  </Link>
                  <button
                    onClick={() => handleDelete(courier.id, courier.courierName)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">📱 {courier.phoneNumber}</div>
                {courier.email && <div className="text-sm text-gray-600">📧 {courier.email}</div>}
                <div className="text-sm text-gray-600">📍 Service Area: {courier.region}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}







