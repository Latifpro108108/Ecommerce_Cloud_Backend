"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaStar, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

type Review = {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  product: {
    id: string;
    productName: string;
  };
};

export default function ReviewsListPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("");

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.data?.reviews || []);
      }
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Review deleted successfully");
        loadReviews();
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.product.productName.toLowerCase().includes(search.toLowerCase()) ||
      review.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      review.customer.lastName.toLowerCase().includes(search.toLowerCase());

    const matchesRating = !filterRating || review.rating === parseInt(filterRating);

    return matchesSearch && matchesRating;
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
          <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
          <p className="text-gray-600 mt-1">{filteredReviews.length} reviews found</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No reviews found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? "" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="font-semibold">{review.rating}/5</span>
                  </div>
                  <Link
                    href={`/ui/products/list?search=${review.product.productName}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {review.product.productName}
                  </Link>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>

              {review.comment && (
                <p className="text-gray-700 mb-3">"{review.comment}"</p>
              )}

              <div className="text-sm text-gray-500">
                By {review.customer.firstName} {review.customer.lastName} •{" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}







