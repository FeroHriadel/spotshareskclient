import React, { useState } from 'react';
import { auth } from '../firebase';
import Layout from '../components/Layout';
import Button from '../components/Button';
import BigCard from '../components/BigCard';
import './ForgotPassword.css';



const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('Please enter an email where we can send you a password-reset link:');



    const handleSubmit = async e => {
        e.preventDefault();

        if (!email) return setMessage('Email is required');

        const config = {
            url: process.env.REACT_APP_PASSWORD_FORGOT_REDIRECT,
            handleCodeInApp: true
        }

        await auth.sendPasswordResetEmail(email, config)
            .then(() => {
                setEmail('');
                setMessage('Please check your email and follow the instructions to change your password')
            })
            .catch(error => {
                setMessage(`Error: ${error && error.message ? error.message : 'Something went wrong'}`);
            });    
    }



    return (
        <div className='forgot-password-page-container'>
            <Layout>
                <BigCard>

                        {message && <p className='message'>{message}</p>}

                        <input 
                            type='email'
                            name='email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <Button action={handleSubmit} buttonText='Submit' />

                </BigCard>
            </Layout>
        </div>
    )
}



export default ForgotPassword
