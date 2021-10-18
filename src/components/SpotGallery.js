import React, { useState } from 'react';
import './SpotGallery.css';
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa';



const SpotGallery = ({ images, setSpotGalleryShown }) => {
    //BROWSE GALLERY FN
    const [currentImage, setCurrentImage] = useState(0);
    const [animationName, setAnimationName] = useState('imgZoomIn');

    const goRight = () => {
        if (currentImage < images.length - 1) {
            setAnimationName('imgZoomOut');
            setTimeout(() => {
                setCurrentImage(currentImage + 1);
                setAnimationName('imgZoomIn');
            }, 400) //funny, it works nice even withot timeout ms specified :)
        } else {
            setAnimationName('imgZoomOut');
            setTimeout(() => {
                setCurrentImage(0);
                setAnimationName('imgZoomIn');
            }, 400)
        }
    }

    const goLeft = () => {
        if (currentImage === 0) {
            setAnimationName('imgZoomOut');
            setTimeout(() => {
                setCurrentImage(images.length - 1);
                setAnimationName('imgZoomIn');
            }, 400);
        } else {
            setAnimationName('imgZoomOut');
            setTimeout(() => {
                setCurrentImage(currentImage - 1);
                setAnimationName('imgZoomIn');
            }, 400);
        }
    }


    //RENDER
    return (
        <div className='spot-gallery'>

            <p className='spot-gallery-close-btn' onClick={() => setSpotGalleryShown(false)}>Close Gallery</p>

            <section 
                className='spot-gallery-image'
                style={{
                    background: `url(${images[currentImage].url}) no-repeat center center/cover`,
                    animationName: `${animationName}`
                }}
            >
                {images.length > 1 && <p className='left-arrow' onClick={goRight}> <FaChevronLeft /> </p>}
                {images.length > 1 && <p className='right-arrow' onClick={goRight}> <FaChevronRight /> </p>}
            </section>
        </div>
    )
}



export default SpotGallery
