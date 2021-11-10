import React, { useContext, useState, useEffect } from 'react';
import { Link, Route } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Layout from './Layout';



const PrivateRoute = ({ children, ...rest }) => {
    const { state } = useContext(AuthContext);
    const [user, setUser] = useState(false);



    useEffect(() => {
        if (state.user) {
            setUser(true);
        } else {
            setUser(false);
        }
    }, [state.user])




    return (
        user
        ?
        <React.Fragment>
            <Route {...rest} />
        </React.Fragment>
        :
        <Layout>
            <h1 style={{color: 'white', fontFamily: 'Tulpen One', textAlign: 'center', fontSize: '3rem', letterSpacing: '2px'}}>
                You have to log in to see this page
            </h1>

            <Link to='login' style={{textDecoration: 'none'}}>
                <h3 
                    style={{color: '#ddd', fontFamily: 'Tulpen One', textAlign: 'center', fontSize: '1.5rem', marginTop: '1rem', textDecoration: 'none'}}
                >
                    Login?
                </h3>
            </Link>

            <Link to='/' style={{textDecoration: 'none'}}>
                <h3 
                    style={{color: '#ddd', fontFamily: 'Tulpen One', textAlign: 'center', fontSize: '1.5rem', marginTop: '1rem', textDecoration: 'none'}}
                >
                    Go Home
                </h3>
            </Link>
        </Layout>
    )
}

export default PrivateRoute
