import React, { useState } from "react";
import "./EventDetailsCard.css";

function EventDetailsCard({ eventClicked,toggleSpeakerForm,toggleParticipantForm }) {
  const [showSpeakerForm, setshowSpeakerForm] = useState(false);
  const [partbtn, setpartbtn] = useState(false);
  const [showParticipantForm, setshowParticipantForm] = useState(false);
  const url = eventClicked?eventClicked.confAffiche ? `files/${eventClicked.confAffiche}`: 'files/conferenceAfficheDefault.jpg':null; 
 const addSpeakerSection=()=>{
  toggleSpeakerForm(true);
  toggleParticipantForm(false);
  setshowSpeakerForm(true);
  setshowParticipantForm(false);
  console.log("join as speaker");
  const section = document.getElementById('speaker-add-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
}
 const addParticipantSection=()=>{
  toggleSpeakerForm(false);
  toggleParticipantForm(true);
  setpartbtn(!partbtn)
  setshowParticipantForm(true);
  setshowSpeakerForm(false);
  console.log("join as Participant");
  const section = document.getElementById('Participant-add-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
}
  return (
    <div className="cardDetails" style={{ backgroundColor:"#F0F3F9" }}>
    <div className="event-details-card">
      <img
        src={url}
        alt="event"
        className="event-img"
      />
      <div className="all-details-grp">
        <div style={{ display:'flex',flex:1 }}>
        <button className="change-photo" onClick={addParticipantSection} style={{ backgroundColor:partbtn?"#D4DDEE":"#809BCE" }}>Join As Participant</button>
        <button className="change-photo" onClick={addSpeakerSection} style={{ backgroundColor:partbtn?"#809BCE":"#D4DDEE" }}>Join As Speaker</button>
        </div>
        <p>Location:</p>{eventClicked &&(<span>{eventClicked.location}</span>)}
      </div>
      
    </div>

</div>
  );
}
export default EventDetailsCard;