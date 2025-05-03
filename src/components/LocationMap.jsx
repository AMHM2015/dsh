import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
// Component to handle map view updates
const MapUpdater = ({ center }) => {
  const map = useMap(); // Access the map instance

  // Update the map view when the center changes
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true }); // Smoothly animate to the new center
    }
  }, [center, map]);

  return null; // This component doesn't render anything
};

const LocationMap = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const locationRef = ref(database, 'location');
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Location Data:', data);
      if (data) {
        setLocation(data);
      }
      setLoading(false);
    });
  }, []);

  if (loading || !location) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      <MapContainer center={[location.lat, location.lng]} zoom={17} style={{ height: '300px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>Current Location</Popup>
        </Marker>
        {/* Pass the new center to MapUpdater */}
        <MapUpdater center={[location.lat, location.lng]} />
      </MapContainer>
    </div>
  );
};

export default LocationMap;