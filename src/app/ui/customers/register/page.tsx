"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    region: "",
    city: "",
    address: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register");

      // simple client session bootstrap
      if (data.data?.customer) {
        localStorage.setItem("gomart:user", JSON.stringify(data.data.customer));
      }
      toast.success("Account created! Welcome to GoMart");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-4">
      <div className="space-y-2">
        <span className="pill">Join GoMart</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Create your account</h1>
        <p className="text-sm text-gray-300">Unlock fast checkout, saved addresses and order tracking.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-surface rounded-3xl p-6 md:p-8 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">First name</label>
          <input value={form.firstName} onChange={(e)=>setForm({...form, firstName:e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Last name</label>
          <input value={form.lastName} onChange={(e)=>setForm({...form, lastName:e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone number</label>
          <input value={form.phoneNumber} onChange={(e)=>setForm({...form, phoneNumber:e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Region</label>
          <input value={form.region} onChange={(e)=>setForm({...form, region:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-1">City</label>
          <input value={form.city} onChange={(e)=>setForm({...form, city:e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Address</label>
          <input value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} />
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary px-6 py-3 rounded-xl disabled:opacity-60">
            {loading ? "Creating..." : "Create account"}
          </button>
          <Link href="/ui/customers/login" className="text-sm font-semibold text-gray-300 hover:text-white">
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}


