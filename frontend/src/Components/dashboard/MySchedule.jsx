import ScheduleItem from "./ScheduleItem";

function MySchedule({ scheduleItems = [] }) {
  return (
    <section>
      <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">
        My Schedule
      </h2>
      <div className="bg-white rounded-xl border border-gray-100 px-6 py-2">
        {scheduleItems.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center italic">
            No scheduled sessions yet. Book an event to automatically populate your itinerary.
          </p>
        ) : (
          scheduleItems.map((item, idx) => (
            <ScheduleItem
              key={idx}
              item={item}
              isLast={idx === scheduleItems.length - 1}
            />
          ))
        )}
      </div>
    </section>
  );
}
export default MySchedule;