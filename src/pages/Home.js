import React from 'react';
import './Home.css';
import Nav from '../components/Nav';



const Home = () => {
    return (
        <div className='home-page-container'>
            <Nav />
            <div className='textBg'></div>
            <div className='text-positioner'></div>
        </div>
    )
}

export default Home
