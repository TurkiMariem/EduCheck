import { Scheduler } from "@aldabil/react-scheduler";
import axios from 'axios';

import GoogleMapReact from 'google-map-react';
import React, { useEffect, useRef, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';
import { MdDelete } from "react-icons/md";
import { Marker } from 'react-map-gl';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from 'semantic-ui-react';
import * as XLSX from 'xlsx';
import Participants from './Participants';
import './eventDetails/Bottom.css';
import './eventDetails/top.css';

function removeCircularReferences(obj, seen = new Set()) {
    if (obj && typeof obj === 'object') {
      if (seen.has(obj)) {
        return '[Circular]';
      }
      seen.add(obj);
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          obj[index] = removeCircularReferences(item, seen);
        });
      } else {
        for (let key in obj) {
          obj[key] = removeCircularReferences(obj[key], seen);
        }
      }
    }
    return obj;
  }
  
const GoogleMap = ({ apiKey,updateLocation,location }) => {
    const latLngPattern = /\(([^)]+)\)/;
const match = location.match(latLngPattern);
if (match) {
  const [lat, lng] = match[1].split(',').map(coord => parseFloat(coord.trim()));
  console.log('Latitude:', lat);
  console.log('Longitude:', lng);
  setMarkerPosition({ lat: lat, lng: lng });
}
const defaultCenter = { lat: 13.2, lng: 9.3};
    const defaultZoom = 13;
    const [markerPosition, setMarkerPosition] = useState(null);
    const [routeAddress, setRouteAddress] = useState(location);
    const getRouteAddress = async (lat, lng, apiKey) => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        const data = response.data;
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          return data.results[0].formatted_address;
        } else {
          throw new Error('Address not found');
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        return null;
      }
    };
    const handleClick = async (event) => {
      const clickedLat = event.lat;
      const clickedLng = event.lng;
      setMarkerPosition({ lat: clickedLat, lng: clickedLng });
      console.log({ lat: clickedLat, lng: clickedLng });
      const address = await getRouteAddress(clickedLat, clickedLng, apiKey);
    setRouteAddress(address);
    console.log("routeAddress",routeAddress);
    updateLocation(address);
    };
  
    return (
      <>
      <input type="text"
        name="location"
        id=""
        value={routeAddress}
        onChange={(e) => {
          setRouteAddress(e.target.value);
        }}
      />
      <div style={{ height: '400px', width: '100%',marginBottom:"30px" }}>
         
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          onClick={handleClick}
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
      </>
    );
  };
function ConferenceDetailsSection(props) {
    console.log(props);
        let { id } = useParams();
      //  console.log("confId",id);
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
const [location, setlocation] = useState('');
const [showSelectSpeaker, setshowSelectSpeaker] = useState(false);
const [speakers, setspeakers] = useState([]);
const [selectedSpeakers, setselectedSpeakers] = useState(event ? JSON.parse(event.selectedSpeakers[0]) : []);
const [selectedOrganizers, setselectedOrganizers] = useState(event ? JSON.parse(event.selectedOrganizers[0]) : []);
const [organizers, setorganizers] = useState([])
const [confEmail, setconfEmail] = useState('');
const [showSelectOrganizer, setshowSelectOrganizer] = useState(false);
const [ShowPlanning, setShowPlanning] = useState(false);
const [editMode, setEditMode] = useState(false);
const [description, setDescription] = useState(event&& event.confDescription);
const [selectedDate, setselectedDate] = useState(new Date('2024-05-15T01:00:00+01:00'));
const [Events, setEvents] = useState([]);
const scheduleObj = useRef(null);
const [eventTitle, setEventTitle] = useState('');
const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');
const [sessions, setSessions] = useState([]);
const [selectedFile, setSelectedFile] = useState(event&& event.confAffiche);
const [confAffiche, setconfAffiche] = useState(selectedFile);
const [editMode1, setEditMode1] = useState();
const [datetime, setdatetime] = useState();
const [datetimes, setdatetimes] = useState(event&&event.datetimes.split(',').map(date => new Date(date)));
const [category, setcategory] = useState();
const deeplyParseJson = (str) => {
  let parsed = str;
  while (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return parsed; // Return the string if parsing fails
    }
  }
  return parsed;
};

const parseArray = (arr) => {
  return arr.map((item) => {
    return deeplyParseJson(item);
  });
};
const fetchData = async () => {
  try {
    const eventResponse = await axios.get(`http://localhost:5000/events/${id}`);
    setEvent(eventResponse.data);
    setEventTitle(eventResponse.data.confTitle)
    setDescription(eventResponse.data.confDescription);
    setorganizers(eventResponse.data.selectedOrganizers);
    setselectedSpeakers(eventResponse.data.selectedSpeakers);
   
    setdatetime(eventResponse.data.datetimes);
    setcategory(eventResponse.data.confCategory);
    setdatetimes(eventResponse.data.datetimes.split(',').map(date => new Date(date)));
  
console.log("event",event);
    if (eventResponse.data && eventResponse.data.confParticipants) {
      const response = await fetch(`/files/${eventResponse.data.confParticipants}`);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setParticipants(jsonData);
      const sss=eventResponse.data.selectedSpeakers.map(deeplyParseJson);
   console.log("222",sss);
   const ssss = parseArray(eventResponse.data.selectedSpeakers);
console.log("2222", ssss);
    }
    
  } catch (error) {
    console.error('Error fetching data:', error);
  }

};
const fetchSpeakersAndOrganizers = async () => {
  const confEmail1 = localStorage.getItem('confEmail');
  setconfEmail(confEmail1);
  try {
    const responseSpeakers = await fetch(`http://localhost:5000/speakers?confEmail=${confEmail1}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!responseSpeakers.ok) {
      throw new Error('Failed to fetch speakers');
    }
    const dataSpeakers = await responseSpeakers.json();
 //   console.log('Fetched speakers:', dataSpeakers);
    setspeakers(dataSpeakers);

    const responseOrg = await fetch(`http://localhost:5000/organizers?confEmail=${confEmail1}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!responseOrg.ok) {
      throw new Error('Failed to fetch organizers');
    }
    const dataOrg = await responseOrg.json();
//    console.log('Fetched organizers:', dataOrg);
    setorganizers(dataOrg);
  } catch (error) {
    console.error('Error fetching speakers and organizers:', error);
  }
};
const [previewImage, setPreviewImage] = useState(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  }
};
useEffect(() => {
  fetchData();
  console.log("event",event);
  fetchSpeakersAndOrganizers();
  console.log("selectedFile",selectedFile);
  console.log("confAffiche",confAffiche);
  console.log("selectedSpeakers",selectedSpeakers);
  console.log("selectedOrganizers",selectedOrganizers);
}, [id,selectedFile,confAffiche]);

    useEffect(() => {
      //  scrollToSection();
      const dates=event&&event.datetimes.split(',');
const firstDate=new Date(event&&dates[0])
      event&&setselectedDate(firstDate);
      console.log("selectedDate",selectedDate);
      //  console.log("speakers",speakers);
        //console.log("organizers",organizers);
      }, [id,datetimes]);
////////// finish useEffect

      
const handleSpeakerChange = async (e) => {
  const newSelectedOptions = Array.from(e.target.selectedOptions, (option) => JSON.parse(option.value));

  // Merge existing selected speakers with new selected ones, avoiding duplicates
  const updatedSelectedSpeakers = [
    ...selectedSpeakers,
    ...newSelectedOptions.filter(newSpeaker => 
      !selectedSpeakers.some(existingSpeaker => existingSpeaker._id === newSpeaker._id)
    )
  ];

  setselectedSpeakers(updatedSelectedSpeakers);
console.log("updatedSelectedSpeakers",updatedSelectedSpeakers);
  // Update the event in the database with the new selected speakers
  const updatedEvent = {
    ...event,
    selectedSpeakers: [JSON.stringify(updatedSelectedSpeakers)],
  };

  try {
    await axios.put(`http://localhost:5000/myevents/${event.conferenceId}`, updatedEvent);
    setEvent(updatedEvent);
    console.log("speakers updated");
  } catch (error) {
    console.error('Error updating event:', error);
  }
};
const handleOrganizerChange = async (e) => {
  const newSelectedOptions = Array.from(e.target.selectedOptions, (option) => JSON.parse(option.value));

  // Merge existing selected speakers with new selected ones, avoiding duplicates
  const updatedSelectedOrganizers = [
    ...selectedOrganizers,
    ...newSelectedOptions.filter(newSpeaker => 
      !selectedOrganizers.some(existingSpeaker => existingSpeaker._id === newSpeaker._id)
    )
  ];

  setselectedOrganizers(updatedSelectedOrganizers);

  // Update the event in the database with the new selected speakers
  const updatedEvent = {
    ...event,
    selectedOrganizers: [JSON.stringify(updatedSelectedOrganizers)],
  };

  try {
    await axios.put(`http://localhost:5000/myevents/${event.conferenceId}`, updatedEvent);
    setEvent(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
  }
};

    
      const handleDeleteOrganizer = async (index) => {
        try {
          let updatedSelectedOrganizers = JSON.parse(event.selectedOrganizers[0]);
          updatedSelectedOrganizers = updatedSelectedOrganizers.filter((organizer, i) => i !== index);
          const updatedEvent = {
            ...event,
            selectedOrganizers: [JSON.stringify(updatedSelectedOrganizers)]
          };
          await axios.put(`http://localhost:5000/myevents/${event.conferenceId}`, updatedEvent);
          setEvent(updatedEvent);
        } catch (error) {
          console.error('Error deleting organizer:', error);
        }
      };
     
       const handleDeleteSpeaker = async (index) => {
        try {
            let updatedSelectedSpeakers = JSON.parse(event.selectedSpeakers[0]);
            updatedSelectedSpeakers = updatedSelectedSpeakers.filter((speaker, i) => i !== index);
          const updatedEvent = {
            ...event,
            selectedSpeakers: [JSON.stringify(updatedSelectedSpeakers)]
          };
          await axios.put(`http://localhost:5000/myevents/${id}`, updatedEvent);
          setEvent(updatedEvent);
        } catch (error) {
          console.error('Error deleting speaker:', error);
        }
      };
   
      const [newParticipant, setNewParticipant] = useState(Array(participants.length).fill(''));

  const handleInputChange = (e, index) => {
    const updatedParticipant = [...newParticipant];
    updatedParticipant[index] = e.target.value;
    setNewParticipant(updatedParticipant);
  };

  const customStyles = {
    event: {
      backgroundColor: 'rgba(255, 192, 203, 0.5)', // Pink shade color for events
      borderColor: 'rgba(255, 192, 203, 1)', // Border color for events
      color: 'black', // Text color for events
    },
  };

  // Override the default translations to match your requirements
  const customTranslations = {
    navigation: {
      day: 'Day', // You can customize other navigation options as well
    },
    event: {
      title: 'Title',
      start: 'Start',
      end: 'End',
      allDay: 'All Day',
    },
    validation: {
      required: 'Required',
      invalidEmail: 'Invalid Email',
      onlyNumbers: 'Only Numbers Allowed',
      min: 'Minimum {{min}} letters',
      max: 'Maximum {{max}} letters',
    },
    moreEvents: 'More...',
    noDataToDisplay: 'No data to display',
    loading: 'Loading...',
  };

  const handleAddRow = () => {
    const newParticipants = [...participants, newParticipant];
    setNewParticipant(Array(participants[0].length).fill(''));
    setParticipants(newParticipants);
  };
  const handleFileSelect = (file) => {
    // Handle file selection here
    console.log('Selected file:', file);
  };

      
   /*if (!event) {
      return <div>Loading...</div>;
    }*/
   const updateLocation = (newLocation) => {
        setlocation(newLocation);
      };
   
  const handleEditClick = () => {
    setEditMode(!editMode);
  };
      const handleSaveClick = async () => {
        setEditMode(!editMode)
        // Update the database with the new description
        try {
          const response = await fetch(`http://localhost:5000/myevents/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ confDescription:description }),
          });
          if (!response.ok) {
            throw new Error('Failed to update description');
          }
          // If update is successful, exit edit mode
        //  setEditMode(!editMode);
        } catch (error) {
          console.error('Error updating description:', error);
        }
      };
      const handleBoostClick = async () => {
        const confirmBoost = window.confirm('Are you sure you want to boost this conference?');
      
        if (confirmBoost) {
          try {
            const response = await axios.put(`http://localhost:5000/boostEvent/${id}`, {
              boosted: true,
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
      function scrollToSection() {
        setShowPlanning(true);
        const section = document.getElementById('planning');
        if (section) {
          const yOffset = section.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: yOffset, behavior: 'smooth' });
        }
      }
        function handleCellClick(start, end, resourceKey, resourceVal) {
          console.log('Cell clicked!');
          console.log('Start:', start);
          console.log('End:', end);
          console.log('Resource key:', resourceKey);
          console.log('Resource value:', resourceVal);
        }

        const handleConfirm = async (event1, action) => {
          console.log("handleConfirm =", action, event1);
        
          try {
            if (!event1 || !event1.title || !event1.start.toISOString() || !event1.end.toISOString()) {
              throw new Error('Invalid event data');
            }
        
            let updatedEvent;
        
            if (action === "edit") {
              try {
                console.log('Editing event:', event1);
                const response = await axios.put(`http://localhost:5000/sessions11/${event1.id}`, {
                  eventTitle: event1.title,
                  startTime: event1.start.toISOString(),
                  endTime: event1.end.toISOString(),
                });
        
                console.log('Server response (edit):', response.data);
        
                updatedEvent = { ...response.data.session, event_id: id };
                console.log('Updated event (edit):', updatedEvent);
                alert('session updated successfully');
              } catch (error) {
                console.error('Error updating session:', error);
                return;  // Exit the function if there is an error
              }
            } else if (action === "create") {
              try {
                console.log('Creating event:', event1);
                console.log(event1.title,event1.start.toISOString(),event1.end.toISOString(),id);
                const response = await axios.post('http://localhost:5000/sessions11', {
                  eventTitle: event1.title,
                  startTime: event1.start.toISOString(),
                  endTime: event1.end.toISOString(),
                  confId: id,
                });
        
                console.log('Server response (create):', response.data);
                console.log('Server response (create):', response.data);
        
                updatedEvent = { ...response.data.session, event_id: response.data.session._id || Math.random() };
                console.log('Updated event (create):', updatedEvent);
                setSessions([...sessions, updatedEvent]); 
                console.log("sessions55",sessions); 
                alert('session Created successfully');
                
              } catch (error) {
                console.error('Error creating session:', error);
                return;  // Exit the function if there is an error
              }
            }
        
            // Ensure properties are defined before setting state
            if (updatedEvent && updatedEvent.startTime && updatedEvent.endTime) {
              console.log('Setting state with updated event:', updatedEvent);
              setEventTitle(updatedEvent.eventTitle);
             
              setEndTime(new Date(updatedEvent.endTime));
              setStartTime(new Date(updatedEvent.startTime));
            } else {
              console.error('Updated event does not have start or end time', updatedEvent);
            }
          } catch (error) {
            console.error('Failed to update event:', error);
            // Handle error
          }
        };
        
        
        const fetchRemote = async (query) => {
          console.log("query",query);
        
          try {
            const response = await axios.get(`http://localhost:5000/sessions11`, {
              params: { id }
            });
            const sessions = response.data;
            console.log("sessions",sessions);
            setSessions(sessions);
            // Transform events if necessary to match your scheduler's expected format
            const formattedEvents = sessions.map(event => ({
              id: event._id,  // or event.id, depending on your schema
              title: event.eventTitle,
              start: new Date(event.startTime),  // Assuming startTime is stored as a string
              end: new Date(event.endTime)  // Assuming endTime is stored as a string
            }));
        
            return new Promise((res) => {
              setTimeout(() => {
                res(formattedEvents);
              }, 3000);
            });
          } catch (error) {
            console.error('Error fetching events:', error);
            return [];
          }
        };
        
        const handleDelete = async (deletedId) => {
          // Simulate HTTP request: return the deleted id
          return new Promise((res) => {
            setTimeout(() => {
              res(deletedId);
            }, 3000);
          });
        };
        const applyCustomColumnStyle = (cellData) => {
          const { date } = cellData;
          const targetDate = new Date('2024-05-17');
          if (date.getDate() === targetDate.getDate() && date.getMonth() === targetDate.getMonth() && date.getFullYear() === targetDate.getFullYear()) {
            return { backgroundColor: 'pink' };
          }
          return {};
        };
        const handleDateChange = (index, newDate) => {
          const updatedDates = [...datetimes];
          updatedDates[index] = newDate;
          setdatetimes(updatedDates);
        };
      
        const formatDate = (dateStr) => {
          const [year, month, day] = dateStr.split('-');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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
        <div style={{ display:"flex",flex:1 }}>
        <div  className="head-title">
        <div  className="left">
         <h1 className="google-search-heading">
        <span style={{color: '#34A853'}}>M</span>
        <span style={{color: '#EA4335'}}>y</span>{' '}{' '}
        <span style={{color: '#4285F4'}}>C</span>
        <span style={{color: '#EA4335'}}>o</span>
        <span style={{color: '#FBBC05'}}>n</span>
        <span style={{color: '#4285F4'}}>f</span>
        <span style={{color: '#34A853'}}>e</span>
        <span style={{color: '#EA4335'}}>r</span>
        <span style={{color: '#4285F4'}}>e</span>
        <span style={{color: '#34A853'}}>n</span>
        <span style={{color: '#EA4335'}}>c</span>
        <span style={{color: '#FBBC05'}}>e</span>
      </h1>
      </div>
      </div>
      <div className="conference-info" > 
      <span style={{color: '#FBBC05', marginLeft:"900px" ,marginBottom: "10px",fontWeight:"700",display:"flex",justifyContent:"flex-start"}}>Conference ID: {id}</span>
      <button className="btn" onClick={handleBoostClick} style={{ backgroundColor:"#FD7238" ,marginLeft:"900px"  }}>Boost this conference</button>
      </div>
      </div>
         <section id="admin-section" >
            {/*
         {event && (<p style={{color:"#809BCE",marginTop:"50px"}} className="title-event1">{event.confTitle}</p>)}
  */}
          <div className="splitscreen" style={{ display:"flex",position:"relative" ,flex:1,width:"100%"}}>

            <div className="left1" style={{ flex:1 ,position:"absolute"}}>
            <div className="cardDetails">
            <div className="event-details-card">
            {event && (
        <img
          src={previewImage || (event.confAffiche ? `/files/${event.confAffiche}` : "/files/conferenceAfficheDefault.jpg")}
          alt="event"
          className="event-img"
        />
      )}
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={(e) => {
          handleFileChange(e);
         // handlePosterChange(e);
        }}
      />
       <button
       htmlFor="fileInput"
          className='btn'
          style={{ position: "absolute", top: "410px", left: "250px" }}
          onClick={() => document.getElementById('fileInput').click()}
        >
          Change Poster
        </button>
   
        {event && <h2 className="title-event1" style={{ padding:"10px" }}>{event.confTitle}</h2>}
      </div>
    </div>
            </div>
            <div style={{ flex:1}} >
            <div>
    </div>
          {/*    <Bottom  /> */}
          <div>
      <div className="bottom-content1">
        <div className='section1'>
        <div className="desc-card">
        <div >
          <div className="flex-row">
      <p className="desc-title">DESCRIPTION</p>
      <span onClick={handleEditClick} ><FaEdit /></span>
      </div>
      {!editMode ? (
    <div style={{ display:"flex",flex:1 }}>
        
        {event &&( <p className="desc-info">
           {description}
          </p>)}</div>
      ) : (
        <>
            <textarea
        style={{ width: "100%", height: "150px" }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={handleSaveClick}
      />
          <button className='btn' onClick={handleSaveClick}>Save</button>
        </>
      )}
    </div>
       </div>
        <div className="details-card" style={{ marginBottom:"30px" }}>
        <span onClick={()=>setEditMode1(!editMode1)} ><FaEdit /></span>
          <div className="flex-row-vcenter" >
            {/*<img src={detailsIcon} alt="details" className="details-icon" />*/}
            <p className="details-title">DETAILS</p>
        
          </div>
          <div className="details-info flex-col">
            <div className="flex-row">
              <p className="detail-type">DateTime:</p>

             { datetimes&& datetimes.map((date, index) => (
                <input
                key={index}
                type="date"
                value={Date(date)}
                onChange={(e) => handleDateChange(index, e.target.value)}
                onBlur={handleSaveClick}
              />
              ))}
            
            </div>
            <div className="flex-row">
              <p className="detail-type">Time:</p>
              {event &&( <p className="detail-txt">{event.startTime}</p>)}
           
            {event &&(<p className="detail-txt">{event.endTime}</p>)}
            
            </div>
            <div className="flex-row">
              <p className="detail-type">Category:</p>
              {event &&(  <p className="detail-txt">{event.confCategory}</p>)}
            </div>
            <div className="flex-row">
              <p className="detail-type">Location:</p>
              {event &&(<p className="detail-txt">${event.location?event.location:"not affected yet"}</p>)}
             
            </div>
            <div className="flex-row">
              <p className="detail-type">Planning:</p>
              {event &&(<p className="detail-txt">{event.planning?<button className="btn" onClick={scrollToSection}>See planning</button>:<button className="btn" onClick={scrollToSection}>Add Planning</button>}</p>)}
             {/*{ event &&(<p className="detail-txt">$event.planning?event.planning:"not affected yet"</p>) }}*/}
             
            </div>
           
          </div>

        </div>
        </div>
        <div className="google-map-card">
          <div className="flex-row">
            {/** deescIcon */}
            <p className="desc-title">Location</p>
          
           {/**  <img src={editBlack} alt="edit" className="btn-edit" />*/}
          </div>
          {event &&( <p className="desc-info">
          <GoogleMap apiKey={"AIzaSyD_S1IidRs5XkiixAnLMkH6-r-ns3qzQw8"} updateLocation={updateLocation} location={event.location} />
          </p>)}
       
        </div>
      </div>
    </div>
            </div>
          </div>
        </section>
        <main>
        <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
					<div  className="head">
						<h3>Conference Speakers List</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Speaker Name</th>
                <th>Topic</th>
								<th>email</th>
								<th>Contact</th>
								<th>Availability</th>
								<th>Action</th>
							</tr>
						</thead>
                        {event &&(
						<tbody>
                        {selectedSpeakers.map((speaker, index) => {
                          console.log("selectedSpeakers",selectedSpeakers);
                          return (
                            <tr key={index}>
                              <td>
                                <img src={`../files/${speaker.picture}`} alt={speaker.name}></img>
                                <p>{speaker.name}</p>
                              </td>
                              <td>{speaker.role}</td>
                              <td>{speaker.email}</td>
                              <td>{speaker.contact}</td>
                              <td>{speaker.availability}</td>
                              <td>
                                <span onClick={() => handleDeleteSpeaker(index)}><MdDelete/></span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      )}
					</table>
                    <span style={{ fontSize: "20px" }} onClick={() => setshowSelectSpeaker(true)}>
      <IoIosAddCircle /> Add from my speakers list
    </span>
    {showSelectSpeaker && (
      <Form.Field required className='add-department' style={{ marginBottom: "30px" }}>
        <select
          mode="multiple"
          style={{ width: "100%", backgroundColor: "#9CBEC5", color: "#576389", fontSize: "19px", borderRadius: "5%" }}
          value={selectedSpeakers.map(speaker => JSON.stringify(speaker))}
          onChange={handleSpeakerChange}
          >
          {speakers.map((speaker, index) => (
            <option value={JSON.stringify(speaker)} key={index}>
              {speaker.name}
            </option>
          ))}
        </select>
        <button type="button" className='btn' onClick={() => this.handleOpenAdd("speaker")}>
    +
  </button>
      </Form.Field>
    )}
                    <br />
				</div>
				</div>
                </main>
        <main>
        <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#DDE5BF",color:"#53BB6F" }}>
					<div  className="head">
						<h3>Conference Organizers List</h3>
                        <span style={{ fontSize:"26px" }} ><IoIosAddCircle /></span>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Organizer Name</th>
                <th>Topic</th>
								<th>email</th>
								<th>Contact</th>
								<th>Availability</th>
								<th>Action</th>
							</tr>
						</thead>
                        {event &&(
						<tbody>
                        {selectedOrganizers.map((organizer, index) => {
                          console.log("selectedOrganizers",selectedOrganizers);
                          return (
                            <tr key={index}>
                              <td>
                                <img src={`../files/${organizer.picture}`} alt={organizer.name}></img>
                                <p>{organizer.name}</p>
                              </td>
                              <td>{organizer.role}</td>
                              <td>{organizer.email}</td>
                              <td>{organizer.contact}</td>
                              <td>{organizer.availability}</td>
                              <td>
                                <span onClick={() => handleDeleteOrganizer(index)}><MdDelete /></span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      )}
					</table>
                    <span style={{ fontSize:"20px" }} onClick={()=>setshowSelectOrganizer(true)}><IoIosAddCircle />Add from my organizers list</span>
                  {showSelectOrganizer && ( <Form.Field required className='add-departement' style={{  marginBottom:"30px" }}>
                                <select mode="multiple" style={{width:"100%",backgroundColor:"#E1EBE4",color:"#377C4A", fontSize:"19px",borderRadius:"5%"}} 
value={selectedOrganizers.map(speaker => JSON.stringify(speaker))}
  onChange={handleOrganizerChange}>
   {organizers.map((organizer, index) => (
        <option value={JSON.stringify(organizer)} key={index}>
          {organizer.name}
        </option>
      ))}
</select>
      <button type="button" style={{ backgroundColor:"#377C4A" }} className='btn' onClick={() => this.handleOpenAdd("speaker")}>
    +
  </button>
                                </Form.Field> )}
				</div>
				</div>
                </main>
                <Participants confID={id} confTitle={event&&event.confTitle} confDetails={true} handleFileSelect={handleFileSelect} />
                <main>
{ShowPlanning && (

  <section id="planning">
    <h3 style={{ color:"#809BCE" }}>Plan Your conference:</h3>
    <Scheduler ref={scheduleObj} 
    selectedDate={selectedDate} 
    //events={EVENT}
    view="day" 
    onCellClick={handleCellClick} 
   getRemoteEvents={fetchRemote}
      onConfirm={handleConfirm}
      onDelete={handleDelete}
      hourStart={0} // Start from midnight
      hourEnd={24} // End at the end of the day
      day={{ startHour: 0, endHour: 24 }}
      resizable={true}
      editable={true}
      draggable={true}
      cellRenderer={(props) => {
        const customStyle = applyCustomColumnStyle(props);
        return (
          <div className="scheduler-cell" style={customStyle}>
            {props.children}
          </div>
        );
      }}
   />
  </section>
)}

</main>

    </main>
  );
  
}

export default ConferenceDetailsSection