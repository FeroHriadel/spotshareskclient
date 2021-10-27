import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GET_SPOT } from '../graphql/queries';
import { SPOT_LIKE } from '../graphql/mutations';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import TagImage from '../components/TagImage';
import MapModal from '../components/MapModal';
import SpotGallery from '../components/SpotGallery';
import { FaThumbsUp } from 'react-icons/fa';
import './Spot.css';




const Spot = () => {
    //VALUES
    const [mapModalShown, setMapModalShown] = useState(false);
    const [spotGalleryShown, setSpotGalleryShown] = useState(false);



    //GET SPOT BY SLUG FROM PARAMS
    const params = useParams();

    const [getSpot, { error, loading, data }] = useLazyQuery(GET_SPOT, {fetchPolicy: "no-cache"});

    useEffect(() => {
        const slug = params.spotslug;
        getSpot({variables: {slug}});
    }, [params]);



    //LIKE SPOT
    const [likeMessage, setLikeMessage] = useState('');
    const [spotLike] = useMutation(SPOT_LIKE, {
        onError: (error) => {
            console.log(error);
            setLikeMessage(error && error.message ? error.message : 'Spot like failed, sorry');
            setTimeout(() => {
                setLikeMessage('')
            }, 2000);
        }
    });




    //RENDER
    if (error) {
        return (
            <Layout>
                <BigCard>
                    {
                        error && error.message
                        ? 
                        <p>{error.message}</p>
                        :
                        <p className='spot-page-message'>Error. Something went wrong</p>
                    }
                </BigCard>
            </Layout>
        )
    }

    if (loading) {
        return (
            <Layout>
                <BigCard>
                    <p className='spot-page-message'>Loading...</p>
                </BigCard>
            </Layout>
        )
    }

    return (
        <Layout>

            {mapModalShown && <MapModal lat={data.getSpot.lat} long={data.getSpot.long} setMapModalShown={setMapModalShown} />}

            {spotGalleryShown && <SpotGallery images={data.getSpot.images} setSpotGalleryShown={setSpotGalleryShown} />}

            <BigCard heading={data && data.getSpot ? `${data.getSpot.name.toUpperCase()}` : ''}>

                {data && <h3 className='spot-page-highlight'>{data.getSpot.highlight}</h3>}

                {
                    data 
                    && 
                    <div className='spot-page-tags-box'>
                        {
                            data && data.getSpot.tags &&
                            data.getSpot.tags.map(tag => (
                                <TagImage key={Math.random()} tag={tag} />
                            ))
                        }
                    </div>
                }

                {
                    data
                    &&
                    <div className='spot-page-content'>
                        <div 
                            className='image-div'
                            style={{
                                background: `url(${data.getSpot.images[0].url}) no-repeat center center/cover`,
                                width: '260px',
                                minWwidth: '260px',
                                height: '260px',
                                minHeight: '260px',
                                borderRadius: '50%'
                            }}
                        />
                        
                        <p className='orange'>Category: <span className='details'>{(data.getSpot.category.name).charAt(0).toUpperCase() + data.getSpot.category.name.slice(1)}</span></p>

                        <p className='orange'>Tags:
                            {
                                data.getSpot.tags
                                &&
                                data.getSpot.tags.map(tag => (
                                    <span key={tag.name} className='details'>{tag.name} {' '}</span>
                                ))
                            }
                        </p>

                        <p className='orange'>Where: <span className='details'>{data.getSpot.where ? data.getSpot.where : 'No closer description provided. You can find the spot using the GPS coordinates below.'}</span></p>

                        <p className='orange'>GPS: <span className='details'>lat: {data.getSpot.lat}; long: {data.getSpot.long}</span></p>

                        <p className='orange'>Description: <span className='details'>{data.getSpot.description ? data.getSpot.description : 'The author did not add any description.'}</span></p>

                        <p className='orange'>Highlight: <span className='details'>{data.getSpot.highlight ? data.getSpot.highlight : 'The author did not provide any highlight'}</span> </p>

                        <p className='orange'>
                            Liked by: 
                            <span className='details'>
                                {data.getSpot.likes.length === 0 
                                    ? 
                                    'This spot has not been liked yet' 
                                    : 
                                    data.getSpot.likes.length === 1
                                    ?
                                    (data.getSpot.likes.length + ' person')
                                    :
                                    (data.getSpot.likes.length + ' people')}
                            </span>
                            <span 
                                title='Like this spot' 
                                className='details thumbs-up'
                                onClick={() => {
                                    spotLike({
                                        variables: {input: {slug: params.spotslug}}, 
                                        refetchQueries: [{query: GET_SPOT, variables: {slug: data.getSpot.slug}}]
                                    });
                                }}
                            >
                                <FaThumbsUp /> 
                                {likeMessage && <span className='details thumbs-up'>{likeMessage}</span>}
                            </span>
                        </p>

                        <p className='orange'>First Posted: <span className='details'>{new Date(data.getSpot.createdAt).toLocaleDateString('en-US')}</span></p>

                        <p className='orange'>Last Updated: <span className='details'>{new Date(data.getSpot.updatedAt).toLocaleDateString('en-US')}</span></p>

                        <p className='orange'>Posted By: <span className='details'>{data.getSpot.username ? data.getSpot.username : 'Unknown user'}</span></p>

                        <p 
                            className='orange'
                            onClick={() => setMapModalShown(true)}
                            style={{
                                cursor: 'pointer'
                            }}
                        >
                            Map: <span className='details'>Click here to show spot on map</span> 
                        </p>

                        <p 
                            className='orange'
                            onClick={() => setSpotGalleryShown(true)}
                            style={{
                                cursor: 'pointer'
                            }}
                        >
                            Gallery: 
                            <span className='details'>Click here to show spot gallery</span> 
                        </p>
                    </div>
                }

            </BigCard>
        </Layout>
    )
}

export default Spot
