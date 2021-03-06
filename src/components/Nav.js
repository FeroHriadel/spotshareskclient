import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { auth } from '../firebase';
import './Nav.css';
import { useHistory, Link } from 'react-router-dom';




const Nav = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(AuthContext);



    const logout = () => {
        auth.signOut();
        dispatch({
            type: 'LOGGED_IN_USER',
            payload: null
        });
    }



    return (
        <nav className='main-nav'>
            <ul>
                <li>
                    <h3 className='main-item'>Spots</h3>
                    <div className='sub-items'>
                        <Link to='/allspots' style={{textDecoration: 'none'}}>
                            <h3>All Spots</h3>
                        </Link>

                        <Link to='/spotsmap' style={{textDecoration: 'none'}}>
                            <h3>Map</h3>
                        </Link>

                        {
                            state && state.user
                            &&
                            <Link to='/addspot' style={{textDecoration: 'none'}}>
                                <h3>Add Spot</h3>
                            </Link>
                        }

                        {
                            state && state.user
                            &&
                            <Link to='/myspots' style={{textDecoration: 'none'}}>
                                <h3>My Spots</h3>
                            </Link>
                        }
                    </div>
                </li>

                <li>
                    <h3 className='main-item'>{state && state.user ? 'Me' : 'Login'}</h3>
                    <div className='sub-items'>

                        {
                            !state.user
                            &&
                            <Link to='/login' style={{textDecoration: 'none'}}>
                                <h3>Log in</h3>
                            </Link>
                        }

                        {
                            !state.user
                            &&
                            <Link to='/register' style={{textDecoration: 'none'}}>
                                <h3>Register</h3>
                            </Link>
                        }

                        {
                            state && state.user
                            &&
                            <h3 onClick={() => logout()}>
                                Sign out
                            </h3>
                        }
                        {
                            state && state.user
                            &&
                            <Link to='/profile' style={{textDecoration: 'none'}}>
                                <h3>My Profile</h3>
                            </Link>
                        }
                        {
                            state && state.user && state.user.role === 'admin'
                            &&
                            <Link to='/admin' style={{textDecoration: 'none'}}>
                                <h3>Admin</h3>
                            </Link>
                        }
                    </div>
                </li>

                <li>
                    <h3 className='main-item'>Search</h3>
                    <div className='sub-items'>
                        <Link to='/searchspots' style={{textDecoration: 'none'}}>
                            <h3>Search Spots</h3>
                        </Link>
                        <Link to='/searchusers' style={{textDecoration: 'none'}}>
                            <h3>Search Users</h3>
                        </Link>
                    </div>
                </li>

                <li>
                    <Link to='/about' style={{textDecoration: 'none'}}>
                        <h3 className='main-item about'>About</h3>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Nav
