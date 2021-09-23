import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ALL_TAGS } from '../graphql/queries';
import './TagSelect.css';



const TagSelect = ({ values, setValues }) => {
    //SELECTED TAGS
    const [selectedTags, setSelectedTags] = useState([]);

    const selectTag = (tag) => {
        let tagsArray = selectedTags;
        let tagsIdArray = selectedTags.map(t => t._id);
        let selectedTagIndex = tagsIdArray.indexOf(tag._id);
        if (selectedTagIndex === -1) {
            tagsArray.push(tag)
        } else {
            tagsArray.splice(selectedTagIndex, 1);
        }
        
        setSelectedTags([...tagsArray]); //if you setSelectedTags(tagsArray) the seletecedTags.map(st...) won't render. React...
        setValues({...values, tags: [...tagsArray]});
    }



    //QUERY
    const { loading, error, data } = useQuery(ALL_TAGS);



    //RENDER
    if (loading) return (
        <p>Loading tags...</p>
    )

    if (error) return (
        <p>Error. Tags could not be fetched.</p>
    )

    if (data.allTags.length < 1) return (
        <p>There are no tags to choose from</p>
    )

    return (
        <div className='tag-select-container'>
            <label>Tags:</label>

            {
                selectedTags.map(st => (
                    <span key={st._id}>
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
                                    background: `url(${t.image.url}) no-repeat center center/cover`,
                                    width: '50px',
                                    minWidth: '50px',
                                    height: '50px',
                                    minHeight: '50px',
                                    borderRadius: '50%',
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