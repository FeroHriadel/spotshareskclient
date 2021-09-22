import React from 'react';
import { useHistory } from 'react-router-dom'
import { FaTrash, FaPenFancy } from "react-icons/fa";
import './CategoryListItem.css';



const TagListItem = ({ tag, setModalShown, setTagToDelete }) => {
    const history = useHistory();


    return (
        <li className='category-list-item'> {/* wrong name bc we recycle CategoryListItem.css */}
            <h3 style={{display: 'flex', alignItems: 'center'}}>
                <div 
                    className='image-item'
                    style={{
                        width: '50px',
                        minWidth: '50px',
                        height: '50px',
                        minHeight: '50px',
                        borderRadius: '50%',
                        background: tag && tag.image && tag.image.url ? `url(${tag.image.url}) no-repeat center center/cover` : '',
                        border: tag && tag.image && tag.image.url ? 'none' : '2px #ddd solid',
                        boxShadow: tag && tag.image && tag.image.url ? 'none' : '#333 0 0 5px',
                        display: 'inline-block',
                        marginRight: '1rem',
                        marginBottom: 'auto',
                    }}
                />
                <span>{tag.name}</span>
            </h3>
            <div className='buttons-box'>
                <p title='delete' onClick={() => {setTagToDelete(tag); setModalShown(true)}}> <FaTrash /> </p>
                <p title='edit' onClick={() => history.push(`edittag/${tag.slug}`)}> <FaPenFancy /> </p>
            </div>
        </li>
    )
}



export default TagListItem;