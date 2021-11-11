import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useMutation } from '@apollo/react-hooks';
import { ALL_TAGS, ALL_SPOTS, TOTAL_SPOTS } from '../graphql/queries';
import { TAG_DELETE } from '../graphql/mutations';
import Layout from '../components/Layout';
import Button from '../components/Button';
import BigCard from '../components/BigCard';
import TagListItem from '../components/TagListItem';
import { FaCaretLeft } from 'react-icons/fa';
import Modal from '../components/Modal';
import './ManageCategories.css';
import Meta from '../components/Meta';



const ManageTags = () => {
    //VALUES & DEFS
    const history = useHistory();
    const [message, setMessage] = useState('');
    const [modalShown, setModalShown] = useState(false);
    const [actionConfirmed, setActionConfirmed] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);



    //QUERY
    const { data, loading, error } = useQuery(ALL_TAGS);



    //DELETE TAG
    const [tagDelete] = useMutation(TAG_DELETE, {
        update: (cache, { data: { tagDelete }}) => {
            setTagToDelete(null);
            const { allTags } = cache.readQuery({query: ALL_TAGS});
            const filteredTags = allTags.filter(t => t.slug !== tagDelete.slug);
            cache.writeQuery({
                query: ALL_TAGS,
                data: {
                    allTags: filteredTags
                }
            })
        },
        onError: (error) => {
            console.log(error);
            setMessage('Deleting failed');
            setTimeout(() => {
                setMessage('');
            }, 2000);
        }
    });

    useEffect(() => {
        if (actionConfirmed && tagToDelete) {
            tagDelete({
                variables: {input: {slug: tagToDelete.slug}},
                refetchQueries: [{query: TOTAL_SPOTS}, {query: ALL_SPOTS, variables: {input: 1}}]
            });
            setActionConfirmed(false);
            setTagToDelete(null);
        }
    }, [actionConfirmed, tagToDelete])



    //RENDER
    if (loading) return (
        <Layout>
            <BigCard heading='MANAGE TAGS'>
                <p className='message'>Loading...</p>
            </BigCard>
        </Layout>
    )
    
    if (error) return (
        <Layout>
            <BigCard heading='MANAGE TAGS'>
            <p
                className='go-back-btn'
                title='Back to Dashboard'
                onClick={() => history.push('/admin')}
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

                <p className='message'>Sorry, something went wrong :(</p>
            </BigCard>
        </Layout>
    )

    return (
        <Layout>

            <Meta />

            {
                modalShown && <Modal setActionConfirmed={setActionConfirmed} setModalShown={setModalShown} />
            }

            <BigCard heading='MANAGE TAGS'>

                <p
                    className='go-back-btn'
                    title='Back to Dashboard'
                    onClick={() => history.push('/admin')}
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

                <div className='manage-categories-content'> {/* wrong name bc recycling ManageCategories.css */}

                    {
                        data.allTags.length < 1
                        ?
                        <h3 className='message'>No tags found</h3>
                        :
                        <ul>
                            {
                                data.allTags.map(t => (
                                    <TagListItem 
                                        key={t._id} 
                                        tag={t} 
                                        setModalShown={setModalShown}
                                        setTagToDelete={setTagToDelete}
                                    />
                                ))
                            }
                        </ul>
                    }

                    {message && <p className='message' style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>{message}</p>}

                    <Button action={() => history.push('/createtag')} buttonText='Create Tag' />
                </div>
            </BigCard>
        </Layout>
    )
}

export default ManageTags
