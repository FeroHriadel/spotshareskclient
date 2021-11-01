import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { FaTimes } from 'react-icons/fa';
import './CommentListItem.css';



const CommentListItem = ({ comment, removeComment }) => {
    const { state } = useContext(AuthContext);


    return (
        <li className='comment-list-item'>
            {
                !comment
                ?
                <p>Something went wrong with loading this comment</p>
                :
                <React.Fragment>
                    {
                        comment && comment.image && comment.image.url
                        &&
                        <div 
                            className='image-div'
                            style={{
                                width: '100px',
                                minWidth: '100px',
                                height: '100px',
                                minHeight: '100px',
                                background: `url(${comment.image.url}) no-repeat center center/cover`
                            }} 
                        />
                    }

                    <h3>POSTED BY: {comment.commentedBy.username.toUpperCase()} ON: {new Date(comment.createdAt).toLocaleDateString('en-US')}</h3>

                    <p>{comment.content}</p>

                    {
                        state && state.user && state.user.role === 'admin'
                        &&
                        <p className='comment-delete-btn' onClick={() => removeComment(comment._id)}> <FaTimes /> </p>
                    }
                    <div className='clear-fix'></div>

                </React.Fragment>
            }
        </li>
    )
}



export default CommentListItem
