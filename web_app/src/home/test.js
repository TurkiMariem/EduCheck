import sha256 from 'crypto-js/sha256';
import * as emailjs from "emailjs-com";
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Message } from 'semantic-ui-react';
import Web3 from 'web3';
import { getContractInstance } from '../contractServices';
import * as Components from './Components';

function Sign () {
const [signIn, toggle] = useState(true);
const [forgot, setForgot] = useState(false);
const [interfaceName, setInterfaceName] = useState('');
const [address, setAddress] = useState('');
const [passwordInst, setPasswordInst] = useState('');
const [passwordConf, setPasswordConf] = useState('');
const [emailInst, setEmailInst] = useState("admin@example.com");
const [emailConf, setEmailConf] = useState("admin@example.com");
const [newPasswordConf, setNewPasswordConf] = useState('');
const [newPasswordInst, setNewPasswordInst] = useState('');
const [newPassword1, setNewPassword1] = useState("");
const [alertMessage, setAlertMessage] = useState('');
const [status, setStatus] = useState("");
const [id, setId] = useState("");
const [passwordHash, setPasswordHash] = useState("");
const [code, setCode] = useState("");
const [enteredCode, setEnteredCode] = useState("");
const [showLoginForm, setShowLoginForm] = useState(true);
const [showConfForm, setShowConfForm] = useState(true);
const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
const [loggedIn, setLoggedIn] = useState(false);
const [diplomaId, setDiplomaId] = useState(null);
const toggleLoginForm = () => {
  setShowLoginForm(!showLoginForm);
  setShowConfForm(!showConfForm);
};
  const checkAuthorization = async (e) => {
    e.preventDefault();
    //appele de la focntion getContractInstancde d'aprés contractServices.js qui fait l'automatisation de l'adresse ethereum de deploiement
    const storageContract = await getContractInstance();
    if (!storageContract || !storageContract.instance) {
      console.error("Erreur lors de la récupération de l'instance du contrat");
      return;
    }
    //hacher le mot de passe avec sha256, sha256 retourne un binaire donc ce pourquoi on utlise toString pour le transforme en chaine de caractère
    const passwordHashInst = sha256(passwordInst).toString();
    const passwordHashConf = sha256(passwordConf).toString();
    console.log("Password hash:", passwordHash);
    //vérifier la prémire adresse de compte connectée
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];

    const isAuthorizedInst = await storageContract.instance.methods.checkAuthorization(emailInst, passwordHashInst).call({ from: accountAddress });
    const AuthorizedInst = await storageContract.instance.methods.authorizedInstitute(emailInst, passwordHashInst).call({ from: accountAddress });
    const AuthorizedConf = await storageContract.instance.methods.authorizedConference(emailConf, passwordHashConf).call({ from: accountAddress });
    console.log("le role Institute est ", AuthorizedInst);
    console.log("le role Conferencier est ", AuthorizedConf);
    // Si l'acteur est autorisé, naviguer vers une autre interface
    if (isAuthorizedInst) {
      handleSignClick("admin");
    } 
    if (AuthorizedInst === "officier") {
      handleSignClick("institute");
    } else if (AuthorizedInst === "validator") {
      handleSignClick("validator");
    }
    if (AuthorizedConf === "conference") {
      handleSignClick("conference");
    }
  else{
    setAlertMessage("Unauthorized access. Please check your credentials and try again.")
    setStatus("Failed")
  }
 }
 //fonction pour update le mot de passe à la prémière fois
 const handleUpdateCredentialsInst=async(e) =>{
  e.preventDefault();
  const { email, password, newPassword } = this.state;
  const hashNewPassword=sha256(newPassword).toString();
  const contract =await getContractInstance();
  try {
    // Call the updateInstituteCredentials function on the contract
    console.log("Old credentials:", email, password);
    console.log("New credentials:", hashNewPassword);
    
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    const newpasswordHash = sha256( newPassword).toString();
    await contract.instance.methods.updateInstituteCredentials(email,password,  newpasswordHash).send({ from: accountAddress ,
    gas:600000});
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
 //fonction pour update le mot de passe à la prémière fois
  const handleUpdateCredentialsConf=async(e) =>{
  e.preventDefault();
  const { email, password, newPassword } = this.state;
  const hashNewPassword=sha256(newPassword).toString();
  const contract =await getContractInstance();
  try {
    // Call the updateInstituteCredentials function on the contract
    console.log("Old credentials:", email, password);
    console.log("New credentials:", hashNewPassword);
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    const newpasswordHash = sha256( newPassword).toString();
    await contract.instance.methods.updateConferenceCredentials(email,password,  newpasswordHash).send({ from: accountAddress ,
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
//fonction pour verifier l'existance de diplome
const  VerifyDiploma = async (e) => {
  e.preventDefault();
  const contract= await getContractInstance();
  //appel de la fonction getDiplomaById de smart contract pour return le struct de stuedent
  const get=await contract.instance.methods.getDiplomaById(id).call();
  if (get.id !== "") {    
    console.log("Diploma existe", get);
    // Naviguer vers l'URL du fichier dans une nouvelle fenêtre 
    handleSignClick("verifier", id);
    } else {
    // Le diplôme n'existe pas, afficher un message d'erreur
    console.log("Diploma n'existe pas");
    alert("Diploma not registered");
    }
}
 const handleSignClick=(interfaceName, id=null)=> {
  setLoggedIn(true);
  setInterfaceName(interfaceName);
  setDiplomaId(id);
}
const  handleLoginClick=()=>{
  setShowLoginForm(true);
  setShowResetPasswordForm(false);
}
//fonction pour envoyer un code à l'email
const  navigateToCode=async(e)=> {
  e.preventDefault();
  setForgot(true);
  if (emailInst) {
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
        to_email:  emailInst,
      };
      emailjs.send('service_bd0c9dp', 'template_g4n0mqp', templateParams, 'rFDntggHrFpcsQot3')
        .then((result) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });
  

} else {
  alert("Please enter your email");
}
}
const handleCodeSubmit = (event) => {
  event.preventDefault();
  setEnteredCode(parseInt(enteredCode));
  if (enteredCode ===  code) {
setShowResetPasswordForm(true);
alert("Code True");
      } else {
      alert("Verification code is incorrect");
      }
}
//appel de la fonction de smart contract pour reinitialiser le mot de passe
const  handleRestPasswordInst=async(e)=>{
  e.preventDefault();
  setPasswordHash(sha256(newPassword1).toString());
  const contract = await getContractInstance();
  try {
    console.log("New credentialssssss:", passwordHash);
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    //const newpasswordHash = sha256( newPassword1).toString();
    await contract.instance.methods.resetInstitutePassword(emailInst,  passwordHash).send({ from: accountAddress ,gas:500000});
    console.log("Credentials updated successfully.");
    setPasswordInst(newPassword1)
    setAlertMessage(alertMessage);
    setStatus(status);
  } catch (err) {
    console.error(err);
    setAlertMessage("Failed to update credentials. Please try again later.");
    setStatus("Failed");
  }
}
const handleRestPasswordConf=async(e)=>{
  e.preventDefault();
  setPasswordHash(sha256(newPassword1).toString());
  const contract = await getContractInstance();
  try {
    console.log("New credentialssssss:", passwordHash);
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    //const newpasswordHash = sha256( newPassword1).toString();
    await contract.instance.methods.resetConferencePassword(emailConf,  passwordHash).send({ from: accountAddress ,gas:500000});
    console.log("Credentials updated successfully.");
    setPasswordConf(newPassword1)
    setAlertMessage(alertMessage);
    setStatus(status);
  } catch (err) {
    console.error(err);
    setAlertMessage("Failed to update credentials. Please try again later.");
    setStatus("Failed");
  }
}
const handleRestPassword=async(e)=>{
  e.preventDefault();
  setPasswordHash(sha256(newPassword1).toString());
  const contract = await getContractInstance();
  try {
    console.log("New credentialssssss:", passwordHash);
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    //const newpasswordHash = sha256( newPassword1).toString();
    await contract.instance.methods.resetInstitutePassword(emailInst,  passwordHash).send({ from: accountAddress ,gas:500000});
    console.log("Credentials updated successfully.");
    setNewPasswordInst(newPassword1)
    setAlertMessage(alertMessage);
    setStatus(status);
  } catch (err) {
    console.error(err);
    setAlertMessage("Failed to update credentials. Please try again later.");
    setStatus("Failed");
  }
}
const handleVerifyDiploma=()=>{
  setLoggedIn(true);
}
const Link=({ uri, text })=> {
      return <a href={uri} target="_blank" rel="noreferrer">{text}</a>;
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
      }else if ( interfaceName==="verifier" && diplomaId !== null){
        return <Navigate to= {`/verifier/${diplomaId}`}/>;
      }else{
        return <div>Invalid interface name.</div>;
      }
    } else {
      return (
          <>
          <Components.Container>
{showConfForm? (
    
      <Components.SignInContainer signinIn={!signIn} className='front'>
        <Components.Form onSubmit={checkAuthorization}>
          {alertMessage !== '' && status === 'failed' ? (
            <Message negative>{alertMessage}</Message>
          ) : alertMessage !== '' && status === 'success' ? (
            <Message positive>{alertMessage}</Message>
          ) : (
            console.log('')
          )}
          <Components.Title1>Conferencier Login</Components.Title1>
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
            placeholder='Password'
            value={passwordConf}
            autoComplete='current-password'
            onChange={(e) => setPasswordConf(e.target.value)}
            required
          />
          <Components.Anchor href='#' id='flip' forgot={forgot} onClick={navigateToCode}>
            Forgot your password?
          </Components.Anchor>
          <Components.Button>Sign In</Components.Button>
          <Components.ButtonAnchor href='#' forgot={forgot} onClick={toggleLoginForm}>
            Don't have an account? Register
          </Components.ButtonAnchor>
        </Components.Form>
      </Components.SignInContainer>
  ):(
      <Components.SignUpContainer signinIn={signIn}>
        <Components.Form onSubmit={handleUpdateCredentialsConf}>
          <Components.Title1>Conferencier Register</Components.Title1>
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
            placeholder='Password'
            value={passwordConf}
            autoComplete='current-password'
            onChange={(e) => setPasswordConf(e.target.value)}
            required
          />
          <Components.Input
            type='password'
            placeholder='Confirm Password'
            value={newPasswordConf}
            autoComplete='current-password'
            onChange={(e) => setNewPasswordConf(e.target.value)}
            required
          />
          <Components.Button>Register</Components.Button>
          <Components.ButtonAnchor href='#' forgot={forgot} onClick={toggleLoginForm}>
            Already have an account? Login
          </Components.ButtonAnchor>
        </Components.Form>
      </Components.SignUpContainer>
  )}

{showLoginForm&& !forgot ?( <Components.SignInContainer signinIn={signIn}>
    <Components.Form onSubmit={checkAuthorization}>
      {alertMessage !== '' && status === 'failed' ? (
        <Message negative>{alertMessage}</Message>
      ) : alertMessage !== '' && status === 'success' ? (
        <Message positive>{alertMessage}</Message>
      ) : (
        console.log('')
      )}
      <Components.Title1>Institute Login</Components.Title1>
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
      <Components.Anchor href='#' forgot={forgot} onClick={navigateToCode}>
        Forgot your password?
      </Components.Anchor>
      <Components.Button>Sign In</Components.Button>
      <Components.ButtonAnchor href='#' forgot={forgot} onClick={toggleLoginForm}>
        Don't have an account? Register
      </Components.ButtonAnchor>
    </Components.Form>  
  </Components.SignInContainer>)
:!forgot? (
  <Components.SignInContainer signinIn={signIn}>
    <Components.Form onSubmit={checkAuthorization}>
      <Components.Title1>Institute Register</Components.Title1>
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
      <Components.Input
        type='password'
        placeholder='ConfirmPassword'
        value={passwordInst}
        autoComplete='current-password'
        onChange={(e) => setNewPasswordInst(e.target.value)}
        required
      />
      <Components.Button>Register</Components.Button>
      <Components.ButtonAnchor href='#' forgot={forgot} onClick={toggleLoginForm}>
        Already have an account? Login
      </Components.ButtonAnchor>
    </Components.Form>
  </Components.SignInContainer>
):(
  <Components.SignInContainer signinIn={signIn}>
 <Components.Form onSubmit={handleCodeSubmit}>
       <Components.Title1>Forgot Password ?</Components.Title1>
       <Components.Paragraph>Enter the code we sent to you in email !</Components.Paragraph>
       <Components.Input
        type='text'
        placeholder='Code'
        onChange={(e) => setEnteredCode(e.target.value)}
        required
      />
       <Components.Button >Submit Code</Components.Button>
      </Components.Form>
      </Components.SignInContainer>
      )}
      {showResetPasswordForm && (
        <Components.SignInContainer signinIn={signIn}>
 <Components.Form onSubmit={handleRestPassword}>
       <Components.Title1>Change your password </Components.Title1>
       <Components.Paragraph>Enter new password</Components.Paragraph>
       <Components.Input
        type='password'
        placeholder='Password'
        value={newPassword1}
        onChange={(e) => setNewPassword1(e.target.value)}
        required
      />
       <Components.Input
        type='password'
        value={newPassword1}
        placeholder='Confirm Password'
        onChange={(e) => setNewPassword1(e.target.value)}
        required
      />
       <Components.Button >Change Password</Components.Button>
      </Components.Form>
      </Components.SignInContainer>
)}
      <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title2>Institute Login</Components.Title2>
              <Components.Paragraph>
                  To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>
                  Sign In
              </Components.GhostButton>
              </Components.LeftOverlayPanel>

              <Components.RightOverlayPanel signinIn={signIn}>
                <Components.Title2>Hello, Conferencier!</Components.Title2>
                <Components.Paragraph>
                    Enter Your personal details and start your conference with us
                </Components.Paragraph>
                    <Components.GhostButton onClick={() => toggle(false)}>
                        Sign In
                    </Components.GhostButton>
              </Components.RightOverlayPanel>
          </Components.Overlay>
      </Components.OverlayContainer>

  </Components.Container>
  
 </>
      )}}

export default Sign ;