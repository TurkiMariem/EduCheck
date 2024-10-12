import axios from "axios";
import GoogleMapReact from 'google-map-react';
import React, { useEffect, useState } from "react";
import "./Bottom.css";

const Marker = ({ text, color }) => (
  <div style={{ color: color, fontWeight: 'bold' }}>
    {text}
  </div>
);

const GoogleMap = ({ apiKey, location }) => {
  console.log(apiKey, location);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [routeAddress, setRouteAddress] = useState(location);
  const defaultCenter = { lat: 13.2, lng: 9.3 };
  const defaultZoom = 13;

  useEffect(() => {
    const getCoordinates = async (address) => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );
        const data = response.data;
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setMarkerPosition({ lat, lng });
        } else {
          throw new Error('Coordinates not found');
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        setMarkerPosition(null);
      }
    };

    getCoordinates(location);
  }, [location, apiKey]);

  return (
    <div style={{ backgroundColor:"#F0F3F9" }}>
      <input
        type="text"
        name="location"
        value={routeAddress}
        onChange={(e) => setRouteAddress(e.target.value)}
      />
      <div style={{ height: '300px', width: '100%', marginBottom: '30px' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          center={markerPosition || defaultCenter}
        >
          {markerPosition && (
            <Marker
              lat={markerPosition.lat}
              lng={markerPosition.lng}
              text="Marker"
              color="red"
            />
          )}
        </GoogleMapReact>
      </div>
    </div>
  );
};
function Bottom({ eventClicked }) {
  return (
    <div className="bottom">
    <div className="bottom-content1">
      <div className="desc-details-container">
        <div className="desc-card">
          <div className="flex-row">
            {/** deescIcon */}
            <p className="desc-title">DESCRIPTION</p>
            {/**  <img src={editBlack} alt="edit" className="btn-edit" />*/}
          </div>
          {eventClicked && (
            <p className="desc-info">
              {eventClicked.confDescription}
            </p>
          )}
        </div>
        <div className="details-card">
          <div className="flex-row-vcenter">
            {/*<img src={detailsIcon} alt="details" className="details-icon" />*/}
            <p className="details-title">DETAILS</p>
          </div>
          <div className="details-info flex-col">
            <div className="flex-row">
              <p className="detail-type">Date:</p>
              {eventClicked && (
                <p className="detail-txt">{eventClicked.datetimes}</p>
              )}
            </div>
            <div className="flex-row">
              <p className="detail-type">Time:</p>
              {eventClicked && (
                <>
                  <p className="detail-txt">{eventClicked.startTime}</p>
                  <p className="detail-txt">{eventClicked.endTime}</p>
                </>
              )}
            </div>
            <div className="flex-row">
              <p className="detail-type">Duration:</p>
              <p className="detail-txt">2-3 hrs</p>
            </div>
            <div className="flex-row">
              <p className="detail-type">Location:</p>
              {eventClicked && (
                <p className="detail-txt">{eventClicked.location}</p>
              )}
            </div>
            <div className="flex-row">
  <p className="detail-type">Speakers:</p>
  {eventClicked && eventClicked.selectedSpeakers && JSON.parse(eventClicked.selectedSpeakers).map((speaker, index) => (
    <p key={index} className="detail-txt">{speaker.name}</p>
  ))}
</div>
</div>
</div>
      </div>
      <div className="google-map-card">
        <div className="flex-row">
          {/** deescIcon */}
          <p className="desc-title">Location</p>
        </div>
        {eventClicked && (
          <div className="map-container">
            <GoogleMap
              apiKey="AIzaSyD_S1IidRs5XkiixAnLMkH6-r-ns3qzQw8"
              location={eventClicked.location}
             
            />
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
export default Bottom;
