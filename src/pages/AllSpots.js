import React, { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { ALL_SPOTS, TOTAL_SPOTS } from '../graphql/queries';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import SpotListItem from '../components/SpotListItem';
import './AllSpots.css';



const AllSpots = () => {
    //QUERIES
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



    //RENDER
    return (
        <div className='all-spots-page'>
            <Layout>
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
                                <SpotListItem key={spot.slug} spot={spot} />
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
                        </React.Fragment>
                    }
                </BigCard>
            </Layout>
        </div>
    )
}

export default AllSpots
