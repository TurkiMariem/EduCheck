import axios from 'axios';
<<<<<<< HEAD
// import { response } from 'express';
=======
import { response } from 'express';
>>>>>>> hello/dorra
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getContractInstanceConf } from '../../contractServices';
import '../components/conference/style.css';
import './VerifyDiploma.css';
function VerifyDiploma() {
  const [get, setGet] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [certificate, setcertificate] = useState();
  const [participantData, setParticipantData] = useState();
  const [certificateDate, setCertificateDate] = useState('');
  //récupérer l'id depuis la requete
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const contract = await getContractInstanceConf();
      //appel de la fonction getDiplomaBuId qui recupère les informations des etudiants depuis l'id de l'url
<<<<<<< HEAD
      const response = await contract.instance.methods
        .getCertificateOfDiplomaId(id)
        .call();
      console.log('responseDiploma', response);
      setcertificate(response);
      //récupérer le hash de diplome
      const imageUrl = await getFileUrlFromIPFS(response.diplomaHash);
      /*const certifiedDate = new Date(response.timestamp * 1000);
=======
      const response = await contract.instance.methods.getCertificateOfDiplomaId(id).call();
      console.log("responseDiploma",response);
      setcertificate(response);
      //récupérer le hash de diplome 
      const imageUrl = await getFileUrlFromIPFS(response.diplomaHash);
   /*const certifiedDate = new Date(response.timestamp * 1000);
>>>>>>> hello/dorra
      console.log('certified Date:', certifiedDate.toString());
      // You can also add this readable date to the response if needed
      setCertificateDate(certifiedDate.toISOString()); */

<<<<<<< HEAD
      if (response.validated === 'Validated') {
=======
      if (response.validated === "Validated") {
>>>>>>> hello/dorra
        setGet(response);
        setImageUrl(imageUrl);
      } else {
        console.log('Diploma not validated');
      }
    }
<<<<<<< HEAD
    const fetchParticipantData = async id => {
      try {
        await fetchData();
        const response = await axios.get(
          `http://localhost:5000/participants/${certificate.participantId}`
        );
        setParticipantData(response.data);
        console.log(participantData);
      } catch (error) {
        console.error('Error fetching participant data:', error);
      }
    };
    if (id !== '') {
=======
    const fetchParticipantData = async (id) => {
     
      try {
        await fetchData();
        const response = await axios.get(`http://localhost:5000/participants/${certificate.participantId}`);
          setParticipantData(response.data);
          console.log(participantData);
      } catch (error) {
          console.error('Error fetching participant data:', error);
      }
  };
    if (id !== '') {
     
>>>>>>> hello/dorra
      fetchParticipantData();
    } else {
      console.log('Diploma not registered');
    }
<<<<<<< HEAD
  }, [id, participantData]);
=======
  }, [id,participantData]);
>>>>>>> hello/dorra

  if (get) {
    return <div>Diploma not registered...</div>;
  }

  return (
<<<<<<< HEAD
    <div className="verify-diploma-container">
      <h1 style={{ color: '#CCE0EC' }}>Diploma Verification For ID : </h1>
      <h4 style={{ color: '#CCE0EC' }}>{id}</h4>
      <div className="content-container">
        <div id="content">
          <main>
            <div className="table-data">
              <div
                className="order"
                style={{ backgroundColor: '#D4DDEE', color: '#809BCE' }}
              >
                <div className="head">
                  <h3 color="#7F7FB7">Participant Informations</h3>
                  <i className="bx bx-search"></i>
                  <i className="bx bx-filter"></i>
                </div>
                <table>
                  {participantData && (
                    <thead>
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
                        <td>{participantData.name}</td>
                      </tr>
                      <tr>
                        <th>Conference Id</th>
                        <td>{response.condId}</td>
                      </tr>
                      <tr>
                        <th>Conference Name</th>
                        <td>{response.condId}</td>
                      </tr>
                      <tr>
                        <th>Certified Date</th>
                        <td>{response.condId}</td>
                      </tr>
                    </thead>
                  )}

                  <tbody></tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="image-container">
        {imageUrl && <img src={imageUrl} alt="Diploma" />}
      </div>
      <div className="home-button-container">
        <Link to="/" className="home-button">
          Home
        </Link>
      </div>
    </div>
  );
}

export default VerifyDiploma;
=======
    <div className="verify-diploma-container" >
      <h1 style={{ color:"#CCE0EC" }}>Diploma Verification For ID : </h1>
      <h4 style={{ color:"#CCE0EC" }}>{id}</h4>
      <div className="content-container">
          <div id='content' >
      <main>
      <div  className="table-data">
 <div  className="order"  style={{ backgroundColor:"#D4DDEE" ,color:"#809BCE"}}>
     <div  className="head">
         <h3 color='#7F7FB7'>Participant Informations</h3>
         <i  className='bx bx-search' ></i>
         <i  className='bx bx-filter' ></i>
     </div>
     <table>
      {participantData&&(
        <thead>
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
      <td>{participantData.name}</td>
      </tr>
      <tr>
      <th>Conference Id</th>
      <td>{response.condId}</td>
      </tr>
      <tr>
      <th>Conference Name</th>
      <td>{response.condId}</td>
      </tr>
      <tr>
      <th>Certified Date</th>
       <td>{response.condId}</td>
      </tr>
  </thead>
      )}
  
  <tbody>
  
  </tbody>
</table>
     </div>
</div>
      </main>
      </div>
      </div>
      <div className="image-container">
      {imageUrl && <img src={imageUrl} alt="Diploma" />}
      </div>
      <div className="home-button-container">
          <Link to="/" className="home-button">Home</Link>
      </div>
    </div>
   
  );
}

export default VerifyDiploma;
>>>>>>> hello/dorra
