import React, { Component } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Form } from 'semantic-ui-react';

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      picture: null,
      Services:[''],
      isEdit:false,
      serviceId:''
    };
    this.servicePic = React.createRef();
  }
  componentDidMount=async()=>{
    try {
      const response = await fetch(`http://localhost:5000/Services`,
     { method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
      if (!response.ok) {
        throw new Error('Failed to fetch Services');
      }
      const data=await response.json();
      console.log("data",data);
      this.setState({Services : data});
      console.log('Fetched Services:', this.state.Services);
      return data;
    } catch (error) {
      console.error('Error fetching Services:', error);
      return null;
    }
  }
  sendAddservice= async () => {
    const {   title, description, picture } = this.state;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", picture);
    console.log('Form submitted with data:', { title, description, picture });
  
    const url = 'http://localhost:5000/services';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to register service');
      }
  
      const result = await response.text();
      console.log("result serviceRegister", result);
      toast.success("serviceadded successfully !");
      this.setState({
        title: '',
      description: '',
      picture: null,
      Services:[''],
      isEdit:false,
      serviceId:''
      });
      this.componentDidMount();
      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  /////////////////////edit 
  sendEditservice = async () => {
    const { title, description, picture, serviceId } = this.state;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", picture); // Ensure 'picture' is a file object
  console.log("picture",picture);
    const url = `http://localhost:5000/services/${serviceId}`;
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        // No need to set Content-Type header for FormData
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to update service');
      }
  
      const result = await response.json();
      console.log("result serviceUpdate", result);
      toast.success("Service updated successfully!");
  
      this.setState({
        title: '',
        description: '',
        picture: null,
        Services: [],
        isEdit: false,
        serviceId: ''
      });
  
      this.componentDidMount(); // Re-fetch services
    } catch (error) {
      console.error('Error:', error);
    }
  }; 
  handleDeleteservice= async (index) => {
    const sp=this.state.Services[index];
    this.setState({
      serviceId: sp._id,});
      console.log("this.state.serviceId",this.state.serviceId);
    const confirmDelete = window.confirm('Are you sure you want to delete the service?');
    if (!confirmDelete) {
      return; // User clicked Cancel, so exit the function
    }
    const url = `http://localhost:5000/services/${this.state.serviceId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
  
      const result = await response.text();
      console.log("result serviceDelete ", result);
      toast.success("service Deleted successfully !");
      // Refresh the list of Services
      this.componentDidMount(); // Assuming fetchServices is a function that fetches the list of Services from the server
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  handleEdit = (index) => {
    console.log('Edit serviceat index:', index);
    const sp=this.state.Services[index];
    this.setState({
      serviceId: sp._id,
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
              <span style={{color: '#4285F4'}}>S</span>
              <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#FBBC05'}}>r</span>
              <span style={{color: '#4285F4'}}>v</span>
              <span style={{color: '#34A853'}}>i</span>
              <span style={{color: '#EA4335'}}>c</span>
              <span style={{color: '#4285F4'}}>e</span>
              <span style={{color: '#FBBC05'}}>s</span>
            </h1>
            <h4>What We Offer</h4>
            </div>
            </div>
        <div className="hash" style={{ padding:"20px",margin:"20px" ,width:"95%"}}>
            
          <h2 style={{ color: "#576389" }}>{isEdit?"Update ":"Add "} service</h2>
          <div className='signup'>
            <Card fluid centered>
              <Card.Content>
                <Form size='large' onSubmit={isEdit? this.sendEditservice:this.sendAddservice} enctype="multipart/form-data">
                  <Form.Field required className='add-departement'>
                    <h4>Service Title</h4>
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Service Title'
                      value={title}
                      autoComplete="title"
                      onChange={(e) => this.handleChange(e, 'title')}
                    />
                  </Form.Field>

                  <Form.Field required className='add-departement'>
                    <h4>Service Description</h4>
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
                    <h4>Service Icon</h4>
                                  <input type="file"
            accept="image/*"  ref={this.servicePic}
        onChange={this.handleFileChange} 
       id="image" name="image" />
                                </Form.Field>
                  <button className="btn" type="submit" style={{left:"80%",position:"relative", backgroundColor:isEdit?"#FBBC05":"#576389" }}>{isEdit?"Update ":"Add "} service</button>
                </Form>
              </Card.Content>
            </Card>
          </div>
        </div>
        {this.props.hideTable ? null : (<main>
            <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
					<div  className="head">
						<h3>Your Services List</h3>
						<i  className='bx bx-add' ></i>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Service Title</th>
                <th>Description</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
            {this.state.Services.map((service, index) => {
    return (
      <tr key={index}>
        <td>
          <img src={`../files/${service.picture}`}></img>
          <p>{service.title}</p>
        </td>
        <td>{service.description}</td>
        <td>
        <span  onClick={() => this.handleEdit(index)}><FaEdit /></span>
        <span  onClick={() => this.handleDeleteservice(index)}><MdDelete /></span>
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

export default Services;
