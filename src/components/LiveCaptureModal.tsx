import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Button from '@/components/Button';

interface LiveCaptureModalProps {
    isActive: boolean;
    onCapture: (frontImageSrc: string | null, backImageSrc: string | null) => void;
    onCancel: () => void;
}

const LiveCaptureModal: React.FC<LiveCaptureModalProps> = ({ isActive, onCapture, onCancel }) => {
    const webcamRef = useRef<Webcam>(null);
    const [state, setState] = useState<{
        step: 'front' | 'back';
        frontImageSrc: string | null;
        backImageSrc: string | null;
    }>({ step: 'front', frontImageSrc: null, backImageSrc: null });

    const handleCapture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setState(prev => ({
                ...prev,
                [prev.step === 'front' ? 'frontImageSrc' : 'backImageSrc']: imageSrc,
            }));
        }
    }, [webcamRef]);

    const handleRetake = () => {
        setState(prev => ({
            ...prev,
            [prev.step === 'front' ? 'frontImageSrc' : 'backImageSrc']: null,
        }));
    };

    const handleNextStep = () => {
        if (state.step === 'front') {
            setState(prev => ({ ...prev, step: 'back' }));
        } else {
            onCapture(state.frontImageSrc, state.backImageSrc);
        }
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
                <div className="text-black text-2xl font">
                    {state.step === 'front' ? 'Front Side' : 'Back Side'}
                </div>
                {(state.step === 'front' && state.frontImageSrc) || (state.step === 'back' && state.backImageSrc) ? (
                    <img src={state.step === 'front' ? state.frontImageSrc : state.backImageSrc} alt="Captured" className="" />
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
                    {(state.step === 'front' && state.frontImageSrc) || (state.step === 'back' && state.backImageSrc) ? (
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
