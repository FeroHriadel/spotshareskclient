import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import FileUploadMultiple from '../components/FileUploadMultiple';
import CategorySelect from '../components/CategorySelect';
import TagSelect from '../components/TagSelect';



const AddSpot = () => {
    //VALUES
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
        lat: '',
        likes: []
    });

    const { name, where, highlight, description, category, tags, long, lat } = values;


    useEffect(() => {
        console.table(values);
    }, [values])



    //CHANGE HANDLER
    const handleChange = e => {
        setMessage('');
        setValues({...values, [e.target.name]: e.target.value});
    }



    //RENDER
    return (
        <Layout>
            <BigCard heading='ADD SPOT'>
                <FileUploadMultiple values={values} setValues={setValues} setMessage={setMessage} />
                { message && <p className='message'>{message}</p>}

                <form>
                    <div className='form-group'>
                        <label>Name:</label>
                        <input
                            type='text'
                            name='name'
                            value={name}
                            placeholder='e.g.: Certovica Mountain Pass'
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label>Where:</label>
                        <input
                            type='text'
                            name='where'
                            value={where}
                            placeholder='e.g.: Central Slovakia'
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label>Highlight:</label>
                        <input
                            type='text'
                            name='highlight'
                            value={highlight}
                            placeholder='e.g.: Cool driving experience'
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label>Description:</label>
                        <textarea
                            type='text'
                            name='description'
                            value={description}
                            placeholder='e.g.: A mountain pass with a lot of switchbacks and beautiful views...'
                            onChange={handleChange}
                        />
                    </div>

                    <CategorySelect handleChange={handleChange} />

                    <TagSelect values={values} setValues={setValues} />
                    
                </form>
            </BigCard>
        </Layout>
    )
}

export default AddSpot
