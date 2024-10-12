import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FcViewDetails } from 'react-icons/fc';
import { SiQuicklook } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import Web3 from "web3";
import { getContractInstanceConf } from "../../contractServices";
function CertificateTable() {
    const [certificates, setCertificates] = useState([]);
	const userEmail=localStorage.getItem('confEmail');
	const [certificatesWithUrls, setCertificatesWithUrls] = useState([]);
  const [confsIds, setconfsIds] = useState();
  const [Events, setEvents] = useState([]);
  const moment = require('moment');

 const getFileUrlFromIPFS = async (hash) => {
    try {
      const response = await axios.get(`http://localhost:5000/getFileUrlFromIPFS/${hash}`);
      return response.data.url;
    } catch (error) {
      console.error('Error fetching file URL from IPFS:', error);
    }
  };
  useEffect(() => {
    const fetchCertifs = async () => {
      try {
        const storageContract = await getContractInstanceConf();
        if (!storageContract || !storageContract.instance) {
          console.error("Error retrieving contract instance");
          return;
        }
  
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const accountAddress = accounts[0];
        console.log("Transaction address:", accountAddress);
  
        const certificates = await storageContract.instance.methods.getCertificatesForConfEmail(userEmail).call();
        console.log("Certificates fetched successfully", certificates);
        setCertificates(certificates);
        return certificates;
      } catch (err) {
        console.error("Error calling getCertificatesForConfEmail:", err);
      }
    };
  
    const fetchUrls = async (certificates) => {
      const updatedCertificates = await Promise.all(certificates.map(async (task) => {
        const fileUrl = await getFileUrlFromIPFS(task.diplomaHash);
        return { ...task, fileUrl };
      }));
      setCertificatesWithUrls(updatedCertificates);
    };
  
    const fetchEvents = async (certificates) => {
      const values = new Set(certificates.map((array) => array[2]));
      const uniqueValues = Array.from(values);
      console.log("Unique Values:", uniqueValues);
      setconfsIds(uniqueValues);
  
      for (const id of uniqueValues) {
        try {
          const eventResponse = await axios.get(`http://localhost:5000/events/${id}`);
          setEvents((prevEvents) => [...prevEvents, eventResponse.data]);
          console.log("Events:", eventResponse.data);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      }
    };
  
    const fetchData = async () => {
      const certificates = await fetchCertifs();
      if (certificates && certificates.length > 0) {
        await fetchUrls(certificates);
        await fetchEvents(certificates);
      }
    };
  
    fetchData();
  }, []);
  const navigate=useNavigate();
  const handleDetailsClick = (event, diplomaId) => {
    event.preventDefault();
    const url = `${window.location.origin}/verifier/${diplomaId}`;
    window.open(url, '_blank');
  };
  return (
    <main>

<div  className="table-data">
 <div  className="order"  style={{ backgroundColor:"#FFE0D3" ,color:"#FD7238"}}>
     <div  className="head">
         <h3>Participants Certificates</h3>
         <i  className='bx bx-search' ></i>
         <i  className='bx bx-filter' ></i>
     </div>
     <table>
  <thead>
    <tr>
      <th>Conference Id</th>
      <th>Conference Name</th>
      <th>Participant ID</th>
      <th>Participant Name</th>
      <th>Diploma Url</th>
      <th>Certified at</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    {certificatesWithUrls&&certificatesWithUrls.map((task, index) => {
      // Find the event corresponding to the task.confId
      const event = Events.find(event => event._id === task.confId);

      return (
        <tr key={index}>
          <td>{task.confId}</td>
          <td>{event ? event.confTitle : 'Conference Title Not Found'}</td>
          <td>{task.participantId}</td> 
          <td>{task.participantId}</td> 
          <td>
            <a href={task.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color:"#FD7238" }}>  <SiQuicklook /> See Diploma File</a>
          </td>
          <td>{moment.unix(task.timestamp).format('YYYY-MM-DD HH:mm:ss')}</td> {/* Assuming event.endAt exists */}
          <td>
          <a
      href={`/verifier/${task.diplomaId}`}
      onClick={(event) => handleDetailsClick(event, task.diplomaId)}
      style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
    >
      <FcViewDetails /> More Details
    </a>
              </td>
        </tr>
      );
    })}
  </tbody>
</table>

     </div>
</div>

    </main>
  )
}

export default CertificateTable;