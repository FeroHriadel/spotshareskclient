import React from 'react';
import { useHistory } from 'react-router-dom'
import { FaTrash, FaPenFancy } from "react-icons/fa";
import './CategoryListItem.css';



const CategoryListItem = ({ category, setModalShown, setCategoryToDelete }) => {
    const history = useHistory();


    return (
        <li className='category-list-item'>
            <h3>{category.name}</h3>
            <div className='buttons-box'>
                <p title='delete' onClick={() => {setCategoryToDelete(category); setModalShown(true)}}> <FaTrash /> </p>
                <p title='edit' onClick={() => history.push(`editcategory/${category.slug}`)}> <FaPenFancy /> </p>
            </div>
        </li>
    )
}

export default CategoryListItem
