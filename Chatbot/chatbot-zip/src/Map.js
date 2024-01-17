import React, { useEffect, useState } from 'react';

const LocationComponent = () => {
  const [lat, setLat] = useState('Waiting for location...');
  const [long, setLong] = useState('Waiting for location...');

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setLat(latitude);
            setLong(longitude);
          },
          (error) => {
            switch(error.code) {
              case error.PERMISSION_DENIED:
                setLong('User denied the request for Geolocation.');
                break;
              case error.POSITION_UNAVAILABLE:
                setLong('Location information is unavailable.');
                break;
              case error.TIMEOUT:
                setLong('The request to get user location timed out.');
                break;
              default:
                setLong('An unknown error occurred.');
            }
          }
        );
      } else {
        setLong('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  return (
    <div> <p>Your Location : Latitude {lat}, Longitude{long}</p></div>
  );
};

export default LocationComponent;
