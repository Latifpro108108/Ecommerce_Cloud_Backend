"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaArrowLeft, FaMapMarkerAlt, FaShoppingCart, FaStar } from "react-icons/fa";
import { FiImage } from "react-icons/fi";

type ProductDetail = {
  id: string;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageURL?: string;
  galleryImages?: string[];
  highlights?: string[];
  deliveryInfo?: string | null;
  returnPolicy?: string | null;
  videoURL?: string | null;
  specifications?: Record<string, string> | null;
  brand?: string | null;
  sku?: string | null;
  averageRating: number;
  reviewCount: number;
  category: { id: string; categoryName: string };
  vendor: {
    id: string;
    vendorName: string;
    region: string;
    isVerified: boolean;
    storeDescription?: string | null;
    storeLogo?: string | null;
  };
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          router.push("/ui/products/list");
          return;
        }
        const data = await res.json();
        const fetchedProduct: ProductDetail | undefined = data.data?.product;
        if (!fetchedProduct) {
          router.push("/ui/products/list");
          return;
        }
        setProduct(fetchedProduct);
        const gallery = fetchedProduct.galleryImages?.length
          ? fetchedProduct.galleryImages
          : fetchedProduct.imageURL
          ? [fetchedProduct.imageURL]
          : [];
        setSelectedImage(gallery[0] || null);
      } catch (error) {
        router.push("/ui/products/list");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, router]);

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    if (product.galleryImages && product.galleryImages.length > 0) {
      return product.galleryImages;
    }
    return product.imageURL ? [product.imageURL] : [];
  }, [product]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-300">
        <p className="text-lg">Product not available at the moment please try again later or contact the vendor for .</p>
        <Link href="/ui/products/list" className="btn-primary inline-flex mt-6 px-6 py-3 rounded-xl text-sm font-semibold">
          Back to products
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
    if (!product) return;
    try {
      const stored = localStorage.getItem("gomart:cart");
      let cart: Array<{
        productId: string;
        productName: string;
        price: number;
        imageURL?: string | null;
        quantity: number;
        stockQuantity: number;
      }> = stored ? JSON.parse(stored) : [];

      const existing = cart.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          toast.info("Maximum stock already in cart");
        } else {
          existing.quantity += 1;
          toast.success("Quantity updated in cart");
        }
      } else {
        cart.push({
          productId: product.id,
          productName: product.productName,
          price: product.price,
          imageURL: selectedImage || product.imageURL,
          quantity: 1,
          stockQuantity: product.stockQuantity,
        });
        toast.success("Added to cart");
      }

      localStorage.setItem("gomart:cart", JSON.stringify(cart));
      window.dispatchEvent(new StorageEvent("storage", { key: "gomart:cart" }));
    } catch (error) {
      toast.error("Could not update cart");
    }
  }

  const specificationsEntries = product.specifications
    ? Object.entries(product.specifications)
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center gap-3 text-sm text-gray-300">
        <Link href="/ui/products/list" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
          <FaArrowLeft /> Back to products
        </Link>
        <span>•</span>
        <span>{product.category.categoryName}</span>
      </div>

      <div className="glass-surface rounded-3xl p-6 md:p-10 grid gap-8 lg:grid-cols-[1.2fr,0.9fr] items-start">
        <div className="space-y-4">
          <div className="relative h-[340px] md:h-[420px] rounded-3xl overflow-hidden border border-white/10 bg-[rgba(255,255,255,0.04)]">
            {selectedImage ? (
              <Image src={selectedImage} alt={product.productName} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                <FiImage className="text-5xl" />
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="pill bg-[rgba(10,155,69,0.2)] text-[var(--primary)]">
                {product.category.categoryName}
              </span>
              {product.vendor.isVerified && (
                <span className="pill bg-[rgba(244,196,48,0.2)] text-[var(--gold)]">Verified vendor</span>
              )}
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {gallery.map((image) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border ${
                    selectedImage === image ? "border-[var(--gold)]" : "border-white/10"
                  }`}
                >
                  <Image src={image} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{product.productName}</h1>
            {product.brand && (
              <p className="text-sm uppercase tracking-[0.35em] text-gray-500">{product.brand}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <FaStar className="text-[var(--gold)]" />
                <span>{product.averageRating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">({product.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaMapMarkerAlt />
                <span>{product.vendor.vendorName}</span>
                <span>•</span>
                <span>{product.vendor.region}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>

          <div className="rounded-3xl bg-[rgba(255,255,255,0.04)] border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.4em] text-gray-500">Price</span>
              <span className="text-3xl font-extrabold text-[var(--gold)]">GH₵ {product.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Availability</span>
              <span>
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="btn-primary w-full px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Add to cart
            </button>
          </div>

          {product.highlights && product.highlights.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-white">Highlights</h2>
              <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
                {product.highlights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {specificationsEntries.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-white">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                {specificationsEntries.map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{key}</p>
                    <p className="mt-1 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(product.deliveryInfo || product.returnPolicy) && (
            <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-300">
              {product.deliveryInfo && (
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Delivery information</h3>
                  <p>{product.deliveryInfo}</p>
                </div>
              )}
              {product.returnPolicy && (
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Return policy</h3>
                  <p>{product.returnPolicy}</p>
                </div>
              )}
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Vendor</h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
                {product.vendor.storeLogo ? (
                  <Image src={product.vendor.storeLogo} alt="Vendor logo" width={48} height={48} className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                    {product.vendor.vendorName[0]}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-white">{product.vendor.vendorName}</p>
                <p className="text-xs text-gray-400">{product.vendor.region}</p>
              </div>
            </div>
            {product.vendor.storeDescription && (
              <p className="text-sm text-gray-300 leading-relaxed">
                {product.vendor.storeDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

