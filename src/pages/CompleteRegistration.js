import React, { useState, useContext } from 'react';
import Background from '../components/Background';
import BigCard from '../components/BigCard';
import Button from '../components/Button';
import './CompleteRegistration.css';
import { auth } from '../firebase';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { useMutation } from '@apollo/react-hooks';
import { USER_CREATE } from '../graphql/mutations';
import Meta from '../components/Meta';



const CompleteRegistration = () => {
    //STATE
    const [message, setMessage] = useState('Please click the button below to complete the registration process and create your account.');
    


    //DEFS
    const history = useHistory();
    const { dispatch } = useContext(AuthContext);
    const [userCreate] = useMutation(USER_CREATE, {
        update: ({ data }) => {
            console.log(data)
            setMessage('Thank you for registering! Redirecting...');
            setTimeout(() => {
                history.push('/profile')
            }, 2500)
        },
        onError: () => setMessage('Sorry, something went wrong')
    });



    //SUBMIT HANDLER
    const handleSubmit = async e => {
        e.preventDefault();

        try {
            //signin to firebase with email
            const result = await auth.signInWithEmailLink(localStorage.getItem('registrationEmail'), window.location.href);
            if (result.user.emailVerified) {
                localStorage.removeItem('registrationEmail');

                //set password in firebase
                let user = auth.currentUser;
                await user.updatePassword(localStorage.getItem('registrationPassword'));
                localStorage.removeItem('registrationPassword');
                
                //get token from firebase
                const idTokenResult = await user.getIdTokenResult();

                //put email & token to Context
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {email: user.email, token: idTokenResult.token, role: 'user'}
                })

                //trigger userCreate mutation
                userCreate();
            }
            
        } catch (error) {
            setMessage(`Error: ${error & error.message ? error.message : error}`);
        }
    }



    return (
        <div className='complete-registration-page-container'>

            <Meta />

            <Background />

            <BigCard heading='PLEASE CONFIRM REGISTRATION'>
                {message && <p>{message}</p>}
                <Button action={handleSubmit} buttonText='Register' />
            </BigCard>
        </div>
    )
}

export default CompleteRegistration
