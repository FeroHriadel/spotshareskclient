import React from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SmallCard from '../components/SmallCard';
import './Admin.css';



const Admin = () => {
    const history = useHistory();



    return (
        <Layout>
            <SmallCard>
                <div className='admin-page-content'>
                    <h1>Admin Dashboard</h1>
                    <Button action={() => history.push('/managecategories')} buttonText='Categories' />
                    <Button action={() => history.push('/managetags')} buttonText='Tags' />
                    <Button action={() => history.push('/managespots')} buttonText='Spots' />
                    <Button action={() => history.push('/manageusers')} buttonText='Users' />
                </div>
            </SmallCard>
        </Layout>
    )
}

export default Admin
