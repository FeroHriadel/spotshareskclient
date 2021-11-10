import React from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/Layout';



const NotFound = () => {
    const history = useHistory();



    return (
        <Layout>
            <h1 style={{color: 'white', fontFamily: 'Tulpen One', textAlign: 'center', fontSize: '3rem', letterSpacing: '2px'}}>
                Page not found
            </h1>
            <h3
                onClick={() => history.push(`/`)}
                style={{color: `#ddd`, fontFamily: 'Tulpen One', textAlign: 'center', fontSize: '1.5rem', marginTop: '1rem', cursor: 'pointer', transition: `0.4s linear`}}
            >
                Go Home
            </h3>
        </Layout>
    )
}

export default NotFound
