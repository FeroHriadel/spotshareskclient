import React, { useState } from 'react';
import { auth } from '../firebase';
import Button from './Button';
import './ResetPassword.css';


const ResetPassword = ({ scrollDown }) => {
    //VALUES
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordMessage, setNewPasswordMessage] = useState('Please enter your new password');



    //SUBMIT HANDLER
    const handleSubmit = async e => {
        e.preventDefault();

        if (newPassword.length < 6) return setNewPasswordMessage('Password must be at least 6 characters long');

        auth.currentUser.updatePassword(newPassword)
            .then(() => {
                setNewPasswordMessage('Password Updated');
                setTimeout(() => {
                    setShowResetPassword(false);
                }, 1000);
            })
            .catch(error => {
                setNewPasswordMessage('Password update failed');
                console.log(error);
            })
    }
    


    //RENDER
    return (
        <div className='reset-password-container'>
            <Button 
                action={() => {
                    setShowResetPassword(!showResetPassword);
                    setTimeout(() => {
                        scrollDown()
                    }, 50); //must wait a little for form to appear first, then scroll
                }} 
                buttonText='Reset Password' 
            />

            {
                showResetPassword
                &&
                <form onSubmit={handleSubmit}>
                    <label htmlFor='newpassword'>{newPasswordMessage}</label>
                    <input
                        type='password'
                        name='newpassword'
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                    <input type='submit' value='Change' />
                </form>
            }
        </div>
    )
}

export default ResetPassword
