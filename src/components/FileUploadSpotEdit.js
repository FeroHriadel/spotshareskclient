import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import './FileUploadMultiple.css';
import { FaMousePointer, FaTimes } from 'react-icons/fa';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';

//
import { useMutation, useQuery } from '@apollo/react-hooks';
import { ALL_SPOTS } from '../graphql/queries';
import { SPOT_EDIT } from '../graphql/mutations';




const FileUploadSpotEdit = ({ values, setValues, setMessage }) => {
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


    //MUTATION & QUERY
    const [deletedImgPublicId, setDeletedImgPublicId] = useState(null);
    const { data: allSpotsData } = useQuery(ALL_SPOTS, {variables: {input: 1}});
    const [spotEdit] = useMutation(SPOT_EDIT, {
        onCompleted: (data) => {
            deleteCloudinaryImage(deletedImgPublicId);
            setMessage('Spot images updated');
            setTimeout(() => {
                setMessage('');
            }, 2000);
            setDeletedImgPublicId(null);
        },
        onError: (error) => {
            setMessage(`Image delete failed`);
            console.log(error);
            setTimeout(() => {
                setMessage('');
            }, 2000);
            setDeletedImgPublicId(null);
        }
    });



    //DELETE UPLOADED IMAGE
    const deleteImgFromDb = (imagePublicId) => {
        //check if not the only image
        if (values.images.length === 1) {
            setMessage('Cannot delete the spot only image');
            setTimeout(() => {
                setMessage('');
            }, 2000);
            return
        }

        setDeletedImgPublicId(imagePublicId);
        setMessage('Deleting image...');

        //update values
        let uploadedImages = values.images;
        let filteredImages = uploadedImages.filter(i => i.public_id !== imagePublicId);
        setValues({...values, images: filteredImages});

        //rewrite spot in db
        if (Number(values.lat) > 49.3574 || Number(values.lat) < 47.64725) return setMessage('Latitude is outside Slovakia (47.64725 - 49.3574)');
        if (Number(values.long) < 16.60943 || Number(values.long) > 22.76178) return setMessage('Longitude is outside Slovakia (16.60943 - 22.76178)');
        const tagIDs = values.tags.map(t => t._id) //remove unnecessary data from tags
        spotEdit({
            variables: {input: {...values, tags: tagIDs, images: filteredImages}},
            refetchQueries: [{query: ALL_SPOTS, variables: {input: 1}}]
        })
    }

    const deleteCloudinaryImage = (imagePublicId) => {
        axios.post(`${process.env.REACT_APP_REST_ENDPOINT}/removeimage`, {public_id: imagePublicId}, {headers: {authtoken: state.user.token}})
    }

    const removeImage = (imagePublicId) => { // a little stupid I know - come back and rewrite this later       
           deleteImgFromDb(imagePublicId);
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
                            key={image.public_id}
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

export default FileUploadSpotEdit
