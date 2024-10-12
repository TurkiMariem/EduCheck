import React, { Component } from 'react';
import Web3 from 'web3';
import { getContractInstanceInst } from '../../../contractServices';
import { getFileUrlFromIPFS } from '../../../ipfs';


class ValidatedDiploma extends Component {
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
    
    const ValidatedStudents = students.filter(student => (student.validated==='Validated'));
    if (!ValidatedStudents || ValidatedStudents.length === 0) {
      this.setState({ errorMessage: "No Validated diploma" });
      alert( "No Validated diploma" );
      return;
    }

    this.setState({
      studentList: ValidatedStudents,
      
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





  render() {
    const { studentList, selectedStudent, imageUrl, showDetailsModal, showDiplomaModal } = this.state;
    return (
      <main>
			<div  className="head-title">
				<div  className="left">
				<h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>V</span>
              <span style={{color: '#EA4335'}}>a</span>
              <span style={{color: '#FBBC05'}}>l</span>
              <span style={{color: '#34A853'}}>i</span>
              <span style={{color: '#4285F4'}}>d</span>
              <span style={{color: '#EA4335'}}>a</span>
              <span style={{color: '#FBBC05'}}>t</span>
              <span style={{color: '#34A853'}}>e</span>
              <span style={{color: '#FBBC05'}}>d</span>{" "}{" "}
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
						<h3>Recent Validated Diplomas</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Student Details</th>
          <th>Diploma Details</th>
        </tr>
      </thead>
      <tbody>
        {studentList.map((student) => (
          <tr key={student.numCIN}>
            <td>{student.name}</td>
            <td>
              <button className="status yes" onClick={(e) => this.handleStudentClick(e, student)}>View Details</button>
            </td>
            <td>
              <button className="status completed" onClick={() => {this.viewDiploma(student.ipfsHash);this.setState({ showDiplomaModal: true })}}>View Diploma</button>
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

export default ValidatedDiploma;