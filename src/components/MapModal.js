import React from 'react';

import { MapContainer, TileLayer,Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";

import './MapModal.css';



const MapModal = ({ lat, long, setMapModalShown }) => {
    return (
        <div className='map-modal'>

            <p  className='map-modal-close-btn' onClick={() => setMapModalShown(false)}>Close Map</p>

            <section className='map-container'>
                <MapContainer
                    center={[49.020606517888275, 19.603840559810987]} 
                    zoom={7} 
                    scrollWheelZoom={true} 
                    style={{height: "100%", width: "100%"}}
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker 
                        position={[lat, long]}
                        draggable={true}
                        animate={true}
                    />

                </MapContainer>
            </section>
        </div>
    )
}

export default MapModal
