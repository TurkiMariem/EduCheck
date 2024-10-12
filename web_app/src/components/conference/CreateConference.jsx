import axios from 'axios';
import * as emailjs from "emailjs-com";
import React, { Component, useState } from "react";
import ReactDOM from 'react-dom';
import { Button, Card, Form } from 'semantic-ui-react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from "web3";
//var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
import GoogleMapReact from 'google-map-react';
import { Marker } from 'react-map-gl';
import { getContractInstanceConf } from "../../contractServices";
import Organizers from './Organizers';
import Speakers from './Speakers';
const { v4: uuidv4 } = require('uuid');
const GoogleMap = ({ apiKey,updateLocation }) => {
  const defaultCenter = { lat: 33.8869, lng: 9.5375};
  const defaultZoom = 13;
  const [markerPosition, setMarkerPosition] = useState('');
  const [routeAddress, setRouteAddress] = useState('');
  const [ShowMap, setShowMap] = useState(false);
  const getRouteAddress = async (lat, lng, apiKey) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = response.data;
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };
  const handleClick = async (event) => {
    const clickedLat = event.lat;
    const clickedLng = event.lng;
    setMarkerPosition({ lat: clickedLat, lng: clickedLng });
    console.log({ lat: clickedLat, lng: clickedLng });
    const address = await getRouteAddress(clickedLat, clickedLng, apiKey);
  setRouteAddress(address);
  console.log("routeAddress",routeAddress);
  updateLocation(address);
  };

  return (
    <>
    
    <h4>Location :</h4>
    <div style={{ display:"flex",gap:"10px",marginBottom:"50px" }}>
    <button style={{ backgroundColor:"#D4DDEE",color:"#809BCE" }} onClick={()=>{setShowMap(true)}}>Map</button>
    <button style={{ backgroundColor:"#FFF2C6",color:"#FFCE26" }}onClick={()=>{setShowMap(false);setRouteAddress("Online")}}>Online</button>
    <button style={{ backgroundColor:"#FFE0D3" ,color:"#FD7238"}}onClick={()=>{setShowMap(false);setRouteAddress("To be announced")}}>To be announced</button>
    </div>
    {ShowMap&&(
      <div>
    <input type="text"
      name="location"
      id=""
      value={routeAddress}
      onChange={(e) => {
        setRouteAddress(e.target.value);
      }}
    />
    <div style={{ height: '400px', width: '100%',marginBottom:"30px" }}>
       
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        onClick={handleClick}
      >
        {markerPosition && (
          <Marker
            lat={markerPosition.lat}
            lng={markerPosition.lng}
            text="Marker"
            color="red"
          />
        )}
      </GoogleMapReact>
    </div>
    </div>
    )}
    </>
  );
};
class CreateConference extends Component{
    constructor(props) {
        super(props);
      this.state={
        confId:props.confId,
        conferenceId:uuidv4(),
        isEditing: props.isEditing,
        clickedPosition: null,
        center: { lat: 37.7749, lng: -122.4194 },
        added:false,
        address:'',
        confEmail:'',
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
        speakers:['',''],
        organizers:['',''],
        file:null,
        selectedSpeakers: [],
        selectedOrganizers: [],
      markers:[],
      ExcelParticipants:[],
      selectedItem:'createConference',
      };
      this.fileInputRef = React.createRef();
      this.confAfficheRef = React.createRef();
      this.mapRef = React.createRef();
      
    }
  
   renderContent = () => {
      switch (this.state.selectedItem) {
        case 'createConference':
          return <CreateConference/>;
        case 'Speakers':
          return <Speakers/>;
        case 'Organizers':
          return <Organizers/>;
        default:
          return  <CreateConference/>;
      }
    };

  updateLocation = (newLocation) => {
    this.setState({ location: newLocation });
  };
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
  AddEventInMongoDb = async () => {
    const {
        address,
        conferenceId,
        confTitle,
        confCategory,
        confDescription,
        selectedSpeakers,
        selectedOrganizers,
        location,
        datetimes,
        startTime,
        endTime,
        confAffiche,
        confParticipants
    } = this.state;

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token not found');
        return;
    }

      console.log("token found", token);
    console.log("confParticipants", confParticipants);
    const confEmail = localStorage.getItem('confEmail');
    console.log("confEmail", confEmail);

    try {
        const formData = new FormData();
        formData.append("address", address);
        formData.append("conferenceId", conferenceId);
        formData.append("confTitle", confTitle);
        formData.append("confCategory", confCategory);
        formData.append("confDescription", confDescription);
        formData.append("selectedSpeakers", JSON.stringify(selectedSpeakers));
        formData.append("selectedOrganizers", JSON.stringify(selectedOrganizers));
        formData.append("confParticipantsFile", confParticipants);
        formData.append("location", location);
        formData.append("datetimes", datetimes);
        formData.append("startTime", startTime);
        formData.append("endTime", endTime);
        formData.append("image", confAffiche);
        formData.append("userEmail", confEmail);

        console.log("formData", formData);

        // Add event to MongoDB
        const url = 'http://localhost:5000/events';
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to register event');
                }
        console.log("added in mongodb");
       }catch(e){console.log(e);}
      }
   
sendAddEvent = async () => {
    const {
      conferenceId,
    } = this.state;
    const confEmail = localStorage.getItem('confEmail');
    console.log("confEmail", confEmail);

    try {
      // Add event to blockchain
      const blockchainResponse = await this.handleAddInBlockchaine();
        await this.AddEventInMongoDb();
        await this.sendNotification('A new conference has been created!', confEmail, "EduCheck Server", "creation");
        console.log("conferenceId", conferenceId);
        toast.success("Event added successfully!");
        // Reset form state
        this.setState({
            confTitle: '',
            confCategory: '',
            confDescription: '',
            selectedSpeakers: [],
            confParticipants: [],
            location: '',
            datetimes: [''],
            startTime: [''],
            endTime: [''],
            confAffiche: null,
            confParticipantsFile: null,
            address: ''
        }, () => {
            this.componentDidMount();
        });
  
       
      
    } catch (error) {
        console.error('Error:', error);
        toast.success('Failed to add event. Please try again.');
    }
  };
  
  
      
    /*  

*/
    //cycle de vie d'un composant dans React qui est appelé automatiquement une fois que le composant a été monté
    async componentDidMount() {
      const dfv=uuidv4();
      console.log(dfv);
      console.log("this.state.conferenceId",this.state.conferenceId);
      console.log(this.state.confEmail);
      console.log("selectedSpeakers",this.state.selectedSpeakers);
      console.log("JSON.stringify(selectedSpeakers)",JSON.stringify(this.state.selectedSpeakers));
      
      try {
        try {
          const response = await axios.get('address.json'); // Replace with the actual path to your JSON file
          console.log('Fetched JSON data:', response.data);
          this.setState({
            addresses: response.data.addresses,
            //loading: false,
          });
        } catch (error) {
          console.error('Error fetching JSON data:', error);
        }  
        // Fetch organizers
        const confEmail1 = localStorage.getItem('confEmail');
        this.setState({confEmail:confEmail1})
        const responseOrg = await fetch(`http://localhost:5000/organizers?confEmail=${confEmail1}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!responseOrg.ok) {
          throw new Error('Failed to fetch organizers');
        }
        const dataOrg = await responseOrg.json();
        //const organizers = dataOrg.map(element => element.name);
        console.log('Fetched organizers:', dataOrg);
        this.setState({ organizers:dataOrg });
    
        // Fetch speakers
        const responseSpeakers = await fetch(`http://localhost:5000/speakers?confEmail=${confEmail1}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!responseSpeakers.ok) {
          throw new Error('Failed to fetch speakers');
        }
        const dataSpeakers = await responseSpeakers.json();
        //const speakers = dataSpeakers.map(element => element.name);
        console.log('Fetched speakers:', dataSpeakers);
        //this.setState({ speakers });
        this.setState({ speakers:dataSpeakers });
        console.log();
        {this.state.speakers.map((speaker,index) => (
            
        console.log("fff",speaker[index])
      ));}
        console.log("this.state.speakers",this.state.speakers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      console.log("o",this.state.organizers);
      console.log("s",this.state.speakers);
    }
async componentDidUpdate(prevProps, prevState) {
    const { addresses, loading, address } = this.state;
          //const unusedAddress = addresses.find(address => !address.used);
         // const isAddressChanged = address.toLowerCase() !== unusedAddress.address.toLowerCase();
         // console.log("etat est",address, unusedAddress.address, this.state.address );
          // Update the state with the fetched data
    const { confId, isEditing } = this.props;
     /* if (!loading && unusedAddress) {
        const isAddressChanged = address.toLowerCase() !== unusedAddress.adresse.toLowerCase();
        console.log("etat est",address, unusedAddress.adresse, this.state.address );

        if (isAddressChanged) {
            this.setState({
                address: unusedAddress.adresse,
                idAddress: unusedAddress.id,
            });

            console.log('Selected address is', this.state.address);
            console.log('Address and id:', unusedAddress.adresse, unusedAddress.id);
        }
      }*/
      if (isEditing && confId !== prevProps.confId ) {

        const response = await fetch(`http://localhost:5000/myevents/${confId}`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Failed to get conference');
        }
        const data = await response.json();
          console.log("event to update", data);

        this.setState({
            event: data,
            confTitle: data[0].confTitle,
            confCategory: data[0].confCategory,
            confDescription: data[0].confDescription,
            selectedSpeakers: data[0].selectedSpeakers,
            confParticipants: data[0].confParticipants,
            location: data[0].location,
            datetimes: data[0].datetimes,
            startTime: data[0].startTime,
            endTime: data[0].endTime,
            confAffiche: data[0].confAffiche,
            confParticipantsFile: data[0].confParticipantsFile,
        }, () => {
            console.log("Updated state:", this.state);
        });
       
    }
}
    
   /**
    *
    */ 
    
    //// speaker select
    handleSpeakerChange = (event) => {
      const option = event.target;
      const selectedOptions = Array.from(option.selectedOptions, (option) => JSON.parse(option.value));
      const { selectedSpeakers } = this.state;
      // Check if the option is already selected
      const isSelected = selectedSpeakers.find(speaker => speaker._id === selectedOptions[0]._id);
      // If the option is selected, remove it. Otherwise, add it.
      const updatedSpeakers = isSelected
        ? selectedSpeakers.filter(speaker => speaker._id !== selectedOptions[0]._id)
        : [...selectedSpeakers, ...selectedOptions];
    
      this.setState({ selectedSpeakers: updatedSpeakers });
      console.log("this.state.selectedSpeakers", this.state.selectedSpeakers);
      console.log("this.state.selectedSpeakers json", JSON.stringify(this.state.selectedSpeakers));
    };
        
    
    /// speaker remove
    removeSpeaker = (speakerToRemove) => {
      const updatedSelectedSpeakers = this.state.selectedSpeakers.filter((speaker) => speaker !== speakerToRemove);
      this.setState({ selectedSpeakers: updatedSelectedSpeakers });
    };
  
    handleOrganizerChange = (event) => {
      const option = event.target;
      const selectedOptions = Array.from(option.selectedOptions, (option) => JSON.parse(option.value));
      const { selectedOrganizers } = this.state;
      // Check if the option is already selected
      const isSelected = selectedOrganizers.find(speaker => speaker._id === selectedOptions[0]._id);
      // If the option is selected, remove it. Otherwise, add it.
      const updatedOrganizers = isSelected
        ? selectedOrganizers.filter(speaker => speaker._id !== selectedOptions[0]._id)
        : [...selectedOrganizers, ...selectedOptions];
    
      this.setState({ selectedOrganizers: updatedOrganizers });
      console.log("this.state.selectedOrganizers", this.state.selectedOrganizers);
    };
    /// Organizer remove
    removeOrganizer = (speakerToRemove) => {
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
connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Get the user's address
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      this.setState({ address: accounts[0] });
    } catch (error) {
      console.error(error); 
    }
  } else {
    console.error('Web3 provider not detected. Please install Metamask.');
    toast.success('Web3 provider not detected. Please install Metamask.');
  }
};

    //fonction asyncrone  peut contenir des opérations asynchrones telles que des appels à des API externes ou des fonctions qui retournent des promesses.(await,catch, then..)
    handleAddInBlockchaine = async() => {
      console.log("handleAddInBlockchaine function");
      
        //l'automatisation de l'adresse ethereum 
        const storageContract= await getContractInstanceConf();   
        console.log("instance chargée");
        if (!storageContract || !storageContract.instance) {
        console.error("Erreur lors de la récupération de l'instance du contrat");
        return;
        } 

        // Vérifiez que les champs obligatoires sont remplis
        if (!this.state.address||!this.state.confCategory || !this.state.confTitle || !this.state.confDescription || !this.state.datetimes ) {
        console.error("Tous les champs doivent être remplis");
        return;
     }
        //const address = this.props.usedAddress.adresse;
        const {address, confTitle,confAffiche, confCategory,confDescription,selectedSpeakers,selectedOrganizers,location,datetimes,startTime,endTime,idAddress}=this.state;
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const accountAddress = accounts[0];
        if(accountAddress==null){
          toast.success("You should connect to your blockchaine wallet to create a conference !")
        }
        try{
          console.log("address",address,/*ref*/this.state.conferenceId,
          /*name*/confTitle,/*email*/this.state.confEmail);
          const ajout=await storageContract.instance.methods.addConference(
          address,/*ref*/this.state.conferenceId,
          /*name*/confTitle,/*email*/this.state.confEmail,'created').send({
            from: accountAddress
          });
          if (ajout.status) {
            
            this.setState({added:true})
              console.log("Conference added successfully!");
             // this.sendEmail();
            //this.updateAccountProperty( idAddress, selectedConfInfo.name );
    
            } else {
              toast.success("La transaction a échoué");
            }
          } 
          catch (error) {
              toast.success("Institute address or reference already exist");
          }
        console.log("l adresse de transaction est ",accountAddress);
        console.log('transaction effectuée avec les params ',address,this.state.conferenceId,this.state.confEmail,confTitle, confCategory,confDescription,selectedSpeakers,selectedOrganizers,location,datetimes,startTime,endTime);
        console.log('les diplomas name and ref : ',datetimes);
    }
    sendEmail = async () => {
    const {confEmail}=this.state
    console.log('l email de send is', confEmail);
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
  handleAddSpeaker=()=>{

  }
  
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
  handleOpenAdd = (open) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '50%';
    iframe.style.left = '50%';
    iframe.style.transform = 'translate(-50%, -50%)';
    iframe.style.width = '80%';
    iframe.style.height = '80%';
    iframe.style.backgroundColor = 'white';
    iframe.style.border = '1px solid #ccc';
    iframe.style.zIndex = '1000';
  
    // Track which component should be rendered
    let componentToRender;
    if (open === 'speaker') {
        componentToRender = <Speakers hideTable={true}/>;
    } else if (open === 'organizer') {
        componentToRender = <Organizers hideTable={true} />;
    }
  
    // Wait for the iframe to load before accessing its contentDocument
    iframe.addEventListener('load', () => {
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.addEventListener('click', () => document.body.removeChild(iframe));
        iframe.contentDocument.body.appendChild(closeButton);
  
        const div = document.createElement('div');
        iframe.contentDocument.body.appendChild(div);
        ReactDOM.render(componentToRender, div);
    });
  
    document.body.appendChild(iframe);
}
updateConference = async (event, conferenceId) => {
  event.preventDefault();
  try {
    const response = await fetch(`http://localhost:5000/myevents/${conferenceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      //body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
      throw new Error('Failed to update conference');
    }

    toast.success('Conference updated successfully');
   // window.location.reload(); // Reload the page after successful update
   this.componentDidMount();
  } catch (error) {
    console.error('Error updating conference:', error);
    toast.success('Failed to update conference');
  }
}

    render(){
      
        const {address, loading,isEditing} =this.state;
        return(
         <main style={{ padding:"50px" }}>
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
           <div>
		
          {this.state.isEditing?<h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>U</span>
              <span style={{color: '#EA4335'}}>p</span>
              <span style={{color: '#FBBC05'}}>d</span>
              <span style={{color: '#4285F4'}}>a</span>
              <span style={{color: '#34A853'}}>t</span>
              <span style={{color: '#EA4335'}}>e</span>{' '}{' '}
              <span style={{color: '#4285F4'}}>Y</span>
              <span style={{color: '#EA4335'}}>o</span>
              <span style={{color: '#FBBC05'}}>u</span>
			        <span style={{color: '#4285F4'}}>r</span>{' '}{' '}
              <span style={{color: '#EA4335'}}>C</span>
              <span style={{color: '#FBBC05'}}>o</span>
              <span style={{color: '#4285F4'}}>n</span>
              <span style={{color: '#34A853'}}>f</span>
              <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#4285F4'}}>r</span>
              <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#34A853'}}>n</span>
              <span style={{color: '#FBBC05'}}>c</span>
			        <span style={{color: '#4285F4'}}>e</span>
              {' '}{' '}{' '}{' '}{' '}{' '}{' '}{' '}
              <span style={{ fontSize:"11px",fontWeight:100 ,display:"flex",justifyContent:"flex-end"}}>conference Id : {this.state.confId}</span>
            </h1>:<div  className="head-title">
            <div  className="left">
              <h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>C</span>
              <span style={{color: '#EA4335'}}>r</span>
              <span style={{color: '#FBBC05'}}>e</span>
              <span style={{color: '#4285F4'}}>a</span>
              <span style={{color: '#34A853'}}>t</span>
              <span style={{color: '#EA4335'}}>e</span>{' '}{' '}
              <span style={{color: '#4285F4'}}>Y</span>
              <span style={{color: '#EA4335'}}>o</span>
              <span style={{color: '#FBBC05'}}>u</span>
			        <span style={{color: '#4285F4'}}>r</span>{' '}{' '}
              <span style={{color: '#EA4335'}}>C</span>
              <span style={{color: '#FBBC05'}}>o</span>
              <span style={{color: '#4285F4'}}>n</span>
              <span style={{color: '#34A853'}}>f</span>
              <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#4285F4'}}>r</span>
              <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#34A853'}}>n</span>
              <span style={{color: '#FBBC05'}}>c</span>
			        <span style={{color: '#4285F4'}}>e</span>
              </h1>
              </div>
              </div>
         }
				
        <div  style={{display:'flex',width:"100%", justifyContent: 'center' ,right:"0px",alignItems: 'center',top:"120px",position:'relative'}} >
               
                    <div  className='signup1'  style={{width:"100%",padding:"30px",borderRadius:"3%",boxShadow:"6px 8px 18px rgba(0, 0, 0, 0.25)",position:'relative',top:"-100px", backgroundImage:"linear-gradient(#758EBC,#9CBEC5)",display: 'flex', justifyContent: 'center' ,alignItems: 'center'}}>
                    <Card fluid style={{ width:"100%",display: 'flex', justifyContent: 'center' ,alignItems: 'center'}}>
                        <Card.Content style={{ width:"100%" }}>
                        <div className='add-departement' >
                                  <h4>Account Address</h4>
                                  <input className="form-input1" style={{backgroundColor:"#576389",color:"#fff"}} value={address} readOnly/>
                                  <button onClick={this.connectWallet} className='btnn'>Connect wallet</button>
                                </div>
                          <Form size='large' enctype="multipart/form-data">                              
                                  <h4>Conference Title</h4>
                                <Form.Field required className='add-departement' style={{  marginBottom:"30px"  }}>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='Conference name'
                                        value={this.state.confTitle}
                                        autoComplete="confTitle"
                                        onChange={e => this.setState({ confTitle: e.target.value })}
                                    />
                                </Form.Field>
                                  <h4>Conference Category</h4>
                                <Form.Field required className='add-departement'>
                                <select style={{ marginBottom:"30px" ,backgroundColor:"#9CBEC5",color:"#576389",width:"100%", fontSize:"19px",borderRadius:"10%"}} onChange={this.handleCategoryChange}>
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
                                <Form.Field required className='add-departement' style={{ marginBottom:"30px" }}>
                                  <textarea name="" id=""  value={this.state.confDescription} onChange={e => this.setState({ confDescription: e.target.value })} cols="30" rows="10" style={{height:"50%",color:"#fff" ,padding:"10px",fontSize:"20px",borderRadius:"10%",backgroundColor:"#576389",width:"100%" }}></textarea>
                                </Form.Field>
                                <h4>Choice all the speakers will be in this conference : </h4>
                                <Form.Field required className='add-departement' style={{  marginBottom:"30px" }}>
        <select mode="multiple" style={{width:"100%",backgroundColor:"#9CBEC5",color:"#576389", fontSize:"19px",borderRadius:"5%"}}  value={this.state.selectedSpeakers}
          onChange={this.handleSpeakerChange}>
  {this.state.speakers.map((speaker,index) => (
    <option value={JSON.stringify(speaker)} key={index}>
      {speaker.name}
    </option>
        ))}
      </select>
      <button type="button" className='btn' onClick={() => this.handleOpenAdd("speaker")}>
    +
  </button>
                                </Form.Field>
                                <ul style={{marginBottom:"30px", backgroundColor:"#576389" ,display:"flex",flexDirection:"row",padding:"10px",borderRadius:"5%"}}>
            {this.state.selectedSpeakers.map((speaker,index) => (
              <li style={{ backgroundColor:"#9CBEC5" ,borderRadius:"5%",marginRight:"5px"}} key={index}>{speaker.name}<span onClick={() => this.removeSpeaker(speaker)}> x </span></li>
            ))}
          </ul>
          <h4>
        choice all the organizers for this conference : </h4>
                                <Form.Field required className='add-departement' style={{  marginBottom:"30px"  }}>
        <select mode="multiple" style={{backgroundColor:"#9CBEC5",color:"#576389",width:"100%", fontSize:"19px",borderRadius:"5%"}}  value={this.state.selectedOrganizers}
          onChange={this.handleOrganizerChange}>
        {this.state.organizers.map((organizer,index) => (
    <option value={JSON.stringify(organizer)} key={index}>
      {organizer.name}
    </option>
        ))}
      </select>
      <button type="button" className='btn' onClick={() => this.handleOpenAdd("organizer")}>
    +
  </button>
                                </Form.Field>
                                <ul style={{marginBottom:"30px", backgroundColor:"#576389" ,display:"flex",flexDirection:"row",padding:"10px",borderRadius:"5%"}}>
            {this.state.selectedOrganizers.map((organizer,index) => (
              <li style={{ backgroundColor:"#9CBEC5" ,borderRadius:"10%",marginRight:"5px"}} key={index}>{organizer.name}<span onClick={() => this.removeOrganizer(organizer)}> x </span></li>
            ))}
          </ul>
                                <h4>Conference Affiche</h4>
                                <Form.Field required className='add-departement' style={{  marginBottom:"30px"  }}>
                                  <input type="file"
            accept="image/*"  ref={this.confAfficheRef}
        onChange={this.handleFileChange} 
       id="image" name="image" />
                                </Form.Field>
                                <h4>Participants List</h4>
                                <Form.Field required className='add-departement'style={{  marginBottom:"30px" }}>
                                  <input type="file" name="confParticipantsFile"  title="Please select an Excel file. The first row should contain the name, the second row the email address, the third row the conference interest, the fourth row the contact, and the last row the affiliation." id="confParticipantsFile"  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" ref={this.fileInputRef}
        onChange={this.handleFileParticipantsChange}/>
                                </Form.Field>
                              
<GoogleMap apiKey={"AIzaSyD_S1IidRs5XkiixAnLMkH6-r-ns3qzQw8"} updateLocation={this.updateLocation} />
                                <h4>Datetime</h4>
                                <Form.Field className='add-departement' required style={{ display:"flex",flexDirection: "row" }}>
                  <div style={{ display:"flex",flexDirection:"column",justifyContent:"space-between", }}>
                    <br />
                  <h5>date</h5>
                 <br />
                  <h5>start</h5>
                  <br />
                  <h5>End</h5>
                  </div>
  {this.state.datetimes.map((diploma, index) => (
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
        value={this.state.startTime[index]}
        onChange={(e) => this.handleChangeDatetimes(index, 'start', e.target.value)}
      />
      <input
        className="form-input1"
        type='time'
        value={this.state.endTime[index]}
        onChange={(e) => this.handleChangeDatetimes(index, 'end', e.target.value)}
      />
    </div>
  ))}
  <button type="button" className='btn' onClick={this.handleAddDatetime}>
    +
  </button>
</Form.Field>

                                <Form.Field>
                                    <Button class="btn"  primary fluid size='large'onClick={(event) => isEditing ? this.updateConference(event, this.state.confId) : this.sendAddEvent(event)}>
                                    {this.state.isEditing ? 'Update' : 'Create'}
                                    </Button>
                                </Form.Field>

                            </Form>
                        </Card.Content>
                      </Card>
                      </div>
      </div>
      </div>
   </main>
    );
}
    }
export default CreateConference;