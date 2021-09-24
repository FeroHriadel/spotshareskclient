import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ALL_CATEGORIES } from '../graphql/queries';




const CategorySelect = ({ handleChange }) => {
    //QUERY
    const { loading, error, data } = useQuery(ALL_CATEGORIES);



    //RENDER
    if (loading) return (
        <p>Loading categories...</p>
    )

    if (error) return (
        <p>Error. Categories could not be fetched.</p>
    )

    if (data.allCategories.length < 1) return (
        <p>There are no categories to choose from</p>
    )

    return (
        <div className='form-group'>
            <label>Category:</label>
            <select
                name='category'
                onChange={handleChange}
            >
                <option value=''>Choose a category</option>
                {
                    data.allCategories.map(c => (
                        <option 
                            key={c._id} 
                            value={c._id}
                            style={{
                                background: '0'
                            }}
                        >
                            {c.name}
                        </option>
                    ))
                }
            </select>
        </div>
    )
}

export default CategorySelect
