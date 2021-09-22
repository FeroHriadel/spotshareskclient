import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import Button from "../components/Button";
import SmallCard from "../components/SmallCard";
import FileUploadSingle from "../components/FileUploadSingle";
import { useHistory } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { FaCaretLeft } from 'react-icons/fa';
import { useMutation } from '@apollo/react-hooks';
import { useLazyQuery } from "@apollo/react-hooks";
import { GET_TAG, ALL_TAGS } from "../graphql/queries";
import { TAG_UPDATE } from "../graphql/mutations";
import omitDeep from 'omit-deep';



const EditTag = () => {
    //VALUES & DEFS
    const history = useHistory();
    const params = useParams();
    const [submitShown, setSubmitShown] = useState(true);
    const [message, setMessage] = useState('');
    const [values, setValues] = useState({
        name: '',
        image: {},
        slug: ''
    });

    const { name } = values;



    //GET TAG
    const [getTag, { data }] = useLazyQuery(GET_TAG);

    useEffect(() => {
        const slug = params.tagslug;
        getTag({variables: {slug}});
    }, []);



    //PREFILL FORM
    useMemo(() => {
        if (data) {
            setValues({
                name: data.getTag.name,
                image: omitDeep(data.getTag.image, ["__typename"]),
                slug: data.getTag.slug
            })
        }
    }, [data]);




    //CHANGE HANDLER
    const handleChange = e => {
        setMessage('');
        setValues({...values, [e.target.name]: e.target.value});
    }



    //SUBMIT HANDLER & UPDATE TAG MUTATION
    const [tagUpdate] = useMutation(TAG_UPDATE, {
        update: () => {
            setSubmitShown(false);
            setMessage(`Updated. Redirecting to Tag List...`);
            setTimeout(() => {
                history.push(`/managetags`)
            }, 2000);
        },
        //THIS TURNED OUT UNNECESSARY => ALL_TAGS GOT UPDATED SOMEHOW EVEN WITHOUT ME EDITING THEM
        // update: (cache, {data: { tagUpdate }}) => {
        //     const { allTags } = cache.readQuery({query: ALL_TAGS});
        //     cache.writeQuery({
        //         query: ALL_TAGS,
        //         data: {
        //             allTags: [tagUpdate, ...allTags]
        //         }
        //     })
        // },
        onError: (error) => {
            console.log(error);
            setMessage('Failed. Perhaps a tag with the same name already exists?');
        }
    })

    const handleSubmit = e => {
        e.preventDefault();

        if (name.trim() === '') return setMessage('Tag name is required');

        tagUpdate({variables: {input: values}});
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

                        <h1>Edit Tag</h1>`
                        
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
                                    {submitShown && <Button action={handleSubmit} buttonText='Edit' />}
                                </div>
                            </div>
                        </form>
                    </div>
                </SmallCard>
            </Layout>
    )
}



export default EditTag;