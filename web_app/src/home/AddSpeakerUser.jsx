import React, { Component } from 'react';
import { Card, Form } from 'semantic-ui-react';

class AddSpeakerUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speakers:[],
      name: '',
      email: '',
      bio: '',
      picture: null,
      cv: null,
      topic: '',
      contact: '',
      availability: '',
      speakers:[''],
      isEdit:false,
      speakerId:''
    };
    this.SpeakerPic = React.createRef();
    this.SpeakerCV = React.createRef();
  }
  componentDidMount=async()=>{
   console.log(this.props.eventClicked._id);
  }
  sendAddSpeaker = async () => {
  
    const url = 'http://localhost:5000/newSpeakers';
    const formData = new FormData();
    formData.append("name", this.state.name);
    formData.append("email", this.state.email);
    formData.append("bio", this.state.bio);
    formData.append("image", this.state.picture);
    formData.append("cv", this.state.cv);
    formData.append("topic", this.state.topic);
    formData.append("contact", this.state.contact); // Make sure this matches the field name expected by your server
    formData.append("availability", this.state.availability);
    formData.append("status", 'joined');
    formData.append("conferenceId", this.props.eventClicked._id);
  
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
      alert("Speaker added successfully !");
     
      this.setState({
        name: '',
        email: '',
        bio: '',
        picture: null,
        cv: null,
        topic: '',
        contact: '',
        availability: ''
      });

      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      console.error('Error:', error);
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

  handlePicChange = (event) => {
    const file = event.target.files[0];
    this.setState({ picture: file },() => {
        console.log("this.state.file", this.state.picture);});
  }
  handleCVChange = (event) => {
    const file = event.target.files[0];
    this.setState({ cv: file },() => {
        console.log("this.state.file", this.state.cv);});
  }

  handleChange = (event, fieldName) => {
    this.setState({ [fieldName]: event.target.value });
  }
  render() {
    const { name, email, bio, topic, contact, availability,isEdit } = this.state;
    return (
      <>
        <div className="hash center" style={{position:"relative",top:"100%",left:"50%",transform:"translate(-50%, 0%)",padding:"20px",margin:"20px" ,width:"65%", backgroundImage: "linear-gradient(#758EBC,#9CBEC5)"}}>
            
          <h2 style={{ color: "#576389" }}>Join this conference as Speaker</h2>
          <div className='signup'>
            <Card fluid centered>
              <Card.Content>
                <Form size='large' onSubmit={this.sendAddSpeaker} enctype="multipart/form-data">
               <div style={{ display:"flex",flexDirection:"row"}}>
 <div style={{ display:"flex", flexDirection:"column", width: "70%" }}>
                <h4>Speaker Full Name</h4>
                  <Form.Field required className='add-departement'>
                  
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Full Name'
                      value={name}
                      autoComplete="name"
                      onChange={(e) => this.handleChange(e, 'name')}
                    />
                  </Form.Field>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", width: "100%" }}>
                  <h4>Speaker Email</h4>
                  <Form.Field required className='add-departement'>
                   
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='email'
                      value={email}
                      autoComplete="email"
                      onChange={(e) => this.handleChange(e, 'email')}
                    />
                     </Form.Field>
                     </div>
                     </div>
                     <h4>Speaker Bio</h4>
                    <Form.Field required className='add-departement'>
                      
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
                  <div style={{ display:"flex",flexDirection:"row"}}>
 <div style={{ display:"flex", flexDirection:"column",width:"100%" }}>
                  <h4>Profile Picture :</h4>
                    <Form.Field required className='add-departement' style={{ marginBottom:"10px" }}>
                    
                                  <input type="file"
            accept="image/*"  ref={this.SpeakerPic}
        onChange={this.handlePicChange} 
       id="image" name="image" />
                                </Form.Field>
                                </div>
                                <div style={{ display:"flex", flexDirection:"column",width:"100%" }}>
                  <h4>Curriculum Vitae (CV):</h4>
                    <Form.Field required className='add-departement' style={{ marginBottom:"10px" }}>
                    
                                  <input type="file"
            accept="/*"  ref={this.SpeakerCV}
        onChange={this.handleCVChange} 
       id="cv" name="cv" />
                                </Form.Field>
                                </div>
                                <div style={{ display:"flex", flexDirection:"column",width:"100%" }}>
                                <h4>Topic :</h4>
                  <Form.Field required className='add-departement' style={{ marginBottom:"10px" }}>
                  
                    <select
                      style={{ backgroundColor: "#9CBEC5", color: "#576389", width: "90%", fontSize: "19px", borderRadius: "10%" }}
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
                  </div>
                                </div>
                                
                                <div style={{ display:"flex",flexDirection:"row"}}>
 <div style={{ display:"flex", flexDirection:"column", width: "100%" }}>
 <h4>Contact : </h4>
                  <Form.Field required className='add-departement'>
                    
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Contact Phone'
                      value={contact}
                      autoComplete="Contact"
                      onChange={(e) => this.handleChange(e, 'contact')}
                    />
                  </Form.Field>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column" , width: "100%"}}>
                  <h4>Availability :</h4>
                  <Form.Field required className='add-departement'>
                    
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Availability'
                      value={availability}
                      autoComplete="Availability"
                      onChange={(e) => this.handleChange(e, 'availability')}
                    />
                  </Form.Field>
                  </div>
                  </div>

                  <button className="btn" type="submit" style={{left:"80%",position:"relative", backgroundColor:isEdit?"#FBBC05":"#576389" }}>Join Conference</button>
                </Form>
              </Card.Content>
            </Card>
          </div>
        </div>
       
      </>
    );
  }
}

export default AddSpeakerUser;
