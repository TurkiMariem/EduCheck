import axios from 'axios';
// import { response } from 'express';
import React, { useEffect, useRef, useState } from 'react';
import { SiQuicklook } from 'react-icons/si';
import { useParams } from 'react-router-dom';
import '../components/conference/style.css';
import { getContractInstanceConf, getContractInstanceInst } from '../contractServices';

import './VerifyDiploma.css';
function VerifyDiploma() {
  const [get, setGet] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [certificate, setCertificate] = useState();
  const [diploma, setDiploma] = useState();
  const [participantData, setParticipantData] = useState();
  const [certificateDate, setCertificateDate] = useState('');
  const [IpfsfileUrl, setIpfsFileUrl] = useState('');
  const [conference, setConference] = useState('');
  const [StudentData, setStudentData] = useState();
  const moment = require('moment');

  //récupérer l'id depuis la requete
  const { id } = useParams();

  useEffect(() => {
    const getFileUrl = async (hash) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/getFileUrlFromIPFS/${hash}`
        );
        console.log("fileUrl diploma", response.data);
        setIpfsFileUrl(response.data.url)
        return response.data.url;
      } catch (error) {
        console.error('Error fetching file URL from IPFS:', error);
        return null;
      }
    };

    const fetchDiplomaData = async () => {
      try {
        const contract = await getContractInstanceInst();
        const response = await contract.instance.methods
          .getDiplomaById(id)
          .call();
        const responseCin = await contract.instance.methods
          .getDiplomaByCin(id)
          .call();
        console.log('responseDiploma2', response);
        console.log('responseDiplomaCin', responseCin);
       
          setDiploma(response);
       
          fetchStudentData(response.studentId);
        //getEvent(response.confId);
        setGet(response.mention);
       
        if (response.status === 'Validated') {
          const imageUrl = await getFileUrl(response.ipfsHash);
          setImageUrl(imageUrl);
          console.log(imageUrl);
          return response.studentId;
        } else {
          console.log('Diploma not validated');
         // setGet('')
          return null;
        }
      } catch (error) {
        console.error('Error fetching certificate data:', error);
        return null;
      }
    };

    const fetchCertificateData = async () => {
      try {
        const contract = await getContractInstanceConf();
        const response = await contract.instance.methods
          .getCertificateOfDiplomaId(id)
          .call();
       
        console.log('responseDiploma', response);
          setCertificate(response);
          setGet(response.participantId);
        fetchParticipantData(response.participantId);
       // getEvent(response.confId);
        //const event=getEvent("6656ff8f0d6bfb49c29537fb");
      //  console.log("event",conference);
        const formattedDate = moment.unix(response.timestamp).format('YYYY-MM-DD HH:mm:ss');
        setCertificateDate(formattedDate);
        console.log(formattedDate);
        if (response.validated === 'Validated') {
          const imageUrl = await getFileUrl(response.diplomaHash);
          setImageUrl(imageUrl);
          console.log(imageUrl);
          //setGet(response.ipfsHash);
          return response.participantId;
        } else {
          console.log('Diploma not validated');
       
          return null;
        }
      } catch (error) {
        console.error('Error fetching certificate data:', error);
        return null;
      }
    };
    const getEvent = async (id) => {
      try {
        const response = await axios.get(`http://localhost:5000/events/${id}`);
        if (response.status === 200) {
          console.log('Event data:', response.data);
          setConference(response.data)
          return response.data;
        } else {
          console.error('Event not found');
          return null;
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        return null;
      }
    };

    const fetchParticipantData = async (participantId) => {
      if (!participantId) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/participants/${participantId}`
        );
        setParticipantData(response.data);
        console.log('participantData', response.data);
      } catch (error) {
        console.error('Error fetching participant data:', error);
      }
    };
    const fetchStudentData = async (participantId) => {
      if (!participantId) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/students/${participantId}`
        );
        setStudentData(response.data);
        console.log('participantData', response.data);
      } catch (error) {
        console.error('Error fetching participant data:', error);
      }
    };

   fetchCertificateData();
   fetchDiplomaData();
console.log("get",get);
  }, [id]);

  const previousGetRef = useRef(get);

  useEffect(() => {
    if (previousGetRef.current !== get) {
      // The 'get' state has changed, handle your logic here
      console.log("The 'get' state has changed to:", get);
      // Add any additional logic that should run when 'get' changes
    }
    previousGetRef.current = get; // Update the ref to the current value of 'get'
  }, [get]);

  /*if (get!==''||null) {
    return <div>

     <div className="verify-diploma-container ">
      <h1 style={{ color: '#CCE0EC',marginTop:"50px" }}>Diploma Verification For ID : </h1>
      <h4 style={{ color: '#CCE0EC' }}>{id}</h4>
      <div className="content-container" style={{ display:'flex',flex: 1}}>
        <div id="contentV">
          <h2>Diploma Not Registered </h2>
          <img src={"../certifNotValide.png"}></img>
          </div>
          </div>
          </div>
      </div>
  } */

  return (
    <div className='verify-diploma'>
    <div className="verify-diploma-container ">
      <h1 style={{ color: '#CCE0EC' ,marginTop:"50px"}}>Diploma Verification For ID : </h1>
      <h4 style={{ color: '#CCE0EC' }}>{id}</h4>
      <div className="content-container" style={{ display:'flex',flex: 1}}>
        <div id="contentV">
          <main>
            <div className="table-data">
              <div
                className="order"
                style={{ backgroundColor: '#D4DDEE', color: '#809BCE' }}
              >
                <div className="head">
                  <h3 style={{color:"#7F7FB7"}}>Participant Informations</h3>
                  <i className="bx bx-search"></i>
                  <i className="bx bx-filter"></i>
                </div>
                <table>
                  {participantData&&(
                    <thead>
                      <div>
                      <tr>
                        <th>Participant Name</th>
                        <td>{participantData.name}</td>
                      </tr>
                      <tr>
                        <th>Participant Email</th>
                        <td>{participantData.email}</td>
                      </tr>
                      <tr>
                        <th>Participant Contact</th>
                        <td>{participantData.contact}</td>
                      </tr>
                      <tr>
                        <th>Affiliation</th>
                        <td>{participantData.affiliation}</td>
                      </tr>
                      <tr>
                        <th>Diploma Url</th>
                        <td>
                        <a href={`http://localhost:8080/ipfs/${certificate.diplomaHash}`} target="_blank" rel="noopener noreferrer" style={{ color:"#FD7238" }}>  <SiQuicklook /> See Diploma File</a>
                        </td>
                      </tr>
                      <tr>
                        <th>Certified Date</th>
                        <td>{certificateDate}</td>
                      </tr>
                      
                      <tr>
                        <th>Conference Id</th>
                        <td>{participantData.conferenceId}</td>
                      </tr>
                     {/* <tr>
                        <th>Conference Name</th>
                        <td>{conference.confTitle}</td>
                      </tr>
                      <tr>
                        <th>Conference Date</th>
                        <td>{conference.datetimes}</td>
                      </tr>
                      <tr>
                        <th>Conference Category</th>
                        <td>{conference.confCategory}</td>
                      </tr> */}
                      </div>
                    </thead>
                  )}
                  {StudentData&&(
                    <thead>
                      <div style={{ fontWeight:600,fontSize:"20px" }}>
                      <tr>
                        <th>Student Id</th>
                        <td>{StudentData._id}</td>
                      </tr>
                      <tr>
                        <th>Student Name</th>
                        <td>{StudentData.studentName}</td>
                      </tr>
                      <tr>
                        <th>Student Email</th>
                        <td>{StudentData.studentEmail}</td>
                      </tr>
                      <tr>
                        <th>Student CIN</th>
                        <td>{StudentData.StudentCIN}</td>
                      </tr>
                      <tr>
                        <th>Student BirthDay</th>
                        <td>{StudentData.birthDay}</td>
                      </tr>
                      <tr>
                        <th>Student Mention</th>
                        <td>{StudentData.mention}</td>
                      </tr>
                      <tr>
                        <th>Diplomated Day</th>
                        <td>{StudentData.remiseDay}</td>
                      </tr>
                      <tr>
                        <th>Diploma Name</th>
                        <td>{StudentData.diplomeName}</td>
                      </tr>
                      <tr>
                        <th>Diploma Ref</th>
                        <td>{StudentData.diplomeRef}</td>
                      </tr>
                      <tr>
                        <th>Diploma Hash</th>
                        <td>{diploma.ipfsHash}</td>
                      </tr>
                      <tr>
                        <th>Diploma Url</th>
                        <td>
                        <a href={`http://localhost:8080/ipfs/${diploma.ipfsHash}`} target="_blank" rel="noopener noreferrer" style={{ color:"#FD7238" }}>  <SiQuicklook /> See Diploma File</a>
                        </td>
                      </tr>
                      
                      </div>
                    </thead>
                  )}

                  <tbody></tbody>
                </table>
              </div>
              <main>
            <div className="table-data">
              <div className="order" style={{ backgroundColor: '#FFF2C6', color: '#FBCB25' }}
              >
                <div className="head">
                  <h3 style={{color:"#FBCB25"}}>Participant Diploma Image</h3>
                 
                </div>
                <table>
                <div >
        {certificate && <img src={`http://localhost:8080/ipfs/${certificate.diplomaHash}`} alt="Diploma" />}
        {diploma && <img src={`http://localhost:8080/ipfs/${diploma.ipfsHash}`} alt="Diploma" />}
      </div>
                </table>
                </div>
                </div>
</main>

            </div>
     
          </main>
          <br />
        
</div>
        </div>
        
     <div className='verify-diploma'><br></br><br></br> <br></br> <br></br> <br></br> <br></br> </div>
      </div> 
      </div>
   
  );
}

export default VerifyDiploma;
