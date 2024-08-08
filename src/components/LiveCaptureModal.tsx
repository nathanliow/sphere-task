import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Button from '@/components/Button';
import Image from 'next/image';

interface LiveCaptureModalProps {
    isActive: boolean;
    documentType: string;
    onCapture: (frontImageSrc: string | null, backImageSrc: string | null) => void;
    onCancel: () => void;
}

const LiveCaptureModal: React.FC<LiveCaptureModalProps> = ({ isActive, documentType, onCapture, onCancel }) => {
    const webcamRef = useRef<Webcam>(null);
    const [state, setState] = useState<{
        step: 'front' | 'back';
        frontImageSrc: string | null;
        backImageSrc: string | null;
    }>({ step: 'front', frontImageSrc: null, backImageSrc: null });

    const handleCapture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (documentType === 'SELFIE') {
                setState({ step: 'front', frontImageSrc: imageSrc, backImageSrc: null });
            } else {
                setState(prev => ({
                    ...prev,
                    [prev.step === 'front' ? 'frontImageSrc' : 'backImageSrc']: imageSrc,
                }));
            }
        }
    }, [webcamRef, documentType]);

    const handleRetake = () => {
        if (documentType === 'SELFIE') {
            setState({ step: 'front', frontImageSrc: null, backImageSrc: null });
        } else {
            setState(prev => ({
                ...prev,
                [prev.step === 'front' ? 'frontImageSrc' : 'backImageSrc']: null,
            }));
        }
    };

    const handleNextStep = () => {
        if (state.step === 'front') {
            setState(prev => ({ ...prev, step: 'back' }));
        } else {
            onCapture(state.frontImageSrc, state.backImageSrc);
        }
    };

    const handleUsePhoto = () => {
        onCapture(state.frontImageSrc, null);
    };

    useEffect(() => {
        if (isActive) {
            setState({ step: 'front', frontImageSrc: null, backImageSrc: null });
        }
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg flex flex-col w-3/4 items-center gap-6">
                {(documentType != "SELFIE") &&
                    <div className="text-black text-2xl font">
                        {state.step === 'front' ? 'Front Side' : 'Back Side'}
                    </div>
                }
                {(state.step === 'front' && state.frontImageSrc) || (state.step === 'back' && state.backImageSrc) ? (
                    state.step === 'front' && state.frontImageSrc ? (
                        <Image 
                            src={state.frontImageSrc} 
                            alt="Captured front" 
                            width={1280} 
                            height={720} 
                            className="" />
                    ) : (
                        state.step === 'back' && state.backImageSrc && (
                            <Image 
                                src={state.backImageSrc} 
                                alt="Captured back" 
                                width={1280} 
                                height={720} 
                                className="" />
                        )
                    )
                ) : (
                    <Webcam
                        audio={false}
                        height={720}
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        width={1280}
                        videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
                    />
                )}
                <div className="flex justify-center gap-12">
                    {state.frontImageSrc && documentType === 'SELFIE' ? (
                        <>
                            <Button variant="tertiary" onClick={handleRetake}>
                                Retake photo
                            </Button>
                            <Button variant="primary" onClick={handleUsePhoto}>
                                Use photo
                            </Button>
                        </>
                    ) : (state.step === 'front' && state.frontImageSrc) || (state.step === 'back' && state.backImageSrc) ? (
                        <>
                            <Button variant="tertiary" onClick={handleRetake}>
                                Retake photo
                            </Button>
                            <Button variant="primary" onClick={handleNextStep}>
                                {state.step === 'front' ? 'Next: Capture Back' : 'Use photos'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="tertiary" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleCapture}>
                                Capture photo
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveCaptureModal;
