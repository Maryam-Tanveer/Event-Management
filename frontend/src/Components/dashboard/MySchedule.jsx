import ScheduleItem from "./ScheduleItem";

function MySchedule({ scheduleItems }) {
  return (
    <section>
      <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">
        My Schedule (Next 7 Days)
      </h2>
      <div className="bg-white rounded-xl border border-gray-100 px-6">
        {scheduleItems.map((item, idx) => (
          <ScheduleItem
            key={idx}
            item={item}
            isLast={idx === scheduleItems.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
export default MySchedule;