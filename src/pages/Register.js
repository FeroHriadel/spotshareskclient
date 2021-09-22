import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useHistory  } from 'react-router-dom';
import Layout from '../components/Layout';
import SmallCard from '../components/SmallCard';
import './Register.css';
import Button from '../components/Button';
import { auth } from '../firebase';



const Register = () => {
    //VALUES
    const [message, setMessage] = useState('Please enter your email and create your password')
    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const { email, password } = values;



    //REDIRECT LOGGED-IN USERS AWAY
    const { state } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        if (state && state.user) {
            history.push('/')
        }
    }, [state])



    //CHANGE HANDLER
    const handleChange = e => {
        setMessage('');
        setValues({...values, [e.target.name]: e.target.value})
    }



    //SUBMIT HANDLER
    const handleSubmit = async e => {
        e.preventDefault();

        if (!email) return setMessage('Email is required');
        if (!email.includes('.') || !email.includes('@')) return setMessage('Your email does not appear to be right');
        if (!password || password.length < 6) return setMessage('Password with min. 6 characters is required');

        const config = {
            url: process.env.REACT_APP_REGISTRATION_REDIRECT,
            handleCodeInApp: true
        }

        await auth.sendSignInLinkToEmail(email, config);
        localStorage.setItem('registrationEmail', email);
        localStorage.setItem('registrationPassword', password);

        setMessage('Please check your email to complete registration');
    }



    //FORM HTML
    const showRegisterForm = () => (
        <form className='register-form'>
            <h1>Register</h1>

            <div className='form-group'>
                <label  htmlFor='email'>email: </label>
                <input 
                    type='email'
                    name='email'
                    value={email}
                    onChange={handleChange}
                />
            </div>

            <div className='form-group'>
                <label  htmlFor='password'>password: </label>
                <input 
                    type='password'
                    name='password'
                    value={password}
                    onChange={handleChange}
                />
            </div>

            {message && <p className='message'>{message}</p>}

            <Button action={handleSubmit} buttonText='Submit'>Submit</Button>
        </form>
    );



    //RENDER
    return (
        <div className='register-page-container'>
            <Layout>
                <SmallCard>
                    {showRegisterForm()}
                </SmallCard>
            </Layout>
        </div>
    )
}

export default Register
