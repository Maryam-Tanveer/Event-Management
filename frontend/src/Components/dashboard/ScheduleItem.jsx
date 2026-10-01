function ScheduleItem({ item, isLast }) {
  return (
    <div className={`flex gap-6 py-4 ${!isLast ? "border-b border-gray-100" : ""}`}>
      <div className="w-16 shrink-0 text-sm text-gray-500">
        <p className="font-medium text-gray-800">{item.date}</p>
        <p>{item.time}</p>
      </div>

      <div className="flex flex-col items-center pt-1.5">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            item.active ? "bg-[#8A6D3B]" : "border border-gray-300"
          }`}
        />
      </div>

      <div>
        <p className="font-medium text-gray-900">{item.title}</p>
        <p className="text-sm text-gray-500">{item.subtitle}</p>
        {item.tag && (
          <span className="inline-flex items-center gap-1 mt-2 bg-[#F5E6D8] text-xs px-2 py-1 rounded text-gray-700">
            ⭐ {item.tag}
          </span>
        )}
      </div>
    </div>
  );
}
export default ScheduleItem;