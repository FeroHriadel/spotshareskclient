import React, { useState } from 'react';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import FileUploadMultiple from '../components/FileUploadMultiple';



const AddSpot = () => {
    const [message, setMessage] = useState('');
    const [values, setValues] = useState({
        images: [],
        name: '',
        where: '',
        highlight: '',
        description: '',
        category: '',
        tags: [],
        long: '',
        lat: ''
    });

    return (
        <Layout>
            <BigCard heading='ADD SPOT'>
                <FileUploadMultiple values={values} setValues={setValues} setMessage={setMessage} />
                { message && <p className='message'>{message}</p>}
            </BigCard>
        </Layout>
    )
}

export default AddSpot
