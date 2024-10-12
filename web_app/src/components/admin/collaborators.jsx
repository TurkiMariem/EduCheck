import React, { Component } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Form } from 'semantic-ui-react';
class Collaborators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      picture: null,
      Collaborators:[''],
      isEdit:false,
      CollaboratorId:''
    };
    this.CollaboratorPic = React.createRef();
  }
  componentDidMount=async()=>{
    try {
      const response = await fetch(`http://localhost:5000/Collaborators`,
     { method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
      if (!response.ok) {
        throw new Error('Failed to fetch Collaborators');
      }
      const data=await response.json();
      console.log("data",data);
      this.setState({Collaborators : data});
      console.log('Fetched Collaborators:', this.state.Collaborators);
      return data;
    } catch (error) {
      console.error('Error fetching Collaborators:', error);
      return null;
    }
  }
  sendAddCollaborator= async () => {
    const {   title, description, picture } = this.state;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", picture);
    console.log('Form submitted with data:', { title, description, picture });
  
    const url = 'http://localhost:5000/collaborators';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to register Collaborator');
      }
  
      const result = await response.text();
      console.log("result CollaboratorRegister", result);
      toast.success("Collaboratoradded successfully !");
      this.setState({
        title: '',
      description: '',
      picture: null,
      Collaborators:[''],
      isEdit:false,
      CollaboratorId:''
      });
      this.componentDidMount();
      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  /////////////////////edit 
  sendEditCollaborator= async () => {
    const {  title, description, picture,CollaboratorId  } = this.state;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", picture);
    console.log('Form submitted with data:', { title, description, picture  });
    const updates = { title, description, picture  };
    const url = `http://localhost:5000/Collaborators/${CollaboratorId}`;
  
    try {
      console.log("formData1",JSON.stringify(formData));
      const response = await fetch(url, {
        method : 'PUT',
        headers: {
          'Content-Type': 'application/json', // Include the token in the headers
      },
      body: JSON.stringify(updates)
      });
      if (!response.ok) {
        throw new Error('Failed to update Collaborator');
      }
      const result = await response.text();
      console.log("result CollaboratorUpdate ", result);
      toast.success("Collaborator Updated successfully !");
      this.setState({
        title: '',
        description: '',
        picture: null,
        Collaborators:[''],
        isEdit:false,
        CollaboratorId:''
      });
      this.componentDidMount();
      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  handleDeleteCollaborator= async (index) => {
    const sp=this.state.Collaborators[index];
    this.setState({
      CollaboratorId: sp._id,});
      console.log("this.state.CollaboratorId",this.state.CollaboratorId);
    const confirmDelete = window.confirm('Are you sure you want to delete the Collaborator?');
    if (!confirmDelete) {
      return; // User clicked Cancel, so exit the function
    }
    const url = `http://localhost:5000/Collaborators/${this.state.CollaboratorId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete Collaborator');
      }
  
      const result = await response.text();
      console.log("result CollaboratorDelete ", result);
      toast.success("Collaborator Deleted successfully !");
      // Refresh the list of Collaborators
      this.componentDidMount(); // Assuming fetchCollaborators is a function that fetches the list of Collaborators from the server
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  handleEdit = (index) => {
    console.log('Edit Collaboratorat index:', index);
    const sp=this.state.Collaborators[index];
    this.setState({
      CollaboratorId: sp._id,
      title: sp.title,
      description:sp.description,
      picture: sp.picture,
    });
this.setState({isEdit:true});
    // Implement your logic to update the state or perform other actions
  };
  
  //////////////////////////////////////////////////////////////////////////////////////////////
  handleSubmit = (event) => {
    event.preventDefault();
    const { name, email, responsabilities, picture, role, contact, availability } = this.state;
    console.log('Form submitted with data:', { name, email, responsabilities, picture, role, contact, availability });
  }

  handleRoleChange = (event) => {
    const selectedCategory = event.target.value;
    console.log('Selected category:', selectedCategory);
    this.setState({ role: selectedCategory });
  }

  handleFileChange = (event) => {
    const file = event.target.files[0];
    this.setState({ picture: file },() => {
        console.log("this.state.file", this.state.picture);});
  }

  handleChange = (event, fieldName) => {
    this.setState({ [fieldName]: event.target.value });
  }
  render() {
    const { title, description, picture,isEdit } = this.state;
    return (
      <main>
          <ToastContainer
     position="bottom-right"
     autoClose={5000}
     hideProgressBar={false}
     newestOnTop={false}
     closeOnClick
     rtl={false}
     pauseOnFocusLoss
     draggable
     pauseOnHover
     theme="colored"/>
      <div  className="head-title">
            <div  className="left">
          <h1 className="google-search-heading">
          <span style={{color: '#4285F4'}}>C</span>
              <span style={{color: '#EA4335'}}>o</span>
              <span style={{color: '#FBBC05'}}>l</span>
              <span style={{color: '#4285F4'}}>l</span>
              <span style={{color: '#34A853'}}>a</span>
              <span style={{color: '#EA4335'}}>b</span>
              <span style={{color: '#4285F4'}}>o</span>
              <span style={{color: '#FBBC05'}}>r</span>
              <span style={{color: '#4285F4'}}>a</span>
              <span style={{color: '#34A853'}}>t</span>
              <span style={{color: '#EA4335'}}>o</span>
              <span style={{color: '#4285F4'}}>r</span>
              <span style={{color: '#FBBC05'}}>s</span>
            </h1>
            <h4>Who is our collaborators ?</h4>
            </div>
            </div>
        <div className="hash" style={{ padding:"20px",margin:"20px" ,width:"95%"}}>
            
          <h2 style={{ color: "#576389" }}>{isEdit?"Update ":"Add "} Collaborator</h2>
          <div className='signup'>
            <Card fluid centered>
              <Card.Content>
                <Form size='large' onSubmit={isEdit? this.sendEditCollaborator:this.sendAddCollaborator} enctype="multipart/form-data">
                  <Form.Field required className='add-departement'>
                    <h4>Collaborator Title</h4>
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Collaborator Title'
                      value={title}
                      autoComplete="title"
                      onChange={(e) => this.handleChange(e, 'title')}
                    />
                  </Form.Field>

                  <Form.Field required className='add-departement'>
                    <h4>Collaborator Description</h4>
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Description'
                      value={description}
                      autoComplete="description"
                      onChange={(e) => this.handleChange(e, 'description')}
                      style={{ height:"80px" }}
                    />
                     </Form.Field>
            
                    <Form.Field required className='add-departement' style={{ marginBottom:"10px" }}>
                    <h4>Collaborator Icon</h4>
                                  <input type="file"
            accept="image/*"  ref={this.CollaboratorPic}
        onChange={this.handleFileChange} 
       id="image" name="image" />
                                </Form.Field>
                  <button className="btn" type="submit" style={{left:"80%",position:"relative", backgroundColor:isEdit?"#FBBC05":"#576389" }}>{isEdit?"Update ":"Add "} Collaborator</button>
                </Form>
              </Card.Content>
            </Card>
          </div>
        </div>
        {this.props.hideTable ? null : (<main>
            <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
					<div  className="head">
						<h3>Your Collaborators List</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Collaborator Title</th>
                <th>Description</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
            {this.state.Collaborators.map((Collaborator, index) => {
    return (
      <tr key={index}>
        <td>
          <img src={`../files/${Collaborator.picture}`}></img>
          <p>{Collaborator.title}</p>
        </td>
        <td>{Collaborator.description}</td>
        <td>
        <span  onClick={() => this.handleEdit(index)} style={{ color:"#FD7238" }}><FaEdit />Edit</span>
        <span  onClick={() => this.handleDeleteCollaborator(index)} style={{ color:"#EA4335" }}><MdDelete />Delete</span>
        </td>
      </tr>
    );
  })}
						</tbody>
					</table>
				</div>
				</div>
                
            </main>)}
      </main>
    );
  }
}

export default Collaborators;
