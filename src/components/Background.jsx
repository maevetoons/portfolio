import React from 'react';
import './Background.css';

const Background = ({ children }) => {
    return (
        <div className="background-wrapper">
            {children}
        </div>
    );
};

export default Background;
