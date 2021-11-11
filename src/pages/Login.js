import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { useHistory } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SmallCard from '../components/SmallCard';
import { auth, googleAuthProvider } from '../firebase';
import { useMutation } from '@apollo/react-hooks';
import { USER_CREATE } from '../graphql/mutations'; //signup and signin do the same thing
import './Login.css';
import Meta from '../components/Meta';



const Login = () => {
    //STATE
    const [message, setMessage] = useState('Sign in with email & password or sign in with Google');
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const { email, password } = values;



    //DEFS
    const history = useHistory();
    const { state, dispatch } = useContext(AuthContext);
    const [userCreate] = useMutation(USER_CREATE, {
        onCompleted: (data) => {
            if (data.userCreate.role === 'admin') {
                setMessage('You are now logged in. Redirecting...');
                setTimeout(() => {
                    dispatch({
                        type: 'LOGGED_IN_USER',
                        payload: {...state.user, role: 'admin'}
                    });
                }, 2000);

            } else {
                setMessage('You are now logged in. Redirecting...');
                setTimeout(() => {
                    dispatch({
                        type: 'LOGGED_IN_USER',
                        payload: {...state.user, role: 'user'}
                    });
                }, 2000);
            }
        },
        onError: () => setMessage('Sorry, something went wrong')
    });



    //REDIRECT LOGGED-IN USERS AWAY
    useEffect(() => {
        if (state && state.user && state.user.role === 'admin') {
            history.push('/admin');
            return;
        }

        if (state && state.user && state.user.role === 'user') {
            history.push('/profile');
        }
    }, [state])



    //CHANGE HANDLER
    const handleChange = e => {
        setMessage('');
        setValues({...values, [e.target.name]: e.target.value});
    }



    //SUBMIT HANDLER (LOGIN w. EMAIL & PASSWORD)
    const handleSubmit = async e => {
        e.preventDefault();

        if (!email) return setMessage('Please enter your email');
        if (!password) return setMessage('Please enter your password');

        try {
            await auth.signInWithEmailAndPassword(email, password).then(async result => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();

                // dispatch({
                //     type: 'LOGGED_IN_USER',
                //     payload: {email: user.email, token: idTokenResult.token}
                // });

                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {email: user.email, token: idTokenResult.token}
                });

                userCreate();
            })

        } catch (error) {
            setMessage(`Error: ${error && error.message ? error.message : error}`)
        }
    }



    //LOGIN WITH GOOGLE
    const googleLogin = (e) => {
        e.preventDefault(); //must be here => stupid <form /> thinks the button is a submit button => must preventDefault()

        try {
            auth.signInWithPopup(googleAuthProvider).then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();
    
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: { email: user.email, token: idTokenResult.token }
                });

                console.log(idTokenResult.token) //
    
                userCreate();
            });

        } catch (error) {
            setMessage(`Error: ${error}`);
        }
    };




    //FORM HTML
    const showLoginForm = () => (
        <form className='login-form'>
            <h1>Log In</h1>

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

            <p className='forgot-password' onClick={() => history.push('/forgotpassword')}>Forgot password?</p>

            <div className='buttons-container'>
                <Button action={handleSubmit} buttonText='Login' />
                <Button action={googleLogin} buttonText='Login w/ Google' />
            </div>
        </form>
    );



    return (
        <div className='login-page-container'>
            <Meta />
            <Layout>
                <SmallCard>
                    {showLoginForm()}
                </SmallCard>
            </Layout>
        </div>
    )
}

export default Login
