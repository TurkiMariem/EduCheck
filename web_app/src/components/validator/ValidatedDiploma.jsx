import axios from 'axios';
import React, { Component } from 'react';
import Web3 from 'web3';
import { getContractInstanceInst } from '../../contractServices';

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
      isZoomed:false,
      students:[]
    };
  }
  fetchValidatedStudents = async (studentIds) => {
    console.log("studentIds from fetchstudents",studentIds);
    try {
      const response = await fetch('http://localhost:5000/get-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentIds })
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
  
      const students = await response.json();
      console.log('Fetched students:', students);
      this.setState({students})
      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

   getFileUrlFromIPFS = async (hash) => {
    try {
      const response = await axios.get(`http://localhost:5000/getFileUrlFromIPFS/${hash}`);
      return(response.data.url);
    } catch (error) {
      console.error('Error fetching file URL from IPFS:', error);
    }
  };
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
      .getDiplomasForInstitute(accountAddress)
      .call({ from: accountAddress });
    console.log("students",students);
    const ValidatedStudents = students.filter(student => (student.status=='Validated'));
    if (!ValidatedStudents || ValidatedStudents.length === 0) {
      this.setState({ errorMessage: "No Validated diploma" });
      alert( "No Validated diploma" );
      return;
    }
    console.log("validated Student",ValidatedStudents);
     // Set state and fetch student details
    this.setState({ studentList: ValidatedStudents }, () => {
      const studentsIdss = ValidatedStudents.map(student => student[2]);
      this.fetchValidatedStudents(studentsIdss);
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
    const diplomaUrl = await this.getFileUrlFromIPFS(ipfsHash);
    this.setState({imageUrl: diplomaUrl, showDiplomaModal: true});
  };





  render() {
    const { studentList, selectedStudent,students, imageUrl, showDetailsModal, showDiplomaModal } = this.state;
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
          <th>Student CIN</th>
          <th>Student Details</th>
          <th>Diploma Details</th>
        </tr>
      </thead>
      <tbody>
        {students&& students.map((student) => (
          <tr key={student.numCIN}>
            <td>{student.studentName}</td>
            <td>{student.studentCIN}</td>
            <td>
              <button className="status yes" onClick={(e) => this.handleStudentClick(e, student)}>View Details</button>
            </td>
            <td>
              <button className="status completed" onClick={() => {this.viewDiploma(student.diplomeHash);this.setState({ showDiplomaModal: true })}}>View Diploma</button>
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
          <th>Name</th><td>{selectedStudent.studentName}</td>
        </tr>
        <tr>
          <th>Email</th><td>{selectedStudent.studentEmail}</td>
        </tr>
        <tr>
          <th>Diploma Name</th><td>{selectedStudent.diplomeName}</td>
        </tr>
        <tr>
          <th>Diploma Ref</th><td>{selectedStudent.diplomeReference}</td>
        </tr>
        <tr>
          <th>Birth Date</th><td>{selectedStudent.birthDay}</td>
        </tr>
        <tr>
          <th>Mention</th><td>{selectedStudent.mention}</td>
        </tr>
        <tr>
          <th>Graduation date</th><td>{selectedStudent.remiseDay}</td>
        </tr>
        <tr>
          <th>CIN </th><td>{selectedStudent.studentCIN}</td>
        </tr>
        <tr>
          <th>Diploma Hash </th><td>{selectedStudent.diplomeHash}</td>
        </tr>
        <tr>
          <th>Diploma ID </th><td>{selectedStudent.diplomaId}</td>
        </tr>
        <tr>
          <th>Status </th><td>{selectedStudent.status}</td>
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