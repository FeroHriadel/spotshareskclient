import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import './FileUploadMultiple.css';
import { FaMousePointer, FaTimes } from 'react-icons/fa';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';




const FileUploadMultiple = ({ values, setValues, setMessage }) => {
    const { state } = useContext(AuthContext);


    //UPLOAD IMAGES
    const fileResizeAndUpload = (e) => {
        let files = e.target.files;
        let uploadedFiles = values.images;

        if (files) {
            setMessage('Loading...');
            for (let i = 0; i < files.length; i++) {
                Resizer.imageFileResizer(files[i], 500, 500, "JPEG", 100, 0, (uri) => {
                    axios.post(`${process.env.REACT_APP_REST_ENDPOINT}/uploadimage`, {image: uri}, {headers: {authtoken: state.user.token}})
                        .then(res => {
                            console.log(res);
                            uploadedFiles.push(res.data);
                            setValues({...values, images: uploadedFiles})
                            setMessage('');
                        })
                        .catch(err => {
                            console.log(err);
                            setMessage('Image upload failed');
                            setTimeout(() => {setMessage('')}, 1500);
                        })
                }, "base64");
            }
        }
    }



    //DELETE UPLOADED IMAGE
    const removeImage = (imagePublicId) => {
        axios.post(`${process.env.REACT_APP_REST_ENDPOINT}/removeimage`, {public_id: imagePublicId}, {headers: {authtoken: state.user.token}})
            .then(res => {
                let uploadedImages = values.images;
                let filteredImages = uploadedImages.filter(i => i.public_id !== imagePublicId);
                setValues({...values, images: filteredImages});
            })
    }



    //RENDER
    return (
        <div className='file-upload-multiple'>
            <label htmlFor='fileupload'>
                Upload Images <FaMousePointer style={{fontSize: '0.75rem'}} />
                <input 
                    type='file'
                    accept='image/*'
                    onChange={fileResizeAndUpload}
                    hidden
                    name='fileupload'
                    id='fileupload'
                />
            </label>

            <div className='preview-box'>
                {
                    values.images.map(image => (
                        <div
                            style={{
                                width: '50px',
                                minWidth: '50px',
                                height: '50px',
                                minHeight: '50px',
                                borderRadius: '50%',
                                background: `url(${image.url}) no-repeat center center/cover`,
                                boxShadow: '0 0 5px rgba(0, 0, 0, 0.6)',
                                margin: '5px',
                                position: 'relative'
                            }}
                        >
                            <div 
                                className='delete-btn' 
                                title='Remove Image'
                                onClick={() => removeImage(image.public_id)}
                            >
                                <FaTimes style={{fontSize: '0.5rem'}} />
                            </div>
                        </div>
                    ))                
                }
            </div>
        </div>
    )
}

export default FileUploadMultiple
