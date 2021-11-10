import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
import { SEARCH_SPOTS } from '../graphql/queries';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import Button from '../components/Button';
import CategorySelect from '../components/CategorySelect';
import TagSelectSingle from '../components/TagSelectSingle';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import './SpotsMap.css';




const SpotsMap = () => {
    //VALUES
    const [message, setMessage] = useState('');
    const [values, setValues] = useState({
        searchword: '', //spot name
        category: '',
        tag: '',
        postedBy: '',
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
                ? setMessage('No spots matching your criteria found') 
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



    //LOAD MORE
    const [allFound, setAllFound] = useState(false); //stops loadMore calls when all found
    const [loadMorePushed, setLoadMorePushed] = useState(false) //when user clicks load more this will change to true and trigger useEffect/loadMore below:

    useEffect(() => {
        //function to load more
        const loadMore = () => {
            console.log('curPg: ' + page + ', currNumOfPgs: ' + numberOfPages)
               
            if (page < numberOfPages && !allFound) {
                console.log('is getting pg: ' + (page+1) + ', numOfPgs: ' + numberOfPages)
                searchSpots({
                    variables: {input: {...values, page: page+1}}
                })
            }

            if (page === numberOfPages) setAllFound(true);
        }

        //trigger the function
        if (loadMorePushed) loadMore();
        setLoadMorePushed(false);

    }, [page, numberOfPages, loadMorePushed]);




    //CHANGE HANDLER
    const handleChange = e => {
        setMessage('');
        setValues({...values, [e.target.name]: e.target.value});
    }



    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();
        setResults({ //reset results found on previous criteria
            page: 1,
            numberOfPages: 2,
            spots: []
        });
        setMessage('Searching...');
        searchSpots({
            variables: {input: {...values}}
        })
    }



    //RENDER
    return (
        <Layout>
            <BigCard heading='SEARCH SPOTS ON MAP'>
                <form className='spot-search-form'> {/* recycles SearchSpots.css */}
                    <div className='form-group'>
                        <label htmlFor='searchword'>Name</label>
                        <input
                            name='searchword'
                            value={searchword}
                            onChange={handleChange}
                        />
                    </div>

                    <CategorySelect handleChange={handleChange} selectedCategory={category} />

                    <TagSelectSingle handleChange={handleChange} />

                    <div className='form-group'>
                        <label htmlFor='postedBy'>Author</label>
                        <input
                            name='postedBy'
                            value={postedBy}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='sortBy'>Sort by</label>
                        <select name='sortBy' onChange={handleChange}>
                            <option value=''>Oldest</option>
                            <option value='recent'>Recent</option>
                            <option value='alphabetically'>Alphabetically</option>
                        </select>
                    </div>

                    {message && <p className='message'>{message}</p>}

                    <div className='btn-wrapper'>
                        <Button buttonText='Search' action={handleSubmit} />
                    </div>
                </form>

                <section id='spots-map-section'>
                    <div className='map-container' style={{width: `90%`, height: `400px`}}>
                        <MapContainer
                            center={[49.020606517888275, 19.603840559810987]} 
                            zoom={7} 
                            scrollWheelZoom={true} 
                            style={{height: "100%", width: "100%"}}
                        >
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {
                                results && results.spots
                                &&
                                results.spots.map(spot => (
                                    <Marker
                                        key={spot.slug}
                                        position={[spot.lat, spot.long]}
                                        draggable={true}
                                        animate={true}
                                    >
                                        <Popup>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                background: `url(${spot.images[0].url}) no-repeat center center/cover`,
                                                marginRight: '15px'
                                            }} />
                        
                                            <div>
                                                <p style={{fontFamily: 'Ubuntu'}}>{spot.name}</p>
                                                <Link to={`/spot/${spot.slug}`}>
                                                    <a style={{fontFamily: 'Ubuntu', textDecoration: 'none'}}>See details</a>
                                                </Link>
                                            </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))
                            }
                            </MapContainer>
                    </div>

                    {
                        results && results.spots
                        &&
                        <div 
                            className='load-more-map-btn'
                            onClick={() => setLoadMorePushed(true)}
                        >
                            <p>Load More</p>
                        </div>
                    }
                </section>

            </BigCard>
        </Layout>
    )
}

export default SpotsMap
