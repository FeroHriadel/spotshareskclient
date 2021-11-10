import React from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminOption from '../components/AdminOption';
import SmallCard from '../components/SmallCard';
import './Admin.css';



const Admin = () => {
    const history = useHistory();



    return (
        <Layout>
            <SmallCard>
                <div className='admin-page-content'>
                    <h1>Admin Dashboard</h1>
                    <AdminOption action={() => history.push('/managecategories')} header='Categories' text='Create, delete, and edit categories' />
                    <AdminOption action={() => history.push('/managetags')} text='Create, delete, edit tags and upload tag images' header='Tags' />
                    <AdminOption action={() => history.push('/searchspots')} text='Search, delete and edit spots' header='Spots' />
                    <AdminOption action={() => history.push('/searchusers')} text='Search users and their spots' header='Users' />
                </div>
            </SmallCard>
        </Layout>
    )
}

export default Admin
