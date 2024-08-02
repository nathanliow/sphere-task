import React from 'react';
import '@/app/loading.css';

const Loading = () => {
    return (
        <svg
            className="loading-container"
            viewBox="0 0 40 40"
            height="40"
            width="40"
        >
            <circle 
                className="loading-car"
                cx="20" 
                cy="20" 
                r="17.5" 
                pathLength="100" 
                strokeWidth="5px" 
                fill="none" 
            />
        </svg>
    );
};

export default Loading;
