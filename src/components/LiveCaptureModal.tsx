import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Button from '@/components/Button';

interface LiveCaptureModalProps {
    isActive: boolean;
    onCapture: (imageSrc: string | null) => void; 
    onCancel: () => void;
}

const LiveCaptureModal: React.FC<LiveCaptureModalProps> = ({ isActive, onCapture, onCancel }) => {
    const webcamRef = useRef<Webcam>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const handleCapture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
        }
    }, [webcamRef]);

    const handleRetake = () => {
        setCapturedImage(null);
    };

    const handleUsePhoto = () => {
        onCapture(capturedImage); 
    };

    useEffect(() => {
        if (isActive) {
            setCapturedImage(null);
        }
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg flex flex-col w-3/4 items-center gap-6">
                {capturedImage ? (
                    <img src={capturedImage} alt="Captured" className="" />
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
                    {capturedImage ? (
                        <>
                            <Button variant="tertiary" onClick={handleRetake}>
                                Retake photo
                            </Button>
                            <Button variant="primary" onClick={handleUsePhoto}>
                                Use photo
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
