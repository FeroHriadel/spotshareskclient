import React from 'react'

const TagImage = ({ tag }) => {
    return (
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
            title={tag.name}
        />
    )
}

export default TagImage
