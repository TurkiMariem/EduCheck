import axios from 'axios';
import * as emailjs from "emailjs-com";
import Loading from 'loading';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
function Participants({confID,confDetails,handleFileSelect,confTitle }) {
  const [participants, setParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [DataToUse, setDataToUse] = useState();
  const [excelParticipants, setExcelParticipants] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchConferenceId, setSearchConferenceId] = useState('');
  const [isChecked, setIsChecked] = useState({});
  const [isCheckedFile, setIsCheckedFile] = useState(false);
  const [selectedStatuses, setselectedStatuses] = useState(['joined']);
  const [showSuggestions, setshowSuggestions] = useState(false);
  const [SelectedParticipants, setSelectedParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([participants]);
  const [participantStatus, setparticipantStatus] = useState('joined');
  const [event, setEvent] = useState();
  const [certificate, setCertificate] = useState(false);
  const [emailDetails, setEmailDetails] = useState({
    fromEmail: '',
    fromName: '',
    toEmail: '',
    toName: '',
    subject: '',
    textPart: '',
    htmlPart: ''
  });
  const handleCheckAll = (event) => {
    const { checked } = event.target;
    setIsCheckedAll(checked);
    const newIsChecked = {};
    {confDetails&&
    participants.forEach((part, index) => {
      newIsChecked[index] = checked;
    });}
    {!confDetails&&
      allParticipants.forEach((part, index) => {
      newIsChecked[index] = checked;
    });}

    setIsChecked(newIsChecked);
  };
  const handleSearchClick = () => {
    setShowSearchInput(!showSearchInput);
};

const handleInputChange = (e) => {
    setSearchConferenceId(e.target.value);
};
  const handleCheck = (index, checked) => {
    setIsChecked((prev) => ({ ...prev, [index]: checked }));
  };
  const handleFileCheck = ( checked) => {
    setIsCheckedFile( checked);
  };
  const ExcelJS = require('exceljs');
  async function addParticipantsToExcel(e,participants) {
    console.log("participants",SelectedParticipants);
    console.log("addParticipantsToExcel participants",participants);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Participants');
  
    // Add headers
    sheet.addRow(['ID','Name', 'Email', 'Interest', 'Affiliate', 'Contact', 'Status']);
    // Add participant data
    participants.forEach(participant => {
      sheet.addRow([
        participant._id,
        participant.name,
        participant.email,
        participant.interest,
        participant.affiliate,
        participant.contact,
        participant.status
      ]);
    }) 
  
    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `participants${confID}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  
    console.log('Participants added to Excel file successfully');
  }
  const isButtonEnabled = Object.values(isChecked).some((value) => value);


  const selectedRows = Object.keys(isChecked || {})
  .filter((index) => isChecked[index])
  .map((index) => parseInt(index));
  console.log("selectedRows", selectedRows);

  useEffect(() => {
    console.log("hello");
  const selectedParticipants = participants.filter((_, index) => selectedRows.includes(index));
  console.log("selectedParticipants", selectedParticipants);
  setSelectedParticipants(selectedParticipants);

    console.log("confDetails", confDetails);
    const fetchParticipant = async () => {
      const confEmail = localStorage.getItem('confEmail');
      console.log("confEmail", confEmail);
        const statusQuery = selectedStatuses.length > 0 ? `&status=${selectedStatuses.join(',')}` : '';
        console.log("statusQuery", statusQuery);
        try {
        const eventResponse = await axios.get(`http://localhost:5000/participants/?conferenceId=${confID}${statusQuery}`);
        setParticipants(eventResponse.data);
        console.log("eventResponse heyyy", eventResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const fetchAllParticipants = async () => {
      const confEmail = localStorage.getItem('confEmail');
      console.log("confEmail", confEmail);
      const statusQuery = selectedStatuses.length > 0 ? `&status=${selectedStatuses.join(',')}` : '';
      console.log("statusQuery", statusQuery);
      try {
        const eventResponse = await axios.get(`http://localhost:5000/participants/?confEmail=${confEmail}${statusQuery}`);
        setAllParticipants(eventResponse.data);
        console.log("allParticipants", eventResponse.data);
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };
  
    console.log("confIDconfID", confID);
    fetchParticipant();
    fetchAllParticipants();
  
    if (searchConferenceId !== '') {
    const filtered = participants.filter(participant => participant.conferenceId === searchConferenceId);
      console.log("filtered", filtered);
      setFilteredParticipants(filtered);
    }
    console.log("participants", participants);
  
  }, [selectedStatuses, confID, searchConferenceId]); // Added necessary dependencies
  
////////////////////////////////////////



 const handleStatusSelection = (status) => {
    if (selectedStatuses.includes(status)) {
      setselectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
     setselectedStatuses([...selectedStatuses, status]);
    }
};

const sendEmail = async (participant) => {
  console.log('l email de send is', event.userEmail);
  // Ajouter le code pour envoyer les données du formulaire à la base de données ici
  const templateParams = {
  from_name: `${event.confTitle} Conference team`,
  to_name:participant[0],
  to_email: participant[1],
  imageURL:`files/${event.confAffiche}`,
  message: `Congratulation, your request to join conference ${event.confTitle} is accepted ! be there in  ${event.datetimes} at ${event.location}`
};
//console.log('les parametres email sont:',this.state.address);
//parametres de api emailjs
emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams, 'UBJPOXynwuM1qwZMP')
.then((result) => {
    console.log(result.text);
  }, (error) => {
    console.log(error.text);
  });
}; 
async function updateParticipantsStatus(e, status) {
  console.log(status);
  e.preventDefault();

  const selectedRows = Object.keys(isChecked || {})
      .filter((index) => isChecked[index])
      .map((index) => parseInt(index));
  console.log("selectedRows", selectedRows);

  const updatedParticipants = [...allParticipants];

  for (let i = 0; i < selectedRows.length; i++) {
      const index = selectedRows[i];
      console.log("index",index);
      console.log(updatedParticipants[index]);
      const participantID = updatedParticipants[index]._id;

      try {
          const response = await fetch(`http://localhost:5000/participants/${participantID}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: status }),
          });
          if (!response.ok) {
              throw new Error('Failed to update participant status');
          }
          console.log(`Participant ${status} successfully`);
          //await sendEmailjet('accepted','')
          updatedParticipants[index].status = status;
          setParticipants(updatedParticipants);
      } catch (error) {
          console.error('Error updating participant status:', error);
      }
  }

  //alert(`${selectedRows.length} Participants were ${status} successfully!`);
  toast.success(`${selectedRows.length} Participants were ${status} successfully!`);
  const selectedParticipants = allParticipants.filter((_, index) => selectedRows.includes(index));
  const selectedParticipants2 = excelParticipants.filter((_, index) => selectedRows.includes(index));
  console.log("selectedParticipants", selectedParticipants);
  if (isCheckedFile) {
      addParticipantsToExcel(selectedParticipants);
  }
  setIsChecked({});
}

async function updateParticipantStatus(e, participantID, index, status) {
  console.log(status);
  e.preventDefault();
  const loadingElement = document.getElementById('loading1');
  loadingElement.style.display = 'flex';
  try {
    const updatedParticipants = [...allParticipants];
    const response = await fetch(`http://localhost:5000/participants/${participantID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update participant status');
    }
    console.log('Participant status updated successfully:', participants[participantID]);
    //await sendEmailjet(status, '');
    updatedParticipants[index].status = status;
    setParticipants(updatedParticipants);
  } catch (error) {
    console.error('Error updating participant status:', error);
  } finally {
    loadingElement.style.display = 'none';
  }
  toast(`Participant ${status} successfully!`);
}

  

const fileInputRef = useRef(null);

const handleUploadXLSXFile = async (e) => {
 
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log('jsonData', jsonData);
    const confEmail = localStorage.getItem('confEmail');
    for (let i = 1; i < jsonData.length; i++) {
      const participant = jsonData[i];
      const participantResponse = await fetch('http://localhost:5000/participants', {
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
          conferenceId: confID,
          confEmail: confEmail,
        }),
      });
      if (!participantResponse.ok) {
        throw new Error('Failed to add participant');
      }
      console.log('Participant added successfully!');
    
    }
    toast.success(`${jsonData.length-1} Participants added successfully!`);
  };
  reader.readAsArrayBuffer(file);
};

const handleReject = (e) => {
  e.preventDefault();
  const confirmation = window.prompt('To confirm deletion, type "reject":');
  if (confirmation && confirmation.toLowerCase() === 'reject') {
      // Perform the deletion operation
      console.log('Deletion confirmed!');
      updateParticipantsStatus(e,'rejected');
      
  } else {
      console.log('Deletion canceled.');
  }
};
const navigate = useNavigate();
const certificateParticipants = async (e) => {
// setCertificate(true);
e.preventDefault();
const selectedParticipantsConf = participants.filter((_, index) => isChecked[index]);
//navigate('/certificate', { state: { participants: selectedParticipantsConf,confDetails:"true",confId:confID,confTitle:confTitle } });
navigate('/generateCertificate', { state: { participants: selectedParticipantsConf,confDetails:"true",confId:confID,confTitle:confTitle } });
}

const DeleteParticipant = () => {
  const updatedExcelParticipants = excelParticipants.filter((participant, index) => !isChecked[index]);
  setExcelParticipants(updatedExcelParticipants);
  toast.success('Participant(s) deleted successfully!');
};

const handleChange = async(e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Concatenate the new data with the existing excelParticipants
      setExcelParticipants((prevParticipants) => [...prevParticipants, ...jsonData]);

      // Upload the file to the server (if needed)
      const formData = new FormData();
      formData.append('file', file);
      await axios.post('http://localhost:5000/upload', formData);

    } catch (error) {
      console.error('Error handling file upload:', error);
    }
}
};

  
  const statusSuggestions = ['joined', 'accepted', 'rejected', 'certified'];
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
       <div id="loading1" style={{
                    display: "none",
                    zIndex: 5000,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(200, 200, 200, 0.5)",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                <Loading  size="large1" colors={["#D4DDEE", "#DDE5BF", "#FFF2C6", "#FFE0D3"]} />
                </div>
      {!confDetails &&(
      <div className="head-title">
        <div className="left">
          <h1 className="google-search-heading">
    <span style={{color: '#4285F4'}}>P</span>
    <span style={{color: '#EA4335'}}>a</span>
    <span style={{color: '#FBBC05'}}>r</span>
    <span style={{color: '#34A853'}}>t</span>
    <span style={{color: '#EA4335'}}>i</span>
    <span style={{color: '#4285F4'}}>c</span>
    <span style={{color: '#EA4335'}}>p</span>
    <span style={{color: '#FBBC05'}}>a</span>
    <span style={{color: '#4285F4'}}>n</span>
    <span style={{color: '#34A853'}}>t</span>
    <span style={{color: '#EA4335'}}>s</span>
          </h1>
        </div>
      </div>)}
      <div className="table-data">
        <div className="order" style={{ backgroundColor: confDetails?"#FFE0D3":"#D4DDEE" }}>
          <div className="head">
            <h3 style={{ color:confDetails?"#FD7238":"#4285F4" }}>Your Joined Participant List</h3>
            <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
            <input style={{ color:confDetails?"#FD7238":"#4285F4" }} type="file" onChange={handleUploadXLSXFile} /> 
            <i className='bx bx-search' onClick={handleSearchClick}></i>
                    {showSearchInput && (
                        <input
                            type="text"
                            placeholder="Enter conference ID"
                            value={searchConferenceId}
                            onChange={handleInputChange}
                        />
                    )}
            <div style={{ position:"relative" }}>
            <i style={{ position:"absolute"}} className='bx bx-filter' onClick={()=>{console.log(!showSuggestions); setshowSuggestions(!showSuggestions)}}></i>
            {showSuggestions && (
                <ul style={{ zIndex:1000,position:"absolute",right:"100%",top:"100%",backgroundColor:"#fff" ,padding:"20px",borderRadius:"20%"}}>
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
          </div>
          <table>
            <thead>
              <tr>
        <th>
          <input
              type="checkbox"
              checked={isCheckedAll}
              onChange={handleCheckAll}
          />
        </th>
                <th>Participant Name</th>
                <th>Email</th>
                <th>Why Interested?</th>
                <th>Contact</th>
        <th>Affiliate</th>
                <th>Status</th>
        <th>Session Attended</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {confDetails?participants.map((participant, index) => {
                return (
                  <tr key={index}>
                     <td><input type="checkbox"
                checked={isChecked[index] || false}
                onChange={(e) => handleCheck(index, e.target.checked)}/>
            </td>
                    <td>
                      <p>{participant.name}</p>
                    </td>
                    <td>{participant.email}</td>
                    <td>{participant.interest}</td>
                    <td>{participant.contact}</td>
                    <td>{participant.affiliation}</td>
                    <td style={{ left: "20px" }}>
                {participant.status === "joined" && (
                    <span className="status process">Joined</span>
                )}
                {participant.status === "accepted" && (
                    <span className="status yes">Accepted</span>
                )}
                {participant.status === "rejected" && (
                    <span className="status no">Rejected</span>
                )}
                {participant.status === "certified" && (
                    <span className="status completed">Certified</span>
                )}
            </td>
            <td>All</td>
           
      <td>
      {participant.status === "rejected" && ( <button className="status yes" onClick={(e) =>updateParticipantStatus(e,participant._id,index,'accepted')}>Add</button>)}
        {participant.status === "joined" && (<div><button className="status no" onClick={(e) =>updateParticipantStatus(e,participant._id,index,'rejected')}>Reject</button>
        <button className="status yes" onClick={(e) =>updateParticipantStatus(e,participant._id,index,'accepted')}>Add</button></div>
    )}
        {participant.status === "accepted" && (<button className="status completed" onClick={(e) =>updateParticipantStatus(e,participant._id,index,'certified')}>Certificate</button>)}
        {participant.status === "certified" && (<button className="status pending" onClick={(e) =>updateParticipantStatus(e,participant._id,index,'certified')}>See Certificate</button>)}
        </td>
                  </tr>
                 
                );
              }):allParticipants.map((participant, index) => {
                return (
                  <tr key={index}>
                     <td><input type="checkbox"
                checked={isChecked[index] || false}
                onChange={(e) => handleCheck(index, e.target.checked)}/>
            </td>
                    <td>
                      <p>{participant.name}</p>
                    </td>
                    <td>{participant.email}</td>
                    <td>{participant.interest}</td>
                    <td>{participant.contact}</td>
                    <td>{participant.affiliation}</td>
                    <td style={{ left: "20px" }}>
                {participant.status === "joined" && (
                    <span className="status process">Joined</span>
                )}
                {participant.status === "accepted" && (
                    <span className="status yes">Accepted</span>
                )}
                {participant.status === "rejected" && (
                    <span className="status no">Rejected</span>
                )}
                {participant.status === "certified" && (
                    <span className="status completed">Certified</span>
                )}
            </td>
            <td>All</td>
      <td>
      {participant.status === "rejected" && ( <button className="status yes" onClick={(e) =>updateParticipantStatus(e,participant._id,index,'accepted')}>Add</button>)}
        {participant.status === "joined" && (<div><button className="status no" onClick={(e) =>updateParticipantStatus(e,participant._id,index,'rejected')}>Reject</button>
        <button className="status yes" onClick={(e) =>updateParticipantStatus(e,participant._id,index,'accepted')}>Add</button></div>
    )}
        {participant.status === "accepted" && (<button className="status completed" onClick={(e) =>updateParticipantStatus(e,participant._id,index,'certified')}>Certificate</button>)}
        {participant.status === "certified" && (<button className="status pending" onClick={(e) =>updateParticipantStatus(e,participant._id,index,'certified')}>See Certificate</button>)}
        </td>
                  </tr>
                );
              })}
             
            </tbody>
            
          </table>
          <td style={{display:"flex", flex:1,width:"100%"}}><input type="checkbox"
                checked={isCheckedFile || false}
                onChange={(e) => handleFileCheck( e.target.checked)}/>
                <p>Want to Export Excel File having the list of the selected participants ?</p>
            </td>
            <td>
            <div style={{ display:"flex",flex:1,justifyItems:"space-between" }}>
              {isButtonEnabled&&( <button style={{ color:"#53BB6F",backgroundColor:"#DDE5BF",marginRight:"50px"}}  onClick={(e) =>updateParticipantsStatus(e,'accepted')}>Accept </button>)}
              {isButtonEnabled&&( <button style={{ color:"#EA4335",backgroundColor:"#F8C0BB",marginRight:"50px"}}  onClick={(e) =>handleReject(e)}>Reject </button>)}
              {isButtonEnabled&&( <button style={{ color:"#FFCE26",backgroundColor:"#FFF2C6",marginRight:"50px"}}  onClick={(e) =>certificateParticipants(e)}>Certificate </button>)}
              {isButtonEnabled&&( <button style={{ color:"#809BCE",backgroundColor:"#D4DDEE",marginRight:"50px"}}  onClick={(e) =>addParticipantsToExcel(e,SelectedParticipants)}>Export XLSX File </button>)}
          </div>
          </td>
          
        </div>
      </div>
      {certificate&&(
        <main>
        {/*  <Certificate /> */}
        </main>
      )}
    </main>
  );
}

export default Participants;
