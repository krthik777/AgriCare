import React, { useEffect, useState } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao'; // Replace with your Google Maps API Key

const MapComponent: React.FC = () => {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<string>('temperature');

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        // Set map URL with center and marker for current location
        const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${userLocation.lat},${userLocation.lng}&zoom=15&maptype=roadmap`;
        
        setIframeSrc(mapUrl); 
      },
      (error) => {
        console.error('Error getting location', error);
        // Handle location error (optional: show a message to the user)
      }
    );
  }, []);

  const handleParameterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedParameter(event.target.value);
  };

  return (
    <div>
    <div style={{ position: 'absolute', top: 20, left: 20, background: 'white', padding: '10px', borderRadius: '5px' }}>
    <label htmlFor="parameter-select">Select Parameter:</label>
    <select id="parameter-select" value={selectedParameter} onChange={handleParameterChange}>
      <option value="temperature">Temperature</option>
      <option value="humidity">Humidity</option>
      <option value="soilContent">Soil Content</option>
    </select>
  </div>
    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
      {iframeSrc ? (
        <>
       
          <iframe
            width="100%"
            height="100%"
            src={iframeSrc}
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            title="Google Map"
          ></iframe>
          
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
    </div>
  );
};

export default MapComponent;
