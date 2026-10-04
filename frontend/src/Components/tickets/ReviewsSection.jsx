import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import ReviewCard from "./ReviewCard";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// ✅ Real reviews API se aate hain, hardcoded nahi
// Real rating bhi event.avgRating se aati hai
function ReviewsSection({ eventId, avgRating = 0, reviewCount = 0 }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Review submit form state ───────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch reviews for this event ──────────────────────────────────────────
  useEffect(() => {
    if (!eventId) return;
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/api/reviews/${eventId}`);
        setReviews(data);
      } catch {
        // Reviews fetch fail — silently ignore (not critical)
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [eventId]);

  // ── Submit new review ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return toast.error("Please write a comment.");
    try {
      setSubmitting(true);
      const { data } = await axiosInstance.post(`/api/reviews/${eventId}`, {
        rating: newRating,
        comment: newComment.trim(),
      });
      setReviews((prev) => [data, ...prev]);
      setNewComment("");
      setNewRating(5);
      setShowForm(false);
      toast.success("Review submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Rating display helpers ────────────────────────────────────────────────
  const filledStars = Math.round(avgRating);

  // Agar koi bhi review nahi aur form bhi nahi — kuch mat dikho
  if (!eventId) return null;

  return (
    <div className="pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif text-[#3d2a2a]">
          {reviews.length > 0 ? "Attendee Reviews" : "Be the First to Review"}
        </h2>
        {user && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="text-sm font-semibold text-[#b8862f] hover:text-[#8b5e1a] transition-colors"
          >
            {showForm ? "Cancel" : "+ Write a Review"}
          </button>
        )}
      </div>

      {/* Real Rating Summary */}
      {reviewCount > 0 && (
        <div className="flex justify-center items-center gap-1 text-[#b8862f] mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={s <= filledStars ? "" : "text-gray-300"}>★</span>
          ))}
          <span className="text-sm text-[#3d2a2a] ml-2">
            {avgRating.toFixed(1)} / 5.0 ({reviewCount} {reviewCount === 1 ? "Review" : "Reviews"})
          </span>
        </div>
      )}

      {/* Write Review Form */}
      {showForm && user && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#fdf6ee] border border-[#e5ddd5] rounded-xl p-5 mb-6"
        >
          <p className="text-sm font-semibold text-[#3d2a2a] mb-3">Your Rating</p>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setNewRating(s)}
                className={`text-2xl transition-colors ${
                  s <= newRating ? "text-[#b8862f]" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience at this event..."
            rows={3}
            maxLength={1000}
            className="w-full border border-[#e5ddd5] rounded-lg p-3 text-sm text-[#3d2a2a] resize-none focus:outline-none focus:ring-2 focus:ring-[#b8862f]/30"
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#3d1823] text-white text-sm font-semibold rounded-full hover:bg-[#2c1119] transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <p className="text-center text-sm text-[#7a6a6a] py-6">Loading reviews...</p>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              name={review.user?.name || "Anonymous"}
              tag={review.isVerifiedAttendee ? "✓ Verified Attendee" : "Guest"}
              quote={review.comment}
              rating={review.rating}
              initials={review.user?.name?.slice(0, 2).toUpperCase() || "??"}
              initialsColor="bg-amber-100 text-amber-700"
            />
          ))}
        </div>
      ) : (
        !showForm && (
          <p className="text-center text-sm text-[#a09080] py-6">
            No reviews yet. {user ? "Be the first to share your experience!" : "Sign in to write a review."}
          </p>
        )
      )}
    </div>
  );
}

export default ReviewsSection;