import React from 'react';
import './AdminOption.css';



const AdminOption = ({ header, text, action }) => {
    return (
        <div className='admin-option' onClick={action}>
            <h3>{header}</h3>
            <p>{text}</p>
        </div>
    )
}



export default AdminOption
