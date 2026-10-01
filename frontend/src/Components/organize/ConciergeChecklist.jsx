import { CheckCircle, ShieldCheck } from "lucide-react";
import { prestigeCriteria } from "../../data/mockEvents";

function ConciergeChecklist({ qualityScore = 70 }) {
  // SVG circular progress values
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (qualityScore / 100) * circumference;

  return (
    <div className="bg-[#2d1a0e] text-white rounded-2xl p-6 space-y-5">
      {/* Header badge */}
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-[#b8862f]" />
        <span className="text-[10px] font-bold tracking-[0.15em] text-[#b8862f] uppercase">
          LuxeEvents Certified
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-serif font-bold leading-tight">
        Concierge Checklist
      </h3>

      {/* Description */}
      <p className="text-xs text-[#c9bfb3] leading-relaxed">
        Your event is automatically eligible for inclusion in the Venice Biennale
        Patron Dispatch upon achieving 90% curation completion.
      </p>

      {/* Quality Score Ring */}
      <div className="flex items-center gap-4 pt-2">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 96 96">
            {/* Background ring */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="#4a3828"
              strokeWidth="6"
            />
            {/* Progress ring */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="#b8862f"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-[#b8862f]">
              {qualityScore}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            Exceptional Quality
          </p>
          <p className="text-[10px] text-[#a09080]">
            Next: Configure Tiers & Passes
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[#4a3828]" />

      {/* Prestige Criteria */}
      <div>
        <h4 className="text-sm font-serif font-semibold mb-3">
          Prestige Criteria
        </h4>
        <ul className="space-y-2.5">
          {prestigeCriteria.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle
                size={16}
                className="text-[#b8862f] mt-0.5 shrink-0"
              />
              <span className="text-xs text-[#c9bfb3] leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ConciergeChecklist;
