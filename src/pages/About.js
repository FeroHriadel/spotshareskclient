import React from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import './About.css';
import Meta from '../components/Meta';




const About = () => {
    const history = useHistory();



    return (
        <div className='about-page-container'>

            <Meta title='About SpotShare'/>

            <Layout>
                <BigCard heading='ABOUT'>
                        <div className='image-div'></div>
                        <p>
                            <b className='brown'>Want to see something interesting in Slovakia but want to avoid crowds?</b>
                            <br />
                            SpotShare is a website where you can find places just like that. We have everything for everyone. Interested in the outdoors? Wanna find a pub that is not crawling with tourists? Deciding where to go on a road trip? Just want to go somewhere interesting in the town? We have it for you. <span className='orange'><b onClick={() => history.push('/allspots')}>Check out our spots...</b></span>
                            <br />
                            SpotShare is an open-community site and new spots are always welcome. If you have seen a non-main-stream place you'd like to <span className='orange' onClick={() => history.push('/addspot')}><b>share</b></span> with people we absolutely encourage you to do so! All community benefits from your tips :)
                            <br />
                            Too many spots to choose from? <span className='orange' onClick={() => history.push('/searchspots')}><b>Find spots</b></span> that suit your needs. Use tags and categories to guide you.
                            <br />
                            Not sure what is avilable? Take a look at the <span className='orange' onClick={() => history.push('/spotsmap')}><b>map</b></span> and find a spot that is not too far.
                        </p>
                </BigCard>
            </Layout>
        </div>
    )
}

export default About
