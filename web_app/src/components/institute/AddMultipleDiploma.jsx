import axios from 'axios';
import Tooltip from 'components/Tooltip';
import { format, parse, parseISO } from 'date-fns';
import Loading from 'loading';
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import * as Components from '../../home/Components';
import DiplomaTemplate2 from './diplomaTemplate2';
import './institut.css';

function Students (){
  const [studentsDiplomas,setStudentsDiplomas]=useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [isChecked, setIsChecked] = useState({});
  const [isCheckedFile, setIsCheckedFile] = useState(false);
  const [selectedStatuses, setselectedStatuses] = useState(['ungraduated']);
  const [showSuggestions, setshowSuggestions] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDepartmentName, setSelectedDepartmentName] = useState('');
  const [selectedDepartmentRef, setSelectedDepartmentRef] = useState('');
  const [diplomas, setDiplomas] = useState([]);
  const [Students, setStudents] = useState([]);
  const [selectedDiplomaRef, setSelectedDiplomaRef] = useState(null);
  const [selectedDiplomaName, setSelectedDiplomaName] = useState();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [ShowCertificates, setShowCertificates] = useState(false);
  const [ShowStudents, setShowStudents] = useState(true);
  const [FetchedStudents, setFetchedStudents] = useState([]);
  const [diplomaName, setdiplomaName] = useState();
  const handleCheckAll = (event) => {
    const { checked } = event.target;
    setIsCheckedAll(checked);
    const newIsChecked = {};
    Students.forEach((student, index) => {
      newIsChecked[index] = checked;
    });
    FetchedStudents.forEach((student, index) => {
      newIsChecked[index] = checked;
    });
    setIsChecked(newIsChecked);
  };
  const handleCheck = (index, checked) => {
    setIsChecked((prev) => ({ ...prev, [index]: checked }));
  };
  const isButtonEnabled = Object.values(isChecked).some((value) => value);

  const getStudentsByInstitute = async (instituteId, departmentId, diplomaRef) => {
    console.log("Fetching students for:", instituteId, departmentId, diplomaRef);
    try {
      const response = await axios.get(`http://localhost:5000/students/institute/${instituteId}`, {
        params: {
          departmentId,
          diplomaRef
        }
      });
      console.log('Students fetched:', response.data);
      setFetchedStudents(response.data);
    } catch (error) {
      console.error('Error fetching students by instituteId:', error.response ? error.response.data : error.message);
    }
  };

  const addStudent = async (studentData) => {
    try {
      const response = await axios.post('http://localhost:5000/students', studentData);
      console.log('Added Student:', response.data);
      return { ok: true, data: response.data };
    } catch (error) {
      console.error('Error adding student:', error.response ? error.response.data : error.message);
      return { ok: false, error: error.response ? error.response.data : error.message };
    }
  };


const instID = localStorage.getItem('instituteID');
const getDepartmentsByInstID = async (instID) => {
  try {
    const response = await axios.get(`http://localhost:5000/departments/${instID}`);
    console.log(response.data);
    console.log(instID);

    // Filter the departments to include only those with non-empty diplomas arrays
    const filteredDepartments = response.data.filter(department => Array.isArray(department.diplomas) && department.diplomas.length > 0);
    
    setDepartments(filteredDepartments);
    return filteredDepartments;
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    const fetchDepartments = async () => {
      await getDepartmentsByInstID(instID);
    };
    fetchDepartments();
     setdiplomaName(selectedDepartmentName+'-'+selectedDiplomaName)
    console.log("diplomaName",diplomaName);
  }, [instID,diplomaName]);

  useEffect(() => {
    if (selectedDepartment) {
      getStudentsByInstitute(instID, selectedDepartment, selectedDiplomaRef);
    }
  }, [instID, selectedDepartment, selectedDiplomaRef]);

  const formatDateString = (dateString) => {
    if (typeof dateString !== 'string') return '';
    const dateParts = dateString.split('T'); // Assuming ISO date format
    return dateParts[0]; // Returns just the date part
  };
  const handleReject = (e) => {
    e.preventDefault();
    const confirmation = window.prompt('To confirm deletion, type "reject":');
    if (confirmation && confirmation.toLowerCase() === 'reject') {
        // Perform the deletion operation
        console.log('Deletion confirmed!');
        updateStudentsStatus(e,'rejected');
        
    } else {
        console.log('Deletion canceled.');
    }
  };
 
  
  const selectedRows = Object.keys(isChecked)
  .filter((index) => isChecked[index])
  .map((index) => parseInt(index));
  console.log("selectedRows",selectedRows);

  const parseAndFormatDate = (dateString) => {
    let date;
    
    // Check the format and parse accordingly
    if (dateString.includes('/')) {
      // Handle 'dd/MM/yyyy' format
      if (dateString.split('/').length === 3) {
        date = parse(dateString, 'dd/MM/yyyy', new Date());
      }
      // Handle 'MM/dd/yy' format
      else if (dateString.split('/').length === 2) {
        date = parse(dateString, 'MM/dd/yy', new Date());
      }
    } else {
      return 'Invalid Date Format';
    }
  
    // Check if date parsing was successful
    if (isNaN(date)) {
      return 'Invalid Date';
    }
  
    // Format the date to 'MM/dd/yyyy'
    return format(date, 'MM/dd/yyyy');
  };
  const handleUploadXLSXFile = async (e) => {
    const universityRef='002';
    const instRef=localStorage.getItem("instituteRef")
    const instID=localStorage.getItem("instID")
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log('jsonData', jsonData);
      setStudents(jsonData.slice(1));
      const loadingElement = document.getElementById('loading1');
      loadingElement.style.display = 'flex';
      for (let i = 1; i < jsonData.length; i++) {
        const student = jsonData[i];
        const studentData = {
          studentName: student[0],
          studentEmail: student[1],
          studentCIN: student[2],
          birthDay: parseAndFormatDate(student[3]),
          mention: student[4],
          remiseDay: parseAndFormatDate(student[5]),
          departmentID: selectedDepartment,
          diplomeRef: selectedDiplomaRef,
          diplomeReference: `${universityRef}${instRef}${selectedDepartmentRef}${selectedDiplomaRef}`,
          diplomeName: selectedDiplomaName,
          diplomeHash: null,
          instituteId: instID,
          status: 'ungraduated'
        };
  
        try {
          const studentResponse = await addStudent(studentData);
          if (studentResponse.ok === false) {
            console.error('Failed to add student:', studentResponse.error);
            throw new Error(`Failed to add student: ${studentResponse.error}`);
          }
          console.log('Student added successfully!');
          setFetchedStudents(prev => [...prev, studentResponse.data]);
        } catch (error) {
          console.error('Error adding student:', error);
          toast.error('Failed to add some students. Please check the console for details.');
          break; // Optionally break the loop if you don't want to proceed after an error
        }finally {
          loadingElement.style.display = 'none';
        }
        
      }
      toast.success(`${jsonData.length} Students added successfully!`);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSearchClick = () => {
    setShowSearchInput(!showSearchInput);
}; 

const handleInputChange = (e) => {
  setSearchStudentId(e.target.value);
}; 

  const handleStatusSelection = (status) => {
    if (selectedStatuses.includes(status)) {
      setselectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
     setselectedStatuses([...selectedStatuses, status]);
    }
};

useEffect(() => {
  if (selectedDepartment) {
    const fetchDiplomas = async () => {
      try {
        const department = departments.find(dept => dept._id === selectedDepartment);
        setDiplomas(department ? department.diplomas : []);
      } catch (error) {
        console.error('Failed to fetch diplomas', error);
      }
    };

    fetchDiplomas();
  }
}, [selectedDepartment, departments]);
const formatDate = (dateString) => {
  const dateObject = parseISO(dateString);
  if (isNaN(dateObject)) {
    return 'Invalid Date';
  }
  return format(dateObject, 'MM/dd/yyyy');
};
const [loading, setLoading] = useState(false);
async function updateStudentsStatus(e, status) {
  console.log(status);
  e.preventDefault();
  setLoading(true);
  const selectedRows = Object.keys(isChecked || {})
      .filter((index) => isChecked[index])
      .map((index) => parseInt(index));
  console.log("selectedRows", selectedRows);

  // const updatedParticipants = [...Students];
  const updatedParticipants = [...FetchedStudents];
  const loadingElement = document.getElementById('loading1');
  loadingElement.style.display = 'flex';
  for (let i = 0; i < selectedRows.length; i++) {
      const index = selectedRows[i];
      console.log("index",index);
      console.log(updatedParticipants[index]);
      const participantID = updatedParticipants[index]._id;

      try {
          const response = await fetch(`http://localhost:5000/students/${participantID}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: status }),
          });

          if (!response.ok) {
              throw new Error('Failed to update participant status');
          }
          console.log(`Participant ${status} successfully`);
          updatedParticipants[index].status = status;
          setStudents(updatedParticipants);
      } catch (error) {
          console.error('Error updating participant status:', error);
      }finally {
        loadingElement.style.display = 'none';
      }
      toast.success(`Student status updated successfully!`);
  }

  toast.success(`${selectedRows.length} Participants were ${status} successfully!`);
  setLoading(false);
  const selectedStudents = Students.filter((_, index) => selectedRows.includes(index));
  console.log("selectedStudents", selectedStudents);

  if (isCheckedFile) {
      addParticipantsToExcel(selectedStudents);
  }
  setIsChecked({});
}

const ExcelJS = require('exceljs');
async function addParticipantsToExcel(e,selectedStudents) {
  console.log("participants",selectedStudents);
  console.log("addParticipantsToExcel participants",selectedStudents);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Participants');

  // Add headers
  sheet.addRow(['ID','Name', 'Email', 'Interest', 'Affiliate', 'Contact', 'Status']);
  // Add participant data
  Students.forEach(participant => {
    sheet.addRow([
      participant._id,
      participant.name,
      participant.email,
      participant.interest,
      participant.affiliate,
      participant.contact,
      participant.status
    ]);
  }) }

  const handleFileCheck = ( checked) => {
    setIsCheckedFile(checked);
  };
  
   const handleCertificateConference = async () => {
    const selectedStudentss = FetchedStudents.filter((_, index) => isChecked[index]);
  setShowStudents(false);
  setShowCertificates(true);
  setSelectedStudents(selectedStudentss);
 // setCertificatedConfId(id);
}

const handleSelectDepartmentChange = (e) => {
  const selectedValue = JSON.parse(e.target.value);
  setSelectedDepartment(selectedValue.id);
  setSelectedDepartmentName(selectedValue.name);
  setSelectedDepartmentRef(selectedValue.ref);
};

const handleSelectDiplomaChange = (e) => {
  const selectedValue = JSON.parse(e.target.value);
  setSelectedDiplomaRef(selectedValue.ref);
  setSelectedDiplomaName(selectedValue.name);
};


  const statusSuggestions = ['ungraduated', 'graduated', 'rejected', 'certified'];
  return (
    <div>
  <div id="loading1" style={{
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
                <Loading  size="large1" colors={["#D4DDEE", "#DDE5BF", "#FFF2C6", "#FFE0D3"]} />
                </div>
        {ShowStudents&&(
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
              <span style={{color: '#34A853'}}>s</span>
            </h1>
            <main>
             
      <h4 style={{ color:"#809BCE" }}>Select Department</h4>
      <Components.Select onChange={handleSelectDepartmentChange} value={JSON.stringify({ id: selectedDepartment, name: selectedDepartmentName, ref: selectedDepartmentRef })}>
        <option value={JSON.stringify({ id: "", name: "", ref: "" })} disabled>Select a department</option>
        {departments && departments.map(department => (
          <option key={department._id} value={JSON.stringify({ id: department._id, name: department.name, ref: department.ref })}>
            {department.name} ({department.ref})
          </option>
        ))}
      </Components.Select>

      <h4 style={{ color: "#809BCE" }}>Select Diploma Reference</h4>
      <Components.Select onChange={handleSelectDiplomaChange} value={JSON.stringify({ ref: selectedDiplomaRef, name: selectedDiplomaName })}>
        <option value={JSON.stringify({ ref: "", name: "" })} disabled>Select a diploma</option>
        {diplomas && diplomas.map(diploma => (
          <option key={diploma.ref} value={JSON.stringify({ ref: diploma.ref, name: diploma.name })}>
            {diploma.name} ({diploma.ref})
          </option>
        ))}
      </Components.Select>
            <div  className="table-data" >
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
        <div  className="order" style={{ backgroundColor: "#D4DDEE" }}>
					<div  className="head">
						<h3 style={{ color:"#4285F4" }}>Students Information:</h3>
            <Tooltip text="The xlsx File Should include the student infos order Name, Email, CIN, BirthDay, Mention, DiplomatedDay">
        <span style={{ textDecoration: 'underline', color: '#4285F4' }}>ℹ️ Info</span>
      </Tooltip>
            <input style={{ color:"#4285F4" }} type="file" onChange={handleUploadXLSXFile} /> 
            <i className='bx bx-search' onClick={handleSearchClick}></i>
                    {showSearchInput && (
                        <input
                            type="text"
                            placeholder="Enter Student ID"
                            value={searchStudentId}
                            onChange={handleInputChange}
                        />
                    )}
            <div style={{ position:"relative" }}>
            <i style={{ position:"absolute"}} className='bx bx-filter' onClick={()=>{console.log(!showSuggestions); setshowSuggestions(!showSuggestions)}}></i>
            {showSuggestions && (
                <ul style={{ zIndex:1000,position:"absolute",right:"100%",top:"100%",backgroundColor:"#fff" ,padding:"20px",borderRadius:"20%"}}>
                    {statusSuggestions.map((status, index) => (
                         <li key={index} style={{ marginRight: '10px', marginBottom: '5px' }}>
                         <label style={{ display: 'flex', alignItems: 'center' }}>
                             <input
                                 type="checkbox"
                                 checked={selectedStatuses.includes(status)}
                                 onChange={() => handleStatusSelection(status)}
                             />
                             <td><span style={{ marginLeft: '5px' }} className={`status yes`}>{status}</span></td>
                         </label>
                     </li>
                    ))}
                </ul>
            )}
            </div>
					
					</div>
					<table>
						<thead>
							<tr>
                <th style={{fontWeight:"10",fontSize:"14px"}}><input
              type="checkbox"
              checked={isCheckedAll}
              onChange={handleCheckAll}
            /></th>
              <th>Student Name</th>
              <th>Student CIN</th>
              <th>Student Email</th>
              <th>Birth Day</th>
              <th>Mention</th>
              <th>Diplomated Day</th>
              <th>Status</th>
              <th>Action</th>
							</tr>
						</thead>
						<tbody>
            {FetchedStudents && FetchedStudents.map((student, index) => (
  <tr key={index}>
    <td><input type="checkbox"
                checked={isChecked[index] || false}
                onChange={(e) => handleCheck(index, e.target.checked)}/>
            </td>
    <td>{student.studentName}</td>
    <td>{student.studentCIN}</td>
    <td>{student.studentEmail}</td>
    <td>{formatDate(student.birthDay)}</td>
    <td>{student.mention}</td>
    <td>{formatDate(student.remiseDay)}</td>
    <td style={{ left: "20px" }}>
                {student.status === "ungraduated" && (
                    <span className="status process">ungraduated</span>
                )}
                {student.status=== "graduated" && (
                    <span className="status yes">graduated</span>
                )}
                {student.status === "rejected" && (
                    <span className="status no">Rejected</span>
                )}
                {student.status === "certified" && (
                    <span className="status completed">Certified</span>
                )}
            </td>
                    </tr>))}
      
</tbody>
<tfoot>
<td style={{display:"flex", flex:1,width:"100%"}}><input type="checkbox"
                checked={isCheckedFile || false}
                onChange={(e) => handleFileCheck( e.target.checked)}/>
                <p>Want to Export Excel File having the list of the selected participants ?</p>
            </td>
            <td>
            <div style={{ display:"flex",flex:1,justifyItems:"space-between" }}>
              {isButtonEnabled&&( <button style={{ color:"#53BB6F",backgroundColor:"#DDE5BF",marginRight:"50px"}}  onClick={(e) =>updateStudentsStatus(e,'graduated')}>Set as Graduated </button>)}
              {isButtonEnabled&&( <button style={{ color:"#EA4335",backgroundColor:"#F8C0BB",marginRight:"50px"}}  onClick={(e) =>handleReject(e)}>Reject </button>)}
              {isButtonEnabled&&( <button style={{ color:"#FFCE26",backgroundColor:"#FFF2C6",marginRight:"50px"}}  onClick={handleCertificateConference}>Certificate </button>)}
              {isButtonEnabled&&( <button style={{ color:"#809BCE",backgroundColor:"#D4DDEE",marginRight:"50px"}}  onClick={(e) =>addParticipantsToExcel(e,selectedStudents)}>Export XLSX File </button>)}
          </div>
          </td>
        <tr>
          <td colSpan="9">
           {/* <button disabled={!isButtonEnabled} onClick={handleSubmit} style={{ width:"200px"}}>Send Diplomas to validator</button> */}
          </td>
        </tr>
      </tfoot>
					</table>
          </div>
    </div>
    </main>
  </div>
    </div>
    </main>)}
   
     {ShowCertificates&&(
    
      <DiplomaTemplate2  students={selectedStudents} confDetails={"true"} departmentID={selectedDepartment} departmentName={selectedDepartmentName} departmentRef={selectedDepartmentRef} diplomaRef={selectedDiplomaRef} diplomeName={selectedDiplomaName}  />
     
    )}
    </div>
   
  );
}


export default Students; 
