import React, { useState } from 'react';
import Button from '@/components/Button';

// icons
import Loading from "@/components/Loading";
import { HiOutlineIdentification } from "react-icons/hi2";
import { CiCamera } from "react-icons/ci";
import { FaChevronLeft } from 'react-icons/fa';
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";

const Kyc = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    };

    const handlePrev = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
    };

    const steps = [
        {
            title: 'Verification for Sphere Labs',
            content: (
                <div className="flex flex-col justify-center items-center gap-8">
                    <div className="text-black text-md font-bold w-3/4">
                        You’re about to submit sensitive data to Sphere Labs. 
                        If you received this link from a suspicious source, 
                        please close this page and notify us immediately.
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-hor gap-4">
                            <div className="flex items-center justify-center bg-gray rounded-full p-2">
                                <HiOutlineIdentification size={40}/>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-dark-gray text-md font-bold">Step 1</div>
                                <div className="text-black text-md">Provide identity document</div>
                            </div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <div className="flex items-center justify-center bg-gray rounded-full p-2">
                                <CiCamera size={40} />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-dark-gray text-md font-bold">Step 2</div>
                                <div className="text-black text-md">Perform a liveness check with a selfie</div>
                            </div>
                        </div>
                    </div>
                </div>        
            ),
        },
        {
            title: 'Provide your identity document',
            content: (
                <div className="flex flex-col justify-center items-center gap-6">
                    <div className="flex flex-hor gap-6">
                        <div className="flex flex-col items-center border-2 border-gray p-12 rounded-[20px]">
                            <CiCamera size={40} />
                            <div className="text-black text-sm font-bold">Take a photo</div>
                        </div>
                        <div className="flex flex-col items-center border-2 border-gray p-12 rounded-[20px]">
                            <MdOutlineFileUpload size={40} />
                            <div className="text-black text-sm font-bold">Upload a file</div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="text-black text-md font-bold">Tips</div>
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Upload a colored photo or file</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Take a photo in a well lit room</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCloseCircleOutline size={24} color={'red'}/>
                            <div className="text-black text-md">Don't edit images of your document</div>
                        </div>
                    </div>
                </div>     
            ),
        },
        {
            title: 'Upload a selfie',
            content: (
                <div className="flex flex-col justify-center items-center gap-6">
                    <div className="flex flex-col items-center border-2 border-gray p-12 rounded-[20px]">
                        <CiCamera size={40} />
                        <div className="text-black text-sm font-bold">Take a photo</div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="text-black text-md font-bold">Tips</div>
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Find a well lit place</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Ensure your face is within the frame</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCloseCircleOutline size={24} color={'red'}/>
                            <div className="text-black text-md">Don't wear hats, glasses, and masks</div>
                        </div>
                    </div>
                </div> 
            ),
        },
        {
            title: 'We are processing your data',
            content: (
                <div className="flex flex-col justify-center items-center gap-8">
                     <Loading/>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Identification</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Selfie</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCloseCircleOutline size={24} color={'red'}/>
                            <div className="text-black text-md">Finish</div>
                        </div>
                    </div>
                </div> 
            ),
        },
    ];

    return (
        <div className="w-full h-full">
            {/* progress bars */}

            <div className="flex flex-col relative items-center border-2 border-gray p-8 rounded-[20px] gap-10">
                {currentStep > 0 && (
                    <FaChevronLeft
                        onClick={handlePrev}
                        className="absolute top-8 left-8 text-xl cursor-pointer"
                    />
                )}
                <div className="text-black text-xl font-bold">{steps[currentStep].title}</div>
                <div>{steps[currentStep].content}</div>

                {currentStep < steps.length - 1 && (<div className="flex flex-col justify-center w-1/2">
                    <Button variant="secondary" onClick={handleNext}>
                        Continue
                    </Button>
                </div>)}
            </div>
        </div>
        
    );
};

export default Kyc;
