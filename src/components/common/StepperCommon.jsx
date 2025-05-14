const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex w-full gap-x-2">
      {steps.map((step, index) => {
        // Determine step status
        const isActive = index === currentStep;

        // Set colors based on status
        let bgColor = "bg-gray-200"; // default for upcoming steps
        if (isActive) {
          bgColor = "bg-blue-500";
        }

        // Text color
        let textColor = "text-gray-700";
        if (isActive) {
          textColor = "text-white";
        }

        // Keep the exact same arrow shape as before
        const arrowShape =
          index === 0
            ? {
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
              }
            : index === steps.length - 1
            ? {
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
                marginLeft: "-20px",
              }
            : {
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
                marginLeft: "-20px",
              };

        return (
          <div key={index} className="flex-1">
            <div
              className={`h-10 flex items-center justify-center ${bgColor} ${textColor} font-medium relative transition-colors`}
              style={arrowShape}
            >
              <span className="z-10 px-4 text-sm truncate">{step}</span>

              {/* Add subtle separator between steps */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-0 h-full w-[1px] bg-white/20" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function StepperCommon({ steps, currentStep }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Stepper steps={steps} currentStep={currentStep} />
    </div>
  );
}
