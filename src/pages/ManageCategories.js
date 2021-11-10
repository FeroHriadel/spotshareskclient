import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BigCard from '../components/BigCard';
import Button from '../components/Button';
import CategoryListItem from '../components/CategoryListItem';
import Modal from '../components/Modal';
import { FaCaretLeft } from 'react-icons/fa';
import './ManageCategories.css';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ALL_CATEGORIES, ALL_SPOTS, TOTAL_SPOTS } from '../graphql/queries';
import { CATEGORY_DELETE } from '../graphql/mutations';
import { useHistory } from 'react-router-dom';



const ManageCategories = () => {
    //VALUES & DEFS
    const history = useHistory();
    const [message, setMessage] = useState('');
    const [modalShown, setModalShown] = useState(false);
    const [actionConfirmed, setActionConfirmed] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);



    //QUERIES & MUTATIONS
    const { loading, error, data } = useQuery(ALL_CATEGORIES);

    const [categoryDelete] = useMutation(CATEGORY_DELETE, {
        onError: (error) => {
            console.log('Deleting failed:', error.message);
            error && error.message ? setMessage(JSON.stringify(error.message)) : setMessage('Deleting failed');
            setTimeout(() => {
                setMessage('');
            }, 3000)
        }
    });



    //LISTEN FOR (DELETE) ACTION CONFIRMED
    useEffect(() => {
        if (actionConfirmed && categoryToDelete) {
            categoryDelete({
                variables: {input: {slug: categoryToDelete.slug}},
                refetchQueries: [{query: ALL_CATEGORIES}, {query: TOTAL_SPOTS}, {query: ALL_SPOTS, variables: {input: 1}}]
            });

            setActionConfirmed(false);
            setCategoryToDelete(null);
        }
    }, [actionConfirmed]);



    //RENDER
    if (loading) return (
        <Layout>
            <BigCard heading='Manage Categories'>
                <div className='manage-categories-content'>
                    <h3 className='message'>Loading</h3>
                </div>
            </BigCard>
        </Layout>
    )

    if (error) return (
        <Layout>
            <BigCard heading='Manage Categories'>
                <div className='manage-categories-content'>
                    <h3 className='message'>Sorry, something went wrong.</h3>
                </div>
            </BigCard>
        </Layout>
    )

    return (
        <Layout>
            {
                modalShown && <Modal setActionConfirmed={setActionConfirmed} setModalShown={setModalShown} modalText='This will also delete all spots in this category. Are you sure?' />
            }

            <BigCard heading='Manage Categories'>

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
                
                <div className='manage-categories-content'>

                    {
                        data.allCategories.length < 1
                        ?
                        <h3 className='message'>No categories found</h3>
                        :
                        <ul>
                            {
                                data.allCategories.map(c => (
                                    <CategoryListItem 
                                        key={c._id} 
                                        category={c} 
                                        setModalShown={setModalShown}
                                        setCategoryToDelete={setCategoryToDelete}
                                    />
                                ))
                            }
                        </ul>
                    }

                    {message && <p className='message' style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>{message}</p>}

                    <Button action={() => history.push('/createcategory')} buttonText='Create Category' />
                </div>
            </BigCard>
        </Layout>
    )
}

export default ManageCategories
