import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { COMMENT_CREATE } from '../graphql/mutations';
import Layout from '../components/Layout';
import SmallCard from '../components/SmallCard';
import FileUploadSingle from '../components/FileUploadSingle';
import Button from '../components/Button';
import { FaCaretLeft } from 'react-icons/fa';



const AddComment = () => {
    //VALUES & DEFS
    const history = useHistory();
    const params = useParams();

    const [message, setMessage] = useState('');
    const [submitBlocked, setSubmitBlocked] = useState(false);
    const [values, setValues] = useState({
        spotSlug: params.spotslug,
        image: {},
        content: '',
    });

    const { spotSlug, image, content } = values;



    //ADD COMMENT MUTATION
    const [commentCreate] = useMutation(COMMENT_CREATE, {
        onCompleted: (data) => {
            setMessage('Comment added');
            setSubmitBlocked(false);
        },
        onError: (error) => {
            console.log(error);
            setMessage(`Error. ${error}`);
            setSubmitBlocked(false);
        }
    })



    //CHANGE HANDLER
    const handleChange = e => {
        setMessage('');
        setSubmitBlocked(false);
        setValues({...values, [e.target.name]: e.target.value});
    }



    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();

        if (submitBlocked) return
        if (content.trim() === '') return setMessage(`Dont post an empty comment, please.`);

        setSubmitBlocked(true);
        commentCreate({
            variables: {input: {...values}}
        })
    }


    //RENDER
    return (
        <Layout>
            <SmallCard>
                <div className='profile-page-content'> {/* wrong name bc it recycles Profile.css */}
                    <p
                        className='go-back-btn'
                        title='Go back'
                        onClick={() => history.goBack()}
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

                    <h1>Post a comment</h1>`
                    
                    {message && <p className='message'>{message}</p>}

                    <FileUploadSingle setMessage={setMessage} setValues={setValues} values={values} />

                    <form>
                        <div className='form-group'>
                            <label htmlFor='name'>Your Comment: </label>
                            <textarea
                                name='content'
                                value={content}
                                onChange={handleChange}
                                style={{marginBottom: '1rem'}}
                            />

                            {message && <p className='message' style={{marginTop: '1rem'}}>{message}</p>}

                            <div className='btn-wrapper' style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
                                <Button action={handleSubmit} buttonText='Post Comment' />
                            </div>
                        </div>
                    </form>
                </div>
            </SmallCard>
        </Layout>
    )
}

export default AddComment
