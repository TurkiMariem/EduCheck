import axios from 'axios';
import bcrypt from 'bcryptjs';
import Alert from 'components/alert';
import sha256 from 'crypto-js/sha256';
import * as emailjs from "emailjs-com";
import Loading from 'loading';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Message } from 'semantic-ui-react';
import { sendDiplomaEmail } from 'sendEmail';
import Web3 from 'web3';
import { getContractInstanceConf, getContractInstanceInst } from '../contractServices';
import * as Components from './Components';
import Facee from './face';
const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

function Sign () {
const [signIn, toggle] = useState(true);
const [universitiesData, setUniversitiesData] = useState('');
const [institutes, setInstitutes] = useState('');
const [universities, setUniversities] = useState('');
const [registerConf, setRegisterConf] = useState(false);
const [registerInst, setRegisterInst] = useState(false);
const [loginConf, setLoginConf] = useState(false);
const [loginInst, setLoginInst] = useState(true);
const [forgotConf, setForgotConf] = useState(false);
const [forgotInst, setForgotInst] = useState(false);
const [interfaceName, setInterfaceName] = useState('');
const [passwordInst, setPasswordInst] = useState('');
const [passwordConf, setPasswordConf] = useState('');
const [passwordConf1, setPasswordConf1] = useState('');
const [emailInst, setEmailInst] = useState("admin@example.com");
const [emailConf, setEmailConf] = useState("admin@example.com");
const [newPasswordConf, setNewPasswordConf] = useState('');
const [newPasswordConf1, setNewPasswordConf1] = useState('');
const [newPasswordInst, setNewPasswordInst] = useState('');
const [newPasswordInst1, setNewPasswordInst1] = useState('');
const [passwordHashInst, setpasswordHashInst] = useState('');
const [alertMessage, setAlertMessage] = useState('');
const [code, setCode] = useState("");
const [enteredCode, setEnteredCode] = useState("");
const [showLoginForm, setShowLoginForm] = useState(true);
const [showConfForm, setShowConfForm] = useState(true);
const [showResetPasswordFormInst, setShowResetPasswordFormInst] = useState(false);
const [showResetPasswordFormConf, setShowResetPasswordFormConf] = useState(false);
const [loggedIn, setLoggedIn] = useState(false);
const [diplomaId, setDiplomaId] = useState(null);
//// institute Register
const [universityName, setuniversityName] = useState('');
const [instName, setinstName] = useState('');
const [instAcronym, setinstAcronym] = useState('');
const [instRef, setinstRef] = useState('');
const [officerEmail, setofficerEmail] = useState('');
const [validatorEmail, setvalidatorEmail] = useState('');
const [contact, setcontact] = useState(null);
const [website, setwebsite]= useState('');
const [statusInst, setstatusInst]= useState("created");
//// Conferencier Register
const [confName, setconfName] = useState('');
const [confEmail, setconfEmail] = useState('');
const [confPassword, setconfPassword] = useState('');
const [organisation, setorganisation] = useState('');
const [organisationPref, setOrganisationPref] = useState('');
const [confContact, setconfContact] = useState('');
const [confBio, setconfBio] = useState('');
const [confProfilePicture, setconfProfilePicture] = useState('');
const [status, setStatus]= useState(false);
const [publicUni, setPublicUni]= useState(true);
const [privateUni, setPrivateUni]= useState(false);
const [showFace, setshowFace] = useState(false);
const lang=localStorage.getItem('lang') ;
const { i18n, t } = useTranslation();

useEffect(() => {
  fetchInstitutes();
  i18n.changeLanguage(lang);
  console.log("langgg",lang);
/** */
}, [])



const checkAuthorizationInst = async (e) => {
    e.preventDefault();
    const loadingElement = document.getElementById('loading');
      loadingElement.style.display = 'flex';
    //appele de la focntion getContractInstancde d'aprés contractServices.js qui fait l'automatisation de l'adresse ethereum de deploiement
    const storageContractInst = await getContractInstanceInst();
    if (!storageContractInst || !storageContractInst.instance) {
      console.error("Erreur lors de la récupération de l'instance du contrat Inst");
      return;
    }
    //hacher le mot de passe avec sha256, sha256 retourne un binaire donc ce pourquoi on utlise toString pour le transforme en chaine de caractère
    const passwordHashInst = sha256(passwordInst).toString();
    setpasswordHashInst(passwordHashInst);
    console.log("Password hash:", passwordHashInst);
    //vérifier la prémire adresse de compte connectée
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    //const gasEstimate = await storageContractInst.instance.methods.checkAuthorization(emailInst, passwordHashInst).estimateGas({ from: accountAddress });
    //console.log("Gas Estimate:", gasEstimate);
    const isAuthorized = await storageContractInst.instance.methods.checkAuthorization(emailInst, passwordHashInst).call({ from: accountAddress});
    //const institute = await storageContractInst.instance.methods.getInstitute(0).call({ from: accountAddress });
    //console.log(institute);
    const AuthorizedInst = await storageContractInst.instance.methods.authorizedInstitute(emailInst, passwordHashInst).call({ from: accountAddress,gas:500000});
    console.log(emailInst,passwordHashInst);
    console.log("le role Institute est ", AuthorizedInst);
    loadingElement.style.display = 'none';
    const institute= await storageContractInst.instance.methods.getInstituteByEmail(emailInst).call();
    console.log("institute",institute);
  
    if (isAuthorized) {
     
      setshowFace(true);
      handleSignClick("admin");
      console.log("role admin ", isAuthorized);
    }

    if (AuthorizedInst === "officier") {
      const institute= await storageContractInst.instance.methods.getInstituteByEmail(emailInst).call();
      console.log("institute",institute);
      localStorage.setItem('emailOff',institute[3]);
      localStorage.setItem('emailValid',institute[4]);
      localStorage.setItem('instituteID',institute[1]);
      const emailOff=localStorage.getItem('emailOff');
      const emailValid=localStorage.getItem('emailValid');
      const instituteID=localStorage.getItem('instituteID');
      console.log("emailOff",emailOff);
      console.log("emailValid",emailValid);
      console.log("instituteId",instituteID);
      setshowFace(true);
     
     // handleSignClick("institute");

    } else if (AuthorizedInst === "validator") {
      localStorage.setItem('emailOff',institute[3]);
      localStorage.setItem('emailValid',institute[4]);
      localStorage.setItem('instituteID',institute[1]);
      const emailOff=localStorage.getItem('emailOff');
      const emailValid=localStorage.getItem('emailValid');
      const instituteID=localStorage.getItem('instituteID');
      console.log("emailOff",emailOff);
      console.log("emailValid",emailValid);
      console.log("instituteId",instituteID);
      setshowFace(true)
      localStorage.setItem('validatorEmail',institute.emailValid);
     // handleSignClick("validator");
    }else{
      console.log("valoff");
    }

 }
 async function loginConferencier(e) {
  e.preventDefault();
  try {
    const response = await axios.post(`http://localhost:5000/loginConferencier`, {
      email: emailConf,
      password: passwordConf,
    });
    console.log('Response:', response.data);
    const token = response.data.token;
    console.log('TokenLogin:', token);
   
    if (response.data.success) {
      alert(response.data.message);
      console.log('Conference login successful');
      localStorage.setItem('confEmail', emailConf);
    const emm=localStorage.getItem('confEmail');
    console.log("emmm",emm);
      localStorage.setItem('token', token);
      handleSignClick("conferenceHome");
    } else {
      alert('Login failed');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    alert('An error occurred. Please try again later.');
  }
}
const handleCloseAlert = () => {
  this.setState({showAlertApproved:false})
  this.setState({showAlertRejected:false})
};
async function sendRegisterConferencier(event) {
  event.preventDefault(); // Prevent default form submission behavior
  const loadingElement = document.getElementById('loading');
      loadingElement.style.display = 'flex';
  const url = 'http://localhost:5000/conferences';
  const hashedPassword = await bcrypt.hash(confPassword, 10); // Hash the password
  const data = {confName, confEmail,  confPassword: hashedPassword , organisation, organisationPref, confContact, confBio, confProfilePicture};
  try {
    const response = await axios.post(url, data);
    if (response.status === 201) {
      <Alert message={'Conferencier account registered successfully'} type={'success'} onClose={handleCloseAlert}/>
      alert('Conferencier account registered successfully')
    } else {
      <Alert message={'Conferencier account registered failed'} type={'error'} onClose={handleCloseAlert}/>
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      const errorMessage = error.response.data.error;
      if (errorMessage.includes('already exists')) {
        alert(errorMessage);
      } else {
        alert('An error occurred. Please try again later.');
      }
    } else {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  }finally {
    loadingElement.style.display = 'none';
  }
};


const sendRegisterInstitute = async () => {
  const url = 'http://localhost:5000/institutes';
  const data = {
    universityName: String(universityName),
    instName: String(instName),
    instAcronym: String(instAcronym),
    instRef: String(instRef),
    officerEmail,
    validatorEmail,
    contact,
    website,
    statusInst
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Institute account registered successfully. Our service agent will contact you as soon as possible. Thank you.');
    }

    const result = await response.json(); // parse JSON response
   
    if (response.ok) {
      console.log("result Inst Register", result);
      alert('Institute account registered successfully. Our service agent will contact you as soon as possible. Thank you.');
    }
  } catch (error) {
    alert('Institute account registered successfully. Our service agent will contact you as soon as possible. Thank you.');
  }
};

  const checkAuthorizationConfRegister = async (e) => {
    e.preventDefault();
    if(passwordConf===passwordConf1){
    //appele de la focntion getContractInstancde d'aprés contractServices.js qui fait l'automatisation de l'adresse ethereum de deploiement
    const storageContract = await getContractInstanceConf();
    if (!storageContract || !storageContract.instance) {
      console.error("Erreur lors de la récupération de l'instance du contrat");
      return;
    }
    //hacher le mot de passe avec sha256, sha256 retourne un binaire donc ce pourquoi on utlise toString pour le transforme en chaine de caractère
    const passwordHashConf = sha256(passwordConf).toString();
    console.log("Password hash:", passwordHashConf);
    //vérifier la prémire adresse de compte connectée
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    const isAuthorized = await storageContract.instance.methods.checkAuthorization(emailConf, passwordHashConf).call({ from: accountAddress });
    const AuthorizedConf = await storageContract.instance.methods.authorizedConference(emailConf, passwordHashConf).call({ from: accountAddress });
    console.log("le role Conferencier est ", AuthorizedConf);
    // Si l'acteur est autorisé, naviguer vers une autre interface
    if (isAuthorized) {
      handleSignClick("admin");
      console.log("logged Successful");
    }
    if (AuthorizedConf === "conference") {
      handleSignClick("conference");
      console.log("logged Conferencier Successful");
    }}else{
      alert('Passwords do not match');
    }
 }

 //fonction pour update le mot de passe à la prémière fois
 const handleUpdateCredentialsInst=async(e) =>{
  e.preventDefault();
  const { email, password, newPassword } = this.state;
  const hashNewPassword=sha256(newPassword).toString();
  const contract =await getContractInstanceInst();
  try {
    // Call the updateInstituteCredentials function on the contract
    console.log("Old credentials:", email, password);
    console.log("New credentials:", hashNewPassword);
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    const newpasswordHash = sha256(newPassword).toString();
    await contract.instance.methods.updateInstituteCredentials(email,password,  newpasswordHash).send({ from: accountAddress ,gas:600000});
    console.log("Credentials updated successfully.");
    setPasswordInst(password);
    setAlertMessage("Credentials updated successfully.");
    setStatus("success");
  } catch (err) {
    console.error(err);
    setAlertMessage("Failed to update credentials. Please try again later.");
    setStatus("failed");
  }
}
  const checkAuthorizationConf = async (e) => {
    e.preventDefault();
    //appele de la focntion getContractInstancde d'aprés contractServices.js qui fait l'automatisation de l'adresse ethereum de deploiement
    const storageContract = await getContractInstanceConf();
    if (!storageContract || !storageContract.instance) {
      console.error("Erreur lors de la récupération de l'instance du contrat");
      return;
    }
    //hacher le mot de passe avec sha256, sha256 retourne un binaire donc ce pourquoi on utlise toString pour le transforme en chaine de caractère
    const passwordHashConf = sha256(passwordConf).toString();
    console.log("Password hash:", passwordHashConf);
    //vérifier la prémire adresse de compte connectée
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    const isAuthorized = await storageContract.instance.methods.checkAuthorization(emailConf, passwordHashConf).call({ from: accountAddress });
    const AuthorizedConf = await storageContract.instance.methods.authorizedConference(emailConf, passwordHashConf).call({ from: accountAddress });
    console.log("le role Conferencier est ", AuthorizedConf);
    // Si l'acteur est autorisé, naviguer vers une autre interface
    if (isAuthorized) {
      handleSignClick("admin");
      console.log("logged Successful");
    }
    if (AuthorizedConf === "conference") {
      handleSignClick("conference");
      console.log("logged Conferencier Successful");
    }else{
      console.log("cannot login As conferencier");
    }
 }
 //fonction pour update le mot de passe à la prémière fois
  const handleUpdateCredentialsConf=async(e) =>{
  e.preventDefault();
  const { email, password, newPassword } = this.state;
  const contract =await getContractInstanceConf();
  try {
    
    const hashNewPassword=sha256(newPassword).toString();
    // Call the updateInstituteCredentials function on the contract
    console.log("Old credentials:", email, password);
    console.log("New credentials:", hashNewPassword);
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    
    await contract.instance.methods.updateConferenceCredentials(email,password,  hashNewPassword).send({ from: accountAddress ,
    gas:600000});
    console.log("Credentials updated successfully.");
    setPasswordConf(password);
    setAlertMessage("Credentials updated successfully.");
    setStatus("success");
  } catch (err) {
    console.error(err);
    setAlertMessage("Failed to update credentials. Please try again later.");
    setStatus("failed");
  }
}

const handleSignClick=(interfaceName, id=null)=> {
  setLoggedIn(true);
  setInterfaceName(interfaceName);
  setDiplomaId(id);
}

//fonction pour envoyer un code à l'email
const  navigateToCodeInst=async(e)=> {
  e.preventDefault();
  setForgotInst(true);
  setShowResetPasswordFormInst(false);
  setShowResetPasswordFormConf(false);
  setLoginConf(false);
  setRegisterConf(false);
  setLoginInst(false);
  setRegisterInst(false);
  if (emailInst) {
    const CODE = Math.floor(Math.random() * 9000 + 1000);
    console.log(CODE);
    //ou on peut saisie le code
    setCode(CODE);
  await sendDiplomaEmail(emailInst,"EduCheck Recover Password Code",
  null,
  `<title>EduCheck Recover Password Code</title>
          <h5>Below your Recover Code : </h5>
          <h5>Your Code is : </h5>
          <h1>${CODE} </h1>
          <h5>Best regards, </h5>
          <h5><strong>EduCheck Team</strong></h5>
          <p>If you have any questions, feel free to contact us at this email or call us at +216 52759645.</p>`,
          null
);}else{
  alert("Please enter your email !")
}


}
//fonction pour envoyer un code à l'email
const  navigateToCodeConf=async(e)=> {
  e.preventDefault();
  setForgotConf(true);
  setLoginConf(false);
  setRegisterConf(false);
  setLoginInst(false);
  setRegisterInst(false);
  if (emailConf) {
    const CODE = Math.floor(Math.random() * 9000 + 1000);
    console.log(CODE);
    //ou on peut saisie le code
    setCode(CODE);
    const templateParams = 
      {
        subject:"Verification code",
        to_name: "Institute",
        from_name: "CRNS",
        message: `your code is ${CODE}`,
        to_email:  emailConf,
      };
      emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams, 'UBJPOXynwuM1qwZMP')
        .then((result) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });
} else {
  alert("Please enter your email");
}
}
const handleCodeSubmitInst = (event) => {
  event.preventDefault();
  //setEnteredCode(parseInt(enteredCode));
  if (enteredCode ===  code) {
    alert("Code True");
    setForgotInst(false);
    setShowResetPasswordFormInst(true);
      } else {
      alert("Verification code is incorrect");
      }
}
const handleCodeSubmitConf = (event) => {
  event.preventDefault();
  setEnteredCode(parseInt(enteredCode));
  if (enteredCode ===  code) {
    setForgotConf(false);
setShowResetPasswordFormConf(true);
alert("Code True");
      } else {
      alert("Verification code is incorrect");
      }
}
//appel de la fonction de smart contract pour reinitialiser le mot de passe
const  handleRestPasswordInst=async(e)=>{
  e.preventDefault();
 if (newPasswordInst1 === newPasswordInst) {
  const passwordHash=(sha256(newPasswordInst).toString());
  const contract = await getContractInstanceInst();
  try {
    console.log("New credentialssssss:", passwordHash);
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    //const newpasswordHash = sha256( newPassword1).toString();
    const reset=await contract.instance.methods.resetInstitutePassword(emailInst,  passwordHash).send({ from: accountAddress}); 
if(reset.status=== true){
  console.log("Credentials Institute updated successfully.",emailInst,newPasswordInst,passwordHash);
  setPasswordInst(newPasswordInst)
  setAlertMessage(alertMessage);
 
  alert('updated succeful')
  setStatus(reset.status);
  setLoginInst(true);
  setShowResetPasswordFormInst(false);
  
}
    
  } catch (err) {
    console.error(err);
    setAlertMessage("Failed to update credentials. Please try again later.");
    setStatus("Failed");
  }}
  else{
    alert('Passwords do not match');
  }
}
const handleRestPasswordConf=async(e)=>{
  e.preventDefault();
  if (newPasswordConf1 === newPasswordConf) {
    const passwordHash=(sha256(newPasswordConf).toString());
  const contract = await getContractInstanceConf();
  try {
    console.log("New cre+dentialssssss:", passwordHash);
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    //const newpasswordHash = sha256( newPassword1).toString();
    const reset=await contract.instance.methods.resetConferencePassword(emailConf,  passwordHash).send({ from: accountAddress ,gas:500000});
    if(reset===true){
      console.log("Credentials updated successfully.",emailConf,newPasswordConf,passwordHash);
      setPasswordConf(newPasswordConf)
      setAlertMessage(alertMessage);
      setStatus(status);
      alert('Credentials updated successfully.');
      setShowResetPasswordFormConf(false);
      setLoginConf(true);
    }
    
  } catch (err) {
    console.error(err);
    setAlertMessage("Failed to update credentials. Please try again later.");
    setStatus("Failed");
  }}else{
    alert('Passwords do not match');
  }
}
const fetchInstitutes = async () => {
  try {
    const response = await fetch('http://localhost:5000/universities',
   { method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }});
    if (!response.ok) {
      throw new Error('Failed to fetch institutes');
    }
    const data=await response.json();
    const universities = data.map(item => item.universityName); // Extract universityName values
const uniqueUniversities = [...new Set(universities)];
uniqueUniversities.push("private University")

console.log("uniqueUniversities",uniqueUniversities);
setUniversities(uniqueUniversities);
    //this.setState({universities : data});
    console.log('Fetched universities:', data);
    setUniversitiesData(data);
    return data;
  } catch (error) {
    console.error('Error fetching universities:', error);
    return null;
  }
};
const handleUniversityChange=(event,selectedIndex) => {
  const selectedUniversity= universities[selectedIndex];
  if(selectedUniversity=="private University"){
    setuniversityName("private University")
    setPublicUni(false);
    setPrivateUni(true);
    /*institute Name could be input */
  }else{
    console.log("selectedUniversity",selectedUniversity);
    const institutes = universitiesData.filter(item => item.universityName === selectedUniversity) // Filter by universityName
    .map(item => item.instName);
    console.log("errrrrorrrr",institutes);
    setInstitutes(institutes);
    setPublicUni(true);
    setPrivateUni(false);
    setuniversityName(selectedUniversity);
  }
 
};
const handleInstituteChange = (event, selectedIndex) => {
  const inst = institutes[selectedIndex];
  console.log("Selected Institute:", inst);
  setinstName(inst);

  // Filter and get acronym and ref directly
  const filteredData = universitiesData.filter(item => item.universityName === universityName && item.instName === inst);
  const acronyms = filteredData.map(item => item.instAcronym);
  const refs = filteredData.map(item => item.instRef);

  // Assuming there is only one unique acronym and ref per institute
  const selectedAcronym = acronyms.length > 0 ? acronyms[0] : '';
  const selectedRef = refs.length > 0 ? refs[0] : '';

  setinstAcronym(selectedAcronym);
  setinstRef(selectedRef);

  console.log("Acronym:", selectedAcronym);
  console.log("Reference:", selectedRef);
};



const handleChangeOrganisationPref = (event) => {
  setOrganisationPref(event.target.value);
};
const handleLoginConf=()=>{
  setLoginConf(true);
  setLoginInst(false);
  setRegisterConf(false);
  setRegisterInst(false);
  setForgotConf(false);
  setForgotInst(false);
  toggle(false);
}
const handleLoginInst=()=>{
  setLoginConf(false);
  setLoginInst(true);
  setRegisterConf(false);
  setRegisterInst(false);
  setForgotConf(false);
  setForgotInst(false);
  toggle(true);
}
const handleRegisterConf=()=>{
  setLoginConf(false);
  setLoginInst(false);
  setRegisterConf(true);
  setRegisterInst(false);
  setForgotConf(false);
  setForgotInst(false);
}
const handleRegisterInst=()=>{
  setLoginConf(false);
  setLoginInst(false);
  setRegisterConf(false);
  setRegisterInst(true);
  setForgotConf(false);
  setForgotInst(false);

}
    if(loggedIn){
      //naviguer à l'interface admin 
      if( interfaceName==="admin"){
        return<Navigate to ='/admin'/>;
        //naviguer à l'interface institute
      }else if ( interfaceName==="institute"){
        return<Navigate to= '/institute'/>;
        //naviguer à l'interface verifier/id
      }else if ( interfaceName==="validator"){
        return<Navigate to= '/validator'/>;
        //naviguer à l'interface verifier/id
      }else if ( interfaceName==="conference"){
        return<Navigate to= '/conference'/>;
      }
      else if ( interfaceName==="conferenceHome"){
        return<Navigate to= '/conferenceHome'/>;
      }else if ( interfaceName==="verifier" && diplomaId !== null){
        return <Navigate to= {`/verifier/${diplomaId}`}/>;
      }else{
        return <div>Invalid interface name.</div>;
      }
    } else {
      return (
          <>
  <GlobalContext.Provider value={{ loggedIn, setLoggedIn, interfaceName, setInterfaceName, diplomaId, setDiplomaId }}>
          <Components.Container>
{loginConf? (
      <Components.SignInContainer signinIn={signIn} className='front'>
        <Components.Form onSubmit={(e)=>loginConferencier(e)}>
          {alertMessage !== '' && status === 'failed' ? (
            <Message negative>{alertMessage}</Message>
          ) : alertMessage !== '' && status === 'success' ? (
            <Message positive>{alertMessage}</Message>
          ) : (
            console.log('')
          )}
          <Components.Title1>{t('homepage.sign.conferencier_login')}</Components.Title1>
          <Components.Input
            type='email'
            placeholder='Email'
            value={emailConf}
            autoComplete='email'
            onChange={(e) => setEmailConf(e.target.value)}
            required
          />
          <Components.Input
            type='password'
            placeholder={t('homepage.sign.password_placeholder')}
            value={passwordConf}
            autoComplete='current-password'
            onChange={(e) => setPasswordConf(e.target.value)}
            required
          />
          <Components.Anchor href='#' id='flip' forgot={forgotConf} onClick={navigateToCodeConf}>
          {t('homepage.sign.forgot_password')}
          </Components.Anchor>
          <Components.Button>{t('homepage.sign.sign_in_button')}</Components.Button>
          <Components.ButtonAnchor href='#'  onClick={handleRegisterConf}>
          {t('homepage.sign.register_button')}
          </Components.ButtonAnchor>
        </Components.Form>
      </Components.SignInContainer>
  ):registerConf?(
      <Components.SignUpConference signinIn={!signIn} >
         <div id="loading" style={{
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
        <Loading  size="large" colors={["#D4DDEE", "#DDE5BF", "#FFF2C6", "#FFE0D3"]} />
        </div>
       <Components.Form onSubmit={(e)=>sendRegisterConferencier(e)}>
      <Components.Title2 >{t('homepage.sign.register_inst_button')}</Components.Title2>
      <div style={{ width:"100%",height:"70%"}} >
      <div style={{ width:"50%",height:"60%",position:'absolute',left:0,marginRight:"20px" }}>
      <Components.Paragraph>{t('homepage.sign.conference_name')}</Components.Paragraph>
      <input
      style={{ height:"15%",width:"95%", marginBottom:"30px" }}
        type='text'
        placeholder='Full Name'
        value={confName}
        onChange={(e) => setconfName(e.target.value)}
        required
      />
      <Components.Paragraph>{t('homepage.sign.conference_email')}</Components.Paragraph>
      <input
       style={{height:"15%",width:"95%", marginBottom:"30px"  }}
        type='email'
        placeholder='Your Email'
        value={confEmail}
        autoComplete='email'
        onChange={(e) => setconfEmail(e.target.value)}
     
      />
       <Components.Paragraph>{t('homepage.sign.password_placeholder')}</Components.Paragraph>
      <input
      style={{ height:"15%",width:"95%", marginBottom:"30px" }}
        type='password'
        placeholder='Password'
        value={confPassword}
        onChange={(e) => setconfPassword(e.target.value)}
        required
      />
       <Components.Paragraph>{t('homepage.sign.organization')}</Components.Paragraph>
      <input
      style={{ height:"15%",width:"95%", marginBottom:"30px"  }}
        type='text'
        placeholder='Organization'
        value={organisation}
        onChange={(e) => setorganisation(e.target.value)}
        
      />
      </div>

      <div style={{ width:"50%" ,height:"60%",position:"absolute",right:0}}>
     
      <Components.Paragraph>{t('Organization preferences')}</Components.Paragraph>
      <Components.Select style={{ height:"15%",width:"95%", marginBottom:"30px" , borderRadius:"20%"}} 
      name="organization-preferences" id="organization-preferences"
      value={organisationPref}
        onChange={handleChangeOrganisationPref}>
    <Components.Option value="Technology">Technology</Components.Option>
    <Components.Option value="Education">Education</Components.Option>
    <Components.Option value="Business">Business</Components.Option>
    <Components.Option value="Healthcare">Healthcare</Components.Option>
    <Components.Option value="Science">Science</Components.Option>
    <Components.Option value="Arts and Culture">Arts and Culture</Components.Option>
    <Components.Option value="Environment">Environment</Components.Option>
    <Components.Option value="Social Issues">Social Issues</Components.Option>
  </Components.Select>
      <Components.Paragraph>{t('Contact')}</Components.Paragraph>
      <input
      style={{ height:"15%",width:"95%", marginBottom:"30px" }}
        type='number'
        placeholder='Phone Contact'
        value={confContact}
        onChange={(e) => setconfContact(e.target.value)}
        required
      />
      <Components.Paragraph>{t('homepage.sign.description')}</Components.Paragraph>
      <textarea name="" id="" cols="30" rows="10"
       style={{ height:"40%",width:"95%", marginBottom:"30px",borderRadius:"10%" ,padding:"20px",fontSize:"19px",color:"#576389"}}
       placeholder='Describe your self'
        value={confBio}
        onChange={(e) => setconfBio(e.target.value)}
        
      ></textarea>
      </div>
      </div>
      <Components.Button>{t('homepage.sign.register_button')}</Components.Button>
      <Components.ButtonAnchor2 href='#' onClick={handleLoginInst}>
      {t('homepage.sign.sign_in_button')}
      </Components.ButtonAnchor2>
    </Components.Form>
      </Components.SignUpConference>
  ):loginInst?( <Components.SignInContainer signinIn={signIn} >
    <Components.Form onSubmit={checkAuthorizationInst}>
      {alertMessage !== '' && status === 'failed' ? (
        <Message negative>{alertMessage}</Message>
      ) : alertMessage !== '' && status === 'success' ? (
        <Message positive>{alertMessage}</Message>
      ) : (
        console.log('')
      )}
      <Components.Title1>{t('homepage.sign.institute_login')}</Components.Title1>
      <Components.Input
        type='email'
        placeholder='Email'
        value={emailInst}
        autoComplete='email'
        onChange={(e) => setEmailInst(e.target.value)}
        required
      />
      <Components.Input
        type='password'
        placeholder='Password'
        value={passwordInst}
        autoComplete='current-password'
        onChange={(e) => setPasswordInst(e.target.value)}
        required
      />
      <Components.Anchor href='#' forgot={forgotInst} onClick={navigateToCodeInst}>
      {t('homepage.sign.forgot_password')}
      </Components.Anchor>
      <Components.Button>{t('homepage.sign.sign_in_button')}</Components.Button>
      <Components.ButtonAnchor href='#' onClick={handleRegisterInst}>
      {t('homepage.sign.register_button')}
      </Components.ButtonAnchor>
    </Components.Form>  
    <div id="loading" style={{
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
        <Loading  size="large" colors={["#D4DDEE", "#DDE5BF", "#FFF2C6", "#FFE0D3"]} />
        </div>
  </Components.SignInContainer>)
:registerInst ? (
  <Components.SignUpInstitute signinIn={signIn}>
    <Components.Form onSubmit={sendRegisterInstitute}>
      <Components.Title2>{t('homepage.sign.institute_register')}</Components.Title2>
      <div style={{ width:"100%",height:"70%"}} >
      <div style={{ width:"50%",height:"60%",position:'absolute',left:0,marginRight:"20px" }}>
        <div>
      <Components.Paragraph>{t('homepage.sign.university_dropdown')}</Components.Paragraph>
     <Components.Select
    id="universityDropdown"
    value={universityName}
    onChange={(e) => handleUniversityChange(e, e.target.selectedIndex - 1)}
  >
    <option value="">{t('homepage.sign.institute_name')}</option>
    {universities.map((university, index) => (
      <option key={index} value={university}>
        {university}
      </option>
    ))}
    </Components.Select>
    </div>
    <div>
       <Components.Paragraph>{t('homepage.sign.university_dropdown')}</Components.Paragraph>
      {publicUni && <Components.Select
  id="instituteDropdown"
  value={instName}
  onChange={(e) => handleInstituteChange(e,e.target.selectedIndex - 1)}
>
  <option value={instName}>{instName}</option>
  {Array.isArray(institutes) && institutes.map((institute, index) => (
    <option key={index} value={index}>
      {institute} 
    </option>
  ))}
</Components.Select>}
{privateUni &&<input
  style={{ height:"15%",width:"95%",marginBottom:"20px" }}
    type='name'
    placeholder='Institute Name'
    value={instName}
    autoComplete='name'
    onChange={(e) => setinstName(e.target.value)}
    required
  />}
</div>
      
       <Components.Paragraph>{t('homepage.sign.institute_acronym')}</Components.Paragraph>
     {publicUni?( <input
      style={{ height:"15%",width:"95%",marginBottom:"20px" }}
        type='text'
        value={instAcronym}
        readOnly
        onChange={(e) => setinstAcronym(e.target.value)}
        required
      />):(
<input
      style={{ height:"15%",width:"95%",marginBottom:"20px" }}
        type='text'
        value={instAcronym}
        onChange={(e) => setinstAcronym(e.target.value)}
        required
      />
      )}
       <Components.Paragraph>{t('homepage.sign.institute_ref')}</Components.Paragraph>
      <input
      style={{ height:"15%",width:"95%",marginBottom:"20px" }}
        type='text'
        value={instRef}
        onChange={(e) => setinstRef(e.target.value)}
        required
      />
      </div>

      <div style={{ width:"50%" ,height:"60%",position:"absolute",right:0}}>
     
      <Components.Paragraph>{t('homepage.sign.officer_email')}</Components.Paragraph>
      <input
      style={{ height:"15%",width:"95%",marginBottom:"20px" }}
        type='email'
        placeholder='Officer Email'
        value={officerEmail}
        autoComplete='email'
        onChange={(e) => setofficerEmail(e.target.value)}
        required
      />
      <Components.Paragraph>{t('homepage.sign.validator_email')}</Components.Paragraph>
      <input
      style={{ height:"15%",width:"95%",marginBottom:"20px" }}
        type='email'
        placeholder='Validator Email'
        value={validatorEmail}
        autoComplete='email'
        onChange={(e) => setvalidatorEmail(e.target.value)}
        required
      />
      <Components.Paragraph>{t('homepage.sign.phone_contact')}</Components.Paragraph>
      <input
      style={{ height:"15%",width:"95%",marginBottom:"20px"}}
        type='number'
        placeholder='Phone Contact'
        value={contact}
        onChange={(e) => setcontact(e.target.value)}
        required
      />
      <Components.Paragraph>{t('homepage.sign.website')}</Components.Paragraph>
      <input
      style={{ height:"15%",width:"95%",marginBottom:"20px"}}
        type='text'
        placeholder='Website'
        value={website}
        onChange={(e) => setwebsite(e.target.value)}
      />
      </div>
      </div>
      <Components.Button>{t('homepage.sign.register_button')}</Components.Button>
      
      <Components.ButtonAnchor2 href='#' onClick={handleLoginInst}> 
      {t('homepage.sign.sign_in_button')}
      </Components.ButtonAnchor2>
    </Components.Form>
  </Components.SignUpInstitute>
):forgotConf ? (
  <Components.SignInContainer signinIn={signIn} >
 <Components.Form onSubmit={handleCodeSubmitConf}>
       <Components.Title1>{t('homepage.sign.forgot_password_text')}</Components.Title1>
       <Components.Paragraph>{t('homepage.sign.forgot_password_text')}</Components.Paragraph>
       <input
       style={{ height:"80px", marginTop:"100px",marginBottom:"50px" }}
        type='text'
        placeholder='Code'
        onChange={(e) => setEnteredCode(e.target.value)}
        required
      />
       <Components.Button >{t('homepage.sign.submit_code')}</Components.Button>
       <Components.ButtonAnchor href='#' onClick={handleLoginConf}>
       {t('homepage.sign.already_have_account')}
      </Components.ButtonAnchor>
      </Components.Form>
      </Components.SignInContainer>
      ):forgotInst?(
        <Components.SignInContainer signinIn={signIn} >
        <Components.Form onSubmit={handleCodeSubmitInst}>
              <Components.Title1>{t('homepage.sign.forgot_password_text')}</Components.Title1>
              <Components.Paragraph>{t('homepage.sign.forgot_password_text')}</Components.Paragraph>
              <input
              style={{ height:"80px", marginTop:"100px",marginBottom:"50px" }}
               type='text'
               placeholder='Code'
               onChange={(e) => setEnteredCode(parseInt(e.target.value))}
               required
             />
              <Components.Button >{t('homepage.sign.submit_code')}</Components.Button>
              <Components.ButtonAnchor href='#' onClick={handleLoginInst}>
              {t('homepage.sign.already_have_account')}
             </Components.ButtonAnchor>
             </Components.Form>
             </Components.SignInContainer>
      ):null}
      {showResetPasswordFormInst? (
        <Components.SignInContainer signinIn={signIn}>
 <Components.Form onSubmit={handleRestPasswordInst}>
       <Components.Title1>{t('homepage.sign.forgot_password')} </Components.Title1>
       <Components.Paragraph>{t('homepage.sign.forgot_password')}</Components.Paragraph>
       <Components.Input
        type='password'
        placeholder='Password'
        value={newPasswordInst}
        onChange={(e) => setNewPasswordInst(e.target.value)}
        required
      />
       <Components.Input
        type='password'
        value={newPasswordInst1}
        placeholder='Confirm Password'
        onChange={(e) => setNewPasswordInst1(e.target.value)}
        required
      />
       <Components.Button >{t('homepage.sign.change_password')}</Components.Button>
      </Components.Form>
      </Components.SignInContainer>
):showResetPasswordFormConf? (
        <Components.SignInContainer signinIn={signIn}>
 <Components.Form onSubmit={handleRestPasswordConf}>
       <Components.Title1>{t('homepage.sign.forgot_password')}</Components.Title1>
       <Components.Paragraph>{t('homepage.sign.forgot_password')}</Components.Paragraph>
       <Components.Input
        type='password'
        placeholder='Password'
        value={newPasswordConf}
        onChange={(e) => setNewPasswordConf(e.target.value)}
        required
      />
       <Components.Input
        type='password'
        value={newPasswordConf1}
        placeholder='Confirm Password'
        onChange={(e) => setNewPasswordConf1(e.target.value)}
        required
      />
       <Components.Button >{t('homepage.sign.change_password')}</Components.Button>
      </Components.Form>
      </Components.SignInContainer>
):
null}
     {!showFace?( <Components.OverlayContainer signinIn={signIn}  >
          <Components.Overlay signinIn={signIn} >
          <Components.LeftOverlayPanel signinIn={signIn} >
              <Components.Title2>{t('homepage.sign.institute_login')}</Components.Title2>
              <Components.Paragraph>
              {t('homepage.sign.instPara')}
              </Components.Paragraph>
              <Components.GhostButton onClick={handleLoginInst}>
              {t('homepage.sign.sign_in_button')}
              </Components.GhostButton>
              </Components.LeftOverlayPanel>

              <Components.RightOverlayPanel signinIn={signIn}>
                <Components.Title2>{t('homepage.sign.conferencier_login')}</Components.Title2>
                <Components.Paragraph>
                {t('homepage.sign.confPara')}
                </Components.Paragraph>
                    <Components.GhostButton onClick={handleLoginConf}>
                    {t('homepage.sign.sign_in_button')}
                    </Components.GhostButton>
              </Components.RightOverlayPanel>
          </Components.Overlay>
      </Components.OverlayContainer>):(
        <Components.VerifFace signinIn={true}  >
       <Facee login={true} email={emailInst} passHash={passwordHashInst} />
    </Components.VerifFace>
      )}

  </Components.Container>
  </GlobalContext.Provider>
 </>
      )}}
export default Sign ;