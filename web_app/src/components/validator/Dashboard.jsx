import React, { useState } from 'react';
import Web3 from 'web3';
import { getContractInstanceInst } from '../../contractServices';
import Cards from '../dashCards/Cards';
import './style.css';
  // Analytics Cards imports

  const Dashboard = () => {
	const [transactions, settransactions] = useState([]);
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
  return (
    <div>
		
     <main>
			<div  className="head-title">
				<div  className="left">
				<h1 className="google-search-heading">
				<span style={{color: '#4285F4'}}>V</span>
              <span style={{color: '#EA4335'}}>a</span>
              <span style={{color: '#FBBC05'}}>l</span>
              <span style={{color: '#4285F4'}}>i</span>
              <span style={{color: '#34A853'}}>d</span>
              <span style={{color: '#EA4335'}}>a</span>
              <span style={{color: '#4285F4'}}>t</span>
			  <span style={{color: '#FBBC05'}}>o</span>
              <span style={{color: '#EA4335'}}>r</span>{" "}{" "}
              
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
			<ul className='box-info'>
		<Cards/>
			</ul>
			<ul  className="box-info">
				<li>
					<i  className='bx bxs-calendar-check' ></i>
					<span  className="text" onClick={()=>{console.log('transactions table',transactions);}}>
						<h3>1020</h3>
						<p>Conferences</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-group' ></i>
					<span  className="text">
						<h3>2834</h3>
						<p>Institutes</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-dollar-circle' ></i>
					<span  className="text">
						<h3>112543</h3>
						<p>Verified Diplomas</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-dollar-circle' ></i>
					<span  className="text">
						<h3>112543</h3>
						<p>Verified Diplomas</p>
					</span>
				</li>
			</ul>
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
				<div  className="todo" style={{ backgroundColor:"#DDE5BF" }} >
					<div  className="head">
						<h3>Todos</h3>
						<i  className='bx bx-plus' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<ul  className="todo-list">
						<li  className="completed">
							<p>Todo List</p>
							<i  className='bx bx-dots-vertical-rounded' ></i>
						</li>
						<li  className="completed">
							<p>Todo List</p>
							<i  className='bx bx-dots-vertical-rounded' ></i>
						</li>
						<li  className="not-completed">
							<p>Todo List</p>
							<i  className='bx bx-dots-vertical-rounded' ></i>
						</li>
						<li  className="completed">
							<p>Todo List</p>
							<i  className='bx bx-dots-vertical-rounded' ></i>
						</li>
						<li  className="not-completed">
							<p>Todo List</p>
							<i  className='bx bx-dots-vertical-rounded' ></i>
						</li>
					</ul>
				</div>
				</div>
			<div  className="table-data" >
				<div  className="order" style={{ backgroundColor:"#FFF2C6" }} >
					<div  className="head">
						<h3>Recent Trasactions</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' onClick={componentDidMount}></i>
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
		</main>
    </div>
  );
};

export default Dashboard;