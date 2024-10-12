import React, { useState } from 'react';
import Cards from '../dashCards/Cards';
const DashboardOfficer = () => {
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
  return (
    <>
     <main>

			<div  className="head-title">
				<div  className="left">
				<h1 className="google-search-heading">
				<span style={{color: '#4285F4'}}>O</span>
              <span style={{color: '#EA4335'}}>f</span>
              <span style={{color: '#FBBC05'}}>f</span>
              <span style={{color: '#4285F4'}}>i</span>
              <span style={{color: '#34A853'}}>c</span> 
			  <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#FBBC05'}}>r</span>{" "}{" "}
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
						<h3>1020</h3>
						<p>Verified Diploma</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-group' ></i>
					<span  className="text">
						<h3>2834</h3>
						<p>Students</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-dollar-circle' ></i>
					<span  className="text">
						<h3>1132</h3>
						<p>Pending Diplomas</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-dollar-circle' ></i>
					<span  className="text">
						<h3>25</h3>
						<p>Rejected Students</p>
					</span>
				</li>
			</ul>
			<div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
					<div  className="head">
						<h3>Recent Activities</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Task</th>
								<th>Date</th>
								<th>Start Time</th>
								<th>End Time</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<p>Create new Template</p>
								</td>
								<td>01-02-2024</td>
								<td>01:10</td>
								<td>05:22</td>
								<td><span  className="status yes">Completed</span></td>
							</tr>
							<tr>
								<td>
									<p>Generate Diplomas For FIA </p>
								</td>
								<td>11-08-2021</td>
								<td>01:10</td>
								<td>05:22</td>
								<td><span  className="status no">Must Do</span></td>
							</tr>
							<tr>
								<td>
									<p>Add new Template</p>
								</td>
								<td>13-05-2024</td>
								<td>01:10</td>
								<td>05:22</td>
								<td><span  className="status pending">To Do</span></td>
							</tr>
							<tr>
								<td>
									<p>Add new students</p>
								</td>
								<td>23-04-2024</td>
								<td>01:10</td>
								<td>05:22</td>
								<td><span  className="status completed">done</span></td>
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
			
		</main>
		</>
		
  );
};

export default DashboardOfficer;