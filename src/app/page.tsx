"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart, FaStar, FaMapMarkerAlt, FaShieldAlt, FaMobileAlt, FaBolt } from "react-icons/fa";
import { FiImage } from "react-icons/fi";

type Product = {
  id: string;
  productName: string;
  description: string;
  price: number;
  imageURL?: string;
  stockQuantity: number;
  averageRating: number;
  reviewCount: number;
  category: { id: string; categoryName: string };
  vendor: {
    vendorName: string;
    region: string;
    isVerified: boolean;
  };
};

type Category = {
  id: string;
  categoryName: string;
  description?: string;
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products?limit=8"),
          fetch("/api/categories"),
        ]);

        if (productsRes.ok) {
          const data = await productsRes.json();
          setFeaturedProducts(data.data?.products || []);
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.data?.categories || []);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const heroStats = [
    {
      label: "Verified vendors",
      value: "80+",
      detail: "Trusted sellers across Ghana",
    },
    {
      label: "Products ready",
      value: `${featuredProducts.length.toString().padStart(2, "0")}+`,
      detail: "Curated for Ghanaian shoppers",
    },
    {
      label: "Regions covered",
      value: "16",
      detail: "Nationwide delivery network",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass-surface px-6 py-12 lg:px-12">
        <div className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-[rgba(10,155,69,0.35)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-24 h-80 w-80 rounded-full bg-[rgba(214,27,41,0.28)] blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr,0.85fr] items-center">
          <div className="space-y-6">
            <span className="pill inline-flex items-center gap-2">GoMart • Ghana's digital marketplace</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
              Shop Ghana. Support Ghana. <span className="text-[var(--gold)]">GoMart</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-200 max-w-2xl">
              Discover quality goods from verified vendors across all 16 regions. Pay securely with Ghana's favourite mobile money services and enjoy trusted, fast delivery anywhere you are.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/ui/products/list" className="btn-primary px-6 py-3 rounded-xl text-base font-semibold shadow-lg shadow-[rgba(10,155,69,0.25)]">
                Start Shopping
              </Link>
              <Link href="/ui/categories/list" className="text-sm font-semibold text-gray-300 hover:text-white flex items-center gap-2">
                Explore Categories →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/10 px-4 py-5">
                  <p className="text-3xl font-extrabold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-400 mt-1">
                    {stat.label}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-[rgba(255,255,255,0.04)] border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Trending now</p>
                  <h3 className="text-xl font-semibold text-white">Popular picks in Ghana</h3>
                </div>
                <span className="pill">Live</span>
              </div>
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {featuredProducts.slice(0, 4).map((product) => (
                  <Link key={product.id} href={`/ui/products/${product.id}`} className="flex items-center gap-4 rounded-2xl bg-[rgba(15,22,37,0.65)] border border-white/5 p-3 hover:border-white/20 transition">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[rgba(255,255,255,0.04)]">
                      {product.imageURL ? (
                        <Image src={product.imageURL} alt={product.productName} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-500">
                          <FiImage className="text-2xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white line-clamp-1">{product.productName}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{product.category.categoryName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[var(--gold)]">GH₵ {product.price.toFixed(2)}</p>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500 mt-1">{product.vendor.region}</p>
                    </div>
                  </Link>
                ))}
                {featuredProducts.length === 0 && (
                  <p className="text-sm text-gray-400">No featured products yet. Add your first product to appear here.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why GoMart */}
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            icon: <FaShieldAlt className="text-2xl text-[var(--gold)]" />,
            title: "Verified & secure",
            body: "Every vendor passes strict verification so you can shop with confidence and receive authentic products.",
          },
          {
            icon: <FaMobileAlt className="text-2xl text-[var(--gold)]" />,
            title: "Mobile money ready",
            body: "Pay seamlessly with MTN, Vodafone Cash or AirtelTigo Money. Bank transfer support is coming soon.",
          },
          {
            icon: <FaBolt className="text-2xl text-[var(--gold)]" />,
            title: "Nationwide logistics",
            body: "Fast delivery across all 16 regions with trusted courier partners like Ghana Post, DHL and Bolt.",
          },
        ].map((feature) => (
          <div key={feature.title} className="glass-surface rounded-3xl p-6 card-hover flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(244,196,48,0.12)] flex items-center justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{feature.body}</p>
          </div>
        ))}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="pill">Explore categories</span>
              <h2 className="mt-3 text-3xl font-bold text-white">Shop by interest</h2>
              <p className="text-sm text-gray-400 max-w-xl">From electronics and fashion to food and beauty – discover collections curated for Ghanaian lifestyles.</p>
            </div>
            <Link href="/ui/categories/list" className="text-sm font-semibold text-gray-300 hover:text-white">
              View all categories →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.id}
                href={`/ui/products/list?category=${category.id}`}
                className="rounded-2xl bg-[rgba(16,26,47,0.85)] border border-white/5 hover:border-white/20 transition p-5 flex flex-col gap-3"
              >
                <span className="text-3xl">{getCategoryIcon(category.categoryName)}</span>
                <h3 className="text-sm font-semibold text-white">{category.categoryName}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {category.description || "Discover top-rated products from verified vendors."}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="pill">Featured this week</span>
            <h2 className="mt-3 text-3xl font-bold text-white">Trending products in Ghana</h2>
          </div>
          <Link href="/ui/products/list" className="text-sm font-semibold text-gray-300 hover:text-white">
            Browse marketplace →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="glass-surface rounded-3xl p-12 text-center text-gray-300">
            <p className="text-lg font-semibold">No products available yet</p>
            <p className="text-sm text-gray-400 mt-2">As soon as vendors add their products, they will appear here automatically.</p>
            <Link href="/ui/products/new" className="btn-accent inline-flex mt-6 px-6 py-3 rounded-xl text-sm font-semibold">
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <div key={product.id} className="glass-surface rounded-3xl overflow-hidden card-hover flex flex-col">
                <div className="relative h-56 bg-[rgba(255,255,255,0.05)]">
                  {product.imageURL ? (
                    <Image src={product.imageURL} alt={product.productName} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-500">
                      <FiImage className="text-5xl" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="pill bg-[rgba(10,155,69,0.2)] text-[var(--primary)]">{product.category.categoryName}</span>
                    {product.vendor.isVerified && (
                      <span className="pill bg-[rgba(244,196,48,0.2)] text-[var(--gold)]">Verified</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white line-clamp-2">{product.productName}</h3>
                    <span className="text-sm text-gray-400">{product.vendor.vendorName}</span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-3">{product.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <FaStar className="text-[var(--gold)]" />
                      <span>{product.averageRating.toFixed(1)} · {product.reviewCount} reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[var(--gold)]" />
                      <span>{product.vendor.region}</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-[0.35em]">Price</p>
                      <p className="text-3xl font-extrabold text-[var(--gold)]">GH₵ {product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/ui/products/${product.id}`}
                        className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold"
                      >
                        View product
                      </Link>
                      <Link
                        href={`/ui/cart?add=${product.id}`}
                        className="btn-accent px-4 py-2 rounded-xl text-sm font-semibold"
                      >
                        Add to cart
                      </Link>
                    </div>
                  </div>

                  {product.stockQuantity <= 0 ? (
                    <p className="text-xs font-semibold text-red-400">Out of stock – check back soon.</p>
                  ) : product.stockQuantity < 10 ? (
                    <p className="text-xs font-semibold text-orange-300">Only {product.stockQuantity} left. Order now.</p>
                  ) : (
                    <p className="text-xs text-gray-400">In stock: {product.stockQuantity} units available.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Helper function to get category icons
function getCategoryIcon(categoryName: string): string {
  const name = categoryName.toLowerCase();
  if (name.includes("electronic") || name.includes("phone") || name.includes("computer")) return "📱";
  if (name.includes("fashion") || name.includes("clothing") || name.includes("cloth")) return "👔";
  if (name.includes("food") || name.includes("grocery")) return "🍎";
  if (name.includes("home") || name.includes("furniture")) return "🏠";
  if (name.includes("beauty") || name.includes("cosmetic")) return "💄";
  if (name.includes("sport") || name.includes("fitness")) return "⚽";
  if (name.includes("book") || name.includes("education")) return "📚";
  if (name.includes("toy") || name.includes("kid")) return "🧸";
  if (name.includes("health") || name.includes("medical")) return "⚕️";
  if (name.includes("automotive") || name.includes("car")) return "🚗";
  return "🏷️";
}





