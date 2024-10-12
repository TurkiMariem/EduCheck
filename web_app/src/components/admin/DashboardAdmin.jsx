import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Cards from '../dashCards/Cards';
const Dashboard = () => {
	const [showStatusOptions, setShowStatusOptions] = useState(false);
	const [showStatusOption1, setShowStatusOption1] = useState(true);
	const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
	const [transactions, setTransactions] = useState([]);
	const [Address, setAddress] = useState();
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
	const web3 = new Web3(window.ethereum);
	useEffect(() => {
		const componentDidMount = async () => {
		  try {
		
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
	const shortenAddress=(address) => {
		if (address.length < 10) {
		  return address; // Return the address if it's already short
		}
		const firstPart = address.slice(0, 6); // Get the first 6 characters
		const lastPart = address.slice(-4); // Get the last 4 characters
		return `${firstPart}...${lastPart}`;
	  }
  return (
    <>
     <main>

			<div  className="head-title">
				<div  className="left">
				<h1 className="google-search-heading">
				<span style={{color: '#4285F4'}}>A</span>
              <span style={{color: '#EA4335'}}>d</span>
              <span style={{color: '#FBBC05'}}>m</span>
              <span style={{color: '#4285F4'}}>i</span>
              <span style={{color: '#34A853'}}>n</span>{" "}{" "}
              <span style={{color: '#4285F4'}}>D</span>
              <span style={{color: '#EA4335'}}>a</span>
              <span style={{color: '#FBBC05'}}>s</span>
              <span style={{color: '#4285F4'}}>h</span>
              <span style={{color: '#34A853'}}>b</span>
              <span style={{color: '#EA4335'}}>o</span>
              <span style={{color: '#4285F4'}}>a</span>
              <span style={{color: '#EA4335'}}>r</span>
              <span style={{color: '#FBBC05'}}>d</span>
			 
            </h1>
			
					<ul  className="breadcrumb">
						<li>
							<a href="#">Dashboard</a>
						</li>
						<li><i  className='bx bx-chevron-right' ></i></li>
						<li>
							<a  className="active" href="#">Home</a>
						</li>
					</ul>
				</div>
				<a href="#"  className="btn-download">
					<i  className='bx bxs-cloud-download' ></i>
					<span  className="text">Download PDF</span>
				</a>
			</div>
			<ul  className="box-info">
				<Cards/>
				</ul>
			<ul  className="box-info">
				<li>
					<i  className='bx bxs-calendar-check' ></i>
					<span  className="text">
						<h3>122</h3>
						<p>Conference</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-group' ></i>
					<span  className="text">
						<h3>23</h3>
						<p>Institute</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-dollar-circle' ></i>
					<span  className="text">
						<h3>225</h3>
						<p>Verified Diploma</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-dollar-circle' ></i>
					<span  className="text">
						<h3>2568</h3>
						<p>Verified Certificate</p>
					</span>
				</li>
			</ul>
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
              <td>{shortenAddress(`${tran.blockHash}`)}</td>
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
			
		</main>
		</>
		
  );
};

export default Dashboard;