import React from "react";
import ReviewCard from "./ReviewCard";

const reviews = [
  {
    name: "Sarah Jenkins",
    tag: "Gala 2025 Attendee",
    quote:
      "An absolutely breathtaking evening. The attention to detail in the culinary presentations was unmatched. Truly an elegant affair from start to finish.",
    initials: "SJ",
    initialsColor: "bg-pink-200 text-pink-700",
  },
  {
    name: "Marcus Thorne",
    tag: "VIP Guest",
    quote:
      "The sommelier masterclass was a highlight. The networking opportunities were fantastic, though finding the coat check at the end was a bit crowded.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
    highlighted: true,
  },
  {
    name: "Emma Lin",
    tag: "Gala 2025 Attendee",
    quote:
      "Perfectly executed. The ambiance created by the live jazz band set a sophisticated mood that lingered all night. Worth every penny for the VIP access.",
    initials: "EL",
    initialsColor: "bg-orange-200 text-orange-700",
  },
];

function ReviewsSection() {
  return (
    <div className="text-center pt-8">
      <h2 className="text-lg font-serif text-[#3d2a2a] mb-2">Past Attendee Experiences</h2>
      <div className="flex justify-center items-center gap-1 text-[#b8862f] mb-6">
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span className="text-gray-400">★</span>
        <span className="text-sm text-[#3d2a2a] ml-2">4.8 / 5.0 (124 Reviews)</span>
      </div>

      <div className="grid grid-cols-3 gap-6 text-left">
        {reviews.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;