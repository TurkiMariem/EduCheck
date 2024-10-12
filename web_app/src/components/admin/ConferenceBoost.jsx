import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BoostRequests() {
  const [boostedEvents, setBoostedEvents] = useState([]);

  useEffect(() => {
    const fetchBoostedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/boosted-events');
        setBoostedEvents(response.data);
        console.log("response.data",response.data);
        toast.success("event Fetched")
      } catch (error) {
        console.error('Error fetching boosted events:', error);
      }
    };
    fetchBoostedEvents();
  }, []);
  const BoostClick = async (id) => {
    const confirmBoost = window.confirm('Are you sure you want to display this conference on the homepage?');
  
    if (confirmBoost) {
      try {
        const response = await axios.put(`http://localhost:5000/boostEvent/${id}`, {
          displayed: "true",
        });
  
        if (response.status !== 200) {
          throw new Error('Failed to update description');
        }
  
        toast.success('This conference has been successfully boosted!');
      } catch (error) {
        console.error('Error updating description:', error);
        toast.error('Failed to boost the conference.');
      }
    } else {
      toast.info('Boost request canceled.');
    }
  };
  return (
    <main>
    <ToastContainer
  position="bottom-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"/>
  <div  className="head-title">
  <div  className="left">
   <h1 className="google-search-heading">
   <span style={{color: '#4285F4'}}>B</span>
     <span style={{color: '#EA4335'}}>o</span>
     <span style={{color: '#FBBC05'}}>o</span>
     <span style={{color: '#4285F4'}}>s</span>
     <span style={{color: '#34A853'}}>t</span>{' '}{' '}
     <span style={{color: '#4285F4'}}>C</span>
     <span style={{color: '#EA4335'}}>o</span>
     <span style={{color: '#FBBC05'}}>n</span>
     <span style={{color: '#4285F4'}}>f</span>
     <span style={{color: '#34A853'}}>e</span>
     <span style={{color: '#EA4335'}}>r</span>
     <span style={{color: '#4285F4'}}>e</span>
     <span style={{color: '#EA4335'}}>n</span>
     <span style={{color: '#EA4335'}}>c</span>
     <span style={{color: '#FBBC05'}}>e</span>
     <span style={{color: '#FBBC05'}}>s</span>
   </h1>
   </div>
   </div>
 <div  className="table-data">
     <div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
       <div  className="head">
         <h3 style={{ color:"#4285F4" }}>List of boost Requests</h3>
         <i  className='bx bx-search' ></i>
       </div>
 <table>
   <thead>
           <tr style={{  marginRight:"20px" }}>
             <th>Conference Title</th>
             <th>Conference Director Email</th>
             <th>Conference Description</th>
            
             <th>Location</th>
             <th>TimeLine</th>
             <th>Start Time</th>
             <th>End Time</th>
             <th>Conference Status</th>
             <th>Action</th>
     </tr>
   </thead>
        <tbody>
        {boostedEvents.map(event => (
          <tr key={event._id}>
            <td>{event.confTitle}</td>
            <td>{event.userEmail}</td>
            <td>{event.confDescription}</td>
            <td>{event.location}</td>
            <td>{event.datetimes}</td>
            <td>{event.startTime.join(', ')}</td>
            <td>{event.endTime.join(', ')}</td>
            <td ><span className='status pending'>{event.status}</span></td>
            <td><button className='status yes' onClick={() => BoostClick(event._id)}>Boost Conference</button></td>
          </tr>
        ))}
   </tbody>
 </table>
 </div>
 </div>
 </main>
  )
}

export default BoostRequests