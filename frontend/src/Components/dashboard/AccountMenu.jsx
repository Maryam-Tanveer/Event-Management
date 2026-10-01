import { ChevronRight } from "lucide-react";

function AccountMenu({ onEditProfile, onPaymentClick, onNotificationClick }) {
  const menuItems = [
    {
      label: "Profile & Visibility",
      onClick: onEditProfile,
    },
    {
      label: "Payment Methods",
      onClick: onPaymentClick,
    },
    {
      label: "Notification Preferences",
      onClick: onNotificationClick,
    },
  ];

  return (
    <div className="bg-[#F5E6D8] rounded-xl p-5">
      <h4 className="text-xs font-semibold text-gray-500 tracking-widest mb-3">
        ACCOUNT
      </h4>
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={item.onClick}
          className="w-full flex justify-between items-center py-3 border-b last:border-b-0 border-black/5 text-sm text-gray-800 hover:text-[#4A0E1C] transition-colors"
        >
          {item.label}
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      ))}
    </div>
  );
}

export default AccountMenu;
