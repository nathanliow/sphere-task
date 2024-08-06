import React from 'react';
import '@/app/loading.css';

const Loading = ({size = 40}) => {
    return (
        <svg
            className="loading-container"
            viewBox={`0 0 ${size} ${size}`}
            height={size}
            width={size}
        >
            <circle 
                className="loading-car"
                cx={size/2}
                cy={size/2}
                r="17.5" 
                pathLength="100" 
                strokeWidth="5px" 
                fill="none" 
            />
        </svg>
    );
};

export default Loading;
