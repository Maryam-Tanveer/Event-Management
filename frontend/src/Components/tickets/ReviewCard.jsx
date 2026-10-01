import React from "react";

function ReviewCard ({ name, tag, quote, image, initials, initialsColor, highlighted }) {
  return (
    <div
      className={`bg-[#f0e6dc] p-6 rounded-xl ${
        highlighted ? "border border-[#b8862f]/30" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        {image ? (
          <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${initialsColor}`}
          >
            {initials}
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-[#3d2a2a]">{name}</h4>
          <p className="text-xs text-gray-500 uppercase">{tag}</p>
        </div>
      </div>
      <p className="text-sm italic text-gray-600">"{quote}"</p>
    </div>
  );
};

export default ReviewCard;