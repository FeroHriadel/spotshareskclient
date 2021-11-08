import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_USERS } from '../graphql/queries';
import { useHistory } from 'react-router-dom';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import userPng from '../images/user.png';
import './SearchUsers.css';


const SearchUsers = () => {
    //VALUES & DEFS
    const history = useHistory();
    const [message, setMessage] = useState('');



    //QUERY
    const { data, loading, error } = useQuery(GET_USERS, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            console.log(data.getUsers);
        },
        onError: (error) => {
            console.log('Error. Users could not be found');
        }
    })



    //RENDER
    return (
        <Layout>
            <BigCard heading='USERS'>
                <div className='search-users-wrapper'>
                    
                    {loading && <p className='message'>Loading...</p>}

                    {error && <p className='message'>Error. Users could not be found.</p>}

                    {
                        !loading && !error && data && data.getUsers.length < 1
                        &&
                        <p className='message'>No users found.</p>
                    }

                    {
                        data && data.getUsers.length >= 1
                        &&
                        <ul className='user-list'>
                            {
                                data.getUsers.map(user => (
                                    <li key={user._id} className='user-list-item'>
                                        {
                                            user.image.url === 'nophoto'
                                            ?
                                            <div style={{width: '75px', minWidth: '75px', height: '75px', minHeight: '75px', borderRadius: '50%', background: `url(${userPng}) no-repeat center center/cover`, boxShadow: '0 0 5px rgba(0, 0, 0, 0.6)'}} className='photo' />
                                            :
                                            <div style={{width: '75px', minWidth: '75px', height: '75px', minHeight: '75px', borderRadius: '50%', background: `url(${user.image.url}) no-repeat center center/cover`, boxShadow: '0 0 5px rgba(0, 0, 0, 0.6)'}} className='photo' />
                                        }

                                        <div className='user-details'>
                                            <p>{user.username}</p>
                                            <p>joined: {new Date(user.createdAt).toLocaleDateString('en-US')}</p>
                                            <div className='buttons-section'>
                                                <div 
                                                    className='btn'
                                                    onClick={() => history.push(`/usersspots/${user.username}`)}
                                                > 
                                                    <p>User's spots</p> 
                                                </div>
                                                <div 
                                                    className='btn'
                                                    onClick={() => history.push(`publicprofile/${user.username}`)}
                                                > 
                                                    <p>User's profile</p> 
                                                </div>
                                            </div>
                                        </div>

                                    </li>
                                ))
                            }
                        </ul>
                    }


                </div>
            </BigCard>
        </Layout>
    )
}

export default SearchUsers
