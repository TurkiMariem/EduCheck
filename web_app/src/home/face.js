import axios from 'axios';
import { getContractInstanceInst } from 'contractServices';
import CryptoJS from 'crypto-js';
import Loading from 'loading';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Web3 from 'web3';
import './Parallax.css';
async function startVideo() {
  const video = document.getElementById('video');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('MediaDevices API or getUserMedia not supported in this browser.');
      return;
  }

  try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;

      video.onloadedmetadata = () => {
          video.play().catch(error => {
              console.error('Error playing video:', error);
          });
      };
  } catch (error) {
      if (error.name === 'NotAllowedError') {
          console.error('Permission denied: Unable to access camera.');
      } else if (error.name === 'NotFoundError') {
          console.error('No camera found on this device.');
      } else {
          console.error('Error accessing camera:', error);
      }
  }
}


function captureImage() {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
}
function processFaceDetection(data) {
  if (data.length > 0) {
    const face = data[0];

    console.log('Face detected:');
    console.log(`Anger Likelihood: ${face.angerLikelihood}`);
    console.log(`Blurred Likelihood: ${face.blurredLikelihood}`);
    console.log(`Detection Confidence: ${face.detectionConfidence}`);
    console.log(`Headwear Likelihood: ${face.headwearLikelihood}`);
    console.log(`Joy Likelihood: ${face.joyLikelihood}`);
    console.log(`Landmarking Confidence: ${face.landmarkingConfidence}`);
    console.log(`Pan Angle: ${face.panAngle}`);
    console.log(`Roll Angle: ${face.rollAngle}`);
    console.log(`Sorrow Likelihood: ${face.sorrowLikelihood}`);
    console.log(`Surprise Likelihood: ${face.surpriseLikelihood}`);
    console.log(`Tilt Angle: ${face.tiltAngle}`);
    console.log(`Under Exposed Likelihood: ${face.underExposedLikelihood}`);
    console.log(`Bounding Poly:`, face.boundingPoly);
    console.log(`Face Landmarks:`, face.landmarks);
    
  } else {
    console.log('No face detected.');
  }
}
function Facee(props) {
  const location = useLocation();
  const navigate = useNavigate(); // Correctly use useNavigate hook
  const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  const [login, setLogin] = useState(props.login === true || location.state?.login);
  const [email, setEmail] = useState(props.email);
  const [passwordHashInst, setpasswordHashInst] = useState(props.passHash);
  const [loading, setLoading] = useState(false);
  const { v5: uuidv5 } = require('uuid');     
  const hash = CryptoJS.SHA256(email).toString();
  const uuid = uuidv5(hash, NAMESPACE);
  const { id } = useParams();
  console.log(login);
  console.log(props);
  console.log(props.email);
  console.log(email);
  console.log(uuid);

  useEffect(() => {
    startVideo();
  }, []);

  const handleRegister = async () => {
    setLoading(true);
    const imageSrc = captureImage();
    console.log("imageSrc", imageSrc);
    const blob = await fetch(imageSrc).then(res => res.blob());
    const formData = new FormData();
    formData.append('userId', id);
    formData.append('image', blob, 'image.jpg');

    try {
      const response = await axios.post(`http://localhost:3001/registerFace`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert("Face Registered Successfully");
      processFaceDetection(response.data);
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const imageSrc = captureImage();
    console.log(imageSrc);
    const blob = await fetch(imageSrc).then(res => res.blob());
    const formData = new FormData();
    formData.append('userId', uuid);
    formData.append('image', blob, 'image.jpg');

    try {
      const response = await axios.post(`http://localhost:3001/loginFace`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert("FaceId Check Valid! User authenticated successfully");
      const storageContractInst = await getContractInstanceInst();
      if (!storageContractInst || !storageContractInst.instance) {
        console.error("Erreur lors de la récupération de l'instance du contrat Inst");
        return;
      }
        //vérifier la prémire adresse de compte connectée
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
      const AuthorizedInst = await storageContractInst.instance.methods.authorizedInstitute(email, passwordHashInst).call({ from: accountAddress,gas:500000});
      console.log(email,passwordHashInst);
      console.log("le role Institute est ", AuthorizedInst);
      if(AuthorizedInst==="officier"){
        window.alert('You will now be redirected to the institute dashboard.');
        navigate('/institute');}
        else if(AuthorizedInst==="validator"){
          window.alert('You will now be redirected to the institute dashboard.');
          navigate('/validator');}
    
    } catch (error) {
      console.error('Error logging in:', error);
      window.alert('Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!login ? (
        <div className='facee'>
          <h2 style={{ padding: "50px" }}>Face Id Registration</h2>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%", maxWidth: "800px", position: "relative", margin: "auto", backgroundColor: "#C5E1CF", borderRadius: "5%" }} className="video-container">
            <video style={{ height: "100%", width: "90%", margin: "30px", borderRadius: "10%" }} id="video" autoPlay></video>
            <button style={{ backgroundColor: "#FFF", color: "#8099CC", position: "relative", justifyContent: "center", alignItems: "center" }} className="btn" id="capture-button" onClick={handleRegister}>Register</button>
          </div>
          {loading && (
            <div id="loading" style={{
              display: "flex",
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
              <Loading size="large1" colors={["#D4DDEE", "#DDE5BF", "#FFF2C6", "#FFE0D3"]} />
            </div>
          )}
        </div>
      ) : (
        <div style={{ paddingBottom: "50px", height: "100%", width: "100%", backgroundImage: "linear-gradient(#9CBEC5, #7F78B1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h2 style={{ color: "#8099CC" }}>Face Recognition Check</h2>
          <video style={{ height: "100%", width: "65%", borderRadius: "10%" }} id="video" autoPlay></video>
          <button style={{ backgroundColor: "#8099CC", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }} className="btn" onClick={handleLogin}>Login</button>
          {loading && (
            <div id="loading" style={{
              display: "flex",
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
              <Loading size="large1" colors={["#D4DDEE", "#DDE5BF", "#FFF2C6", "#FFE0D3"]} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Facee;
