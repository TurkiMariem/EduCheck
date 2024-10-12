import axios from 'axios';
import * as emailjs from "emailjs-com";
import React, { Component } from "react";
import ReactMapGL, { Marker } from 'react-map-gl';
import { Button, Card, Form } from 'semantic-ui-react';
import Web3 from "web3";
import { getContractInstanceInst } from '../../contractServices';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
class UpdateConference extends Component{
    constructor(props) {
        super(props);
      this.state={
        confId:props.confId,
        address:'',
        confTitle:'',
        confCategory:'',
        confDescription:'',
        confParticipants:'',
        confAffiche:null,
        location:'',
        datetimes:[''],
        startTime:[''],
        endTime:[''],
        confStatus: false,
        addresses: [],
        idAddress:'',
        loading:true,
        speakers:[],
        organizers:[],
        file:null,
        event:null,
        selectedSpeakers: [],
        selectedOrganizers: [],
        viewport :{
          width: '100%',
          height:"400px",
          latitude:0,
          longitude:0,
          zoom: 1,
          pitch: 0, // Add pitch
          bearing: 0, // Add bearing
        },
        selectedLocation:{latitude: 0,
          longitude: 0,},
      };
      this.fileInputRef = React.createRef();
      this.confAfficheRef = React.createRef();
      
    }
   /* updateConference = async(conferenceId) => {
        try {
          const response = await fetch(`http://localhost:5000/myevents/${conferenceId}`, {
            method: 'PUT', // or 'PATCH' depending on your server's API
            headers: {
              'Content-Type': 'application/json',
            },
            //body: JSON.stringify(updatedData) // send the updated data in the request body
          });
          
          if (!response.ok) {
            throw new Error('Failed to update conference');
          }
          alert('Conference updated successfully');
        } catch (error) {
          console.error('Error updating conference:', error);
          alert('Failed to update conference');
        }
      }  
    */
    handleMapClick = (event) => {
      const { lngLat } = event;
      console.log('Clicked location:', lngLat);
      console.log('Clicked location 0:', lngLat[0]);
      console.log('Clicked location 0:', lngLat[1]);
      this.setState({selectedLocation:{
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      }});
      console.log("selectedLocation",event.selectedLocation);
    };
  

    //cycle de vie d'un composant dans React qui est appelé automatiquement une fois que le composant a été monté
    async componentDidMount() {
      //utiliser get pour recupérer les données de address.json
      try {
        console.log("event.confId",this.state.confId);
        ///fetch event to update 
        try {
          const response = await fetch(`http://localhost:5000/myevents/${this.state.confId}`, {
            method: 'GET',
          });
          if (!response.ok) {
            throw new Error('Failed to get conference');
          }
          const data = await response.json();
          console.log("event to update",data);
          this.setState({event:data});
          console.log("this.state.event.confTitle",this.state.event[0].confTitle);
         
        } catch (error) {
          console.error('Error Updating conference:', error);
          alert('Failed to update conference');
        }
          fetch("https://api.github.com/users")
            .then((res) => res.json())
            .then((data) => {
              const userData = data.map((item) => ({
                label: item.login,
                value: item.id
              }));
              this.setState({speakers:userData});
            });
      
        const response = await axios.get('address.json'); // Replace with the actual path to your JSON file
        console.log('Fetched JSON data:', response.data);
        this.setState({
          addresses: response.data.addresses,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }       
    }
   /* componentDidUpdate() {
      const { addresses, loading, address } = this.state;
      const unusedAddress = addresses.find(address => !address.used);
      const isAddressChanged = address.toLowerCase() !== unusedAddress.address.toLowerCase();
      console.log("etat est",address, unusedAddress.address, this.state.address );
      if (!loading && unusedAddress && isAddressChanged) {
        this.setState({
          address: unusedAddress.address,
          idAddress: unusedAddress.id,
        });
    
        console.log('Selected address is', this.state.address);
        console.log('Address and id:', unusedAddress.address, unusedAddress.id);
      }
    } */
    //// speaker select
    handleSpeakerChange = (event) => {
      const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
      const selectedSpeaker=this.state.selectedSpeakers;
      selectedSpeaker.push(this.state.event[0].selectedSpeakers)
      selectedSpeaker.push(selectedOptions);
      this.setState({ selectedSpeakers: selectedSpeaker });
    };
    /// speaker remove
    removeSpeaker = (speakerToRemove) => {
      const updatedSelectedSpeakers = this.state.selectedSpeakers.filter((speaker) => speaker !== speakerToRemove);
      this.setState({ selectedSpeakers: updatedSelectedSpeakers });
    };
  
    handleOrganizerChange = (event) => {
      const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
      const selectedSpeaker=this.state.selectedOrganizers;
      selectedSpeaker.push(selectedOptions);
      this.setState({ selectedOrganizers: selectedSpeaker });
    };
    /// speaker remove
    removeSpeaker = (speakerToRemove) => {
      const updatedSelectedOrganizers = this.state.selectedOrganizers.filter((speaker) => speaker !== speakerToRemove);
      this.setState({ selectedOrganizers: updatedSelectedOrganizers });
    };
  
    //peut changer l'adresse
    handleChange(event) {
      this.setState({ address: event.target.value });
    }
    handleFileParticipantsChange = (event) => {
      this.setState({ confParticipants: event.target.files[0]},() => {
        console.log("this.state.file", this.state.file)
    });
  };

  handleFileChange =(event)=> {
    this.setState({ confAffiche: event.target.files[0] }, () => {
      console.log("this.state.file", this.state.file);
    });
  };

// connect wallet function 
 async connectWallet() {
  if (window.ethereum) {
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Get the user's address
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      this.setState({ address: accounts[0 ] });
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error('Web3 provider not detected. Please install Metamask.');
    alert('Web3 provider not detected. Please install Metamask.');
  }
};
    //fonction asyncrone  peut contenir des opérations asynchrones telles que des appels à des API externes ou des fonctions qui retournent des promesses.(await,catch, then..)
    handleSubmit = async(e) => {
        e.preventDefault();
        //l'automatisation de l'adresse ethereum 
        const storageContract= await getContractInstanceInst();   
        console.log("instance chargée");
        if (!storageContract || !storageContract.instance) {
        console.error("Erreur lors de la récupération de l'instance du contrat");
        return;
        } 

        // Vérifiez que les champs obligatoires sont remplis
        if (!this.state.confCategory || !this.state.confTitle || !this.state.confDescription || !this.state.selectedSpeakers ||!this.state.selectedOrganizers || !this.state.confParticipants || !this.state.datetimes || !this.state.startTime || !this.state.endTime || !this.state.location) {
        console.error("Tous les champs doivent être remplis");
        return;
     }
        //const address = this.props.usedAddress.adresse;
        const {address, confTitle,confAffiche, confCategory,confDescription,selectedSpeakers,selectedOrganizers,location,datetimes,startTime,endTime,idAddress}=this.state;
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const accountAddress = accounts[0];
        if(accountAddress==null){
          alert("You should connect to your blockchaine wallet to create a conference !")
        }
        console.log("l adresse de transaction est ",accountAddress);
        console.log('transaction effectuée avec les params ',address,confAffiche, confTitle, confCategory,confDescription,selectedSpeakers,selectedOrganizers,location,datetimes,startTime,endTime);
        console.log('les diplomas name and ref : ',datetimes);
    }
    sendEmail = async () => {
    const {emailOfficer}=this.state
    console.log('l email de send is', emailOfficer);
    // Ajouter le code pour envoyer les données du formulaire à la base de données ici
    const templateParams = {
    address: this.state.address,
    confTitle:this.state.confTitle,
    startTime: this.state.startTime.join(", "),
    endTime: this.state.endTime.join(", "),
    to_email: this.state.emailOfficer ,// Utilisez l'adresse de destination récupérée à partir du champ "email" du formulaire
    message: `Here are your login details for your account:\nBlockchain Address: ${this.state.address}\nBefore you log in to your account, please change your password and select the *forget password* button.`
  };
  //console.log('les parametres email sont:',this.state.address);
  //parametres de api emailjs
  emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams, 'UBJPOXynwuM1qwZMP')
  .then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
    
    
  }; 
  //envoyer un email d'information
  sendNotification= async () => {
    const templateParams1 = {
      to_email: 'dorrachakroun13@gmail.com',
      subject: 'Notification : Nouvelle institut ajouté',
      message:'A new institute has been successfully added.'
    };
    emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams1, 'UBJPOXynwuM1qwZMP')
    .then((result) =>{
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
  }; 
   handleCategoryChange=(event) =>{
    const selectedCategory = event.target.value;
    console.log('Selected category:', selectedCategory);
    this.setState({confCategory:selectedCategory})
    // You can now use the selectedCategory value in your application
  }
  handleChangeDatetimes = (index, field, value) => {
    const { datetimes, startTime, endTime } = this.state;
    if (field === 'date') {
      datetimes[index] = value;
      this.setState({ datetimes });
    } else if (field === 'start') {
      startTime[index] = value;
      this.setState({ startTime });
    } else if (field === 'end') {
      endTime[index] = value;
      this.setState({ endTime });
    }
  };
  
  handleAddDatetime = () => {
    const { datetimes, startTime, endTime } = this.state;
    this.setState({
      datetimes: [...datetimes, ''],
      startTime: [...startTime, ''],
      endTime: [...endTime, '']
    });
  };
  
  // Function to update a specific item's property
  updateAccountProperty = async (itemId,affected) => {
    // Find the item to update
    const updatedItems = this.state.addresses.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          ['affectedTo']:affected,
          ['used']: true,
        };
      }
      return item;
    });

    // Send the updated data to the backend
    try {
      await axios.put('http://localhost:5000/writeAPI', { addresses: updatedItems });
      this.setState({ addresses: updatedItems }); // Update the state
      console.log('les nouvelles addresses', this.state.addresses);
    } catch (error) {
      console.error(error);
    }
  };
    render(){
      
        const {address, loading,event} =this.state;
        if (loading) {
          return <div>Loading...</div>;
        }
        
    
        return(
         <div style={{  display:"flex",flexDirection:'column',width:"100%",boxShadow:"6px 8px 18px rgba(0, 0, 0, 0.25)"}}>
            <div className="top-container" >
      <div>
       
        <h1>Update Your Conference</h1>
        </div>
        </div>
        <div  style={{display:'flex', justifyContent: 'center' ,alignItems: 'center'}} >
               
                    <div  className='signup'  style={{padding:"30px",borderRadius:"10%",boxShadow:"6px 8px 18px rgba(0, 0, 0, 0.25)",position:'relative',top:"-100px", backgroundImage:"linear-gradient(#758EBC,#9CBEC5)",display: 'flex', justifyContent: 'center' ,alignItems: 'center'}}>
                    <Card fluid style={{ display: 'flex', justifyContent: 'center' ,alignItems: 'center'}}>
                        <Card.Content>
                            <Form size='large' /*onSubmit={this.updateConference(this.state.confId)}*/ enctype="multipart/form-data">
                                <div className='add-departement'>
                                  <h4>Account Address</h4>
                                  <input className="form-input1" style={{backgroundColor:"#576389",color:"#fff"}} value={event[0].address} readOnly/>
                                  <button onClick={this.connectWallet} className='btn'>Connect wallet</button>
                                </div>
                                  <h4>Conference Title</h4>
                                <Form.Field required className='add-departement'>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='Conference name'
                                        value={event[0].confTitle}
                                        autoComplete="confTitle"
                                        onChange={e => this.setState({ confTitle: e.target.value })}
                                    />
                                </Form.Field>
                                  <h4>Conference Category</h4>
                                <Form.Field required className='add-departement'>
                                <select style={{backgroundColor:"#9CBEC5",color:"#576389",width:"100%", fontSize:"19px",borderRadius:"10%"}} onChange={this.handleCategoryChange}>
  <option value="data_science">{event[0].confCategory}</option>
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
                                <h4>Description</h4>
                                <Form.Field required className='add-departement'>
                                  <textarea name="" id=""  value={event[0].confDescription} onChange={e => this.setState({ confDescription: e.target.value })} cols="30" rows="10" style={{height:"50%",color:"#fff" ,padding:"10px",fontSize:"20px",borderRadius:"10%",backgroundColor:"#576389",width:"100%" }}></textarea>
                                </Form.Field>
                              
                                <Form.Field required className='add-departement'>
                                <h4>
        choice all the speakers will be in this conference :
        <select mode="multiple" style={{marginTop:"15px",backgroundColor:"#9CBEC5",color:"#576389",width:"100%", fontSize:"19px",borderRadius:"10%"}}  value={event[0].selectedSpeakers}
          onChange={this.handleSpeakerChange}>
        {this.state.speakers.map(({ label, value, text }) => (
          <option value={label} key={value}>
            {label}
          </option>
        ))}
        </select>
     <ul style={{ backgroundColor:"#576389" ,display:"flex",flexDirection:"row",padding:"10px",borderRadius:"10%"}}>
            {event[0].selectedSpeakers.map((speaker) => (
              <li style={{ backgroundColor:"#9CBEC5" ,borderRadius:"10%",marginRight:"5px"}} key={speaker}>{speaker}<span onClick={() => this.removeSpeaker(speaker)}> x </span></li>
            ))}
            </ul>
      </h4>
                                </Form.Field>
                                <Form.Field required className='add-departement'>
                                <h4>
        choice all the organizers for this conference :
        <select mode="multiple" style={{marginTop:"15px",backgroundColor:"#9CBEC5",color:"#576389",width:"100%", fontSize:"19px",borderRadius:"10%"}}  value={event[0].selectedSpeakers}
          onChange={this.handleOrganizerChange}>
        {event[0].selectedSpeakers.map(({ label, value, text }) => (
          <option value={label} key={value}>
            {label}
          </option>
        ))}
        </select>
     {event[0].selectedOrganizers && <ul style={{ backgroundColor:"#576389" ,display:"flex",flexDirection:"row",padding:"10px",borderRadius:"10%"}}>
            {event[0].selectedOrganizers.map((organizer) => (
              <li style={{ backgroundColor:"#9CBEC5" ,borderRadius:"10%",marginRight:"5px"}} key={organizer}>{organizer}<span onClick={() => this.removeOrganizer(organizer)}> x </span></li>
            ))}
            </ul>}
      </h4>
                                </Form.Field>
                                <h4>Conference Affiche</h4>
                                <Form.Field required className='add-departement'>
                                  <input type="file"
            accept="image/*"  ref={this.confAfficheRef}
        onChange={this.handleFileChange} 
       id="image" name="image" />
      
                                </Form.Field>
                                {event[0].confAffiche && (<div style={{ color:"#576389" }}>Selected File: {event[0].confAffiche}</div>)}
                                <h4>Participants List</h4>
                                <Form.Field required className='add-departement'>
                                  <input type="file" name="confParticipantsFile" id="confParticipantsFile"  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" ref={this.fileInputRef}
        onChange={this.handleFileParticipantsChange}/>
                                </Form.Field>
                                {event[0].confParticipants && (<div style={{ color:"#576389" }}>Selected File: {event[0].confParticipants}</div>)}
                                <h4>Location</h4>
                                <input
  type="text"
  name="location"
  id=""
  value={event[0].location}
  onChange={(e) => {
    this.setState({ location: e.target.value });
  }}
/>

<div>
  <ReactMapGL
    width="100%"
    height="400px"
    {...event[0].viewport}
    mapboxApiAccessToken="pk.eyJ1IjoiZG9ycmFjaGFrcm91bjEzIiwiYSI6ImNsdWQ1ZGh1azE3ZngybHFuaXQ5cTkwcWQifQ.nK3_hp0HH6iP_Ot7X0qdQQ"
    onViewportChange={(newViewport) => this.setState({ viewport: newViewport })}
    onClick={this.handleMapClick}
  >
    {event[0].selectedLocation && (
      <Marker
        latitude={event[0].selectedLocation.latitude}
        longitude={event[0].selectedLocation.longitude}
      >
        <div>Selected Location</div>
      </Marker>
    )}
  </ReactMapGL>
</div>

                                <h4>Datetime</h4>
                                <Form.Field className='add-departement' required style={{ display:"flex",flexDirection: "row" }}>
                  <div style={{ display:"flex",flexDirection:"column",justifyContent:"space-between", }}>
                  <h5>date</h5>
                 <br /><br />
                  <h5>start</h5>
                  <br /><br />
                  <h5>End</h5>
                  </div>
  {event[0].datetimes.map((diploma, index) => (
    <div key={index}>
      <input
        type="date"
        name="date"
        id=""
        value={diploma}
        onChange={(e) => this.handleChangeDatetimes(index, 'date', e.target.value)}
      />
      <input
        className="form-input1"
        type='time'
        value={event[0].startTime[index]}
        onChange={(e) => this.handleChangeDatetimes(index, 'start', e.target.value)}
      />
      <input
        className="form-input1"
        type='time'
        value={event[0].endTime[index]}
        onChange={(e) => this.handleChangeDatetimes(index, 'end', e.target.value)}
      />
    </div>
  ))}
  <button type="button" className='btn' onClick={this.handleAddDatetime}>
    +
  </button>
</Form.Field>

                                <Form.Field>
                                    <Button type='submit' class="btn"  primary fluid size='large' >
                                    Update
                                    </Button>
                                </Form.Field>

                            </Form>
                        </Card.Content>
                      </Card>
                      </div>
      </div>
   </div>
    );
}
}
export default UpdateConference;