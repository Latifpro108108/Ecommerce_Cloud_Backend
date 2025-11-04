"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaMobileAlt, FaShieldAlt } from "react-icons/fa";
import { FiCreditCard } from "react-icons/fi";

const CART_KEY = "gomart:cart";

type CartItem = {
  productId: string;
  productName: string;
  price: number;
  imageURL?: string | null;
  quantity: number;
  stockQuantity: number;
};

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  notes: string;
  paymentMethod: "MTN" | "Vodafone" | "AirtelTigo" | "Bank";
  momoNumber: string;
  momoNetwork: "MTN" | "Vodafone" | "AirtelTigo";
};

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to parse cart", error);
    return [];
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    email: "",
    phone: "",
    region: "",
    city: "",
    address: "",
    notes: "",
    paymentMethod: "MTN",
    momoNumber: "",
    momoNetwork: "MTN",
  });

  useEffect(() => {
    const items = readCart();
    setCartItems(items);
    if (items.length === 0) {
      toast.info("Your cart is empty");
      router.push("/ui/cart");
    }
  }, [router]);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 20;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [cartItems]);

  const paymentDescription = useMemo(() => {
    switch (form.paymentMethod) {
      case "MTN":
        return "Dial *170# → Option 1 (Transfer Money) → Option 1 (Momo User) → Enter Merchant ID 123456 and amount.";
      case "Vodafone":
        return "Dial *110# → Option 4 (Make Payments) → Option 1 (Goods & Services) → Enter Merchant ID 654321.";
      case "AirtelTigo":
        return "Dial *110# → Select Pay Bill → Choose Goods & Services → Enter Merchant ID 987654.";
      case "Bank":
      default:
        return "Bank transfer instructions will be emailed. Payment must be confirmed before shipping.";
    }
  }, [form.paymentMethod]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if ((form.paymentMethod === "MTN" || form.paymentMethod === "Vodafone" || form.paymentMethod === "AirtelTigo") && !form.momoNumber) {
      toast.error("Please enter your mobile money number");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      toast.success("Mock payment successful! Order confirmed.");
      localStorage.setItem(CART_KEY, JSON.stringify([]));
      window.dispatchEvent(new StorageEvent("storage", { key: CART_KEY }));
      setSubmitting(false);
      router.push("/ui/products/list");
    }, 1200);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <span className="pill">Checkout</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Payment & delivery</h1>
          <p className="text-sm text-gray-300">Complete your order with secure Mobile Money or bank transfer.</p>
        </div>
        <Link href="/ui/cart" className="text-sm font-semibold text-gray-300 hover:text-white">
          ← Back to cart
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.5fr,0.9fr]">
        <div className="space-y-6">
          <section className="glass-surface rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-white">Contact information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Full name *</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone number *</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
            </div>
          </section>

          <section className="glass-surface rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-white">Delivery details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Region *</label>
                <input
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">City *</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Delivery address *</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Order notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  placeholder="Delivery instructions or references"
                />
              </div>
            </div>
          </section>

          <section className="glass-surface rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-white">Payment method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["MTN", "Vodafone", "AirtelTigo", "Bank"].map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm cursor-pointer transition ${
                    form.paymentMethod === method
                      ? "border-[var(--gold)] bg-[rgba(244,196,48,0.12)] text-[var(--gold)]"
                      : "border-white/10 bg-[rgba(255,255,255,0.03)] text-gray-300 hover:border-white/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={form.paymentMethod === method}
                    onChange={() => setForm({ ...form, paymentMethod: method as CheckoutForm["paymentMethod"] })}
                    className="hidden"
                  />
                  {method === "Bank" ? <FiCreditCard /> : <FaMobileAlt />}
                  <span>{method}</span>
                </label>
              ))}
            </div>

            {(form.paymentMethod === "MTN" || form.paymentMethod === "Vodafone" || form.paymentMethod === "AirtelTigo") && (
              <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Network</label>
                    <select
                      value={form.momoNetwork}
                      onChange={(e) => setForm({ ...form, momoNetwork: e.target.value as CheckoutForm["momoNetwork"] })}
                    >
                      <option value="MTN">MTN</option>
                      <option value="Vodafone">Vodafone</option>
                      <option value="AirtelTigo">AirtelTigo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Mobile money number *</label>
                    <input
                      value={form.momoNumber}
                      onChange={(e) => setForm({ ...form, momoNumber: e.target.value })}
                      placeholder="024 XXX XXXX"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Transfer the total amount to the displayed merchant ID. You will receive an SMS confirmation.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-500">
                <FaShieldAlt /> Secure checkout (demo)
              </div>
              <p>{paymentDescription}</p>
            </div>
          </section>
        </div>

        <aside className="glass-surface rounded-3xl p-6 space-y-5 h-fit">
          <h2 className="text-lg font-semibold text-white">Order summary</h2>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>GH₵ {totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{totals.shipping === 0 ? "FREE" : `GH₵ ${totals.shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between text-base font-semibold text-white">
              <span>Total</span>
              <span>GH₵ {totals.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? "Processing..." : "Confirm order"}
          </button>
          <p className="text-xs text-gray-400 text-center">
            Payments are simulated for the demo. No real money is transferred.
          </p>
        </aside>
      </form>
    </div>
  );
}
