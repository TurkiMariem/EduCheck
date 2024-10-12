import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'semantic-ui-react';
import Web3 from 'web3';
import { getContractInstanceInst } from '../../contractServices';
import './style.css';
  // Analytics Cards imports
  import axios from 'axios';
import { IoMdAddCircle } from 'react-icons/io';
  const ValidatorAccount = () => {
	const [transactions, setTransactions] = useState([]);
	const [address, setAddress] = useState("");
	const [selectedStatus, setSelectedStatus] = useState('');
	const [showStatusOptions, setShowStatusOptions] = useState(false);
	const [showStatusOption1, setShowStatusOption1] = useState(true);
	const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showModalDiploma, setShowModalDiploma] = useState(false);
	const [departmentName, setDepartmentName] = useState('');
	const [diplomaName, setDiplomaName] = useState('');
	const [departmentRef, setDepartmentRef] = useState('');
	const [diplomaRef, setDiplomaRef] = useState('');
	const [departments, setDepartments] = useState([]);
  const [studentsIds, setStudentsIds] = useState([]);
  const [students, setstudents] = useState();
	const [selectedDepartmentIndex, setSelectedDepartmentIndex] = useState(null); 
  const [Institute, setInstitute] = useState([]);
const instID = localStorage.getItem('instituteID');
console.log("instID",instID);
useEffect(() => {
  const fetchInstitute = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/institute/${instID}`);
      console.log("response.data.institute",response.data);
      setInstitute(response.data);
    } catch (error) {
      console.error('Error fetching institute:', error);
    }
  };

  fetchInstitute();
}, [instID]);

const getDepartmentsByInstID = async (instID) => {
  try {
    const response = await axios.get(`http://localhost:5000/departments/${instID}`);
    console.log(response.data);
    console.log(instID);
    setDepartments(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

 
useEffect(() => {
  const fetchDepartments = async () => {
    const data = await getDepartmentsByInstID(instID);
   // setDepartments(data);
	console.log("departments",data);
  };

  fetchDepartments();
 
}, [instID]);


const handleAddDepartment = async (e) => {
  e.preventDefault();

  console.log(instID);
  try {
    const response = await axios.post('http://localhost:5000/departments', {
      name: departmentName,
      ref: departmentRef,
      instID: instID
    });
    const newDepartment = response.data;
    setDepartments((prevDepartments) => [...prevDepartments, newDepartment]);
    console.log(newDepartment);
    // Optionally, clear the form inputs
    setDepartmentName('');
    setDepartmentRef('');
  } catch (error) {
    console.error(error);
  }
};


const handleAddDiploma = async (index) => {
  if (diplomaName && diplomaRef) {
    const department = departments[index];
    const updatedDiplomas = [...(department.diplomas || []), { name: diplomaName, ref: diplomaRef }];

    try {
      const response = await axios.put(`http://localhost:5000/departments/${department._id}/diplomas`, {
        diplomas: updatedDiplomas,
      });
      const updatedDepartment = response.data;
      setDepartments((prevDepartments) => {
        const newDepartments = [...prevDepartments];
        newDepartments[index] = updatedDepartment;
        return newDepartments;
      });
      setDiplomaName('');
      setDiplomaRef('');
      setSelectedDepartmentIndex(null);
    } catch (error) {
      console.error('Failed to update diplomas', error);
    }
  }
};


	const [todos, setTodos] = useState([ { text: 'Learn React', completed: false },
	{ text: 'Build a Todo App', completed: false },
	{ text: 'Deploy the App', completed: false },
	{ text: 'Deploy the App', completed: false }]);
	

	const removeToDo = (index) => {
	  setTodos(todos.filter((_, i) => i !== index));
	};
  
	const addToDoLi = () => {
	  setTodos([...todos, { text: 'New Todo', completed: false }]);
	};
  
	const handleStatusChange = (status) => {
		const updatedTodos = todos.map((todo, index) => {
		  if (index === selectedTodoIndex) {
			return { ...todo, completed: status === 'completed' };
		  }
		  return todo;
		});
		setTodos(updatedTodos);
		setShowStatusOption1(!showStatusOption1);
		setSelectedTodoIndex(null);
		
	  };
	const web3 = new Web3(window.ethereum);
 
  useEffect(() => {
    const componentDidMount = async () => {
      try {
        const storageContract = await getContractInstanceInst();
        if (!storageContract || !storageContract.instance) {
          console.error("Erreur lors de la récupération de l'instance du contrat");
         // setErrorMessage("Erreur lors de la récupération de l'instance du contrat");
          return;
        }

        const accounts = await web3.eth.getAccounts();
        const accountAddress = accounts[0];
        setAddress(accountAddress);
        await fetchTransactions(accountAddress);
      } catch (error) {
        console.error("Error in componentDidMount:", error);
      }
    };

    componentDidMount();
  }, []);


  const fetchTransactions = async (accountAddress) => {
    const trans = [];
    const latestBlockNumber = await web3.eth.getBlockNumber();

    for (let i = 0; i <= latestBlockNumber; i++) {
      try {
        const block = await web3.eth.getBlock(i, true);
        if (block && block.transactions) {
          for (let transaction of block.transactions) {
            if (transaction.from === accountAddress || transaction.to === accountAddress) {
              const receipt = await web3.eth.getTransactionReceipt(transaction.hash);
              const gasUsed = receipt.gasUsed;
              const gasPrice = transaction.gasPrice;
              const transactionCost = web3.utils.fromWei((gasUsed * gasPrice).toString(), 'ether');
              const timestamp = block.timestamp;
              const date = new Date(timestamp * 1000); // Convert timestamp to date

              // Convert date to string for rendering in React
              const dateString = date.toISOString();

              trans.push({ ...transaction, date: dateString, gasUsed, gasPrice, transactionCost });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    }

    setTransactions(trans);
    console.log('Transactions table', trans);
  };

	useEffect(()=>{
	},[departments]);
	  
  return (	
	<>
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
			  <span style={{color: '#34A853'}}>o</span>
              <span style={{color: '#4285F4'}}>r</span>{" "}
              <span style={{color: '#4285F4'}}>A</span>
              <span style={{color: '#EA4335'}}>c</span>
              <span style={{color: '#FBBC05'}}>c</span>
              <span style={{color: '#34A853'}}>o</span>
              <span style={{color: '#4285F4'}}>u</span>
              <span style={{color: '#EA4335'}}>n</span>
              <span style={{color: '#FBBC05'}}>t</span>
            </h1>
					<ul  className="breadcrumb">
						<li>
							<a href="#">Account</a>
						</li>
						<li><i  className='bx bx-chevron-right' ></i></li>
						<li>
							<a  className="active" href="#">Settings</a>
						</li>
					</ul>
				</div>
				<a href="#"  className="btn-download">
					<i  className='bx bxs-cloud-download' ></i>
					<span  className="text">Download PDF Account Informations</span>
				</a>
				<div  className="table-data" >
				<div  className="order" style={{ backgroundColor:"#FFE0D3" }} >
					<div  className="head">
						<h3 style={{ color:"#FD7238" }}>Institute Account Details</h3>
					</div>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large' style={{ color:"#FD7238",display: 'flex', justifyContent: 'space-between' }}>
								<div style={{ flex: 1 ,justifyContent: 'center',alignItems:"center"}}>
								<div style={{ width: "200px", height: "200px", borderRadius: "50%", justifyContent: 'center', position: 'relative' }}>
  <input
    type="file"
    id="fileInput"
    style={{ display: 'none' }}
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageSrc = e.target.result;
          // Update the image source here
          document.getElementById('profileImage').src = imageSrc;
        };
        reader.readAsDataURL(file);
      }
    }}
  />
  <a href="#" className="AccountImage">
    <img
      id="profileImage"
      src="./images/people.png"
      alt="Profile"
      style={{ width: "200px", height: "200px", borderRadius: "50%", justifyContent: 'center' }}
    />
    <label
      htmlFor="fileInput"
      style={{ position: "absolute", bottom: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 20, backgroundColor: "#fff", cursor: 'pointer', padding: '5px 10px', borderRadius: '5px' }}
    >
      <i className='bx bx-camera'></i>
    </label>
  </a>
</div>

                                <div className='add-departement'>
                                  <h4>Account Address</h4>
                                  <input className="form-input1" style={{backgroundColor:"#FD7238",color:"#fff"}} value={address} />
                                </div>

                                <Form.Field required className='add-departement'>
                                  <h4>University Name</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='ref'
                                        value={Institute.universityName}
                                        autoComplete="ref"
                                      
                                    />
                                  </Form.Field>
                                  <Form.Field required className='add-departement'>
                                  <h4>University Reference</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='ref'
                                        value={Institute.universityRef}
                                        autoComplete="ref"
                                      
                                    />
                                  </Form.Field>
								  </div>
								  <div style={{ flex: 1, marginLeft: '20px' }}>
                 
                                <Form.Field required className='add-departement'>
                                  <h4>Institute Name</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='ref'
                                        value={Institute.instName}
                                        autoComplete="ref"
                                      
                                    />
                                  </Form.Field>
                                <Form.Field required className='add-departement'>
                                  <h4>Institute Acronym</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='ref'
                                        value={Institute.instName}
                                        autoComplete="ref"
                                      
                                    />
                                  </Form.Field>
                                <Form.Field required className='add-departement'>
                                  <h4>Institute Reference</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='name'
                                        value={Institute.instRef}
                                        autoComplete="name"
                                       
                                    />
									<i className='bx bx-pen'></i>
                                </Form.Field>
                              
                                <Form.Field required className='add-departement'>
                                  <h4>Email Validator</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='email'
                                        value={Institute.validatorEmail}
                                        autoComplete="name"
                                    />
									<i className='bx bx-pen'></i>
                                </Form.Field>
                                <Form.Field required className='add-departement'>
                                  <h4>Email Officer</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='email'
                                        value={Institute.officerEmail}
                                        autoComplete="name"
                                    />
									<i className='bx bx-pen'></i>
                                </Form.Field>
                                <Form.Field required className='add-departement'>
                                  <h4>Website</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='email'
                                        value={Institute.website}
                                        autoComplete="name"
                                    />
									<i className='bx bx-pen'></i>
                                </Form.Field>
                               
                                <Form.Field>
                                    <Button type='submit' class="btn"  primary fluid size='large' style={{ backgroundColor:"#FD7238" ,bottom:0}} >
                                       Update
                                    </Button>
                                </Form.Field>
								</div>
                            </Form>
                        </Card.Content>
                      </Card>
					  </div>
					  </div>
					  <div className="table-data">
      <div className="order" style={{ backgroundColor: "#D4DDEE" }}>
        <div className="head">
          <h3>Departments</h3>
          <i className='bx bx-search'></i>
          <i className='bx bx-filter'></i>
        </div>
        <table>
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Department Ref</th>
              <th>
                <span onClick={() => setShowModal(!showModal)} style={{ cursor: 'pointer' }}>
                  Add Department <IoMdAddCircle />
                </span>
              </th>
			  
            </tr>
			{showModal && (
        <div>
          <h5>Add Department Information:</h5>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>
              Department Name
              <input
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </label>
            <label>
              Department Ref
              <input
                value={departmentRef}
                onChange={(e) => setDepartmentRef(e.target.value)}
              />
            </label>
            <button className='btn' onClick={handleAddDepartment}>Add</button>
          </div>
        </div>
      )}
          </thead>
          <tbody>
            {departments && departments.map((department,index) => (
              <React.Fragment key={department._id}>
                <tr style={{ backgroundColor:"#C8C8C8" }}>
                  <td>{department.name}</td>
                  <td>{department.ref}</td>
				  <td>
				  <span onClick={() => setSelectedDepartmentIndex(index)} style={{ cursor: 'pointer' }}>
                      Add Diploma <IoMdAddCircle />
                    </span>
				</td>
				{showModalDiploma && (
        <div>
          <h5>Add Department Information:</h5>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>
              Diploma Name
              <input
                value={diplomaName}
                onChange={(e) => setDiplomaName(e.target.value)}
              />
            </label>
            <label>
              Diploma Ref
              <input
                value={diplomaRef}
                onChange={(e) => setDiplomaRef(e.target.value)}
              />
            </label>
            <button className='btn' onClick={handleAddDepartment}>Add</button>
          </div>
        </div>
      )}
                </tr>
                {department.diplomas && department.diplomas.length > 0 && (
                  <tr >
                    <td colSpan="3">
                      <table>
                        <thead>
                          <tr>
                            <th style={{ color:"#C8C8C8" }}>Diploma Name</th>
                            <th style={{ color:"#C8C8C8" }}>Diploma Ref</th>
                          </tr>
                        </thead>
                        <tbody>
                          {department.diplomas.map((diploma, index) => (
                            <tr key={index}>
                              <td>{diploma.name}</td>
                              <td>{diploma.ref}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              {selectedDepartmentIndex === index && (
                  <tr>
                    <td colSpan="3">
                      <div>
                        <h5>Add Diploma Information:</h5>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <label>
                            Diploma Name
                            <input
                              value={diplomaName}
                              onChange={(e) => setDiplomaName(e.target.value)}
                            />
                          </label>
                          <label>
                            Diploma Ref
                            <input
                              value={diplomaRef}
                              onChange={(e) => setDiplomaRef(e.target.value)}
                            />
                          </label>
                          <button className='btn' onClick={() => handleAddDiploma(index)}>Add</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

     
    </div>
			<div  className="table-data" >
				<div  className="order" style={{ backgroundColor:"#D4DDEE" }} >
					<div  className="head">
						<h3>Recent Activities</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Activitie</th>
								<th>Date</th>
								<th>time</th>
								<th>details</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<p>Add diploma</p>
								</td>
								<td>01-10-2021</td>
								<td>11:56</td>
								<td>11:56</td>
							</tr>
								
							
						</tbody>
					</table>
				</div>
				<div className="todo" style={{ backgroundColor: "#DDE5BF", color: "#53BB6F" }}>
      <div className="head">
        <h3>Todos</h3>
        <i className='bx bx-plus' onClick={() =>addToDoLi()}></i>
        <i className='bx bx-filter' onClick={() => setShowStatusOptions(!showStatusOptions)}></i>
        {showStatusOptions && (
          <ul className="status-options">
            <li >Completed</li>
            <li >Not Completed</li>
          </ul>
        )}
      </div>
      <ul className="todo-list" >
	  {todos.map((todo, index) => (
		<div key={index} style={{ position:'relative' }}>
          <li  className={todo.completed ? 'completed' : 'not-completed'}>
            <input type="text"
			 value={todo.text} 
			 onChange={(e) => {
				const newText = e.target.value;
				setTodos(prevTodos => {
				  const updatedTodos = [...prevTodos];
				  updatedTodos[index].text = newText;
				  return updatedTodos;
				});
			  }} 
	style={{ backgroundColor: "transparent", border: 'none', outline: 'none' }} />
            <i style={{ position:"absolute",left:"100%" }} className='bx bx-dots-vertical-rounded' onClick={() =>{ setSelectedTodoIndex(index)}}></i>
            <i style={{ position:"absolute",left:"90%" }} className='bx bx-trash-alt' onClick={() => removeToDo(index)}></i>
		
          </li>

{selectedTodoIndex === index &&(
        <div style={{ position: "absolute", top: "100%",left: "70%", width: "150px", height: "150px",zIndex:25 }}>
          <ul style={{ borderRadius:"20%", backgroundColor:"#53BB6F" }}>
            <li style={{ backgroundColor:"#53BB6F",color:"#fff" }} onClick={() =>{ handleStatusChange('completed');}}>Completed</li>
            <li style={{ backgroundColor:"#53BB6F",color:"#fff" }} onClick={() => {handleStatusChange('not-completed');}}>Not Completed</li>
          </ul>
        </div>
      )}
		
		</div>
		  
		  ))}  
		  
      </ul>
	
    </div>
				</div>
			<div  className="table-data" >
				<div  className="order"  style={{ backgroundColor:"#FFF2C6" ,color:"#FFCE26"}} >
					<div  className="head">
						<h3>Recent Trasactions</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Transaction Address</th>
								<th>Date</th>
								<th>time</th>
								<th>To Address</th>
                <th>Transaction Cost (ETH)</th>
								<th>Status</th>
								<th>Type</th>
							</tr>
						</thead>
            <tbody>
          {transactions && transactions.map((tran) => (
            <tr key={tran.hash} style={{ color:"#8C8C8C" }}>
              <td>{tran.blockHash}</td>
              <td>{tran.date}</td>
              <td>{tran.date}</td>
              <td>{tran.to}</td>
              <td>{tran.transactionCost}</td>
              <td>{tran.status}</td>
              <td>{tran.type}</td>
            </tr>
          ))}
        </tbody>
					</table>
				</div>
				</div>
				</div>
				</main>
    </>
  );
};

export default ValidatorAccount;