import axios from 'axios';
import * as emailjs from "emailjs-com";
import React, { Component } from "react";
import Web3 from "web3";
import { getContractInstanceInst } from "../../contractServices";
import './styleAdmin.css';
class SelectInstitute extends Component{
    constructor(props) {
        super(props);
        this.state = {
          address:'NULL',
          universities: [], // List of universities from the Excel file
          selectedUniversity: '',
          institutes: [],
          selectedInstituteInfo: null,
          departments:[],
          officer:'',
          validator:'',
          addresses: [],
          idAddress:'',
          loading:true,
          parsedData: null,
          parsedData5: null,
          instituteList:[],
          instituteDiplomas:[]
        };}
        
   /// 
   async componentDidUpdate() {
    const { addresses, loading, address } = this.state;
    if (!addresses || !address) {
      // Return early if addresses or address is undefined
      return;
    }
    const unusedAddress = addresses.find(address => !address.used);
    const isAddressChanged = address.toLowerCase() !== unusedAddress.adresse.toLowerCase();
    console.log("etat est",address, unusedAddress.adresse, this.state.address );
    if (!loading && unusedAddress && isAddressChanged) {
      this.setState({
        address: unusedAddress.adresse,
        idAddress: unusedAddress.id,
      });
      console.log("this.state.selectedInstituteInfo",this.state.selectedInstituteInfo);
      console.log('Selected address is', this.state.address);
      console.log('Address and id:', unusedAddress.adresse, unusedAddress.id);
    }
  }
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
      const {address, idAddress, selectedInstituteInfo}=this.state;
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const accountAddress = accounts[0];
      const diplomasNames = Object.keys(JSON.parse(selectedInstituteInfo[4]));
      console.log("erfcer",diplomasNames);
      const diplomasRefs = Object.values(JSON.parse(selectedInstituteInfo[4]));
      console.log('efcdwv',diplomasRefs);      
      console.log("l adresse de transaction est ",accountAddress);

      console.log('avant la transaction ',address,/*ref*/String(selectedInstituteInfo[2]),
      /*name*/selectedInstituteInfo[1],/*acronym*/selectedInstituteInfo[3],
      /*emailOff*/selectedInstituteInfo[5],/*emailValid*/selectedInstituteInfo[6],
      /*website*/'info.com',/*dep*/selectedInstituteInfo[4] );
      console.log('transaction effectuée avec les params ',address,String(selectedInstituteInfo[2]),selectedInstituteInfo[1],selectedInstituteInfo[5],selectedInstituteInfo[6],selectedInstituteInfo[7],diplomasNames,diplomasRefs);
      try{
          const ajout= await storageContract.instance.methods.addInstitute(
          address,/*ref*/String(selectedInstituteInfo[2]),
          /*name*/selectedInstituteInfo[1],/*acronym*/selectedInstituteInfo[3],
          /*emailOff*/selectedInstituteInfo[5],/*emailValid*/selectedInstituteInfo[6],
          /*website*/selectedInstituteInfo[7],/*diplomasNames*/diplomasNames,
          /*diplomasRefs*/diplomasRefs).send({
            from: accountAddress,
            gas:500000
          });
          console.log('transaction effectuée avec les params ',address,String(selectedInstituteInfo[2]),selectedInstituteInfo[1],selectedInstituteInfo[5],selectedInstituteInfo[6],selectedInstituteInfo[7],diplomasNames,diplomasRefs);
          //verification dans le console
          if (ajout.status === true) {
              console.log("Institute added successfully!");
              this.sendEmail();
              this.updateAccountProperty( idAddress, selectedInstituteInfo.institute );
            } else {
              alert("La transaction a échoué");
            }
          } 
          catch (error) {
              alert("Institute address or reference already exist");
          }
  }

  sendEmail = async () => {
    const {selectedInstituteInfo}=this.state
    console.log('l email de send is', selectedInstituteInfo.officer);
    // Ajouter le code pour envoyer les données du formulaire à la base de données ici
    const templateParams_officer = {
      subject:"New account created",
      to_name: "Officer",
      from_name: "CRNS",
      message: `Here are your login details for your account:\nBlockchain Address: ${this.state.address}\nUse your email address : ${this.state.selectedInstituteInfo.officer} to login to your account \nBefore you log in to your account, please change your password and select the *forget password* button.`,
      to_email: this.state.selectedInstituteInfo.officer,
    
  };
  const templateParams_validator = {
    subject:"New account created",
      to_name: "Validator",
      from_name: "CRNS",
      message: `Here are your login details for your account:\nBlockchain Address: ${this.state.address}\nUse your email address : ${this.state.selectedInstituteInfo.officer} to login to your account \nBefore you log in to your account, please change your password and select the *forget password* button.`,
      to_email: this.state.selectedInstituteInfo.validator,
  };
    emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams_officer, 'UBJPOXynwuM1qwZMP')
      .then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
    emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams_validator, 'UBJPOXynwuM1qwZMP')
      .then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });  
  };
   sendNotification= async () => {
    const templateParams1 = {
      to_email: 'dorrachakroun13@gmail.com',
      subject: 'Notification : Nouvelle institut ajouté',
      message:'A new institute has been successfully added.'
    };
    emailjs.send('service_ts9gwnu','template_67607bd', templateParams1, 'UBJPOXynwuM1qwZMP')
    .then((result) =>{
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
  };

  updateAccountProperty = async (itemId,affected) => {
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
    try {
      await axios.put('http://localhost:5000/writeAPI', { addresses: updatedItems });
      this.setState({ addresses: updatedItems }); // Update the state
      console.log('les nouvelles addresses', this.state.addresses);
    } catch (error) {
      console.error(error);
    }
  };
  async componentDidMount() {
    try {
        const storageContract= await getContractInstanceInst();   
        if (!storageContract || !storageContract.instance) {
          console.error("Erreur lors de la récupération de l'instance du contrat");
          return;
        } 
    try {
              const Accounts = await storageContract.instance.methods.getInstitutes().call();
              this.setState({instituteList:Accounts})
            } catch (err) {
                console.error("Erreur lors de l'appel à getInstitutes():", err);
                return;
              }
     console.log("Information of added inst:", this.state.instituteList);
      const response = await axios.get('address.json');
      console.log('Fetched JSON data helloooo:', response.data);
      this.setState({
        addresses: response.data.addresses,
        loading: false,
      });
      const googleSheetsResponse = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRRsCIeaX36XDXbfdc2Eioc1YnkHNDxxGkpvbvZpzm5_0egJeH1ZgRR3HARhA00ZQ/pubhtml');
      const googleSheetsData = await googleSheetsResponse.text();
      const finalData=this.parseGoogleSheetsData(googleSheetsData);
      this.setState({parsedData:finalData})
      this.setState({ universities:finalData });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
   
  } 
  parseGoogleSheetsData(data) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = data;
    const table = tempElement.querySelector('.waffle');
    const rows = Array.from(table.querySelectorAll('tr'));

    const parsedData1 = rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        return cells.map(cell => cell.textContent.trim());
    });
    const excludedData = parsedData1.slice(2);
    this.setState({parsedData5:excludedData})
    console.log('this.state.parsedData5',this.state.parsedData5);
    const uniqueLocations = [...new Set(excludedData.map(item => item[0]))];
    console.log("excluded " ,uniqueLocations);
   return uniqueLocations;
}
handleUniversityChange = (event,selectedIndex) => {
const selectedUniversity= this.state.universities[selectedIndex];
const institutes = this.parseInstitutes(selectedUniversity);
console.log("errrrrorrrr",institutes);
    this.setState({
      selectedUniversity,
      institutes,
      selectedInstituteInfo: null,
    });
  };

  handleInstituteChange = (event,selectedIndex) => {
    const selectedInstituteInfo = this.state.institutes[selectedIndex];
    this.setState({
      selectedInstituteInfo,
    });
    console.log("dorradorra",selectedInstituteInfo);
    if(selectedInstituteInfo !== null){
      const parsedData=JSON.parse(selectedInstituteInfo[4]);
      this.setState({instituteDiplomas: parsedData});
      console.log("instituteDiplomas",this.state.instituteDiplomas);
     };
  };
  
  parseInstitutes =  (selectedUniversity) => {
const InstitutesSelected= this.state.parsedData5.filter(item => item[0] === selectedUniversity);
    console.log("selectedInstituess",InstitutesSelected);
    
    
    return InstitutesSelected;
  };
  handleValidation = () => {
    console.log('Validation button clicked');
  };

  
  

 
    render(){
      const {universities, selectedUniversity, institutes,selectedInstituteInfo,instituteDiplomas } = this.state;
        const { loading } = this.state;
       
  if (loading) {
    return <div>Loading...</div>;
    }
        return(
          <main>
          <div  className="head-title">
            <div  className="left">
<h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>I</span>
              <span style={{color: '#EA4335'}}>n</span>
              <span style={{color: '#FBBC05'}}>s</span>
              <span style={{color: '#4285F4'}}>t</span>
              <span style={{color: '#34A853'}}>i</span>
              <span style={{color: '#EA4335'}}>t</span>
              <span style={{color: '#4285F4'}}>u</span>
              <span style={{color: '#EA4335'}}>t</span>
              <span style={{color: '#FBBC05'}}>e</span>
              <span style={{color: '#FBBC05'}}>s</span>
            </h1>
            </div>
            </div>
        <div className="dropdown-container">
  <label htmlFor="universityDropdown">Select University:</label>
  <select
    id="universityDropdown"
    value={selectedUniversity}
    onChange={(e) => this.handleUniversityChange(e, e.target.selectedIndex - 1)}
  >
    <option value="">Select a University</option>
    {universities.map((university, index) => (
      <option key={index} value={university}>
        {university}
      </option>
    ))}
  </select>
</div>

<div className="dropdown-container">
  <label htmlFor="instituteDropdown">Select Institute:</label>
  <select
    id="instituteDropdown"
    value={''}
    onChange={(e) => this.handleInstituteChange(e, e.target.selectedIndex - 1)}
  >
    <option value="">Select an Institute</option>
    {institutes.map((institute, index) => (
      <option key={index} value={institute}>
        {institute[1]} {/* Access the institute name at index 1 */}
      </option>
    ))}
  </select>
</div>

<main>
           <div  className="table-data">
            {selectedInstituteInfo && (<div  className="order">
					<div  className="head">
						<h3>Selected Institute Info:</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
         
					<table>
						<thead>
							<tr>
              <th>University</th>
                  <th>Institute</th>
                  <th>Acronym</th>
                  <th>Reference</th>
                  <th>Diplomas</th>
                  <th>Officer</th>
                  <th>Validator</th>
                  <th>Website</th>
                  <th>Create Account</th>
							</tr>
						</thead>
						<tbody>
  
            <tr>
            <td>{selectedInstituteInfo[0]}</td>
            <td>{selectedInstituteInfo[1]}</td>
            <td>{selectedInstituteInfo[3]}</td>
            <td>{selectedInstituteInfo[2]}</td>
            <td>
            <table>
  <thead>
    <tr>
      <th style={{ color: "#809BCE", fontWeight: "10" }}>Diploma Name</th>
      <th style={{ color: "#809BCE", fontWeight: "10" }}>Diploma Ref</th>
    </tr>
  </thead>
  <tbody>
    {Object.entries(JSON.parse(selectedInstituteInfo[4])).map(([diplomaName, diplomaRef], index) => (
      <tr key={index}>
        <td>{diplomaName}</td>
        <td>{diplomaRef}</td>
      </tr>
    ))}
  </tbody>
</table>

              </td>
            <td>{selectedInstituteInfo[5]}</td>
            <td>{selectedInstituteInfo[6]}</td>
            <td>{selectedInstituteInfo[7]}</td>
                      {selectedInstituteInfo && (
             <td><button className="primary" onClick={this.handleSubmit}>Create Account</button></td> 
            )}
                    </tr>
</tbody>
					</table>
          </div>
           )}
    </div>
    </main>
    <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
					<div  className="head">
						<h3>Institutes</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr style={{  marginRight:"20px" }}>
								<th>Institute Address</th>
								<th>Name</th>
								<th>Ref</th>
								<th>Officier Email</th>
								<th>Validator Email</th>
								<th>Diplomas Refs</th>
								<th>website</th>
							</tr>
						</thead>
						<tbody style={{marginRight:"20px"}}>

							{this.state.instituteList.map((inst) => {
    return (
      <tr key={inst.id} style={{marginRight:"20px"}}>
        <td style={{marginRight:"20px"}}>{inst[0]}</td>
        <td style={{marginRight:"20px"}}>{inst[2]}</td>
        <td style={{marginRight:"20px"}}>{inst[1]}</td>
        <td style={{marginRight:"20px"}}>{inst[4]}</td>
        <td style={{marginRight:"20px"}}>{inst[5]}</td>
        <td style={{marginRight:"20px"}}>
          
          </td>
        <td style={{marginRight:"20px"}}>{inst[6]}</td>
       </tr>)})}
						</tbody>
					</table>
				</div>
        </div>
      </main>
       
        
    );
}
}

export default SelectInstitute;