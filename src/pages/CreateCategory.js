import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { CATEGORY_CREATE } from '../graphql/mutations';
import { ALL_CATEGORIES } from '../graphql/queries'; //not used directly but needs to be refetched after categoryCreate so other components that use allCategories are up-to-date
import { useHistory } from 'react-router-dom';
import { FaCaretLeft } from 'react-icons/fa';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SmallCard from '../components/SmallCard';
import './CreateCategory.css';



const CreateCategory = () => {
    //DEFS
    const history = useHistory();



    //STATE
    const [message, setMessage] = useState('');
    const [values, setValues] = useState({
        name: '',
        about: ''
    });

    const { name, about } = values;



    //QUERY & MUATATION
    const { data } = useQuery(ALL_CATEGORIES); //load queries even if you don't use them here. They're used in a previous page and you need to refetch queries so when you go to the previous page that shows all categories you want the categories to be up-to-date

    const [categoryCreate] = useMutation(CATEGORY_CREATE, {
        onCompleted: () => {
            setMessage('Category created');
            setValues({name: '', about: ''});
        },
        onError: (error) => {
            console.log(error);
            setMessage(`Category NOT created. Perhaps a category with the same name already exists?`)
        }
    })



    //CHANGE HANDLER
    const handleChange = e => {
        setMessage('');
        setValues({...values, [e.target.name]: e.target.value});
    }



    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();

        if (name.trim() === '') return setMessage('Category name is required');

        categoryCreate({
            variables: {input: values}, 
            refetchQueries: [{query: ALL_CATEGORIES}] //tell it to refetch queries so the allCategories query is up-to-date
        });
    }



    //RENDER
    return (
        <div className='create-category-page'>
            <Layout>
                <SmallCard>

                    <p
                        className='go-back-btn'
                        title='Back to Categories'
                        onClick={() => history.push('/managecategories')}
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

                        <h1>Create Category</h1>

                        <form>
                            <div className='form-group'>
                                <label htmlFor='name'>Name:</label>
                                <input
                                    type='text'
                                    maxLength='20'
                                    name='name'
                                    value={name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor='about'>About:</label>
                                <input
                                    type='text'
                                    maxLength='255'
                                    name='about'
                                    value={about}
                                    onChange={handleChange}
                                />
                            </div>

                            {message && <p className='message'>{message}</p>}

                            <Button action={handleSubmit} buttonText='Create' />
                        </form>
                </SmallCard>
            </Layout>
        </div>
    )
}

export default CreateCategory
