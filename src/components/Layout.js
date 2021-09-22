import React from 'react';
import Background from './Background';
import Nav from './Nav';
import './Layout.css';



const Layout = ({ children }) => {
    return (
        <div className='layout-container'>
            <Background />
            <Nav />
            {children}
        </div>
    )
}

export default Layout
