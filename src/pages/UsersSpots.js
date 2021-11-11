import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
import { USERS_SPOTS } from '../graphql/queries';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import './UsersSpots.css';
import Meta from '../components/Meta';



const UsersSpots = () => {
    //VALUES & DEFS
    const [message, setMessage] = useState('Loading...');
    const history = useHistory('');
    const params = useParams();



    //GET USER'S SPOTS
    const [usersSpots, { data, loading, error }] = useLazyQuery(USERS_SPOTS, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            if (data && data.userSpots && data.userSpots.length < 1) setMessage('User doesnt seem to have any spots yet');
            else setMessage('');
        },
        onError: (error) => {
            console.log(error);
            setMessage(`Error. ${error}`);
        }
    });

    useEffect(() => {
        const username = params.username;
        setMessage('Getting users spots...');
        usersSpots({variables: {input: {username}}});
    }, [params]);




    //RENDER
    if (loading) return (
        <div className='users-spots-page-container'>
            <Layout>
                <BigCard heading='USERS SPOTS'>
                    {message && <p className='message'>{message}</p>}
                </BigCard>
            </Layout>
        </div>
    );

    if (error) return (
        <div className='users-spots-page-container'>
            <Layout>
                <BigCard heading='USERS SPOTS'>
                    {message && <p className='message'>{message}</p>}
                </BigCard>
            </Layout>
        </div>
    )

    return (
        <div className='users-spots-page-container'>

            <Meta />

            <Layout>
                <BigCard heading='USERS SPOTS'>
                    {message && <p className='message'>{message}</p>}

                    {
                        data && data.usersSpots
                        &&
                        <ul className='user-spots-list'>
                            {data.usersSpots.map(spot => (
                                <li key={spot.name} className='list-item' onClick={() => history.push(`/spot/${spot.slug}`)}>
                                    <div 
                                        className='spot-image' 
                                        style={{
                                            background: `url(${spot.images[0].url}) no-repeat center center/cover`,
                                            width: `100px`,
                                            minWidth: `100px`,
                                            height: `100px`,
                                            borderRadius: `50%`,
                                            margin: `1rem`,
                                            boxShadow: `-2.5px 2.5px 5px #333`
                                        }}
                                    />

                                    <div className='spot-info'>
                                        <h3 className='spot-name'>{spot.name}</h3>
                                        <p className='spot-highlight'>{spot.highlight}</p>
                                        <p className='spot-category'>{spot.category.name}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </BigCard>
            </Layout>
        </div>
    )
}



export default UsersSpots
