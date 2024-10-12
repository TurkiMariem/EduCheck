import React from "react";
import "./top.css";

 function Top({ eventClicked }) {
  return (
    <div className="top-container">
      <div className="flex-row-vend">
      {eventClicked && (<h1 className="title-event">{eventClicked.confTitle}</h1>)}
      {eventClicked && ( <h3 className="date-event">{eventClicked.datetimes}</h3>)}
      {eventClicked && (<button className="delete-btn">{eventClicked.categorie}</button>)}
      </div>
    
    
    </div>
  );
}
export default Top;

