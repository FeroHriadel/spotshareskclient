import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { SEARCH_SPOTS, TOTAL_SPOTS, ALL_SPOTS } from '../graphql/queries';
import { SPOT_DELETE } from '../graphql/mutations'
import axios from 'axios';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import SpotListItem from '../components/SpotListItem';
import Modal from '../components/Modal';
import './SearchSpots.css';
import Meta from '../components/Meta';



const MySpots = () => {    //recycles SearchSpots.js
    //VALUES
    const { state } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [values, setValues] = useState({
        searchword: '',
        category: '',
        tag: '',
        postedBy: state && state.user && state.user.email ? state.user.email : '',
        sortBy: ''
    })
    const { searchword, category, tag, postedBy, sortBy } = values;

    const [results, setResults] = useState({
        page: 1,
        numberOfPages: 2,
        spots: []
    })
    const { page, numberOfPages, spots } = results;



    //SEARCH SPOTS QUERY
    const [searchSpots, { data, loading, error }] = useLazyQuery(SEARCH_SPOTS, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            !data.searchSpots.spots || data.searchSpots.spots.length === 0 
                ? setMessage('No spots found') 
                : setMessage('');
            setResults({
                page: data.searchSpots.page, 
                numberOfPages: data.searchSpots.numberOfPages, 
                spots: [...spots, ...data.searchSpots.spots]
            });
        },
        onError: (error) => {
            setMessage('Error. Search failed');
            setTimeout(() => {setMessage('')}, 2000);
            console.log(error);
        }
    });

    useEffect(() => {
        setMessage('Getting your spots...');
        searchSpots({
            variables: {input: {...values}}
        })
    }, []);
    


    //DELETE SPOT
    const [modalShown, setModalShown] = useState(false);
    const [modalText, setModalText] = useState('Please confirm you want to delete the spot');
    const [deletingStatus, setDeletingStatus] = useState('');
    const [spotToDelete, setSpotToDelete] = useState(null);
    const [actionConfirmed, setActionConfirmed] = useState(false);

    const [spotDelete] = useMutation(SPOT_DELETE, {
        onCompleted: () => {
            //remove spot from results
            let filteredSpots = spots.filter(spot => spot.slug !== spotToDelete.slug);
            setResults({...results, spots: filteredSpots});

            //show message
            setDeletingStatus('Spot deleted...');
            setTimeout(() => {
                setDeletingStatus('');
            }, 2000);

            //remove images from Cloudinary
            spotToDelete.images.forEach(img => {
                axios.post(`${process.env.REACT_APP_REST_ENDPOINT}/removeimage`, {public_id: img.public_id}, {headers: {authtoken: state.user.token}})
            })

            //set delete checkers to default
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
                refetchQueries: [
                    {query: TOTAL_SPOTS}, 
                    {query: ALL_SPOTS, variables: {input: page}},
                    // {query: SEARCH_SPOTS, variables: {input: {...values}}}
                ]
            });
        }
    }

    useEffect(() => {
        if (actionConfirmed) {
            removeSpot(spotToDelete);
        }
    }, [actionConfirmed, spotToDelete]);



    //INFINITE SCROLL
    const [allFound, setAllFound] = useState(false);

    useEffect(() => {
        let cardContent = document.querySelector('.content-wrapper');
        const loadMore = () => {
            console.log('curPg: ' + page + ', currNumOfPgs: ' + numberOfPages)
            let scrollTop = cardContent.scrollTop;
            let scrollHeight = cardContent.scrollHeight;                
            if (page < numberOfPages && !allFound) {
                console.log('is getting pg: ' + (page+1) + ', numOfPgs: ' + numberOfPages)
                searchSpots({
                    variables: {input: {...values, page: page+1}}
                })
            }

            if (page === numberOfPages) setAllFound(true);
        }
    
        if (cardContent) cardContent.addEventListener('scroll', loadMore);

        return () => {
            if (cardContent) cardContent.removeEventListener('scroll', loadMore);
        }
    }, [page, numberOfPages]);



    //CHANGE HANDLER
    // const handleChange = e => {
    //     setMessage('');
    //     setValues({...values, [e.target.name]: e.target.value});
    // }



    //SUBMIT HANDLER
    // const handleSubmit = e => {
    //     e.preventDefault();
    //     setResults({ //reset results found on previous criteria
    //         page: 1,
    //         numberOfPages: 2,
    //         spots: []
    //     });
    //     setMessage('Searching...');
    //     searchSpots({
    //         variables: {input: {...values}}
    //     })
    // }



    //RENDER
    return (
        <Layout>

            <Meta />

            {
                modalShown && <Modal setActionConfirmed={setActionConfirmed} setModalShown={setModalShown} modalText={modalText} />
            }

            <BigCard heading='MY SPOTS'>
                <div className='spot-search-form'>
                    {message && <p className='message'>{message}</p>}
                </div>

                <section className='spot-search-results'>
                   {
                       spots
                       &&
                       spots.map(spot => (
                        <SpotListItem key={spot.slug} spot={spot} setModalShown={setModalShown} setSpotToDelete={setSpotToDelete} />
                       ))
                   }

                   {deletingStatus && <p className='message deleting-status'>{deletingStatus}</p>}
                </section>
            </BigCard>
        </Layout>
    )
}

export default MySpots
