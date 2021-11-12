import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ALL_SPOTS, TOTAL_SPOTS } from '../graphql/queries';
import { SPOT_DELETE } from '../graphql/mutations'
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import SpotListItem from '../components/SpotListItem';
import Modal from '../components/Modal';
import './AllSpots.css';
import Meta from '../components/Meta';



const AllSpots = () => {
    //GET SPOTS QUERIES
    const { data: spotCount } = useQuery(TOTAL_SPOTS);
    const [page, setPage] = useState(1);
    const { data, loading, error } = useQuery(ALL_SPOTS, {variables: {input: page}});



    //PAGINATION
    const perPage = 3;

    const next = () => {
        let totalPages = Math.ceil(spotCount && spotCount.totalSpots/perPage);
        if (page < totalPages) setPage(page + 1);
    }

    const previous = () => {
        if (page > 1) setPage(page - 1);
    }



    //SCROLL TOP (after page change)    
    const scrollTop = () => {
        let cardContent = document.querySelector('.content-wrapper');
        if (cardContent) cardContent.scrollTop = 0;
    }



    //DELETE SPOT
    const { state } = useContext(AuthContext);

    const [modalShown, setModalShown] = useState(false);
    const [modalText, setModalText] = useState('Please confirm you want to delete the spot');
    const [deletingStatus, setDeletingStatus] = useState('');
    const [spotToDelete, setSpotToDelete] = useState(null);
    const [actionConfirmed, setActionConfirmed] = useState(false);

    const [spotDelete] = useMutation(SPOT_DELETE, {
        onCompleted: () => {
            setDeletingStatus('Spot deleted...');
            setTimeout(() => {
                setDeletingStatus('');
            }, 2000);
            spotToDelete.images.forEach(img => {
                axios.post(`${process.env.REACT_APP_REST_ENDPOINT}/removeimage`, {public_id: img.public_id}, {headers: {authtoken: state.user.token}})
            })
            setSpotToDelete(null);
            setActionConfirmed(false);
        },
        onError: (error) => {
            console.log(error);
            setDeletingStatus('Spot delete failed');
            setSpotToDelete(null);
            setActionConfirmed(false);
            setTimeout(() => {
                setDeletingStatus('');
            }, 2000);
        }
    });

    const removeSpot = spot => {
        if (spotToDelete && actionConfirmed) {
            setDeletingStatus('Deleting spot...');
            spotDelete({
                variables: {input: {postedBy: spotToDelete.postedBy, slug: spotToDelete.slug}},
                refetchQueries: [{query: TOTAL_SPOTS}, {query: ALL_SPOTS, variables: {input: page}}]
            });
        }
    }

    useEffect(() => {
        if (actionConfirmed) {
            removeSpot(spotToDelete);
        }
    }, [actionConfirmed, spotToDelete]);



    //RENDER
    return (
        <div className='all-spots-page'>

            <Meta title='SpotShare | All Spots' />

            <Layout>
                {
                    modalShown && <Modal setActionConfirmed={setActionConfirmed} setModalShown={setModalShown} modalText={modalText} />
                }

                <BigCard heading='ALL SPOTS'>
                    {
                        loading
                        ?
                        <p className='message'>Loading...</p>
                        :
                        error 
                        ? 
                        <p className='message'>Sorry, something went wrong</p>
                        :
                        data.allSpots.length === 0
                        ?
                        <p className='message'>There are currently no spots. Would you like to add one?</p>
                        :
                        <React.Fragment>
                            {data.allSpots.map(spot => (
                                <SpotListItem key={spot.slug} spot={spot} setModalShown={setModalShown} setSpotToDelete={setSpotToDelete} />
                            ))}

                            {
                                spotCount
                                &&
                                <div className='pagination'>
                                    <p className='arrow' onClick={() => {previous(); scrollTop()}}>previous</p>
                                    <p className='counter'>{page}/{Math.ceil(spotCount && spotCount.totalSpots/perPage)}</p>
                                    <p className='arrow' onClick={() => {next(); scrollTop()}}>next</p>
                                </div>
                            }

                            {deletingStatus && <p className='message deleting-status'>{deletingStatus}</p>}
                        </React.Fragment>
                    }
                </BigCard>
            </Layout>
        </div>
    )
}

export default AllSpots
