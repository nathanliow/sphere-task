import React from 'react';
import '@/app/loading.css';

type LoadingProps = {
    size?: number;
    color?: string;
};

const Loading: React.FC<LoadingProps> = ({ size = 40, color = "#2C61F9" }) => {
    return (
        <svg
            className="loading-container"
            style={{ '--uib-color': color } as React.CSSProperties}
            viewBox={`0 0 ${size} ${size}`}
            height={size}
            width={size}
        >
            <circle 
                className="loading-car"
                cx={size / 2}
                cy={size / 2}
                r="17.5" 
                pathLength="100" 
                strokeWidth="5px" 
                fill="none" 
            />
        </svg>
    );
};

export default Loading;
