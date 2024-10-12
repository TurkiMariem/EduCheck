import axios from 'axios';
import * as emailjs from "emailjs-com";
import React, { Component } from "react";
import Web3 from "web3";
import { getContractInstanceConf } from "../../contractServices";
import ConferenceList from './ConferenceList';
import './styleAdmin.css';
class AddConference extends Component {
  state = {
    address: 'NULL',
    Conferences: [],
    selectedConfInfo: null,
    email: '',
    addresses: [],
    idAddress: '',
    loading: true,
    ConferenceList:[],
  };

  async componentDidMount() {
    try {
        const storageContract= await getContractInstanceConf();   
        if (!storageContract || !storageContract.instance) {
          console.error("Erreur lors de la récupération de l'instance du contrat");
          return;
        }
            try {
              const Conference = await storageContract.instance.methods.getConferences().call();
              this.setState(Conference);
            } catch (err) {
                console.error("Erreur lors de l'appel à getConference():", err);
                return;
              }
      console.log("Information of added conference:", this.state.ConferenceList);
      const response = await axios.get('address.json');
      console.log('Fetched JSON data helloooo:', response.data);
      this.setState({
        addresses: response.data.addresses,
        loading: false,
      });

      const googleSheetsResponse = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTf2Mg_5Z9MdAF5o1YY9JTbYNy8QDs8dJRKrLk4Fuw1HkTarJm_ELemBglqhqr4rDG9RDd-I81JGl_F/pubhtml');
      const googleSheetsData = await googleSheetsResponse.text();
      const parsedData = this.parseGoogleSheetsData(googleSheetsData);
      console.log(parsedData);
      this.setState({ Conferences: parsedData });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  componentDidUpdate() {
    const { addresses, loading, address } = this.state;
    const unusedAddress = addresses.find(address => !address.used);
  
    if (!loading && unusedAddress) {
      const isAddressChanged = address.toLowerCase() !== unusedAddress.adresse.toLowerCase();
      console.log("etat est", address, unusedAddress.adresse, this.state.address);
  
      if (isAddressChanged) {
        this.setState({
          address: unusedAddress.adresse,
          idAddress: unusedAddress.id,
        });
        console.log('Selected address is', this.state.address);
        console.log('Address and id:', unusedAddress.adresse, unusedAddress.id);
      }
    }
  }
  

  handleSubmit = async (e) => {
    e.preventDefault();
  //l'automatisation de l'adresse ethereum 
  const storageContract= await getContractInstanceConf();   
  console.log("instance chargée");
  if (!storageContract || !storageContract.instance) {
  console.error("Erreur lors de la récupération de l'instance du contrat");
  return;
  } 
  const {address, idAddress, selectedConfInfo}=this.state;
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  const accountAddress = accounts[0];
  console.log(accountAddress);
  console.log("l adresse de transaction est ",accountAddress);

  try{
    // if click approuve then change conf status to approuved , else change status to rejected

      const ajout=await storageContract.instance.methods.addConference(
      address,/*ref*/String(selectedConfInfo[1]),
      /*name*/selectedConfInfo[0],/*email*/selectedConfInfo[5],/*acronym*/selectedConfInfo[4]).send({
        from: accountAddress,
        gas:500000 
      });
      if (ajout.status === true) {
          console.log("Conference added successfully!");
          this.sendEmail();
        this.updateAccountProperty( idAddress, selectedConfInfo.name );

        } else {
          alert("La transaction a échoué");
        }
      } 
      catch (error) {
          alert("Institute address or reference already exist");
      }
  };

  sendEmail = async () => {
    const {selectedConfInfo}=this.state
console.log('l email de send is', selectedConfInfo.email,selectedConfInfo,selectedConfInfo[0]);
// Ajouter le code pour envoyer les données du formulaire à la base de données ici
const templateParams = {
  subject:"New account created",
  to_name: "Conference",
  from_name: "CRNS",
  message: `Here are your login details for your account:\nBlockchain Address: ${this.state.address}\nUse your email address : ${this.state.selectedConfInfo.email} to login to your account \nBefore you log in to your account, please change your password and select the *forget password* button.`,
  to_email: this.state.selectedConfInfo.email,
};

emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams, 'UBJPOXynwuM1qwZMP')
  .then((result) => {
  console.log(result.text);
}, (error) => {
  console.log(error.text);
});
  };

  sendNotification = async () => {
    const templateParams1 = {
      to_email: 'dorrachakroun13@gmail.com',
      subject: 'Notification : Nouvelle conference ajoutée',
      message:'A new conference has been successfully added.'
    };
    emailjs.send('service_ts9gwnu','template_67607bd', templateParams1, 'UBJPOXynwuM1qwZMP')
    .then((result) =>{
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
  };
updateAccountProperty = async (itemId, affected) => {
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
  parseGoogleSheetsData(data) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = data;
    const table = tempElement.querySelector('.waffle');
    const rows = Array.from(table.querySelectorAll('tr'));

    const parsedData = rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        return cells.map(cell => cell.textContent.trim());
    });
    const excludedData = parsedData.slice(2);
   return excludedData;
}
handleConfChange = (event,selectedIndex) => {
  console.log("selected Conf",this.state.Conferences[selectedIndex]);
  this.setState({
    selectedConfInfo: this.state.Conferences[selectedIndex],
  });
  };

  render() {
    const { Conferences, selectedConfInfo, loading } = this.state;
    console.log("conf 0",Conferences[0]);
    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <main>
  
      {/*
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
        <span style={{color: '#EA4335'}}>c</span>
        <span style={{color: '#FBBC05'}}>e</span>
        <span style={{color: '#FBBC05'}}>s</span>
      </h1>
          <div className="dropdown-container">
              <label htmlFor="instituteDropdown">
                Select Conference:
              </label>
              <select
                id="instituteDropdown"
                value={''}
                onChange={(e) => this.handleConfChange(e, e.target.selectedIndex - 1)}>
                <option value="">Select a Conference</option>
                {Conferences.map((conference, index) => (
                  <option key={index} value={conference.value}>
                    {conference[0]}
                  </option>
                ))}
              </select>
                </div> */}
            <main>
            <div  className="table-data">
            {selectedConfInfo && (<div  className="order">
					<div  className="head">
						<h3>Selected Conference Info:</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
              <th>Name</th>
                      <th>Start day</th>
                      <th>Final Day</th>
                      <th>Place</th>
                      <th>Email</th>
                      <th>Create Account</th>
							</tr>
						</thead>
						<tbody>
            <tr>
                      <td>{selectedConfInfo[0]}</td>
                      <td>{selectedConfInfo[2]}</td>
                      <td>{selectedConfInfo[3]}</td>
                      <td>{selectedConfInfo[4]}</td>
                      <td>{selectedConfInfo[5]}</td>
                      {selectedConfInfo && (
             <td><button className="buttonLeft" onClick={this.handleSubmit}>Create Account</button></td> 
            )}
                    </tr>
</tbody>
					</table>
          </div>
           )}
    </div>
    
    </main>
        <ConferenceList/>
        </main>
    );
  }
}
export default AddConference;