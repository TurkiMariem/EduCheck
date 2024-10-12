import axios from 'axios';
import React, { useEffect, useState } from 'react';

function StudentInformation() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setselectedStudent] = useState([]);
  const [instituteId, setInstituteId] = useState(localStorage.getItem("instituteID")); // Set your institute ID
  const [departmentId, setDepartmentId] = useState('');
  const [diplomaRef, setDiplomaRef] = useState('');
  const [error, setError] = useState('');
  const [imageUrl, setimageUrl] = useState();
const [showDetailsModal, setshowDetailsModal] = useState(false);
const [showDiplomaModal, setshowDiplomaModal] = useState();
  //fonction pour afficher les details de student
  const handleStudentClick = async(event, student) => {
    event.preventDefault();
  if (selectedStudent) {
    setselectedStudent(null);
    setimageUrl( null);
    setshowDetailsModal(false);
  } else {
    setselectedStudent(student);
    setimageUrl(null); 
    setshowDetailsModal(true);
  }
};
  //fonction pour affiche le diplome
 const viewDiploma = async (ipfsHash) => {
    const diplomaUrl = await this.getFileUrlFromIPFS(ipfsHash);
    setimageUrl(diplomaUrl);
    setshowDiplomaModal(true);
  };

  const fetchStudentsByInstitute = async (instituteId) => {
    try {
      const url = `http://localhost:5000/students/institute/${instituteId}`;
      const response = await axios.get(url);
      console.log('Students:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await fetchStudentsByInstitute(instituteId, departmentId, diplomaRef);
        setStudents(studentsData);
      } catch (error) {
        setError('Error fetching students');
      }
    };

    fetchStudents();
  }, [instituteId, departmentId, diplomaRef]);
  return (
    <main>
    <div  className="head-title">
      <div  className="left">
        <h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>S</span>
              <span style={{color: '#EA4335'}}>t</span>
              <span style={{color: '#FBBC05'}}>u</span>
              <span style={{color: '#34A853'}}>d</span>
              <span style={{color: '#4285F4'}}>e</span>
              <span style={{color: '#EA4335'}}>n</span>
              <span style={{color: '#FBBC05'}}>t</span>
              <span style={{color: '#34A853'}}>s</span>{' '}{' '}
              <span style={{color: '#4285F4'}}>I</span>
              <span style={{color: '#EA4335'}}>n</span>
              <span style={{color: '#FBBC05'}}>f</span>
              <span style={{color: '#34A853'}}>o</span>
              <span style={{color: '#4285F4'}}>r</span>
              <span style={{color: '#EA4335'}}>m</span>
              <span style={{color: '#FBBC05'}}>a</span>
              <span style={{color: '#EA4335'}}>t</span>
              <span style={{color: '#FBBC05'}}>i</span>
              <span style={{color: '#34A853'}}>o</span>
              <span style={{color: '#4285F4'}}>n</span>

            </h1>
          <div  className="table-data" style={{ width:"100%" }} >
      <div  className="order" style={{ backgroundColor:"#D4DDEE" }} >
        <div  className="head">
          <h3>Students Informations</h3>
          <i  className='bx bx-search' ></i>
          <i  className='bx bx-filter' ></i>
        </div>
        <table>
    <thead>
      <tr>
      <th>Student Name</th>
      <th>Student CIN</th>
      <th>Student Email</th>
      <th>Department Id</th>
      <th>Birth Day</th>
      <th>Diploma Name</th>
      <th>Diploma Ref</th>
      <th>Mention</th>
      <th>Status</th>
        <th>Student Details</th>
        <th>Diploma Details</th>
      </tr>
    </thead>
    <tbody>
      {students.map((student) => (
        <tr key={student.studentCIN}>
          <td>{student.studentName}</td>
          <td>{student.studentCIN}</td>
          <td>{student.studentEmail}</td>
          <td>{student.departmentID}</td>
          <td>{student.birthDay}</td>
          <td>{student.diplomeName}</td>
          <td>{student.diplomeRef}</td>
          <td>{student.mention}</td>
          <td>{student.status}</td>
          <td>
            <button className="status yes" onClick={(e) => handleStudentClick(e, student)}>View Details</button>
          </td>
          <td>
            <button className="status completed" onClick={() => {viewDiploma(student.diplomeHash)}}>View Diploma</button>
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
              <span onClick={() => setshowDiplomaModal(false)}>
                  <i className='bx bx-window-close'></i>
              </span>
             {/* <span onClick={() => this.setState({ isZoomed: true })}>
                  <i className='bx bxs-zoom-in'></i>
              </span> */}
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
 {/* {this.state.isZoomed &&(
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
  } */}
  </main>
  )
}

export default StudentInformation