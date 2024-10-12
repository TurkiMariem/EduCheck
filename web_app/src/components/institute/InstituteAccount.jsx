import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'semantic-ui-react';
import Web3 from 'web3';
import { getContractInstanceInst } from '../../contractServices';
import './style.css';
  // Analytics Cards imports

  const InstituteAccount = () => {
	const [transactions, settransactions] = useState([]);
	const [address, setAddress] = useState("");
	const [selectedStatus, setSelectedStatus] = useState('');
	const [showStatusOptions, setShowStatusOptions] = useState(false);
	const [showStatusOption1, setShowStatusOption1] = useState(true);
	const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
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
	const trans=[];
	const web3 = new Web3(window.ethereum);
	const componentDidMount=async()=> {
		const storageContract = await getContractInstanceInst();
		if (!storageContract || !storageContract.instance) {
		  console.error("Erreur lors de la récupération de l'instance du contrat");
		  this.setState({ errorMessage: "Erreur lors de la récupération de l'instance du contrat" });
		  return;
		}
		const accounts = await web3.eth.getAccounts();
		const accountAddress = accounts[0];
		setAddress(accountAddress)
		web3.eth.getTransactionCount(accountAddress).then((count) => {
			for (let i = 0; i < count; i++) {
			  web3.eth.getTransactionFromBlock(i).then((transaction) => {
				if (transaction) {
trans.push(transaction);
settransactions(trans);
				  const blockHash = transaction.blockHash;
				  const blockHash2 = transaction.to;
				  web3.eth.getBlock(blockHash).then((block) => {
					const timestamp = block.timestamp;
					const date = new Date(timestamp * 1000); // Convert timestamp to date
					console.log("Transaction date and time: ", date);
					console.log("Block Hash: ", blockHash);
					console.log("transaction: ", transaction);
					console.log("to:  ", blockHash2);

				  });
				}

			  });
			}
			console.log('transactions table',trans);
		  });
		 
		  console.log('transactions table',trans);
		}

	useEffect(()=>{
		componentDidMount()
	},[]);
	  
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
						<h3 style={{ color:"#FD7238" }}>Validator Account Details</h3>
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
                                  <h4>Institute Name</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='ref'
                                        value={"this.state.ref"}
                                        autoComplete="ref"
                                      
                                    />
                                  </Form.Field>
								  </div>
								  <div style={{ flex: 1, marginLeft: '20px' }}>
                                <Form.Field required className='add-departement'>
                                  <h4>Name</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='name'
                                        value={"this.state.nam"}
                                        autoComplete="name"
                                       
                                    />
									<i className='bx bx-pen'></i>
                                </Form.Field>
                              
                                <Form.Field required className='add-departement'>
                                  <h4>Email </h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='email'
                                        value={"this.state.emailOfficer"}
                                        autoComplete="name"
                                    />
									<i className='bx bx-pen'></i>
                                </Form.Field>
                                <Form.Field required className='add-departement'>
                                  <h4>Password </h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='email'
                                        value={"this.state.emailOfficer"}
                                        autoComplete="name"
                                    />
									<a>change password</a>
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
							<tr>
								<td>
									<p>Add Multi Diploma</p>
								</td>
								<td>01-10-2021</td>
								<td>01:21</td>
								<td>01:21</td>
							</tr>
							<tr>
								<td>
									<p>Add Multi Diploma</p>
								</td>
								<td>01-10-2021</td>
								<td>01:21</td>
								<td>01:21</td>
							</tr>
							<tr>
								<td>
									<p>Add Multi Diploma</p>
								</td>
								<td>01-10-2021</td>
								<td>01:21</td>
								<td>01:21</td>
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
								<th>Amount</th>
								<th>Status</th>
								<th>details</th>
							</tr>
						</thead>
						<tbody>
						{
    transactions.map((tran) => {
      
        <tr key={tran.hash}>
          <td>{tran.blockHash}</td>
          <td>{"date.toDateString()"}</td>
          <td>{"date.toTimeString()"}</td>
          <td>{tran.to}</td>
          <td>{tran.gasPrice}</td>
          <td>{tran.status}</td>
          <td>{tran.type}</td>
        </tr>
    
	
  })}
						</tbody>
					</table>
				</div>
				</div>
				</div>
				</main>
    </>
  );
};

export default InstituteAccount;