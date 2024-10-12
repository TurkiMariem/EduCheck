import axios from "axios";
import * as emailjs from "emailjs-com";
import React, { useEffect, useState } from "react";
import { SiQuicklook } from "react-icons/si";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from "web3";
import * as XLSX from 'xlsx';
import { getContractInstanceConf } from "../../contractServices";
import Alert from "../alert";
const ConferenceList=()=>{
  const [conferences, setConferences] = useState([]);
  const [events, setEvents] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(['created']);
  const [showAlertApproved, setShowAlertApproved] = useState(false);
  const [showAlertRejected, setShowAlertRejected] = useState(false);
  const [confEmail, setConfEmail] = useState(false);
  const [FilteredEvents, setFilteredEvents] = useState();
const [status, setStatus] = useState(false);
const [confUpdate, setConfUpdate] = useState(false);

      const fetchConferences = async () => {
  try {
    const storageContract = await getContractInstanceConf();
        if (!storageContract || !storageContract.instance) {
      console.error("Error retrieving contract instance");
          return;
        } 

    const Conference = await storageContract.instance.methods.getConferences().call({ gas: 500000 });
    console.log("Conferences", Conference);
    setConferences(Conference);
            } catch (err) {
    console.error("Error calling getConferences():", err);
    // Handle error, e.g., show a message to the user
  }
};

  useEffect(() => {
    const fetchBoostedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/boosted-events');
        console.log("boostedevents",response.data);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching boosted events:', error);
      }
    };

    fetchBoostedEvents();
  }, []);
const fetchEvents = async (selectedStatuses) => {
  try {
    const statusQuery = selectedStatuses.length > 0 ? `status=${selectedStatuses.join(',')}` : '';
    console.log("statusQuery", statusQuery);
    const url = `http://localhost:5000/events?${statusQuery}`;
    console.log("conef listt");
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    const data = await response.json();
    console.log('Fetched events:', data);
    setEvents(data);

    // Filter events based on conference references
    const filteredEvents = conferences.map(([address, ref]) => {
      return data.filter(event => event.conferenceId === ref);
    }).filter(eventsArray => eventsArray.length > 0);

    console.log("filteredEvents", filteredEvents);
    setFilteredEvents(filteredEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

useEffect(() => {
  fetchConferences();
}, [confUpdate]);

useEffect(() => {
  if (conferences.length > 0) {
    fetchEvents(selectedStatuses);
  }
}, [selectedStatuses, conferences]);


  const handleCloseAlert = () => {
      setShowAlertRejected(false);
      setShowAlertApproved(false);
  };

  const sendEmail = async (conf) => {
    const emailConf=conf.confEmail;
    console.log("emailConf",emailConf);
    setConfEmail(emailConf);
    const address= conf.adresseEthereum || 'N/A';;
    const ConfTitle= conf.title;
    const ConferenceID= conf.ref;
    // Ajouter le code pour envoyer les données du formulaire à la base de données ici
    const templateParams = {
    address,
     ConfTitle: conf.title,
     ConferenceID: conf.ref,
    to_email: emailConf ,// Utilisez l'adresse de destination récupérée à partir du champ "email" du formulaire
    message: `You recent created conference with id :${ConferenceID} 'and title:${ConfTitle} ' \nBlockchain Address: ${address}\n is now approved and active successfully .`
  };
    emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams, 'UBJPOXynwuM1qwZMP')
      .then((result) => {
      console.log(result.text);
      toast.success("COnfrence Acceptation email sent to the conferencier ",emailConf)
    }, (error) => {
      console.log(error.text);
    });
  };
  const updateConferenceStatus = async (conferenceRef, newStatus) => {
    console.log("start updateConferenceStatus",conferenceRef,newStatus);
    try {
      const storageContract = await getContractInstanceConf();   
      if (!storageContract || !storageContract.instance) {
        console.error("Error retrieving contract instance");
                return;
              }            
      //const address = this.props.usedAddress.adresse;
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    console.log("l adresse de transaction est ",accountAddress);
     const rr= await storageContract.instance.methods.updateConferenceStatus(conferenceRef, newStatus).send({ from: accountAddress, gas: 500000 });
      console.log("Conference status updated successfully");
      toast.success("Conference status updated successfully");
      setStatus(!status);
  console.log("Conference status rr",rr);
    } catch (err) {
      console.error("Error calling updateConferenceStatus:", err);
      // Handle error, e.g., show a message to the user
    }
  };
  const updateEventStatusInMongoDB = async (confRef, status) => {
    try {
      const response = await fetch(`http://localhost:5000/myevents/${confRef}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update event status in MongoDB');
      }
  
      toast.success('Conference status updated successfully');
      const responseData = await response.json();
      console.log("MongoDB response", responseData);
      return responseData;
    } catch (error) {
      console.error('Error updating event status in MongoDB:', error);
      toast.error('Failed to update conference status');
    }
  };
 const addParticipantsFromExcel = async (conf) => {
  console.log("addParticipantsFromExcel function");
    console.log("conference",conf);
    try {
   
      const response = await axios.get(`/files/${conf.confParticipants}`, { responseType: 'arraybuffer' });
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      for (let i = 1; i < jsonData.length; i++) {
        const participant = jsonData[i];
        const participantResponse = await fetch(`http://localhost:5000/participants`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: participant[0],
            email: participant[1],
            affiliation: participant[4],
            interest: participant[2],
            contact: participant[3],
            status: 'joined',
            sessions: 'all',
            conferenceId: conf._id,
          }),
        });
        if (!participantResponse.ok) {
          throw new Error('Failed to add participant');
        }
      }
      console.log('Participant added successfully!');
      toast.success('Participant added successfully!');
    } catch (error) {
      console.error('Error processing Excel file:', error);
    }
  };
  
  const handleSubmit = async (status,conf) => {
    if(status==='rejected'){
    const note = prompt('Do you want to add a note explaining the rejection to the conferencier ?');
    if (note !== null) {
setRejectNote(note);
        console.log('Note added:', note);
    } else {
        // User clicked Cancel in the prompt dialog
        console.log('No note added');
    }
    sendEmailReject(conf);
  }
  if (status === 'approved') {
    try {
      // Update status to approved in blockchain
      const updateConfStatus = await updateConferenceStatus(conf.conferenceId, status);
      console.log("updateConfStatus", updateConfStatus);
      console.log("conf.ref", conf.conferenceId);

      // Update status to approved in MongoDB
      await updateEventStatusInMongoDB(conf.conferenceId, status);
      setShowAlertApproved(true);
    setConfUpdate(!confUpdate);
 // Add participants
 const addPart = await addParticipantsFromExcel(conf);
 console.log("addPart",addPart);
      const s = await sendNotification(`Your conference Id ${conf.conferenceId} titled: ${conf.confTitle} has been approved`, "EduCheck Server", conf.userEmail, 'approved');
      
      console.log(s);
      console.log(addPart);
      
      // Uncomment to send an email if needed
      // sendEmail(conf);
    } catch (error) {
      console.error('Error updating MongoDB:', error);
    }
  }
   else if(status==='rejected'){
      const response = await fetch(`http://localhost:5000/myevents/${conf.conferenceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update event status');
      }
      setShowAlertRejected(true);
      const s=await sendNotification( `Your conference Id ${conf.conferenceId} has been rejected`,"EduCheck Server",conf.userEmail,'rejected');
      console.log(s);
      }
  };

  const sendEmailReject = async (conf) => {
    const emailConf=conf.userEmail;
    console.log("emailConf",emailConf);
    setConfEmail(emailConf);
    const address=conf.address || 'N/A';
    const ConfTitle= conf.confTitle;
    const ConferenceID= conf.conferenceId;
    console.log('l email de send is', emailConf);
    // Ajouter le code pour envoyer les données du formulaire à la base de données ici
    const templateParams = {
    address,
     ConfTitle: conf.confTitle,
     ConferenceID: conf.conferenceId,
    rejectNote,
    to_email: emailConf ,// Utilisez l'adresse de destination récupérée à partir du champ "email" du formulaire
    message: `We are sorry to inform you that Your recent created conference with id : ${conf.conferenceId} 'and title: ${conf.confTitle} ' \nBlockchain Address: ${address}\n has been rejected . ${rejectNote} . our agent will call you and explain you more , thanks for understanding and have a great day !`
  };
  //console.log('les parametres email sont:',this.state.address);
  //parametres de api emailjs
    emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams, 'UBJPOXynwuM1qwZMP')
      .then((result) => {
      console.log(result.text);
      toast.success("Rejected email has been sent to the conferencier ",emailConf)
    }, (error) => {
      console.log(error.text);
    });
    
    
  };
  //envoyer une notification au conferencier 
  const sendNotification = async (content, from, to,type) => {
    try {
      const response = await fetch('http://localhost:5000/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, from, to ,type}),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
  
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:5000/notifications/${notificationId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
  
      console.log('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

    const handleOpenFile = (fileUrl) => {
      const iframeContainer = document.createElement('div');
      iframeContainer.style.position = 'fixed';
      iframeContainer.style.top = '0';
      iframeContainer.style.left = '0';
      iframeContainer.style.width = '100%';
      iframeContainer.style.height = '100%';
      iframeContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent gray background
      iframeContainer.style.display = 'flex';
      iframeContainer.style.alignItems = 'center';
      iframeContainer.style.justifyContent = 'center';
      iframeContainer.style.zIndex = '9999'; // Ensure the container is on top of other elements
    
      const iframe = document.createElement('iframe');
      iframe.src = fileUrl;
      iframe.style.maxWidth = '800px'; // Set max width to 800px
      iframe.style.width = '80%';
      iframe.style.height = '80%';
      const closeButton = document.createElement('button');
      closeButton.innerText = 'Close';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '10px';
      closeButton.style.right = '10px';
      closeButton.addEventListener('click', () => {
        document.body.removeChild(iframeContainer);
      });
    
      iframeContainer.appendChild(closeButton);
      iframeContainer.appendChild(iframe);
      document.body.appendChild(iframeContainer);
    };
    const handleOpenFileXlsx = (fileUrl) => {
      fetch(fileUrl)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          const data = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const htmlTable = XLSX.utils.sheet_to_html(sheet);
    
          const iframe = document.createElement('iframe');
          iframe.style.position = 'fixed';
          iframe.style.top = '50%';
          iframe.style.left = '50%';
          iframe.style.transform = 'translate(-50%, -50%)';
          iframe.style.width = '80%';
          iframe.style.height = '80%';
          iframe.style.backgroundColor = 'white';
          iframe.style.border = '1px solid #ccc';
          iframe.style.zIndex = '1000';
    
          // Wait for the iframe to load before accessing its contentDocument
          iframe.addEventListener('load', () => {
            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.addEventListener('click', () => document.body.removeChild(iframe));
            iframe.contentDocument.body.appendChild(closeButton);
          });
    
          iframe.srcdoc = htmlTable;
          document.body.appendChild(iframe);
        })
        .catch(error => {
          console.error('Error loading Excel file:', error);
        });
    };    
    const handleStatusSelection = (status) => {
      if (selectedStatuses.includes(status)) {
          setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
      } else {
          setSelectedStatuses([...selectedStatuses, status]);
      }
  };
  function shortenAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 4)}..${address.substring(address.length - 2)}`;
  }
    const statusSuggestions = ['created', 'completed', 'approved', 'rejected', 'certified','Boost request'];
  return(
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
      <h1 className="google-search-heading">
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
    <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
					<div  className="head">
						<h3 style={{ color:"#4285F4" }}>List of created conferences</h3>
            <div style={{ position:"relative" }}>
            <i style={{ position:"absolute"}} className='bx bx-filter' onClick={() => setShowSuggestions(!showSuggestions)}></i>
            {showSuggestions && (
                <ul style={{ position:"absolute", right:"100%",top:"100%",backgroundColor:"#fff" ,padding:"20px",borderRadius:"20%"}}>
                    {statusSuggestions.map((status, index) => (
                         <li key={index} style={{ marginRight: '10px', marginBottom: '5px' }}>
                         <label style={{ display: 'flex', alignItems: 'center' }}>
                             <input
                                 type="checkbox"
                                 checked={selectedStatuses.includes(status)}
                                 onChange={() => handleStatusSelection(status)}
                             />
                             <td><span style={{ marginLeft: '5px' }} className={`status yes`}>{status}</span></td>
                         </label>
                     </li>
                    ))}
                </ul>
            )}
            </div>
          {/*  <p>Selected Status: {selectedStatus}</p>*/}
						<i  className='bx bx-search' ></i>
					</div>
    <table>
      <thead>
							<tr style={{  marginRight:"20px" }}>
								<th>Conference Address</th>
								<th>Conference Title</th>
								<th>Conference Email</th>
								<th>Conference Description</th>
							  <th>speakers</th> 
							  <th>organizers</th> 
							  <th>participants</th>
								<th>Affiche</th>
								<th>Location</th>
								<th>TimeLine</th>
								<th>Start Time</th>
								<th>End Time</th>
                <th>Conference Status</th>
								<th>Action</th>
        </tr>
      </thead>
						<tbody style={{right:"20px"}}>

						{Array.isArray(FilteredEvents) && FilteredEvents.map((confArray, index) => (
  confArray.map((conf, subIndex) => {
    let ss = '';
    if (conf.status === 'created') {
      ss = 'pending';
    } else if (conf.status === 'completed') {
      ss = 'completed';
    } else if (conf.status === 'approved') {
      ss = 'process';
    } else if (conf.status === 'rejected') {
      ss = 'no';
    } else if (conf.status === 'certified') {
      ss = 'yes';
    }
    let sss = conf.status;

    return (
      <tr key={`${index}-${subIndex}`} style={{ marginRight: "20px" }}>
        <td style={{ left: "20px" }}>{shortenAddress(conf.address)}</td>
        <td style={{ left: "20px" }}>{conf.confTitle}</td>
        <td style={{ left: "20px" }}>{conf.userEmail}</td>
        <td style={{ maxWidth: "50px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conf.confDescription}</td>
        <td style={{left:"20px"}}><SiQuicklook onClick={() => handleOpenFileXlsx(`http://localhost:5000/files/${conf.confParticipants}`)} />
  Quick Look</td>
<td style={{left:"20px"}}><SiQuicklook onClick={() => handleOpenFileXlsx(`http://localhost:5000/files/${conf.confParticipants}`)} />
  Quick Look</td>

        <td style={{ left: "20px" }}>
  <SiQuicklook onClick={() => handleOpenFileXlsx(`http://localhost:5000/files/${conf.confParticipants}`)} />
  Quick Look
</td>
        <td style={{ left: "20px" }}>
  <SiQuicklook onClick={() => handleOpenFile(`http://localhost:5000/files/${conf.confAffiche}`)} />
  Quick Look
</td>
       
        <td style={{left:"20px"}}>{conf.location}</td>
        <td style={{ left: "20px", width: "120px", whiteSpace: "nowrap" }}>
  {conf.datetimes && conf.datetimes.split(',').map((date, index) => (
    <div key={index} style={{ display: "block" }}>{date}</div>
  ))}
</td>

<td style={{ left: "20px",width:"80px" }}>
  {conf.startTime && conf.startTime[0] && conf.startTime[0].split(',').map((time, index) => (
    <div key={index} style={{ display: "flex", flex: 1  }}>{time}</div>
  ))}
</td>
<td style={{ left: "20px" }}>
  {conf.endTime && conf.endTime[0] && conf.endTime[0].split(',').map((time, index) => (
    <div key={index} style={{ display: "flex", flex: 1  }}>{time}</div>
  ))}
</td>
        <td style={{marginRight:"20px"}}><span className={`status ${ss}`}>{conf.status}</span></td>
        <td style={{ left: "20px" }}>
                {conf.status === "approved" && (
                    <button className="status no" onClick={() => { sendEmailReject(conf); handleSubmit('rejected', conf); setSelectedIndex(index) }}>Rejecter</button>
                )}
                {(conf.status === "rejected" || conf.status === "created") && (
                  <div>
                    <button className="status yes" onClick={() => {  handleSubmit('approved', conf); setSelectedIndex(index) }}>Approve</button>
                    <button className="status pending" onClick={() => { sendEmailReject(conf); handleSubmit('rejected', conf); setSelectedIndex(index) }}>Delete</button>
                    </div>
                )}
                {(conf.status === "created") && (
                  <div>
                    <button className="status no" onClick={() => { sendEmailReject(conf); handleSubmit('rejected', conf); setSelectedIndex(index) }}>Rejecter</button>
                    </div>
                )}
            </td>
       </tr>)})))}
      </tbody>
    </table>
    </div>
    </div>
    <div>
            {showAlertApproved && (
                <Alert message="Event status updated to approved!" type="success" onClose={handleCloseAlert}/>
            )}
            {showAlertRejected && (
                <Alert message="Event status updated to rejected!" type="error" onClose={handleCloseAlert}/>
            )}
    </div>
    </main>

  );
};
export default ConferenceList