import React from 'react';
import './Modal.css';



const Modal = ({ modalText = 'Please confirm...', setActionConfirmed, setModalShown }) => {
    return (
        <div className='modal-container'>
            <div className='dialog-box'>
                <h2 className='modal-heading'>Are you sure?</h2>
                <p className='modal-text'>{modalText}</p>
                <div className='modal-buttons-wrapper'>
                    <p className='modal-button' onClick={() => {setActionConfirmed(true); setModalShown(false)}}>Confirm</p>
                    <p className='modal-button' onClick={() => setModalShown(false)}>Cancel</p>
                </div>
            </div>
        </div>
    )
}

export default Modal
