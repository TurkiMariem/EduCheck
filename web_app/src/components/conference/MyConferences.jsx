import * as emailjs from "emailjs-com";
import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { SiQuicklook } from "react-icons/si";
import { Link } from 'react-router-dom';
import Web3 from "web3";
import * as XLSX from 'xlsx';
import { getContractInstanceConf } from "../../contractServices";
import Certificate from "./Certificate";
import CreateConference from "./CreateConference";
import './style.css';
const MyConferences=()=>{
  const [conferences, setConferences] = useState([]);
  const [events, setEvents] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [confAddress, setConfAddress] = useState(null);
  const [confID, setConfID] = useState(null);
  const [confId, setConfId] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [showMyConferences, setShowMyConferences] = useState(true);
  const [certificatedConfId, setCertificatedConfId] = useState();
  const [index, setIndex] = useState();
  const [showSuggestions, setShowSuggestions] = useState(false);
const [selectedStatuses, setSelectedStatuses] = useState(['created']);
  const handleScrollToSection =(confid) => {
    setConfId(confid);
    setIsVisible(true);
    setIsEditing(true);
console.log("confID",confid);
    const section = document.getElementById('update-conf-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }


 const handleCertificateConference = async (id,index) => {
  console.log("id",id);
  setShowMyConferences(false);
  setShowCertificates(true);
  setCertificatedConfId(id);
  setIndex(index);
}
 const handleDeleteConference = async (id) => {
  console.log("id",id);
  const token = localStorage.getItem('token');
  console.log("tokenid",token);
  try {
    const response = await fetch(`http://localhost:5000/myevents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete conference');
    }
    // Remove the deleted conference from the local state
    setEvents(events.filter(conf => conf._id !== id));
    alert('Conference deleted successfully');
  } catch (error) {
    console.error('Error deleting conference:', error);
    alert('Failed to delete conference');
  }
};

  const sendEmail = async () => {
    console.log("l id de conference est ",events[selectedIndex]._id);
    const emailConf="dorrachakroun13@gmail.com";
    const address= events[selectedIndex].address;
    console.log('l email de send is', emailConf);
    // Ajouter le code pour envoyer les données du formulaire à la base de données ici
    const templateParams = {
    address: events[selectedIndex].address,
   // ConfTitle: events[selectedIndex].confTitle,
    //ConferenceID: events[selectedIndex]._id,
    to_email: emailConf ,// Utilisez l'adresse de destination récupérée à partir du champ "email" du formulaire
    message: `You recent created conference with id : 'and title: ' \nBlockchain Address: ${address}\nYou could now add transaction to your blockchain`
  };
  //console.log('les parametres email sont:',this.state.address);
  //parametres de api emailjs
    emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams, 'UBJPOXynwuM1qwZMP')
      .then((result) => {
      console.log(result.text);
      alert("email sent to the conferencier ",emailConf)
    }, (error) => {
      console.log(error.text);
    });
  };
  const handleSubmit = async (e) => {
    //e.preventDefault();
    setConfAddress(events[selectedIndex].address);
    setConfID(events[selectedIndex]._id);
  //l'automatisation de l'adresse ethereum 
  const storageContract= await getContractInstanceConf();   
  console.log("instance chargée");
  if (!storageContract || !storageContract.instance) {
  console.error("Erreur lors de la récupération de l'instance du contrat");
  return;
  } 
  //const {address, idAddress, selectedConfInfo}=this.state;
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  const accountAddress = accounts[0];
  console.log(accountAddress);
  console.log("l adresse de transaction est ",confAddress);
  
  try{
    console.log("l id de conference est ",confID);
      const ajout=await storageContract.instance.methods.addConference(
        confAddress,/*ref*/confID).send({
        from: accountAddress,
      });
      if (ajout.status === true) {
          console.log("Conference added successfully!");
          sendEmail();
       // this.updateAccountProperty( idAddress, selectedConfInfo.name );

        } else {
          alert("La transaction a échoué");
        }
      } 
      catch (error) {
          alert("Institute address or reference already exist");
      }
  };

  const sendEmailReject = async () => {
    const emailConf="dorrachakroun13@gmail.com";
    const address= events[selectedIndex].address;
    console.log('l email de send is', emailConf);
    // Ajouter le code pour envoyer les données du formulaire à la base de données ici
    const templateParams = {
    address: events[selectedIndex].address,
   // ConfTitle: events[selectedIndex].confTitle,
    //ConferenceID: events[selectedIndex]._id,
    to_email: emailConf ,// Utilisez l'adresse de destination récupérée à partir du champ "email" du formulaire
    message: `We are sorry to inform you that Your recent created conference with id : 'and title: ' \nBlockchain Address: ${address}\n has been rejected . You could try another time`
  };
  //console.log('les parametres email sont:',this.state.address);
  //parametres de api emailjs
    emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams, 'UBJPOXynwuM1qwZMP')
      .then((result) => {
      console.log(result.text);
      alert("Rejected email has been sent to the conferencier ",emailConf)
    }, (error) => {
      console.log(error.text);
    });
    
    
  };
  //envoyer un email d'information
  const sendNotification= async () => {
    const templateParams1 = {
      to_email: 'dorrachakroun13@gmail.com',
      subject: 'Notification : Conference approuved',
      message:'Your recent created conference has been successfully added.'
    };
    emailjs.send('service_ts9gwnu','template_67607bd', templateParams1, 'UBJPOXynwuM1qwZMP')
    .then((result) =>{
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
  };
    useEffect(() => {
      const confEmail = localStorage.getItem('confEmail');
        console.log("confEmailllll",confEmail);
      const fetchEvents = async () => {
        const token = localStorage.getItem('token');
if (!token) {
  console.error('Token not found');
  console.log('Token not found');
  // Handle this case (e.g., redirect to login page)
  return;
}
        try {
          const statusQuery = selectedStatuses.length > 0 ? `status=${selectedStatuses.join(',')}` : '';
          console.log("statusQuery",statusQuery);
          console.log("conf token",token);
          const confEmail = localStorage.getItem('confEmail');
          const response = await fetch(`http://localhost:5000/myevents?confEmail=${confEmail}&${statusQuery}`,
         { method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
          if (!response.ok) {
            throw new Error('Failed to fetch events');
          }
          const data=await response.json();
          console.log("data",data);
      setEvents(data);
          //this.setState({universities : data});
          console.log('Fetched events:', events);
          
          return data;
        } catch (error) {
          console.error('Error fetching events:', error);
          return null;
        }
      };
      const fetchConferences = async () => {
        const storageContract= await getContractInstanceConf();   
        if (!storageContract || !storageContract.instance) {
          console.error("Erreur lors de la récupération de l'instance du contrat");
          return;
        } 
       
            try {
              const Conference = await storageContract.instance.methods.getConferences().call();
              setConferences(Conference);
            } catch (err) {
                console.error("Erreur lors de l'appel à getInstitute():", err);
                return;
              }            
          
            console.log("Information of added conference:", conferences);

      };
console.log(events);
     fetchConferences();
     fetchEvents();
    }, [selectedStatuses]);
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
    const handleStatusSelection = (status) => {
      if (selectedStatuses.includes(status)) {
          setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
      } else {
          setSelectedStatuses([...selectedStatuses, status]);
      }
  };

    const statusSuggestions = ['created', 'completed', 'approved', 'rejected', 'certified'];
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
    

  return(
    <div>
   {showMyConferences &&( <main>
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
						<h3>List of created conferences</h3>
						<i  className='bx bx-search' ></i>
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
					</div>
					<table>
						<thead>
							<tr >
								{/*<th>Conferencier Address</th>*/}
								<th>Conference Title</th>
								<th>Conference category</th>
								<th>Conference Description</th>
							  <th>Speakers</th>
							  <th>Organizers</th>
                <th>Participants</th>
								<th>Affiche</th>
								<th>Location</th>
								<th>Date</th>
								<th>Start Time</th>
								<th>End Time</th>
								<th>Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody style={{right:"20px"}}>
            {Array.isArray(events) && events.map((conf,index) => {
                let ss='';
                if(conf.status ==='created'){
                  ss='pending';
                }else if(conf.status ==='completed'){
                  ss='completed'
                }else if(conf.status ==='approved'){
                  ss='process'
                }else if(conf.status ==='rejected'){
                  ss='no'
                }else if(conf.status ==='certified'){
                  ss='yes'
                }
                const baseUrl = 'http://localhost:5000';
                console.log(conf);
    return (
      <tr key={index} style={{marginRight:"20px"}}>
      {/*  <td style={{left:"20px"}}>{conf.address}</td>*/}
        <td style={{left:"20px"}}>{conf.confTitle}</td>
        <td style={{left:"20px"}}>{conf.confCategory}</td>
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
        <td style={{left:"20px"}}>
          {/** send email to conf that its approuved */}
          {conf.status === "approved" && (
  <span style={{ display: 'inline-block', whiteSpace: "nowrap" }}>
    <Link className='btn status completed' style={{ display: 'inline-block',border:"2px solid white" }} to={`/conference/${conf._id}`}><FaEdit/>Open for More Details</Link>
  </span>
)}

          <button className='btn status pending' onClick={() => handleScrollToSection(conf._id)}>Edit<FaEdit/></button>
          <button className='btn status no' onClick={() => handleDeleteConference(conf._id)}>Delete<AiFillDelete /></button>
          <button className='btn status yes' onClick={() => handleCertificateConference(conf._id,index)}>Certificate</button>
        </td>
       </tr>)})}
						</tbody>
					</table>
				</div>
    </div>
    </main>)}
    {showCertificates &&(
      <Certificate confId={certificatedConfId} confParticipants={events[index].confParticipants}/>
    )}

   {isVisible&& <section id="update-conf-section">
  <CreateConference  confId={confId} isEditing={true}/>
</section>}
    </div>

  );
};
export default MyConferences