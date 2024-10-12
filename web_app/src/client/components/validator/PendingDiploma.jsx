import * as emailjs from "emailjs-com";
import React, { Component } from 'react';
import Web3 from 'web3';
import { getContractInstanceInst } from '../../../contractServices';
import { getFileUrlFromIPFS } from '../../../ipfs';


class PendingDiploma extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentList: [],
      selectedStudent: null,
      errorMessage: null,
      imageUrl: null,
      instituteInfo: {},
      showDetailsModal: false,
      showDiplomaModal: false,
      isZoomed:false
    };
  }
  //cycle de vie d'un composant dans React qui est appelé automatiquement une fois que le composant a été monté
  async componentDidMount() {
    const storageContract = await getContractInstanceInst();
    if (!storageContract || !storageContract.instance) {
      console.error("Erreur lors de la récupération de l'instance du contrat");
      this.setState({ errorMessage: "Erreur lors de la récupération de l'instance du contrat" });
      return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];

    const students = await storageContract.instance.methods
      .getStudentsForInstitute(accountAddress)
      .call({ from: accountAddress });
    
    const PendingStudents = students.filter(student => (student.validated==='Pending'));
    if (!PendingStudents || PendingStudents.length === 0) {
      this.setState({ errorMessage: "No pending diploma" });
      return;
    }

    this.setState({
      studentList: PendingStudents,
      
    });
  }
  //fonction pour afficher les details de student
  handleStudentClick = async(event, student) => {
    event.preventDefault();
  if (this.state.selectedStudent) {
    // hide the form if it's already displayed for the clicked student
    this.setState({ selectedStudent: null, imageUrl: null, showDetailsModal: false });
  } else {
    // display the form for the clicked student
    this.setState({ selectedStudent: student ,imageUrl: null, showDetailsModal: true });
  }
};
  //fonction pour affiche le diplome
  viewDiploma = async (ipfsHash) => {
    const diplomaUrl = await getFileUrlFromIPFS(ipfsHash);
    this.setState({imageUrl: diplomaUrl, showDiplomaModal: true});
  };

 
  validateDiploma= async(studentCIN,studentID,studentHash,studentEmail)  =>{
    // Logique de validation ici
    const storageContract = await getContractInstanceInst();
    if (!storageContract || !storageContract.instance) {
      console.error("Erreur lors de la récupération de l'instance du contrat");
      this.setState({ errorMessage: "Erreur lors de la récupération de l'instance du contrat" });
      return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    console.log("status parameters",studentCIN,studentID);
    const etat = await storageContract.instance.methods
      .setDiplomaStatus(studentCIN, studentID, "Validated")
      .send({ from: accountAddress });
    console.log("Étudiant validé",etat);
    this.sendNotification(studentEmail,studentID,studentHash);
    const updatedStudentList = this.state.studentList.filter(student => student.numCIN !== studentCIN);
    this.setState({
      studentList: updatedStudentList,
    });
  }

  removeDiploma= async(studentCIN,studentID)  =>{
    // Logique de validation ici
    const storageContract = await getContractInstanceInst();
    if (!storageContract || !storageContract.instance) {
      console.error("Erreur lors de la récupération de l'instance du contrat");
      this.setState({ errorMessage: "Erreur lors de la récupération de l'instance du contrat" });
      return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    console.log("status parameters",studentCIN,studentID);
    const etat = await storageContract.instance.methods
      .setDiplomaStatus(studentCIN, studentID, "Rejected")
      .send({ from: accountAddress });
    console.log("Étudiant validé",etat);
  }

  sendNotification = async (email, ID, hash) => {
    const {selectedStudent}=this.state
    console.log("les parames de l etudiants", email,hash);
    
    // Ajouter le code pour envoyer les données du formulaire à la base de données ici
    const templateParams = {
      subject:"Validated Diploma",
      to_name: "Student",
      from_name: "CRNS",
      message: `Here are your Diploma Details:\n Diploma File: ${hash}\nDiploma Verification ID : ${ID} `,
      to_email: email,
    
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


  render() {
    const { studentList, selectedStudent, imageUrl, showDetailsModal, showDiplomaModal } = this.state;
    return (
      <main>
			<div  className="head-title">
				<div  className="left">
				<h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>P</span>
              <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#FBBC05'}}>n</span>
              <span style={{color: '#34A853'}}>d</span>
              <span style={{color: '#4285F4'}}>i</span>
              <span style={{color: '#EA4335'}}>n</span>
              <span style={{color: '#FBBC05'}}>g</span>{" "}{" "}
              <span style={{color: '#34A853'}}>D</span>
              <span style={{color: '#4285F4'}}>i</span>
              <span style={{color: '#EA4335'}}>p</span>
              <span style={{color: '#FBBC05'}}>l</span>
              <span style={{color: '#34A853'}}>o</span>
              <span style={{color: '#4285F4'}}>m</span>
              <span style={{color: '#EA4335'}}>a</span>
            </h1>
            <div  className="table-data" style={{ width:"800px" }} >
				<div  className="order" >
					<div  className="head">
						<h3>Recent Pending Diplomas</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Details</th>
          <th>Diploma</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {studentList.map((student) => (
          <tr key={student.numCIN}>
            <td>{student.name}</td>
            <td>
              <button className="status completed" onClick={(e) => this.handleStudentClick(e, student)}>View Details</button>
            </td>
            <td>
              <button className="status completed" onClick={() => {this.viewDiploma(student.ipfsHash);this.setState({ showDiplomaModal: true })}}>View Diploma</button>
            </td>
            <td>
            <button className="validateButton status yes" onClick={() => this.validateDiploma(student.numCIN, student.id, student.ipfsHash,student.email)}>Validate</button>
            <button className="removeButton status no" onClick={() => this.removeDiploma(student.numCIN, student.id)}>Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </div>
    <div style={{width:"100%" ,display:"flex"}}>
          {selectedStudent && (
               <div  className="table-data" style={{flex: "0 0 50%"  , marginRight: "30px" }} >
				<div  className="order" style={{ backgroundColor:"#D4DDEE",width:"200px" }}>
					<div  className="head" >
						<h3>Selected Diploma details</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
      <thead>
        <tr>
          <th>Name</th><td>{selectedStudent.name}</td>
        </tr>
        <tr>
          <th>Email</th><td>{selectedStudent.email}</td>
        </tr>
        <tr>
          <th>Diploma Ref</th><td>{selectedStudent.department}</td>
        </tr>
        <tr>
          <th>Birth Date</th><td>{selectedStudent.dateOfBirth}</td>
        </tr>
        <tr>
          <th>Mention</th><td>{selectedStudent.mention}</td>
        </tr>
        <tr>
          <th>Graduation date</th><td>{selectedStudent.dateRemiseDiplome}</td>
        </tr>
        <tr>
          <th>CIN </th><td>{selectedStudent.numCIN}</td>
        </tr>
        <tr>
          <th>ID </th><td>{selectedStudent.numCIN}</td>
        </tr>
        <tr>
          <th>IPFS </th><td>{selectedStudent.numCIN}</td>
        </tr>
        <tr>
          <th>Status </th><td>{selectedStudent.numCIN}</td>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
   </div>
   </div>
    
)}

{imageUrl && showDiplomaModal && (
    <div className="table-data" style={{ flex: "0 0 50%", marginRight: "10px" }}>
        <div className="order" style={{ backgroundColor: "#FDF2D2" }}>
            <div className="head">
                <h3>Diploma File</h3>
                <span onClick={() => this.setState({ showDiplomaModal: false })}>
                    <i className='bx bx-window-close'></i>
                </span>
                <span onClick={() => this.setState({ isZoomed: true })}>
                    <i className='bx bxs-zoom-in'></i>
                </span>
            </div>
            <table>
                    <img src={imageUrl} alt="Diploma" className="diploma-image" />
        
            </table>
        </div>
    </div>
)}

    </div>
    </div>
    </div>
    {this.state.isZoomed &&(
<div style={{zIndex:2000,position:"fixed",top:0,left:0,height:"100%",width:"100%"}}>
  <body>
<main>
<span onClick={() => this.setState({ isZoomed: false })}>
                    <i color="#6F718F" className='bx bx-window-close'></i>
                </span>
                    <img src={imageUrl} alt="Diploma" className="diploma-image" style={{backgroundColor:"#6F718F",padding:"50px",justifyContent:"center", width: "100%", height: "100%", objectFit: "cover" }}/>
        
            </main>
            </body>
            </div>
    )
    }
    </main>
    );
  }
}

export default PendingDiploma;