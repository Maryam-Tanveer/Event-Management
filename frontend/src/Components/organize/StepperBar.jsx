import { stepperSteps } from "../../data/mockEvents";

function StepperBar({ activeStep = 1, onStepClick }) {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {stepperSteps.map((step, idx) => {
          const isActive = step.number === activeStep;
          const isCompleted = step.number < activeStep;
          const isLast = idx === stepperSteps.length - 1;

          return (
            <div key={step.number} className="flex items-start flex-1 cursor-pointer" onClick={() => onStepClick && onStepClick(step.number)}>
              {/* Step circle + text */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                    isActive
                      ? "bg-[#3d2a2a] text-white border-[#3d2a2a]"
                      : isCompleted
                      ? "bg-[#b8862f] text-white border-[#b8862f]"
                      : "bg-transparent text-[#a09080] border-[#d5ccc3]"
                  }`}
                >
                  {isCompleted ? "✓" : step.number}
                </div>
                <p
                  className={`mt-2 text-xs font-semibold ${
                    isActive ? "text-[#3d2a2a]" : "text-[#a09080]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-[#a09080] mt-0.5 max-w-[100px] leading-tight">
                  {step.sub}
                </p>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mt-5 mx-2">
                  <div
                    className={`h-[2px] w-full ${
                      isCompleted ? "bg-[#b8862f]" : "bg-[#e0d6cc]"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepperBar;
