"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ identifier: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: form.identifier, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      if (data.data?.customer) {
        localStorage.setItem("gomart:user", JSON.stringify(data.data.customer));
      }

      toast.success("Welcome back");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <div className="space-y-2 text-center">
        <span className="pill inline-block">Welcome back</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Sign in to GoMart</h1>
        <p className="text-sm text-gray-300">Access your orders, saved carts and vendor chats.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-surface rounded-3xl p-6 md:p-8 space-y-5">
        <div>
          <label className="block text-sm mb-1">Email or phone number</label>
          <input
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            placeholder="example@domain.com or +23324XXXXXXX"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="text-center text-sm text-gray-300">
          <span>New here? </span>
          <Link href="/ui/customers/register" className="font-semibold text-white hover:text-[var(--gold)]">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}


