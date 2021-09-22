import React from 'react';
import './Button.css';



const Button = ({ action, buttonText }) => {
    return (
        <button className='button' onClick={action}>{buttonText}</button>
    )
}

export default Button
