import { useRef } from "react";
import { Calendar, Clock, Globe } from "lucide-react";

function TemporalBlueprint({ eventData, setEventData }) {
  const startDateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endDateRef = useRef(null);
  const endTimeRef = useRef(null);

  const handleIconClick = (ref) => {
    if (ref.current) {
      try {
        if (typeof ref.current.showPicker === 'function') {
          ref.current.showPicker();
        } else {
          ref.current.focus();
        }
      } catch (e) {
        ref.current.focus();
      }
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-[#e8e0d8] p-8">
      {/* Section header */}
      <h3 className="text-xs font-bold tracking-[0.2em] text-[#b8862f] uppercase mb-6">
        02 / Temporal Blueprint
      </h3>

      {/* Date / Time row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
        {/* Start */}
        <div>
          <label className="block text-sm font-semibold text-[#3d2a2a] mb-2">
            Commencement Date & Hour
          </label>
          <div className="flex gap-2">
            <div 
              className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-[#e0d6cc] rounded-lg bg-[#faf7f4] cursor-text"
              onClick={() => handleIconClick(startDateRef)}
            >
              <Calendar size={16} className="text-[#b8862f] shrink-0 cursor-pointer" />
              <input
                ref={startDateRef}
                type="date"
                value={eventData.startDate}
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full bg-transparent text-sm text-[#3d2a2a] focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>
            <div 
              className="flex items-center gap-2 px-3 py-2.5 border border-[#e0d6cc] rounded-lg bg-[#faf7f4] cursor-text"
              onClick={() => handleIconClick(startTimeRef)}
            >
              <Clock size={16} className="text-[#b8862f] shrink-0 cursor-pointer" />
              <input
                ref={startTimeRef}
                type="time"
                value={eventData.startTime}
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="w-24 bg-transparent text-sm text-[#3d2a2a] focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>
          </div>
        </div>

        {/* End */}
        <div>
          <label className="block text-sm font-semibold text-[#3d2a2a] mb-2">
            Conclusion
          </label>
          <div className="flex gap-2">
            <div 
              className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-[#e0d6cc] rounded-lg bg-[#faf7f4] cursor-text"
              onClick={() => handleIconClick(endDateRef)}
            >
              <Calendar size={16} className="text-[#b8862f] shrink-0 cursor-pointer" />
              <input
                ref={endDateRef}
                type="date"
                value={eventData.endDate}
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="w-full bg-transparent text-sm text-[#3d2a2a] focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>
            <div 
              className="flex items-center gap-2 px-3 py-2.5 border border-[#e0d6cc] rounded-lg bg-[#faf7f4] cursor-text"
              onClick={() => handleIconClick(endTimeRef)}
            >
              <Clock size={16} className="text-[#b8862f] shrink-0 cursor-pointer" />
              <input
                ref={endTimeRef}
                type="time"
                value={eventData.endTime}
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                className="w-24 bg-transparent text-sm text-[#3d2a2a] focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timezone */}
      <div 
        className="flex items-center gap-2 px-4 py-2.5 bg-[#faf7f4] border border-[#e0d6cc] rounded-lg cursor-text"
        onClick={() => document.getElementById('tz-input')?.focus()}
      >
        <Globe size={16} className="text-[#b8862f] shrink-0" />
        <span className="text-xs text-[#3d2a2a] whitespace-nowrap">
          Time Zone:
        </span>
        <input
          id="tz-input"
          type="text"
          value={eventData.timezone}
          onChange={(e) => setEventData((prev) => ({ ...prev, timezone: e.target.value }))}
          placeholder="e.g. EST, UTC, Europe/London"
          className="flex-1 bg-transparent text-xs text-[#3d2a2a] focus:outline-none"
        />
      </div>
    </section>
  );
}

export default TemporalBlueprint;
