import React, { useContext, useState, useEffect } from 'react';
import { Link, Route } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Layout from './Layout';



const AdminRoute = ({ children, ...rest }) => {
    const { state } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);



    useEffect(() => {
        if (state && state.user && state.user.role === 'admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [state, state.user])




    return (
        isAdmin
        ?
        <React.Fragment>
            <Route {...rest} />
        </React.Fragment>
        :
        <Layout>
            <h1 style={{color: 'white', fontFamily: 'Tulpen One', textAlign: 'center', fontSize: '3rem', letterSpacing: '2px'}}>
                Access denied
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

export default AdminRoute
