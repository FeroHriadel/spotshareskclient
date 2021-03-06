import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useHistory } from 'react-router-dom';
import TagImage from './TagImage';
import './SpotListItem.css';



const SpotListItem = ({ spot, setModalShown, setSpotToDelete }) => {
    //DEFS
    const history = useHistory();
    const { state } = useContext(AuthContext);
    const { user } = state;



    //OPEN SPOT (onClick)
    const openSpot = () => {
        history.push(`/spot/${spot.slug}`)
    }



    //RENDER
    return (
        <section className='spot-list-item'>
            <div 
                className='image' 
                style={spot && spot.images && spot.images[0].url ? { background: `url(${spot.images[0].url}) no-repeat center center/cover`} : {background: 'rgba(0, 0, 0, 0.3)'}}
                onClick={openSpot}
            />
            <div className='content'>
                <h2 onClick={openSpot}>{spot.name}</h2>
                <p className='category' onClick={openSpot}>{spot.category.name}</p>
                {
                    spot.tags
                    &&
                    <div className='tags-container'>
                        {spot.tags.map(tag => (
                            <TagImage key={Math.random()} tag={tag} onClick={openSpot}/>
                        ))}
                    </div>
                }
                <p className='highlight' onClick={openSpot}><i>{spot.highlight}</i></p>

                {
                    state && state.user && (state.user.role === 'admin' || state.user.email === spot.postedBy) &&
                    <div className='admin-buttons'>
                        <div className='btn' onClick={() => history.push(`/editspot/${spot.slug}`)}><p>Edit</p></div>
                        <div
                            className='btn' 
                            onClick={() => {
                                setModalShown(true);
                                setSpotToDelete(spot);
                            }}
                        >
                            <p>Delete</p>
                        </div>
                    </div>
                }
            </div>
        </section>
    )
}



export default SpotListItem
