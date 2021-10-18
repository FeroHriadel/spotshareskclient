import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useMutation } from '@apollo/react-hooks';
import { SPOT_CREATE } from '../graphql/mutations';
import { useHistory } from 'react-router-dom';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import FileUploadMultiple from '../components/FileUploadMultiple';
import CategorySelect from '../components/CategorySelect';
import TagSelect from '../components/TagSelect';
import Button from '../components/Button';
import './AddSpot.css';



const AddSpot = () => {
    //ROUTER
    const history = useHistory();



    //GET USER FROM CTX
    const { state } = useContext(AuthContext);




    //VALUES
    const [submitShown, setSubmitShown] = useState(true);
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
        postedBy: '' //see useEffect below
    });

    const { name, where, highlight, description, category, tags, long, lat } = values;

    useEffect(() => {
        if (state && state.user && state.user.email) setValues({...values, postedBy: state.user.email});
        else setValues({...values, postedBy: ''});
    }, [state.user]) //had to do this to fill in postedBy => page crashed on logout



    //MUTATION
    const [spotCreate] = useMutation(SPOT_CREATE, {
        onCompleted: (data) => {
            setSubmitShown(false);
            setMessage('Spot Created. Redirecting...');
            setTimeout(() => {
                history.push(`/spot/${data.spotCreate.slug}`)
            }, 2000);
        },
        onError: (error) => {
            setMessage(`Error. ${error}`);
            console.log(error);
        }
    });



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
                { message && <p className='add-spot message'>{message}</p>}

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

                    { message && <p className='message'>{message}</p>}

                    {
                        submitShown
                        &&
                        <div className='button-wrapper'>
                            <Button action={handleSubmit} buttonText='Add Spot' />
                        </div>
                    }
                    
                </form>
            </BigCard>
        </Layout>
    )
}

export default AddSpot
