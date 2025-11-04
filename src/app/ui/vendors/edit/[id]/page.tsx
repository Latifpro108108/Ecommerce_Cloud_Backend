"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

// Ghana regions
const GHANA_REGIONS = [
  "Greater Accra", "Ashanti", "Western", "Eastern", "Central",
  "Northern", "Upper East", "Upper West", "Volta", "Brong-Ahafo",
  "Oti", "Bono East", "Ahafo", "Savannah", "North East", "Western North"
];

type Vendor = {
  id: string;
  vendorName: string;
  email: string;
  phoneNumber: string;
  businessAddress: string;
  region: string;
  city: string;
  businessLicense?: string;
  taxId?: string;
  isVerified: boolean;
  isActive: boolean;
  rating?: number;
};

export default function EditVendorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    vendorName: "",
    email: "",
    phoneNumber: "",
    businessAddress: "",
    region: "",
    city: "",
    businessLicense: "",
    taxId: "",
    isVerified: false,
    isActive: true,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/vendors/${id}`);
        if (!res.ok) throw new Error("Vendor not found");

        const data = await res.json();
        const vendor: Vendor = data.data?.vendor;

        setForm({
          vendorName: vendor.vendorName,
          email: vendor.email,
          phoneNumber: vendor.phoneNumber,
          businessAddress: vendor.businessAddress,
          region: vendor.region,
          city: vendor.city,
          businessLicense: vendor.businessLicense || "",
          taxId: vendor.taxId || "",
          isVerified: vendor.isVerified,
          isActive: vendor.isActive,
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to load vendor");
        router.push("/ui/vendors/list");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/vendors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          businessLicense: form.businessLicense || undefined,
          taxId: form.taxId || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update vendor");
      }

      toast.success("Vendor updated successfully!");
      router.push("/ui/vendors/list");
    } catch (error: any) {
      toast.error(error.message || "Failed to update vendor");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Vendor</h1>
          <p className="text-gray-600 mt-1">Update vendor information</p>
        </div>
        <Link
          href="/ui/vendors/list"
          className="text-green-600 hover:underline font-semibold"
        >
          ← Back to list
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vendor Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Business/Vendor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.vendorName}
              onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Business Address */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Business Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.businessAddress}
              onChange={(e) => setForm({ ...form, businessAddress: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 min-h-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Region and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select a region...</option>
                {GHANA_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Business License and Tax ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Business License Number
              </label>
              <input
                type="text"
                value={form.businessLicense}
                onChange={(e) => setForm({ ...form, businessLicense: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Tax ID (TIN)
              </label>
              <input
                type="text"
                value={form.taxId}
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Options */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isVerified"
                checked={form.isVerified}
                onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
                className="w-5 h-5 text-green-600 focus:ring-2 focus:ring-green-500"
              />
              <label htmlFor="isVerified" className="font-medium text-gray-700">
                Vendor is verified
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-5 h-5 text-green-600 focus:ring-2 focus:ring-green-500"
              />
              <label htmlFor="isActive" className="font-medium text-gray-700">
                Vendor account is active
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/ui/vendors/list"
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}







