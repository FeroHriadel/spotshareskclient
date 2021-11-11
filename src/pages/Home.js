import React from 'react';
import './Home.css';
import Nav from '../components/Nav';
import Meta from '../components/Meta';



const Home = () => {
    return (
        <div className='home-page-container'>
            <Meta />
            <Nav />
            <div className='textBg'></div>
            <div className='text-positioner'></div>
        </div>
    )
}

export default Home
