import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ALL_TAGS } from '../graphql/queries';
import './TagSelect.css';



const TagSelectSingle = ({ handleChange }) => {
    //QUERY
    const { loading, error, data } = useQuery(ALL_TAGS);



     //RENDER
     if (loading) return (
        <p style={{
            color: '#9c3611',
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '1rem 0 1rem 0',
            fontFamily: 'Tulpen One',
        }}>
            Loading tags...
        </p>
    )

    if (error) return (
        <p style={{
            color: '#9c3611',
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '1rem 0 1rem 0',
            fontFamily: 'Tulpen One',
        }}>
            Error. Tags could not be fetched.
        </p>
    )

    if (data.allTags.length < 1) return (
        <p style={{
            color: '#9c3611',
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '1rem 0 1rem 0',
            fontFamily: 'Tulpen One',
        }}>
            There are no tags to choose from
        </p>
    )

    return (
        <div className='form-group'>
            <label htmlFor='tag'>Tag:</label>
            <select name='tag' onChange={handleChange}>
                <option value=''>Select a tag</option>
                {
                    data.allTags.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                    ))
                }
            </select>
        </div>
    )
}

export default TagSelectSingle
