import React from 'react';
import './SmallCard.css';



const SmallCard = ({ children }) => {
    return (
        <div className='small-card-container'>
            {children}
        </div>
    )
}

export default SmallCard
