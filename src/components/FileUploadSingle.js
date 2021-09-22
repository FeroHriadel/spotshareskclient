import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import userPng from '../images/user.png';
import './FileUploadSingle.css';



const FileUploadSingle = ({ values, setValues, setMessage }) => {
    const { state } = useContext(AuthContext);



    const fileResizeAndUpload = e => {
        let fileInput = false;
        if (e.target.files[0]) {
            fileInput = true
        }

        if (fileInput) {
            Resizer.imageFileResizer(
                e.target.files[0],
                300,
                300,
                'JPEG',
                100,
                0,
                (uri) => {
                    axios.post(`${process.env.REACT_APP_REST_ENDPOINT}/uploadimage`, {image: uri}, {headers: {authtoken: state.user.token}})
                        .then(response => {
                            setValues({...values, image: response.data});
                            setMessage('');
                        })
                        .catch(error => {
                            console.log('Upload failed', error);
                            setMessage('Image Upload failed');
                        });
                },
                'base64'
            );
        }
    }



    return (
        <div className='file-upload-single'>
            {
                values.image && values.image.url === 'nophoto' /* no user's photo*/
                ?
                <div style={{width: '240px', minWidth: '240px', height: '240px', minHeight: '240px', borderRadius: '50%', background: `url(${userPng}) no-repeat center center/cover`, boxShadow: '0 0 10px rgba(0, 0, 0, 0.6)'}} className='photo' />
                :
                !values.image || !values.image.url /* no tag image */
                ?
                <div style={{width: '240px', minWidth: '240px', height: '240px', minHeight: '240px', borderRadius: '50%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.6)', border: '3px #ddd solid'}} className='photo' />
                :
                <div style={{width: '240px', minWidth: '240px', height: '240px', minHeight: '240px', borderRadius: '50%', background: `url(${values.image.url}) no-repeat center center/cover`, boxShadow: '0 0 10px rgba(0, 0, 0, 0.6)'}} className='photo' />
            }

            <label htmlFor='fileupload'>
                Upload Image
                <input 
                    type='file'
                    accept='image/*'
                    onChange={fileResizeAndUpload}
                    hidden
                    name='fileupload'
                    id='fileupload'
                />
            </label>
        </div>
    )
}

export default FileUploadSingle
