import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { PUBLIC_PROFILE } from '../graphql/queries';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import './PublicProfile.css';



const PublicProfile = () => {
    //DEFS & VALUES
    const params = useParams();
    const history = useHistory();
    const [message, setMessage] = useState('');



    //GET PUBLIC PROFILE
    const [publicProfile, { data, loading, error }] = useLazyQuery(PUBLIC_PROFILE, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            setMessage('');
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
            setMessage('Error. ', error);
        }
    })

    useEffect(() => {
        if (!params.username) setMessage('Something went wrong. Username is required');
        else {
            let username = params.username;
            setMessage('Getting user...')
            publicProfile({
                variables: {input: {username}}
            })
        }

    }, [params]);



    //RENDER
    if (loading) {
        return (
            <div className='public-profile-container'>
                <Layout>
                    <BigCard heading='PUBLIC PROFILE'>
                        <p className='message'>Loading...</p>
                    </BigCard>
                </Layout>
            </div>
        )
    }

    if (error) {
        return (
            <div className='public-profile-container'>
                <Layout>
                    <BigCard heading='PUBLIC PROFILE'>
                        <p className='message'>{message} Click the button bellow to go back.</p>
                        <div 
                            className='btn' 
                            onClick={() => history.goBack()}
                            style={{
                                position: `absolute`,
                                left: `50%`,
                                transform: `translate(-50%)`,
                                marginTop: `0`
                            }}
                            > 
                                <p>Back</p> 
                        </div>
                    </BigCard>
                </Layout>
            </div>
        )
    }

    return (
        <div className='public-profile-container'>
            <Layout>

                <BigCard heading='PUBLIC PROFILE'>               
            
                    {
                        data && data.publicProfile
                        &&
                        <React.Fragment>
                            <div 
                                className='image-div' 
                                style={data.publicProfile.image.url !== 'nophoto'
                                ? 
                                {background: `url{${data.publicProfile.image.url}} no-repeat center center/cover`}
                                :
                                {}
                            } />

                            <h2>{data.publicProfile.username}</h2>
                            {data.publicProfile.about ? <p className='text'>{data.publicProfile.about}</p> : <p className='text'>User has not shared any information about themselves yet</p>}

                            <div className='btn' onClick={() => history.goBack()}> <p>Back</p> </div>
                        </React.Fragment>                        
                    }


                </BigCard>
            </Layout>
        </div>
    )
}



export default PublicProfile
