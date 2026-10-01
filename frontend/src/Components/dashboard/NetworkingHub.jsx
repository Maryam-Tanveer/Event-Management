import { MessageSquare } from "lucide-react";

function NetworkingHub({ data }) {
  return (
    <div className="bg-[#4A0E1C] text-white rounded-xl p-6">
      <h3 className="text-lg font-serif font-semibold mb-2">Networking Hub</h3>
      <p className="text-sm text-white/80 mb-5">
        Connect with {data.attendeeCount} other attendees before the{" "}
        {data.eventName}.
      </p>

      <div className="flex items-center mb-5">
        {data.avatars.map((avatar, i) => (
          <img
            key={i}
            src={avatar}
            alt="attendee"
            className="w-8 h-8 rounded-full border-2 border-[#4A0E1C] -ml-2 first:ml-0 object-cover"
          />
        ))}
        <span className="w-8 h-8 rounded-full bg-[#8A6D3B] text-xs flex items-center justify-center -ml-2 border-2 border-[#4A0E1C]">
          +{data.extraCount}
        </span>
      </div>

      <button className="w-full bg-white text-gray-900 rounded-md py-2.5 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100">
        <MessageSquare size={16} />
        Open Chat
      </button>
    </div>
  );
}
export default NetworkingHub;