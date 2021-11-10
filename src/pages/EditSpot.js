import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useParams, useHistory } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { GET_SPOT, ALL_SPOTS } from '../graphql/queries';
import { SPOT_EDIT } from '../graphql/mutations';
import omitDeep from 'omit-deep';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
//import FileUploadMultiple from '../components/FileUploadMultiple';
import FileUploadSpotEdit from '../components/FileUploadSpotEdit';
import CategorySelect from '../components/CategorySelect';
import TagSelect from '../components/TagSelect';
import Button from '../components/Button';
import './AddSpot.css';



const EditSpot = () => {
    //GET SPOT
    const params = useParams();
    
    const [getSpot, { error, loading, data }] = useLazyQuery(GET_SPOT, {fetchPolicy: 'no-cache'});

    useEffect(() => {
        const slug = params.spotslug;
        getSpot({variables: {slug}});
    }, [params]);



    //ONLY ADMIT ADMIN OR AUTHOR
    const { state } = useContext(AuthContext);
    const history = useHistory();
    
    useEffect(() => {
        if (data && state && data.getSpot.postedBy !== state.user.email) {
            if (state.user.role !== 'admin') {
                history.push('/');
            }
        }
    }, [data, state]);



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
        postedBy: '',
        likes: []
    });

    const { name, where, highlight, description, category, tags, long, lat } = values;


    //PRE-FILL FORM
    useEffect(() => {
        if (data && data.getSpot) {
            setValues({
                images: omitDeep(data.getSpot.images, ["__typename"]),
                name: data.getSpot.name,
                where: data.getSpot.where,
                highlight: data.getSpot.highlight,
                description: data.getSpot.description,
                category: data.getSpot.category._id,
                tags: data.getSpot.tags,
                lat: data.getSpot.lat,
                long: data.getSpot.long,
                postedBy: data.getSpot.postedBy,
                slug: data.getSpot.slug,
                postedBy: data.getSpot.postedBy,
                likes: data.getSpot.likes
            })
        }
    }, [data]);



    useEffect(() => {
        if (values.likes) console.log(values.likes)
    }, [values])



    //CHANGE HANDLER
    const handleChange = e => {
        setMessage('');
        setValues({...values, [e.target.name]: e.target.value});
    }



    //MUTATION & QUERY
    const { data: allSpotsData } = useQuery(ALL_SPOTS, {variables: {input: 1}});
    const [spotEdit] = useMutation(SPOT_EDIT, {
        onCompleted: (data) => {
            setMessage('Spot Updated');
            setTimeout(() => {
                setMessage('');
            }, 2000);
        },
        onError: (error) => {
            setMessage(`Error: ${error}`);
            console.log(error);
        }
    });



    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();
        if (Number(lat) > 49.3574 || Number(lat) < 47.64725) return setMessage('Latitude is outside Slovakia (47.64725 - 49.3574)');
        if (Number(long) < 16.60943 || Number(long) > 22.76178) return setMessage('Longitude is outside Slovakia (16.60943 - 22.76178)');

        const tagIDs = tags.map(t => t._id) //remove unnecessary data from tags
        spotEdit({
            variables: {input: {...values, tags: tagIDs}},
            refetchQueries: [{query: ALL_SPOTS, variables: {input: 1}}]
        })
    }



    //RENDER
    if (error) return (
        <Layout>
            <BigCard heading='EDIT SPOT'>
                <p className='add-spot message'>Error. Spot update failed.</p>
            </BigCard>
        </Layout>
    )

    if (loading) return (
        <Layout>
            <BigCard heading='EDIT SPOT'>
                <p className='add-spot message'>Loading...</p>
            </BigCard>
        </Layout>
    )

    if (!values.name) return (
        <Layout>
            <BigCard heading='EDIT SPOT'>
                <p className='add-spot message'>Loading...</p>
            </BigCard>
        </Layout>
    )

    if (values.name) return (
        <Layout>
            <BigCard heading='EDIT SPOT'>
                {/*<FileUploadMultiple 
                    values={values} 
                    setValues={setValues} 
                    setMessage={setMessage}
                />*/}

                <FileUploadSpotEdit 
                    values={values} 
                    setValues={setValues} 
                    setMessage={setMessage}
                />
                
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

                    <CategorySelect handleChange={handleChange} selectedCategory={category} />

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
                            <Button action={handleSubmit} buttonText='Edit Spot' />
                        </div>
                    }
                    
                </form>
            </BigCard>
        </Layout>
    )
}

export default EditSpot
