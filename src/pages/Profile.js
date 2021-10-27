import React, { useState, useMemo, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import omitDeep from 'omit-deep';
import { PROFILE } from '../graphql/queries';
import { USER_UPDATE } from '../graphql/mutations';
import Layout from '../components/Layout';
import SmallCard from '../components/SmallCard';
import Button from '../components/Button';
import FileUploadSingle from '../components/FileUploadSingle';
import ResetPassword from '../components/ResetPassword';
import './Profile.css';




const Profile = () => {
    //ROUTER
    const history = useHistory();


    //VALUES 
    const [message, setMessage] = useState('');
    const [values, setValues] = useState({
        username: '',
        image: {},
        about: '',
    });
    const { username, image, about } = values;

    

    //QUERY & MUTATION
    const { data, error, loading } = useQuery(PROFILE);

    const [userUpdate] = useMutation(USER_UPDATE, {
        update: ({ data }) => {
            console.log('Profile updated:', data);
            setMessage('Your profile has been changed');
        },
        onError: () => {
            setMessage('Profile update failed');
        }
    });



    //PREFILL FORM
    useMemo(() => {
        if (data) {
            setValues({
                username: data.profile.username,
                about: data.profile.about === null ? '' : data.profile.about,
                image: omitDeep(data.profile.image, ["__typename"])
            });
        }

        if (!data && error) {
            setMessage('Error. Something went wrong.')
        }
    }, [data, error]);



    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();
        userUpdate({variables: {input: values}});
    }



    //SCROLL DOWN
      //reset password button (in <ResetPassword />) will scroll down to the form it opens
    const wrapper = useRef(); 

    const scrollDown = () => {
        wrapper.current.scrollTop = wrapper.current.scrollTop + 100;
    }



    //RENDER
    if (loading) return (
        <Layout>
            <SmallCard>
                <div ref={wrapper} className='profile-page-content'>
                    <h1>My Profile</h1>
                    <h3 className='message'>Loading...</h3>
                </div>
            </SmallCard>
        </Layout>
    )

    return (
        <Layout>
            <SmallCard>
                <div ref={wrapper} className='profile-page-content'>
                    <h1>My Profile</h1>

                    <FileUploadSingle values={values} setValues={setValues} setMessage={setMessage} />

                    {
                        message && <h3 className='message'>{message}</h3>
                    }

                   <form>
                        <div className='form-group'>
                            <label htmlFor='username'>username:</label>
                            <input 
                                name='username'
                                value={username}
                                onChange={e => setValues({...values, username: e.target.value})}
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label htmlFor='about'>about:</label>
                            <input 
                                name='about'
                                value={about}
                                onChange={e => setValues({...values, about: e.target.value})}
                                maxLength='255'
                            />
                        </div>
                        
                        <Button action={handleSubmit} buttonText='Submit Changes' />
                   </form>

                   <ResetPassword scrollDown={scrollDown} />

                </div>
            </SmallCard>
        </Layout>
    )
}

export default Profile
