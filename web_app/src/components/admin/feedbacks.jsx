import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FeedbackBoost() {
  const [boostedEvents, setBoostedEvents] = useState([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    const fetchBoostedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/feedbacks');
        setBoostedEvents(response.data);
        console.log("response.data",response.data);
        toast.success("event Fetched")
      } catch (error) {
        console.error('Error fetching boosted events:', error);
      }
    };
    fetchBoostedEvents();
  }, [change]);
  const handleDeleteFeedback = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this feedback?');

    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/feedbacks/${id}`);

        if (response.status === 200) {
          toast.success('Feedback deleted successfully!');
          // Refresh the feedback list
          setChange(!change);
        } else {
          throw new Error('Failed to delete feedback');
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
        toast.error('Failed to delete feedback.');
      }
    } else {
      toast.info('Delete request canceled.');
    }
  };
  const BoostClick = async (id) => {
    
      try {
        const response = await axios.put(`http://localhost:5000/feedbacks/${id}`, {
          displayed: "true",
        });
  
        if (response.status !== 200) {
          throw new Error('Failed to update feedbacks');
        }
  
        toast.success('This feedback has been successfully boosted!');
      } catch (error) {
        console.error('Error updating feedback:', error);
        toast.error('Failed to boost the feedback.');
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
     <span style={{color: '#4285F4'}}>F</span>
     <span style={{color: '#EA4335'}}>e</span>
     <span style={{color: '#FBBC05'}}>e</span>
     <span style={{color: '#4285F4'}}>d</span>
     <span style={{color: '#34A853'}}>b</span>
     <span style={{color: '#EA4335'}}>a</span>
     <span style={{color: '#4285F4'}}>c</span>
     <span style={{color: '#EA4335'}}>k</span>
     <span style={{color: '#FBBC05'}}>s</span>
   </h1>
   </div></div>
 <div  className="table-data">
     <div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
       <div  className="head">
         <h3 style={{ color:"#4285F4" }}>List of client Feedbacks</h3>
         <i  className='bx bx-search' ></i>
       </div>
 <table>
   <thead>
           <tr style={{  marginRight:"20px" }}>
             <th>Client Image </th>
             <th>Client Name </th>
             <th>Client Email</th>
             <th>Client Feedback</th>
             <th>Feedback Status</th>
             <th>Action</th>
     </tr>
   </thead>
        <tbody>
        {boostedEvents.map(event => (
          <tr key={event._id}>
            <td><img src={`files/${event.image}`}/></td>
            <td>{event.name}</td>
            <td>{event.name}</td>
            <td>{event.content}</td>
            <td>
  <span className={event.displayed === true ? 'status yes' : 'status pending'}>
    {event.displayed == true ?  'displayed':'pending'}
  </span>
</td>
            <td><button className='status yes' onClick={() => BoostClick(event._id)}>Boost Feedback</button></td>
            <td><button className='status no' onClick={() => handleDeleteFeedback(event._id)}>Reject Feedback</button></td>
          </tr>
        ))}
   </tbody>
 </table>
 </div>
 </div>
 </main>
  )
}

export default FeedbackBoost