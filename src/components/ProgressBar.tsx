// components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
    currentStep: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
    const stepNames = [
        "INTRODUCTION",
        "SELECT_DOCUMENT",
        "UPLOAD_DOCUMENT",
        "UPLOAD_SELFIE",
        "PROCESSING",
        "VERIFIED",
        "TEMP_REJECT",
        "FINAL_REJECT"
    ];

    const progressData = [
        { name: "Identification", isFilled: false, isHalfFilled: false },
        { name: "Selfie", isFilled: false, isHalfFilled: false },
        { name: "Finish", isFilled: false, isHalfFilled: false },
    ];

    const currentStepIndex = stepNames.indexOf(currentStep);
    if (currentStepIndex >= 1) { // SELECT_DOCUMENT
        progressData[0].isHalfFilled = true; 
    }
    if (currentStepIndex >= 2) { // UPLOAD_DOCUMENT
        progressData[0].isHalfFilled = true; 
    }
    if (currentStepIndex >= 3) { // UPLOAD_SELFIE
        progressData[0].isHalfFilled = false;
        progressData[0].isFilled = true;
        progressData[1].isHalfFilled = true; 
    }
    if (currentStepIndex >= 4) {
        progressData[1].isHalfFilled = false;
        progressData[1].isFilled = true; // PROCESSING
        progressData[2].isHalfFilled = true;
    }
    if (currentStepIndex >= 5) {
        progressData[2].isFilled = true; // VERIFIED
    }

    return (
        <div className="flex flex-hor gap-4">
            {progressData.map((step, index) => (
                <div key={index} className="flex flex-col w-full items-center">
                    <div className={`mb-2 font-semibold ${step.isHalfFilled ? 'text-black' : 'text-gray'}`}>
                        {step.name}
                    </div>
                    <div className="h-2 bg-light-gray rounded w-4/5">
                        <div
                            className={`h-full rounded transition-all duration-300`}
                            style={{
                                width: step.isFilled ? '100%' : step.isHalfFilled ? '50%' : '0%',
                                background: step.isFilled 
                                    ? 'linear-gradient(90deg, #3A76FF, #27D6FF)' 
                                    : step.isHalfFilled 
                                        ? 'linear-gradient(90deg, #3A76FF, #27D6FF)' 
                                        : 'transparent',
                                opacity: step.isFilled || step.isHalfFilled ? 1 : 0.5,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;
