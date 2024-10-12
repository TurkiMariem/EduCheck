import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GrInProgress } from "react-icons/gr";
import { ImNotification } from "react-icons/im";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
const DashboardConf = () => {
	const [showStatusOptions, setShowStatusOptions] = useState(false);
	const [showStatusOption1, setShowStatusOption1] = useState(true);
	const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
	const [selectedTodoIndexTask, setSelectedTodoIndexTask] = useState(null);
	const [completedTasks, setCompletedTasks] = useState([]);
	const [tasks, setTasks] = useState([]);
	const userEmail=localStorage.getItem('confEmail');

	useEffect(() => {
		const fetchTasks = async () => {
		  try {
			const response = await axios.get(`http://localhost:5000/todo?userEmail=${userEmail}&status=to-do&status=in-progress`);
			setTasks(response.data);
			console.log("tasks",tasks);
		  } catch (error) {
			console.error('Error fetching tasks:', error);
		  }
		};
		const fetchCompletedTasks = async () => {
			try {
			  const response = await axios.get(`http://localhost:5000/todocompleted?userEmail=${userEmail}&status=completed`);
			  setCompletedTasks(response.data);
			  console.log("completed tasks",completedTasks);
			} catch (error) {
			  console.error('Error fetching completed tasks:', error);
			}
		  };
	  
		fetchCompletedTasks();
		fetchTasks();
	  }, [userEmail]);

	const [todos, setTodos] = useState([ { text: ' ', status: "to-do" },]);
	const handleSaveTasks = async () => {
		try {
		  await axios.post('http://localhost:5000/todo', { todos,userEmail });
		  alert('Tasks saved successfully!');
		} catch (error) {
		  console.error('Error saving tasks:', error);
		  alert('Error saving tasks. Please try again.');
		}
	  };
	  const handleDeleteTask = async (id) => {
		const taskId=tasks[id]._id;
		try {
		  await axios.delete(`http://localhost:5000/todo/${taskId}`);
		  setTasks(tasks.filter(task => task._id !== taskId)); // Remove the task from the local state
		  alert('Task deleted successfully!');
		} catch (error) {
		  console.error('Error deleting task:', error);
		  alert('Error deleting task. Please try again.');
		}
	  }; 
	  const handleUpdateTask = async (id, updatedText, updatedStatus) => {
		if (id < 0 || id >= tasks.length) {
			console.error('Invalid task index:', id);
			console.log('Invalid task index:', id);
			return;
		}
	
		const taskId = tasks[id]._id;
		try {
			await axios.put(`http://localhost:5000/todo/${taskId}`, { text: updatedText, status: updatedStatus });
			setTasks(tasks.map(task =>
				task._id === taskId ? { ...task, text: updatedText, status: updatedStatus } : task
			)); // Update the task text and status in the local state
			alert('Task updated successfully!');
		} catch (error) {
			console.error('Error updating task:', error);
			alert('Error updating task. Please try again.');
		}
	};

	const removeToDo = (index) => {
	  setTodos(todos.filter((_, i) => i !== index));
	};
  
	const addToDoLi = () => {
	  setTodos([...todos, { text: ' ', status: "to-do" }]);
	};
  
	const handleStatusChangeTask = (selectedTodoIndexTask,text,status) => {
		handleUpdateTask(selectedTodoIndexTask, text,status);
		setShowStatusOption1(!showStatusOption1);
		setSelectedTodoIndexTask(null);
		
	  };
	const handleStatusChange = (status) => {
		const updatedTodos = todos.map((todo, index) => {
		  if (index === selectedTodoIndex) {
			return { ...todo, status: status };
		  }
		  return todo;
		});
		setTodos(updatedTodos);
		setShowStatusOption1(!showStatusOption1);
		setSelectedTodoIndex(null);
		
	  };
	  const handleTaskContentChange = (index, updatedText) => {
		const updatedTasks = [...tasks];
		updatedTasks[index].todoContent = updatedText;
		setTasks(updatedTasks);
	};
  return (
    <div>
     <main>
			<div  className="head-title">
				<div  className="left">
				<h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>C</span>
              <span style={{color: '#EA4335'}}>o</span>
              <span style={{color: '#FBBC05'}}>n</span>
              <span style={{color: '#4285F4'}}>f</span>
              <span style={{color: '#34A853'}}>e</span>
              <span style={{color: '#EA4335'}}>r</span>
              <span style={{color: '#4285F4'}}>e</span>
              <span style={{color: '#EA4335'}}>n</span>
              <span style={{color: '#FBBC05'}}>c</span>
              <span style={{color: '#34A853'}}>e</span>
              <span style={{color: '#EA4335'}}>r</span>{' '}{' '}
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
				<li>
					<i  className='bx bxs-calendar-check' ></i>
					<span  className="text">
						<h3>120</h3>
						<p>Conferences Passed</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-group' ></i>
					<span  className="text">
						<h3>34</h3>
						<p>Upcoming Conference</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-dollar-circle' ></i>
					<span  className="text">
						<h3>543</h3>
						<p>Verified Certificates</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-dollar-circle' ></i>
					<span  className="text">
						<h3>13</h3>
						<p>Speaker</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-dollar-circle' ></i>
					<span  className="text">
						<h3>43</h3>
						<p>Organizer</p>
					</span>
				</li>
			</ul>
			<div  className="table-data">
				<div  className="order"  style={{ backgroundColor:"#D4DDEE" }}>
					<div  className="head">
						<h3>Recent Activities</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Activitie</th>
								<th>Start at</th>
								<th>End at</th>
								<th>details</th>
							</tr>
						</thead>
						<tbody>
        {completedTasks.map((task) => (
            <tr key={task._id}>
                <td>{task.todoContent}</td>
                <td>{task.createdAt}</td> {/* Assuming 'date' is a property of the task */}
                <td>{task.updatedAt}</td> {/* Assuming 'time' is a property of the task */}
               
            </tr>
        ))}
    </tbody>
					</table>
				</div>
				<div  className="order"  style={{ backgroundColor:"#EFD2BE" }}>
					<div  className="head">
						<h3>Recent Passed Conferences</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Conference Title</th>
								<th>Date</th>
								<th>Category</th>
								<th>Attendants</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<p>Cyber Security</p>
								</td>
								<td>01/05/2024</td>
								<td>Security</td>
								<td>140</td>
							</tr>
							<tr>
								<td>
									<p>Data Science Introduction</p>
								</td>
								<td>01/06/2024</td>
								<td>data science</td>
								<td>59</td>
							</tr>
							<tr>
								<td>
									<p>Computer Science and IOT </p>
								</td>
								<td>01/10/2021</td>
								<td>01:21</td>
								<td>01:21</td>
							</tr>
							<tr>
								<td>
									<p>Artificial Intelligence Introduction</p>
								</td>
								<td>08/05/2024</td>
								<td>data science</td>
								<td>31</td>
							</tr>
							
						</tbody>
					</table>
				</div>
				<div className="todo" style={{ backgroundColor: "#DDE5BF", color: "#53BB6F" }}>
      <div className="head">
        <h3>Todos</h3>
        <i className='bx bx-plus' onClick={() =>addToDoLi()}
		style={{ backgroundColor:"#fff",borderRadius:"20%",fontSize:"25px" }}></i>
        <i className='bx bx-filter' onClick={() => setShowStatusOptions(!showStatusOptions)}></i>
        {showStatusOptions && (
          <ul className="status-options" style={{ backgroundColor:"#53BB6F",color:"#DDE5BF",position:"absolute",zIndex:1000,padding:"15px",borderRadius:"20%" }}>
            <li >To do</li>
            <li >in-progress</li>
            <li >completed</li>
          </ul>
        )}
      </div>
      <ul className="todo-list" >
		
	  {tasks.map((task, index) => (
		<div key={task._id} style={{ position:'relative' ,marginBottom:"15px"}}>
<li className={task.status === 'to-do' ? 'to-do' : task.status === 'completed' ? 'completed' : 'in-progress'}>
<input
    type="text"
    value={task.todoContent}
	onChange={(e) => handleTaskContentChange(index, e.target.value)}
    onBlur={(e) => {
        const updatedText = e.target.value;
        handleUpdateTask(index, updatedText, task.status);
    }}
    style={{ backgroundColor: "transparent", border: 'none', outline: 'none' }}
/>

            <i style={{ position:"absolute",left:"100%" }} className='bx bx-dots-vertical-rounded' onClick={() =>{ setSelectedTodoIndexTask(index)}}></i>
            <i style={{ position:"absolute",left:"90%" }} className='bx bx-trash-alt' onClick={() => handleDeleteTask(index)}></i>
		
          </li>

{selectedTodoIndexTask === index &&(
        <div style={{position: "absolute", top: "40%",left: "88%", width: "150px", height: "150px",zIndex:25 }}>
		<ul style={{ borderRadius:"20%",backgroundColor:"#fff",padding:"20px" }}>
		  <li style={{ backgroundColor:"#FFE0D3",color:"#E53D30" }} onClick={() => {handleStatusChangeTask(index,task.todoContent,'to-do');}}><ImNotification />To Do</li>
		  <li style={{ backgroundColor:"#FFF2C6",color:"#FFCE26" }} onClick={() => {handleStatusChangeTask(index,task.todoContent,'in-progress');}}><GrInProgress />In Progress</li>
		  <li style={{ backgroundColor:"#D4DDEE",color:"#6D8CC2" }} onClick={() => {handleStatusChangeTask(index,task.todoContent,'completed');}}><IoCheckmarkDoneCircle />Completed</li>
		</ul>
	  </div>
      )}
		
		</div>
		  
		  ))}  
	  {todos.map((todo, index) => (
		<div key={index} style={{ position:'relative' ,marginBottom:"15px"}}>
<li className={todo.status === 'to-do' ? 'to-do' : todo.status === 'completed' ? 'completed' : 'in-progress'}>
	
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
        <div style={{position: "absolute", top: "40%",left: "88%", width: "150px", height: "150px",zIndex:25 }}>
          <ul style={{ borderRadius:"20%",backgroundColor:"#fff",padding:"20px" }}>
            <li style={{ backgroundColor:"#FFE0D3",color:"#E53D30" }} onClick={() => {handleStatusChange('to-do');}}><ImNotification />To Do</li>
            <li style={{ backgroundColor:"#FFF2C6",color:"#FFCE26" }} onClick={() => {handleStatusChange('in-progress');}}><GrInProgress />In Progress</li>
			<li style={{ backgroundColor:"#D4DDEE",color:"#6D8CC2" }} onClick={() =>{handleStatusChange('completed');}}><IoCheckmarkDoneCircle />Completed</li>
          </ul>
        </div>
      )}
		
		</div>
		  
		  ))}  
		  <button onClick={handleSaveTasks} className='btn' style={{ backgroundColor:"#53BB6F",display:"flex",right:"0px" }}>Save Tasks</button>
      </ul>
	
    </div>
	
	</div>
	
		</main>
		
		
    </div>
  );
};

export default DashboardConf;