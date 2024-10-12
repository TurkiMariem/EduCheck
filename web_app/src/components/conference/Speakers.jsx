import React, { Component } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Card, Form } from 'semantic-ui-react';
import Alert from '../alert';

class Speakers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speakers:[],
      name: '',
      email: '',
      bio: '',
      picture: null,
      topic: '',
      contact: '',
      availability: '',
      speakers:[''],
      isEdit:false,
      speakerId:'',
      showAlertApproved:false,
      showAlertRejected:false,
      showAlertDeleted:false,
      showAlertNotDeleted:false,
      showAlertNotUpdated:false,
      showAlertUpdated:false,
    };
    this.SpeakerPic = React.createRef();
  }
  componentDidMount=async()=>{
    try {
      const confEmail = localStorage.getItem('confEmail');
      const response = await fetch(`http://localhost:5000/speakers?confEmail=${confEmail}`,
     { method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
      if (!response.ok) {
        throw new Error('Failed to fetch speakers');
      }
      const data=await response.json();
      console.log("data",data);
      this.setState({speakers : data});
      console.log('Fetched speakers:', this.state.speakers);
      return data;
    } catch (error) {
      console.error('Error fetching speakers:', error);
      return null;
    }
  }
  sendAddSpeaker = async () => {
    const { address, name, email, bio, picture, topic, contact, availability } = this.state;
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
    formData.append("bio", bio);
    formData.append("image", picture);
    formData.append("topic", topic);
    formData.append("contact", contact); // Make sure this matches the field name expected by your server
    formData.append("availability", availability);
    formData.append("confEmail", confEmail);
    console.log('Form submitted with data:', { name, email, bio, picture, topic, contact, availability,confEmail });
  
    const url = 'http://localhost:5000/speakers';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to register speaker');
      }
  
      const result = await response.text();
      console.log("result Speaker Register", result);
      this.setState((prevState) => ({
        speakers: [...prevState.speakers, result],
      }));
      this.setState({ShowAlertApproved:true});
      alert("Speaker added successfully !");
     
      this.setState({
        name: '',
        email: '',
        bio: '',
        picture: null,
        topic: '',
        contact: '',
        availability: ''
      });

      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      this.setState({ShowAlertRejected:true});
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  /////////////////////edit 
  sendEditSpeaker = async () => {
    const { address, name, email, bio, picture, topic, contact, availability,speakerId } = this.state;
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
    formData1.append("bio", bio);
    formData1.append("image", picture);
    formData1.append("topic", topic);
    formData1.append("contact", contact); 
    formData1.append("availability", availability);
    formData1.append("confEmail", confEmail); 
    console.log('Form submitted with data:', { name, email, bio, picture, topic, contact, availability,confEmail });
    const updates = {
      address,
      name,
      email,
      bio,
      picture:picture ? picture.name : '', // Assuming picture is the file object or filename
      topic,
      contact,
      availability,
      confEmail
  };
    const url = `http://localhost:5000/speakers/${speakerId}`;
  
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
        this.setState({ShowAlertNotUpdated:true});
        throw new Error('Failed to update speaker');
      }
  
      const result = await response.text();
      console.log("result Speaker Update ", result);
      alert("Speaker Updated successfully !");
      this.setState({ShowAlertUpdated:true});
      this.setState({
        name: '',
        email: '',
        bio: '',
        picture: null,
        topic: '',
        contact: '',
        availability: '',
        speakerId:''
      }, () => {
        // Refresh the page
        window.location.reload();
      });

      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      console.error('Error:', error);
      this.setState({ShowAlertNotUpdated:true});
      // Handle error (e.g., show error message)
    }
  };
  handleDeleteSpeaker = async (index) => {
    const sp=this.state.speakers[index];
    console.log("sp", sp);
    console.log("sp.name", sp.name);
    this.setState({
      speakerId: sp._id,});
      console.log("this.state.speakerId",this.state.speakerId);
    const confirmDelete = window.confirm('Are you sure you want to delete the speaker?');
    if (!confirmDelete) {
      return; // User clicked Cancel, so exit the function
    }
    const url = `http://localhost:5000/speakers/${this.state.speakerId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete speaker');
        this.setState({ShowAlertNotDeleted:true});
      }
  
      const result = await response.text();
      console.log("result Speaker Delete ", result);
      this.setState({ShowAlertDeleted:true});
      alert("Speaker Deleted successfully !");
      // Refresh the list of speakers
      this.componentDidMount(); // Assuming fetchSpeakers is a function that fetches the list of speakers from the server
    } catch (error) {
      console.error('Error:', error);
      this.setState({ShowAlertNotDeleted:true});
      // Handle error (e.g., show error message)
    }
  };
  handleEdit = (index) => {
    console.log('Edit speaker at index:', index);
    const sp=this.state.speakers[index];
    console.log("sp", sp);
    console.log("sp.name", sp.name);
    this.setState({
      speakerId: sp._id,
      name: sp.name,
      email:sp.email,
      bio: sp.bio,
      picture: sp.picture,
      topic: sp.topic,
      contact: sp.contact,
      availability: sp.availability
    });
this.setState({isEdit:true});
    // Implement your logic to update the state or perform other actions
  };
  
  
  handleSubmit = (event) => {
    event.preventDefault();
    const { name, email, bio, picture, topic, contact, availability } = this.state;
    console.log('Form submitted with data:', { name, email, bio, picture, topic, contact, availability });
  }

  handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    console.log('Selected category:', selectedCategory);
    this.setState({ topic: selectedCategory });
  }

  handleFileChange = (event) => {
    const file = event.target.files[0];
    this.setState({ picture: file },() => {
        console.log("this.state.file", this.state.picture);});
  }

  handleChange = (event, fieldName) => {
    this.setState({ [fieldName]: event.target.value });
  }
  handleCloseAlert = () => {
    this.setState({ShowAlertRejected:false});
    this.setState({ShowAlertApproved:false});
    this.setState({ShowAlertUpdated:false});
    this.setState({ShowAlertNotUpdated:false});
    this.setState({ShowAlertNotDeleted:false});
    this.setState({ShowAlertDeleted:false});
};
  render() {
    const { name, email, bio, topic, contact, availability,isEdit } = this.state;
    return (
      <main>
      <div  className="head-title">
            <div  className="left">
          <h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>S</span>
              <span style={{color: '#EA4335'}}>p</span>
              <span style={{color: '#FBBC05'}}>e</span>
              <span style={{color: '#4285F4'}}>a</span>
              <span style={{color: '#34A853'}}>k</span>
              <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#4285F4'}}>r</span>
              <span style={{color: '#EA4335'}}>s</span>
            </h1>
            </div>
            </div>
        <div className="hash" style={{ padding:"20px",margin:"20px" ,width:"95%"}}>
            
          <h3 style={{ color: "#576389" }}>{isEdit?"Update ":"Add "} Speaker</h3>
          <div className='signup'>
            <Card fluid centered>
              <Card.Content>
                <Form size='large' onSubmit={isEdit? this.sendEditSpeaker :this.sendAddSpeaker} enctype="multipart/form-data">
                  <Form.Field required className='add-departement'>
                    <h4>Speaker Full Name</h4>
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
                    <h4>Speaker Email</h4>
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
                      <h4>Speaker Bio</h4>
                      <input
                        className="form-input1"
                        type='text'
                        placeholder='description'
                        value={bio}
                        autoComplete="bio"
                        onChange={(e) => this.handleChange(e, 'bio')}
                        style={{ height:"80px" }}
                      />
                   
                  </Form.Field>
                    <Form.Field required className='add-departement' style={{ marginBottom:"10px" }}>
                    <h4>Profile Picture</h4>
                                  <input type="file"
            accept="image/*"  ref={this.SpeakerPic}
        onChange={this.handleFileChange} 
       id="image" name="image" />
                                </Form.Field>
                  <Form.Field required className='add-departement' style={{ marginBottom:"10px" }}>
                  <h4>Topic</h4>
                    <select
                      style={{ backgroundColor: "#9CBEC5", color: "#576389", width: "100%", fontSize: "19px", borderRadius: "10%" }}
                      onChange={this.handleCategoryChange}
                      value={topic}
                    >
                      <option value="data_science">Data Science</option>
                      <option value="machine_learning">Machine Learning</option>
                      <option value="artificial_intelligence">Artificial Intelligence</option>
                      <option value="blockchain">Blockchain</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="cloud_computing">Cloud Computing</option>
                      <option value="iot">Internet of Things (IoT)</option>
                      <option value="web_development">Web Development</option>
                      <option value="mobile_development">Mobile Development</option>
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

                  <button className="btn" type="submit" style={{left:"80%",position:"relative", backgroundColor:isEdit?"#FBBC05":"#576389" }}>{isEdit?"Update ":"Add "} Speaker</button>
                </Form>
              </Card.Content>
            </Card>
          </div>
        </div>
        {this.props.hideTable ? null : ( <main>
            <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
					<div  className="head">
						<h3>Your Speakers List</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Speaker Name</th>
                <th>Topic</th>
								<th>email</th>
								<th>Contact</th>
								<th>Availability</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
            {this.state.speakers.map((speaker, index) => {
    return (
      <tr key={index}>
        <td>
          <img src={`../files/${speaker.picture}`}></img>
          <p>{speaker.name}</p>
        </td>
        <td>{speaker.topic}</td>
        <td>{speaker.email}</td>
        <td>{speaker.contact}</td>
        <td>{speaker.availability}</td>
        <td>
        <span  onClick={() => this.handleEdit(index)}><FaEdit /></span>
        <span  onClick={() => this.handleDeleteSpeaker(index)}><MdDelete /></span>
        </td>
      </tr>
    );
  })}
						</tbody>
					</table>
				</div>
				</div>
        <div>
            {this.state.showAlertApproved && (
                <Alert message="Speaker Added successfully !" type="success" onClose={this.handleCloseAlert}/>
            )}
            {this.state.showAlertUpdated && (
                <Alert message="Speaker Updated successfully !" type="success" onClose={this.handleCloseAlert}/>
            )}
            {this.state.showAlertRejected && (
                <Alert message="Event status updated to rejected!" type="error" onClose={this.handleCloseAlert}/>
            )}
            {this.state.showAlertNotUpdated && (
                <Alert message="Error in updating speaker " type="error" onClose={this.handleCloseAlert}/>
            )}
            {this.state.showAlertDeleted && (
                <Alert message="Speaker Deleted successfully !" type="success" onClose={this.handleCloseAlert}/>
            )}
            {this.state.showAlertNotDeleted && (
                <Alert message="Error in Deleting speaker !" type="error" onClose={this.handleCloseAlert}/>
            )}
        </div>  
            </main>)}
           
      </main>
    );
  }
}

export default Speakers;
