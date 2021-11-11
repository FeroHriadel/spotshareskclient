import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useHistory, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GET_COMMENTS } from '../graphql/queries';
import { COMMENT_DELETE } from '../graphql/mutations';
import axios from 'axios';
import Layout from '../components/Layout';
import Button from '../components/Button';
import BigCard from '../components/BigCard';
import CommentListItem from '../components/CommentListItem';
import './Comments.css';
import Meta from '../components/Meta';



const Comments = () => {
    //DEFS
    const params = useParams();
    const history = useHistory();
    const { state } = useContext(AuthContext);



    //VALUES
    const [message, setMessage] = useState('');
    const [results, setResults] = useState({
        page: 1,
        numberOfPages: 2,
        comments: []
    });
    const {page, numberOfPages, comments} = results;



    //GET COMMENTS
      //query
    const [getComments, { data, loading, error }] = useLazyQuery(GET_COMMENTS, {
        fetchPolicy: "no-cache",
        onError: (error) => {
            console.log(error);
            setMessage(`Error. ${error}`);
        },
        onCompleted: (data) => {
            setResults({
                page: data.getComments.page,
                numberOfPages: data.getComments.numberOfPages,
                comments: [...results.comments, ...data.getComments.comments]
            });
        }
    });

      //getComments on page load
    useEffect(() => {
        let spotslug = params.spotslug;
        getComments({variables: {input: {page: 1, spotSlug: spotslug}}});
    }, [params]);

      //get more comments
    const getMore = () => {
        if (page < numberOfPages) {
            console.log('is getting pg: ' + (page+1) + ', numOfPgs: ' + numberOfPages);
            getComments({
                variables: {input: {page: page+1, spotSlug: params.spotslug}}
            })
        }
    }



    //DELETE COMMENT
      //mutation
    const [commentDelete] = useMutation(COMMENT_DELETE, {
        onError: (error) => {
            console.log(error);
        },
        onCompleted: (data) => {
            let filteredComments = results.comments.filter(comment => comment._id !== data.commentDelete._id);
            setResults({...results, comments: filteredComments});
            if (data.commentDelete.image && data.commentDelete.image.public_id) {
                axios.post(`${process.env.REACT_APP_REST_ENDPOINT}/removeimage`, {public_id: data.commentDelete.image.public_id}, {headers: {authtoken: state.user.token}})
            }
        }
    });

      //action
    let removeComment = (commentId) => {
        commentDelete({
            variables: {input: {_id: commentId}}
        })
    }



    //RENDER
    return (
        <div className='comments-page-wrapper'>

            <Meta />

            <Layout>
                <BigCard heading='COMMENTS'>

                    {
                        state && state.user && state.user.email &&
                        <div className='button-wrapper' style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <Button action={() => history.push(`/addcomment/${params.spotslug}`)} buttonText='Add Comment' />
                        </div>
                    }

                    { loading && <p className='message'>Loading...</p>}

                    {error && <p className='message'>{message}</p>}

                    {
                        !loading && !error && comments && comments.length < 1
                        ?
                        <p className='message'>This spot has not been commented on yet. Want to add a comment?</p>
                        :
                        <React.Fragment>
                            <ul style={{
                                listStyleType: 'none', 
                                marginTop: '3rem', 
                                width: '95%', 
                            }}
                            >
                                {comments.map(comment => (
                                    <CommentListItem key={comment._id} comment={comment} removeComment={removeComment} />
                                ))}
                            </ul>

                            <p className='get-more-btn' onClick={() => getMore()}>
                                    Show more...
                            </p>
                        </React.Fragment>
                    }
                </BigCard>   
            </Layout>
        </div>
    )
}

export default Comments
