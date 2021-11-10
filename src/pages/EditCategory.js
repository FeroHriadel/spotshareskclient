import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GET_CATEGORY, ALL_CATEGORIES, ALL_SPOTS, TOTAL_SPOTS } from '../graphql/queries';
import { CATEGORY_UPDATE } from '../graphql/mutations';
import { FaCaretLeft } from 'react-icons/fa';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SmallCard from '../components/SmallCard';
import './CreateCategory.css'; //uses the same css as CreateCategory



const EditCategory = () => {
    //VALUES & DEFS
    const history = useHistory();
    const params = useParams();
    const [message, setMessage] = useState('');
    const [values, setValues] = useState({name: '', about: ''});
    const [submitShown, setSubmitShown] = useState(true);

    const { name, about } = values;



    //GET CATEGORY
    const [getCategory, { data }] = useLazyQuery(GET_CATEGORY); //have to use lazy query here because we are waiting for params. Cannot getCategory before we have params value.

    useEffect(() => {
        const slug = params.categoryslug;
        getCategory({variables: {slug}})
    }, []);



    //PREFILL FORM
    useMemo(() => {
        if (data) {
            setValues({name: data.getCategory.name, about: data.getCategory.about || '', slug: data.getCategory.slug})
        }
    }, [data]);



    //CHANGE HANDLER
    const handleChange = e => {
        setMessage('');
        setValues({...values, [e.target.name]: e.target.value});
    }



    //SUBMIT HANDLER & UPDATE CATEGORY MUTATION
      //mutation
    const [categoryUpdate] = useMutation(CATEGORY_UPDATE, {
        onCompleted: () => {
            setSubmitShown(false);
            setMessage('Category updated. Redirecting back to category list...'); 
            setTimeout(() => history.push('/managecategories'), 2000);
        },
        onError: (error) => {
            console.log(error); 
            error && error.message ? setMessage(JSON.stringify(error.message)) : setMessage('Category update failed');
        }
    });

     //all queries (so we can refetch them)
     const { data: allCategories } = useQuery(ALL_CATEGORIES);

    const handleSubmit = e => {
        e.preventDefault();
        if (name.trim() === '') setMessage('Category name cannot be empty');
        else {
            categoryUpdate({
                variables: {input: values}, 
                refetchQueries: [{query: ALL_CATEGORIES}, {query: ALL_SPOTS, variables: {input: 1}}, {query: TOTAL_SPOTS}]
            })
        }
    }



    //RENDER
    return (
        <div className='create-category-page'> {/* wrong name but it's needed bc it recycles CreateCategory.css*/}
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

                        <h1>Edit Category</h1>

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

                            {submitShown && <Button action={handleSubmit} buttonText='Update' />}
                        </form>
                </SmallCard>
            </Layout>
        </div>
    )
}

export default EditCategory
