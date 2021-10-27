import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ALL_TAGS } from '../graphql/queries';
import './TagSelect.css';



const TagSelect = ({ values, setValues }) => {
    //SELECTED TAGS
    const [selectedTags, setSelectedTags] = useState(values.tags);

    const selectTag = (tag) => {
        let tagsArray = selectedTags;
        let tagsIdArray = selectedTags.map(t => t._id);
        let selectedTagIndex = tagsIdArray.indexOf(tag._id);
        if (selectedTagIndex === -1) {
            tagsArray.push(tag)
        } else {
            tagsArray.splice(selectedTagIndex, 1);
        }
        
        setSelectedTags([...tagsArray]);
        setValues({...values, tags: [...tagsArray]});
    }



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
        <div className='tag-select-container'>
            <label>Tags:</label>

            {
                selectedTags.map(st => (
                    <span className='selected-tag' key={st._id}>
                        {st.name}
                    </span>
                ))
            }

            <div className='tags-box'>
                {
                    data.allTags.map(t => (
                        <div className='tag-wrapper' key={t._id}>
                            <div 
                                className='tag-img'
                                style={{
                                    border: t.image.url ? '' : '2px #ddd solid',
                                    background: `url(${t.image.url}) no-repeat center center/cover`,
                                    width: '50px',
                                    minWidth: '50px',
                                    height: '50px',
                                    minHeight: '50px',
                                    borderRadius: '50%',
                                    cursor: 'pointer'
                                }}
                                onClick={() => selectTag(t)}
                            />

                            <p className='tag-name'>{t.name}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default TagSelect
