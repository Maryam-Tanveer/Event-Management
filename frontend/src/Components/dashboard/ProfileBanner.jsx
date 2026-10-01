import { Pencil, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ❌ Pehle tha: "Edit Profile" button kuch nahi karta tha
// ✅ Ab: onEditProfile prop se parent ka handler call hota hai
function ProfileBanner({ user, onEditProfile }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F5E6D8] rounded-none py-8">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between w-full">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <button
              onClick={onEditProfile}
              className="absolute -bottom-1 -right-1 bg-[#4A0E1C] text-white p-1 rounded-full hover:bg-[#3a0b16] transition-colors"
              title="Edit Profile"
            >
              <Pencil size={12} />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-gray-900">
              Welcome back, {user.name}
            </h1>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              🏅 {user.membership}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEditProfile}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-[#4A0E1C] text-white rounded-md text-sm font-medium flex items-center gap-2 hover:bg-[#3a0b16] transition-colors"
          >
            <Calendar size={16} />
            Discover Events
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileBanner;