import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Todo() {
    const [showStatusOptions, setShowStatusOptions] = useState(false);
	const [showStatusOption1, setShowStatusOption1] = useState(true);
	const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [todos, setTodos] = useState([]);
    const addToDoLi = () => {
        setTodos([...todos, { text: ' ', status: 'todo' }]);
      };
	const userEmail=localStorage.getItem('confEmail');
	useEffect(() => {
		const fetchTasks = async () => {
		  try {
			const response = await axios.get(`/todo?userEmail=${userEmail}`);
			setTasks(response.data);
		  } catch (error) {
			console.error('Error fetching tasks:', error);
		  }
		};
	
		fetchTasks();
	  }, [userEmail]);

  return (
    <main>
    <div className="todo" style={{ backgroundColor: "#DDE5BF", color: "#53BB6F" }}>
    <div className="head">
      <h3>Todos</h3>
      <i className='bx bx-plus' onClick={() =>addToDoLi()}></i>
    {/*  <i className='bx bx-filter' onClick={() => setShowStatusOptions(!showStatusOptions)}></i> */}
      {showStatusOptions && (
        <ul className="status-options">
          <li >Completed</li>
          <li >Not Completed</li>
        </ul>
      )}
    </div>
    <ul className="todo-list" >
    {tasks.map((todo, index) => (
      <div key={index} style={{ position:'relative' ,marginBottom:"15px"}}>
        <li  className={todo.completed ? 'completed' : 'not-completed'}>
          <input type="text"
           value={todo.text} 
           onChange={(e) => {
              const newText = e.target.value;
              {/* setTasks(prevTodos => {
                const updatedTodos = [...prevTodos];
                updatedTodos[index].text = newText;
                return updatedTodos;
              }); */}
            }} 
  style={{ backgroundColor: "transparent", border: 'none', outline: 'none' }} />
          <i style={{ position:"absolute",left:"100%" }} className='bx bx-dots-vertical-rounded' onClick={() =>{ setSelectedTodoIndex(index)}}></i>
          <i style={{ position:"absolute",left:"90%" }} className='bx bx-trash-alt' 
        //  onClick={() => removeToDo(index)}
          ></i>
        </li>

{selectedTodoIndex === index &&(
      <div style={{ position: "absolute", top: "100%",left: "70%", width: "150px", height: "150px",zIndex:25 }}>
        <ul style={{ borderRadius:"20%", backgroundColor:"#53BB6F" }}>
         {/* <li style={{ backgroundColor:"#53BB6F",color:"#fff" }} onClick={() =>{handleStatusChange('completed');}}>Completed</li>
          <li style={{ backgroundColor:"#53BB6F",color:"#fff" }} onClick={() => {handleStatusChange('not-completed');}}>Not Completed</li> */}
        </ul>
      </div>
    )}
      
      </div>
        
        ))}  
        
    </ul>
  
  </div>
  </main>
  )
}

export default Todo;