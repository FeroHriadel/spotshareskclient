import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useMutation } from '@apollo/react-hooks';
import { SPOT_CREATE } from '../graphql/mutations';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import FileUploadMultiple from '../components/FileUploadMultiple';
import CategorySelect from '../components/CategorySelect';
import TagSelect from '../components/TagSelect';
import Button from '../components/Button';
import './AddSpot.css';



const AddSpot = () => {
    //GET USER FROM CTX
    const { state } = useContext(AuthContext);




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
        lat: '',
        long: '',
        postedBy: state.user.email
    });

    const { name, where, highlight, description, category, tags, long, lat } = values;



    //MUTATION
    const [spotCreate] = useMutation(SPOT_CREATE, {
        onCompleted: () => console.log('ok'),
        onError: (error) => console.log('Error: ', error)
    })



    //CHANGE HANDLER
    const handleChange = e => {
        setMessage('');
        setValues({...values, [e.target.name]: e.target.value});
    }



    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();
        console.log(values);

        const tagIDs = tags.map(t => t._id) //remove unnecessary data from tags
        spotCreate({
            variables: {input: {...values, tags: tagIDs}}
        })
    }



    //RENDER
    return (
        <Layout>
            <BigCard heading='ADD SPOT'>
                <FileUploadMultiple values={values} setValues={setValues} setMessage={setMessage} />
                { message && <p className='message'>{message}</p>}

                <form className='add-spot-form'>
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

                    <div className='form-group'>
                        <label>Latitude:</label>
                        <input
                            type='number'
                            name='lat'
                            value={lat}
                            placeholder='e.g.: 48.88318'
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label>Longitude:</label>
                        <input
                            type='number'
                            name='long'
                            value={long}
                            placeholder='e.g.: 20.13913'
                            onChange={handleChange}
                        />
                    </div>

                    <div className='button-wrapper'>
                        <Button action={handleSubmit} buttonText='Add Spot' />
                    </div>
                    
                </form>
            </BigCard>
        </Layout>
    )
}

export default AddSpot
