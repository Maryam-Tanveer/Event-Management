import React, { useState } from "react";
import { X, Bell, Mail, MessageSquare, Ticket } from "lucide-react";
import toast from "react-hot-toast";

function NotificationPreferencesModal({ onClose }) {
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    smsAlerts: false,
    newEvents: true,
    ticketUpdates: true,
    marketing: false,
  });

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // API call mock
    toast.success("Notification preferences saved successfully!");
    onClose();
  };

  const PreferenceRow = ({ icon: Icon, title, description, stateKey }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-[#e5ddd5] rounded-xl hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[#FBF3EC] rounded-lg text-[#3d1823]">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-semibold text-[#3d2a2a] text-sm">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => handleToggle(stateKey)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          preferences[stateKey] ? "bg-[#3d1823]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            preferences[stateKey] ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fdf1ea] rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative border border-[#e5ddd5]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-[#3d2a2a]">Notifications</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-3 mb-6">
          <PreferenceRow
            icon={Mail}
            title="Email Alerts"
            description="Receive important updates via email"
            stateKey="emailAlerts"
          />
          <PreferenceRow
            icon={MessageSquare}
            title="SMS Notifications"
            description="Get instant text messages for events"
            stateKey="smsAlerts"
          />
          <PreferenceRow
            icon={Bell}
            title="New Events"
            description="Notify me when new events are added"
            stateKey="newEvents"
          />
          <PreferenceRow
            icon={Ticket}
            title="Ticket Updates"
            description="Updates regarding your purchased tickets"
            stateKey="ticketUpdates"
          />
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-[#d5ccc3] text-[#3d2a2a] text-sm font-semibold hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#3d1823] text-white rounded-full text-sm font-semibold hover:bg-[#2c1119] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationPreferencesModal;
