import React, { useState } from "react";
import Layout from "../components/Layout";
import Button from "../components/Button";
import SmallCard from "../components/SmallCard";
import FileUploadSingle from "../components/FileUploadSingle";
import { useHistory } from 'react-router-dom';
import { FaCaretLeft } from 'react-icons/fa';
import { useMutation } from '@apollo/react-hooks';
import { TAG_CREATE } from '../graphql/mutations';
import { useQuery } from "@apollo/react-hooks";
import { ALL_TAGS } from "../graphql/queries";




const CreateTag = () => {
    //VALUES & DEFS
    const history = useHistory();
    const [message, setMessage] = useState('');
    const [values, setValues] = useState({
        name: '',
        image: {}
    });

    const { name } = values;



    //QUERY
    const { data } = useQuery(ALL_TAGS);



    //MUTATION
    const [tagCreate] = useMutation(TAG_CREATE, {
        update: (cache, {data: { tagCreate }}) => {
            setMessage('Tag Created');
            setValues({name: '', image: {}});
            const { allTags } = cache.readQuery({query: ALL_TAGS}); //read queries => get all Tags
            cache.writeQuery({
                query: ALL_TAGS,
                data: {
                    allTags: [tagCreate, ...allTags]
                }
            })
        },
        onError: (error) => {
            console.log(error);
            setMessage('Failed. Perhaps a tag with the same name already exists?');
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

        if (name.trim() === '') return setMessage('Tag name is required');

        tagCreate({variables: {input: values}});
    }


    //RENDER
    return (

            <Layout>
                <SmallCard>
                    <div className='profile-page-content'> {/* wrong name bc it recycles Profile.css */}
                        <p
                            className='go-back-btn'
                            title='Back to Tags'
                            onClick={() => history.push('/managetags')}
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '1rem',
                                color: '#ddd',
                                fontFamily: 'Ubuntu',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                zIndex: 20
                            }}
                        >
                            <FaCaretLeft />
                        </p>

                        <h1>Create Tag</h1>`
                        
                        {message && <p className='message'>{message}</p>}

                        <FileUploadSingle setMessage={setMessage} setValues={setValues} values={values} />

                        <form>
                            <div className='form-group'>
                                <label htmlFor='name'>Name:</label>
                                <input
                                    type='text'
                                    maxLength='20'
                                    name='name'
                                    value={name}
                                    onChange={handleChange}
                                    style={{marginBottom: '1rem'}}
                                />

                                {message && <p className='message' style={{marginTop: '1rem'}}>{message}</p>}

                                <div className='btn-wrapper' style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
                                    <Button action={handleSubmit} buttonText='Create' />
                                </div>
                            </div>
                        </form>
                    </div>
                </SmallCard>
            </Layout>
    )
}



export default CreateTag;