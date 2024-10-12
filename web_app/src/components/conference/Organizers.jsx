import React, { Component } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Card, Form } from 'semantic-ui-react';
import './organizer.css';
class Organizers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      responsabilities: '',
      picture: null,
      role: '',
      contact: '',
      availability: '',
      organizers:[''],
      isEdit:false,
      organizerId:''
    };
    this.organizerPic = React.createRef();
  }
  componentDidMount=async()=>{
    try {
      const confEmail = localStorage.getItem('confEmail');
      const response = await fetch(`http://localhost:5000/organizers?confEmail=${confEmail}`,
     { method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
      if (!response.ok) {
        throw new Error('Failed to fetch organizers');
      }
      const data=await response.json();
      console.log("data",data);
      this.setState({organizers : data});
      console.log('Fetched organizers:', this.state.organizers);
      return data;
    } catch (error) {
      console.error('Error fetching organizers:', error);
      return null;
    }
  }
  sendAddorganizer = async () => {
    const { address, name, email, responsabilities, picture, role, contact, availability } = this.state;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      // Handle this case (e.g., redirect to login page)
      return;
    }
    
    console.log("token found", token);
    const confEmail=localStorage.getItem('confEmail');
    console.log("confEmail",confEmail);
    const formData = new FormData();
    formData.append("address", address);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("responsabilities", responsabilities);
    formData.append("image", picture);
    formData.append("role", role);
    formData.append("contact", contact); // Make sure this matches the field name expected by your server
    formData.append("availability", availability);
    formData.append("confEmail", confEmail);
    console.log('Form submitted with data:', { name, email, responsabilities, picture, role, contact, availability,confEmail });
  
    const url = 'http://localhost:5000/organizers';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to register organizer');
      }
  
      const result = await response.text();
      console.log("result organizer Register", result);
      alert("organizer added successfully !");
      this.setState({
        name: '',
        email: '',
        responsabilities: '',
        picture: null,
        role: '',
        contact: '',
        availability: ''
      });
      this.componentDidMount();
      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  /////////////////////edit 
  sendEditorganizer = async () => {
    const { address, name, email, responsabilities, picture, role, contact, availability,organizerId } = this.state;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      // Handle this case (e.g., redirect to login page)
      return;
    }
    console.log("token found", token);
    const confEmail=localStorage.getItem('confEmail');
    console.log("confEmail",confEmail);
    const formData1 = new FormData();
    formData1.append("address", address);
    formData1.append("name", name);
    formData1.append("email", email);
    formData1.append("responsabilities", responsabilities);
    formData1.append("image", picture);
    formData1.append("role", role);
    formData1.append("contact", contact); 
    formData1.append("availability", availability);
    formData1.append("confEmail", confEmail); 
    console.log('Form submitted with data:', { name, email, responsabilities, picture, role, contact, availability,confEmail });
    const updates = {
      address,
      name,
      email,
      responsabilities,
      picture:picture ? picture.name : '', // Assuming picture is the file object or filename
      role,
      contact,
      availability,
      confEmail
  };
    const url = `http://localhost:5000/organizers/${organizerId}`;
  
    try {
      console.log("formData1",JSON.stringify(formData1));
      const response = await fetch(url, {
        method : 'PUT',
        headers: {
          'Content-Type': 'application/json', // Include the token in the headers
      },
      body: JSON.stringify(updates)
        /// ask racem
      });
  
      if (!response.ok) {
        throw new Error('Failed to update organizer');
      }
  
      const result = await response.text();
      console.log("result organizer Update ", result);
      alert("organizer Updated successfully !");
      this.setState({
        name: '',
        email: '',
        responsabities: '',
        picture: null,
        role: '',
        contact: '',
        availability: '',
        organizerId:''
      }, () => {
        // Refresh the page
        window.location.reload();
      });

      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  handleDeleteorganizer = async (index) => {
    const sp=this.state.organizers[index];
    console.log("sp", sp);
    console.log("sp.name", sp.name);
    this.setState({
      organizerId: sp._id,});
      console.log("this.state.organizerId",this.state.organizerId);
    const confirmDelete = window.confirm('Are you sure you want to delete the organizer?');
    if (!confirmDelete) {
      return; // User clicked Cancel, so exit the function
    }
    const url = `http://localhost:5000/organizers/${this.state.organizerId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete organizer');
      }
  
      const result = await response.text();
      console.log("result organizer Delete ", result);
      alert("organizer Deleted successfully !");
      // Refresh the list of organizers
      this.componentDidMount(); // Assuming fetchorganizers is a function that fetches the list of organizers from the server
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  handleEdit = (index) => {
    console.log('Edit organizer at index:', index);
    const sp=this.state.organizers[index];
    console.log("sp", sp);
    console.log("sp.name", sp.name);
    this.setState({
      organizerId: sp._id,
      name: sp.name,
      email:sp.email,
      responsabilities: sp.responsabilities,
      picture: sp.picture,
      role: sp.role,
      contact: sp.contact,
      availability: sp.availability
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
    const { name, email, responsabilities, role, contact, availability,isEdit } = this.state;
    return (
      <main>
      <div  className="head-title">
            <div  className="left">
          <h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>O</span>
              <span style={{color: '#EA4335'}}>r</span>
              <span style={{color: '#FBBC05'}}>g</span>
              <span style={{color: '#4285F4'}}>a</span>
              <span style={{color: '#34A853'}}>n</span>
              <span style={{color: '#EA4335'}}>i</span>
              <span style={{color: '#4285F4'}}>z</span>
              <span style={{color: '#FBBC05'}}>e</span>
              <span style={{color: '#EA4335'}}>r</span>
              <span style={{color: '#34A853'}}>s</span>
            </h1>
            </div>
            </div>
        <div className="hash" style={{ padding:"20px",margin:"20px" ,width:"95%"}}>
            
          <h3 style={{ color: "#576389" }}>{isEdit?"Update ":"Add "} organizer</h3>
          <div className='signup'>
            <Card fluid centered>
              <Card.Content>
                <Form size='large' onSubmit={isEdit? this.sendEditorganizer :this.sendAddorganizer} enctype="multipart/form-data">
                  <Form.Field required className='add-departement'>
                    <h4>organizer Full Name</h4>
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Full Name'
                      value={name}
                      autoComplete="name"
                      onChange={(e) => this.handleChange(e, 'name')}
                    />
                  </Form.Field>

                  <Form.Field required className='add-departement'>
                    <h4>organizer Email</h4>
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='email'
                      value={email}
                      autoComplete="email"
                      onChange={(e) => this.handleChange(e, 'email')}
                    />
                     </Form.Field>
                    <Form.Field required className='add-departement'>
                      <h4>organizer responsabilities</h4>
                      <input
                        className="form-input1"
                        type='text'
                        placeholder='description'
                        value={responsabilities}
                        autoComplete="responsabilities"
                        onChange={(e) => this.handleChange(e, 'responsabilities')}
                        style={{ height:"80px" }}
                      />
                   
                  </Form.Field>
                    <Form.Field required className='add-departement' style={{ marginBottom:"10px" }}>
                    <h4>Profile Picture</h4>
                                  <input type="file"
            accept="image/*"  ref={this.organizerPic}
        onChange={this.handleFileChange} 
       id="image" name="image" />
                                </Form.Field>
                  <Form.Field required className='add-departement' style={{ marginBottom:"10px" }}>
                  <h4>role</h4>
                  <select
  style={{ backgroundColor: "#9CBEC5", color: "#576389", width: "100%", fontSize: "19px", borderRadius: "10%" }}
  onChange={this.handleRoleChange}
  value={role}
>
  <option value="event_manager">Event Manager</option>
  <option value="logistics_coordinator">Logistics Coordinator</option>
  <option value="sponsorship_manager">Sponsorship Manager</option>
  <option value="marketing_coordinator">Marketing Coordinator</option>
  <option value="volunteer_coordinator">Volunteer Coordinator</option>
  <option value="technical_manager">Technical Manager</option>
  <option value="speaker_coordinator">Speaker Coordinator</option>
  <option value="finance_manager">Finance Manager</option>
</select>

                  </Form.Field>

                  <Form.Field required className='add-departement'>
                    <h4>Contact</h4>
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Contact Phone'
                      value={contact}
                      autoComplete="Contact"
                      onChange={(e) => this.handleChange(e, 'contact')}
                    />
                  </Form.Field>

                  <Form.Field required className='add-departement'>
                    <h4>Availability</h4>
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Availability'
                      value={availability}
                      autoComplete="Availability"
                      onChange={(e) => this.handleChange(e, 'availability')}
                    />
                  </Form.Field>

                  <button className="btn" type="submit" style={{left:"80%",position:"relative", backgroundColor:isEdit?"#FBBC05":"#576389" }}>{isEdit?"Update ":"Add "} organizer</button>
                </Form>
              </Card.Content>
            </Card>
          </div>
        </div>
        {this.props.hideTable ? null : (<main>
            <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
					<div  className="head">
						<h3>Your organizers List</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>organizer Name</th>
                <th>role</th>
								<th>email</th>
								<th>Contact</th>
								<th>Availability</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
            {this.state.organizers.map((organizer, index) => {
    return (
      <tr key={index}>
        <td>
          <img src={`../files/${organizer.picture}`}></img>
          <p>{organizer.name}</p>
        </td>
        <td>{organizer.role}</td>
        <td>{organizer.email}</td>
        <td>{organizer.contact}</td>
        <td>{organizer.availability}</td>
        <td>
        <span  onClick={() => this.handleEdit(index)}><FaEdit /></span>
        <span  onClick={() => this.handleDeleteorganizer(index)}><MdDelete /></span>
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

export default Organizers;
