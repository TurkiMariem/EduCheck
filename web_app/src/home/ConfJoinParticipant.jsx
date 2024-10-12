import React, { Component } from 'react';
import { Card, Form } from 'semantic-ui-react';

class ConfJoinParticipant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      affiliation:'',
      interest: '',
      topic: '',
      contact: '',
    };
  }
  componentDidMount=async()=>{
   console.log(this.props.eventClicked._id);
  }
  sendNotification = async (content, from, to,type) => {
    try {
      const response = await fetch('http://localhost:5000/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, from, to ,type}),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
  
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  sendAddParticipant = async () => {
    const { name, email, interest, topic, contact,affiliation } = this.state;
    const conferenceId = this.props.eventClicked._id;
    const confEmail = this.props.eventClicked.userEmail;
    const url = 'http://localhost:5000/participants';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          affiliation,
          interest,
          topic,
          contact,
          status: 'joined',
          conferenceId,
          confEmail,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to register participant');
      }
  
      const result = await response.text();
      console.log("result Speaker participant", result);
  
      alert("participant added successfully !");
      await this.sendNotification(`A new participant has joined your conference Id ${this.props.eventClicked._id}`, this.state.email, this.props.eventClicked.userEmail, "creation");
  
      this.setState({
        name: '',
        email: '',
        affiliation:'',
        interest: '',
        topic: '',
        contact: '',
      });
  
      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  
  
  handleSubmit = (event) => {
    event.preventDefault();
    const { name, email,affiliation, interest, topic, contact } = this.state;
    console.log('Form submitted with data:', { name, email,affiliation, interest, topic, contact });
  }

  handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    console.log('Selected category:', selectedCategory);
    this.setState({ topic: selectedCategory });
  }

   handleChange = (event, fieldName) => {
    this.setState({ [fieldName]: event.target.value });
    console.log(fieldName,event.target.value);
  }
  render() {
    const { name, email, affiliation, bio, topic, contact,isEdit } = this.state;
    return (
      <div>
        <div className="hash center" style={{position:"relative",top:"100%",left:"50%",transform:"translate(-50%, 0%)",padding:"20px",margin:"20px" ,width:"70%", backgroundImage: "linear-gradient(#758EBC,#9CBEC5)"}}>
            
          <h2 style={{ color: "#576389" }}>Join this conference as Participant</h2>
          <div className='signup'>
            <Card fluid centered>
              <Card.Content>
                <Form size='large' enctype="multipart/form-data">
               <div style={{ display:"flex",flexDirection:"row"}}>
 <div style={{ display:"flex", flexDirection:"column", width: "70%" }}>
                <h4>Full Name</h4>
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
                  <h4>Email Address</h4>
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
                     <h4>Conference Interest :</h4>
                    <Form.Field required className='add-departement'>
                      
                      <input
                        className="form-input1"
                        type='text'
                        placeholder='description'
                        value={bio}
                        autoComplete="bio"
                        onChange={(e) => this.handleChange(e, 'interest')}
                        style={{ height:"80px" }}
                      />
                   
                  </Form.Field>  
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
 <div style={{ display:"flex", flexDirection:"column", width: "100%" }}>
 <h4>Affiliation : </h4>
                  <Form.Field required className='add-departement'>
                    
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Affiliation'
                      value={affiliation}
                      autoComplete="Affiliation"
                      onChange={(e) => this.handleChange(e, 'affiliation')}
                    />
                  </Form.Field>
                  </div>
                 {/* <div style={{ display:"flex", flexDirection:"column",width:"100%" }}>
                                <h4>Interested Topic :</h4>
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
    </div> */}
                  </div>

                  <button className="btn" type="button" onClick={this.sendAddParticipant} style={{left:"80%",position:"relative", backgroundColor:"#576389" }} >Join Conference</button>
                </Form>
              </Card.Content>
            </Card>
          </div>
        </div>
       
      </div>
    );
  }
}

export default ConfJoinParticipant;
