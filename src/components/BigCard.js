import React from 'react';
import './BigCard.css';



const BigCard = ({ children, heading = '' }) => {
    return (
        <div className='big-card-container'>
            <h1 className='heading'>{heading}</h1>
            <div className='content-wrapper'>
                {children}
            </div>
        </div>
    )
}

export default BigCard
