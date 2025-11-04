"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Northern",
  "Upper East",
  "Upper West",
  "Volta",
  "Brong-Ahafo",
  "Oti",
  "Bono East",
  "Ahafo",
  "Savannah",
  "North East",
  "Western North",
];

type VendorForm = {
  vendorName: string;
  email: string;
  phoneNumber: string;
  businessAddress: string;
  region: string;
  city: string;
  storeDescription: string;
  storeLogo: string;
  storeBanner: string;
  deliveryRegions: string[];
};

export default function NewVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<VendorForm>({
    vendorName: "",
    email: "",
    phoneNumber: "",
    businessAddress: "",
    region: "",
    city: "",
    storeDescription: "",
    storeLogo: "",
    storeBanner: "",
    deliveryRegions: [] as string[],
  });

  const previewDeliveryRegions = useMemo(() => {
    if (form.deliveryRegions.length === 0) return "Nationwide";
    if (form.deliveryRegions.length > 3) {
      return `${form.deliveryRegions.slice(0, 3).join(", ")} +${form.deliveryRegions.length - 3}`;
    }
    return form.deliveryRegions.join(", ");
  }, [form.deliveryRegions]);

  function toggleDeliveryRegion(region: string) {
    setForm((prev) => {
      const exists = prev.deliveryRegions.includes(region);
      return {
        ...prev,
        deliveryRegions: exists
          ? prev.deliveryRegions.filter((r) => r !== region)
          : [...prev.deliveryRegions, region],
      };
    });
  }

  function readFile(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleImageChange(key: "storeLogo" | "storeBanner", file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image")) {
      toast.error("Please upload an image file");
      return;
    }
    const base64 = await readFile(file);
    setForm((prev) => ({ ...prev, [key]: base64 }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create vendor");
      }

      toast.success("Vendor created successfully!");
      router.push("/ui/vendors/list");
    } catch (error: any) {
      toast.error(error.message || "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <span className="pill">Vendor onboarding</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Register a GoMart vendor account
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl">
            Provide a few basic details so shoppers can find and trust your storefront.
          </p>
        </div>
        <Link href="/ui/vendors/list" className="text-sm font-semibold text-gray-300 hover:text-white">
          ← Back to vendors
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr,0.8fr]">
        <form onSubmit={handleSubmit} className="glass-surface rounded-3xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Business / Vendor Name *</label>
              <input
                value={form.vendorName}
                onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
                placeholder="e.g., Ama's Boutique"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">City *</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Accra, Kumasi, Takoradi"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="vendor@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone number *</label>
              <input
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                placeholder="+233 XX XXX XXXX"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm mb-1">Business address *</label>
              <textarea
                value={form.businessAddress}
                onChange={(e) => setForm({ ...form, businessAddress: e.target.value })}
                placeholder="Street, city, nearby landmark"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Region *</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
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
              <label className="block text-sm mb-1">Delivery coverage</label>
              <div className="grid grid-cols-2 gap-2">
                {GHANA_REGIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => toggleDeliveryRegion(region)}
                    className={`text-xs font-semibold px-3 py-2 rounded-full border transition ${
                      form.deliveryRegions.includes(region)
                        ? "border-[var(--gold)] text-[var(--gold)] bg-[rgba(244,196,48,0.15)]"
                        : "border-white/10 text-gray-300 hover:border-white/30"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Store description</label>
            <textarea
              value={form.storeDescription}
              onChange={(e) => setForm({ ...form, storeDescription: e.target.value })}
              placeholder="Tell shoppers what you sell and what makes your store unique"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Upload store logo</label>
              <label className="flex items-center justify-center rounded-2xl border border-dashed border-white/20 px-4 py-6 text-sm text-gray-300 cursor-pointer hover:border-white/40">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleImageChange("storeLogo", file);
                  }}
                />
                {form.storeLogo ? "Change logo" : "Choose logo"}
              </label>
              {form.storeLogo && (
                <div className="mt-3 h-24 w-24 overflow-hidden rounded-xl border border-white/10">
                  <Image src={form.storeLogo} alt="Logo preview" width={96} height={96} className="object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm mb-2">Upload banner image</label>
              <label className="flex items-center justify-center rounded-2xl border border-dashed border-white/20 px-4 py-6 text-sm text-gray-300 cursor-pointer hover:border-white/40">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleImageChange("storeBanner", file);
                  }}
                />
                {form.storeBanner ? "Change banner" : "Choose banner"}
              </label>
              {form.storeBanner && (
                <div className="mt-3 h-24 w-full overflow-hidden rounded-xl border border-white/10">
                  <Image src={form.storeBanner} alt="Banner preview" width={320} height={96} className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end border-t border-white/10 pt-6">
            <Link href="/ui/vendors/list" className="btn-accent px-6 py-3 rounded-xl text-sm font-semibold text-center">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-60">
              {loading ? "Creating..." : "Create vendor"}
            </button>
          </div>
        </form>

        <aside className="glass-surface rounded-3xl p-6 space-y-6 h-fit">
          <h3 className="text-lg font-semibold text-white">Preview card</h3>
          <div className="rounded-3xl overflow-hidden border border-white/10">
            <div className="relative h-32 bg-[rgba(16,26,47,0.85)]">
              {form.storeBanner ? (
                <Image src={form.storeBanner} alt="Store banner" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500 text-sm">Store banner preview</div>
              )}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                  {form.storeLogo ? (
                    <Image src={form.storeLogo} alt="Store logo" width={48} height={48} className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">Logo</div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {form.vendorName || "Vendor name"}
                  </p>
                  <p className="text-xs text-gray-200">{previewDeliveryRegions}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[rgba(7,13,24,0.92)] space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-gray-500">About</p>
              <p className="text-sm text-gray-300 line-clamp-4">
                {form.storeDescription || "Share your story so customers know why to shop with you."}
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-500">
                {form.region && <span>{form.region}</span>}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-300">
            <h4 className="text-xs uppercase tracking-[0.3em] text-gray-400">Tips</h4>
            <p>High-quality images and a clear description help increase shopper trust.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}





