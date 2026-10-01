import React from "react";

function GuestCard ({ name, role, image }){
  return (
    <div className="bg-white p-4 rounded-xl flex items-center gap-4">
      <img src={image} alt={name} className="w-16 h-16 rounded-lg object-cover" />
      <div>
        <h3 className="font-medium text-[#3d2a2a]">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
};

export default GuestCard;