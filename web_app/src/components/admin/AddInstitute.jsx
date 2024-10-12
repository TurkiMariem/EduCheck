import axios from 'axios';
import CryptoJS from 'crypto-js';
import React, { Component } from "react";
import { sendDiplomaEmail } from 'sendEmail';
import { v5 as uuidv5 } from 'uuid';
import Web3 from "web3";
import { getContractInstanceInst } from '../../contractServices';
import Alert from '../alert';
class AddInstitute extends Component{
    constructor(props) {
        super(props);
      this.state={
        selectedStatuses:['created'],
        showSuggestions:false,
        parsedData: null,
        parsedData5: null,
        address:'',
        ref:'',
        name:'',
        acronym:'',
        emailOfficer:'',
        emailValidator:'',
        WebSite:'',
        diplomasNames:[],
        diplomasRefs:[],
        status: '',
        addresses: [],
        idAddress:'',
        loading:true,
        InstitutesRegisteredData:[],
        note:'',
        showAlertApproved:false,
        showAlertRejected:false,
        emailDetails:{ fromEmail: '',
        fromName: '',
        toEmail: '',
        toName: '',
        subject: '',
        textPart: '',
        htmlPart: ''}
      };
    }
    handleCloseAlert = () => {
     this.setState({showAlertApproved:false})
     this.setState({showAlertRejected:false})
  };
    //cycle de vie d'un composant dans React qui est appelé automatiquement une fois que le composant a été monté
    async componentDidMount() {
      try {
         this.fetchAccounts();
          this.fetchInstitutes(this.state.selectedStatuses);
      } catch (error) {
          console.error('Error fetching JSON data:', error);
      }
  }
  fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/accounts');
      const unusedAddress = response.data.find(account => !account.used);
      this.setState({ addresses: response.data, address: unusedAddress ? unusedAddress.adresse : '' });
    } catch (error) {
      console.error('Error fetching accounts:', error);
      this.setState({ error: 'Error fetching accounts'});
    }
  };

    //fonction asyncrone  peut contenir des opérations asynchrones telles que des appels à des API externes ou des fonctions qui retournent des promesses.(await,catch, then..)
    addInstituteAccount = async (e, i) => {
      e.preventDefault();
      const { InstitutesRegisteredData } = this.state;
      const selectedInstitute = InstitutesRegisteredData[i];
      if (!selectedInstitute) {
          console.error("Selected institute not found");
          return;
      }

      const storageContract = await getContractInstanceInst();
      console.log("Instance chargée");
      if (!storageContract || !storageContract.instance) {
          console.error("Erreur lors de la récupération de l'instance du contrat");
          return;
      }

      this.setState({
          ref: selectedInstitute._id,
          name: selectedInstitute.instName,
          emailOfficer: selectedInstitute.officerEmail,
          emailValidator: selectedInstitute.validatorEmail,
          WebSite: selectedInstitute.website,
          acronym: selectedInstitute.instAcronym,
      }, async () => {
          const { ref, name, emailOfficer, emailValidator, acronym, idAddress, address } = this.state;
          if (!ref || !name || !emailOfficer || !emailValidator) {
              console.error("Tous les champs doivent être remplis");
              alert("Tous les champs doivent être remplis");
              return;
          }

          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          const accountAddress = accounts[0];
          console.log("L'adresse de transaction est ", accountAddress);
          console.log('Transaction effectuée avec les params ', address, ref, name, emailOfficer, emailValidator);
          try {
              const receipt = await storageContract.instance.methods.addInstitute(address, ref,
                  name, emailOfficer, emailValidator).send({ from: accountAddress, gas: 5000000 });
              console.log('Transaction effectuée avec les params après', address, name, ref, emailOfficer, emailValidator, receipt.status);
              if (receipt.status === true) {
                  console.log("Institute added successfully!");
                  await this.sendEmail("accepted");
                  this.updateAccountUsed(address);
               //  this.updateAddressState(idAddress);  // Update the address state
                 this.updateInstituteStatus(selectedInstitute._id, 'approved');
               //  this.updateAccountProperty(idAddress, acronym);
                 this.setState({ showAlertApproved: true });
                 this.sendNotification(`Your request to add this institute account is approved. Here are your credentials details. Blockchain account: ${accountAddress}. Before you log in to your account, please change your password and select the 'forget password' button.`, "EduCheck Server", selectedInstitute.emailOfficer, 'rejected');
                 alert("Institute added successfully!");
                  this.componentDidMount();  // Reload data
              } else {
                  alert("La transaction a échoué");
              }
          } catch (error) {
              alert("Institute address or reference already exists", error);
          }
      });
  };


  updateAccountUsed = async (adresse) => {
    try {
      const response = await axios.put(`http://localhost:5000/updateAccount/${adresse}`,{used:true});
      console.log('Account updated:', response.data);
    
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  
 sendEmail = async(status)=>{
  let NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  const { emailOfficer, emailValidator, name, address } = this.state;
  console.log("emailOfficer,emailValidator,name,address", emailOfficer, emailValidator, name, address);

  // Generate different hashes for different emails
  const hash1 = CryptoJS.SHA256(emailOfficer).toString();
  const uuid1 = uuidv5(hash1, NAMESPACE);
  console.log(uuid1);

  const hash2 = CryptoJS.SHA256(emailValidator).toString();
  const uuid2 = uuidv5(hash2, NAMESPACE);
  console.log(uuid2);

  if(status=="accepted"){
  await sendDiplomaEmail(emailOfficer,"EduCheck Account Details",
  null,
  `<title>EduCheck Account Details</title>
          <h3>To ${name},</h3>
          <h4>We are thrilled to inform you that your request to join EduCheck has been successfully validated.</h4>
          <h4>Below are your account details:
          Here are your login details for your account:\n
          <h4>Blockchain Address: <h2> ${address} </h2>\n</h4>
        Before you log in to your account,Please open the link below and register you face Id for more security.\n
         http://localhost:3000/registerFaceInstitute/${uuid1} and please change your password for the first login to create a password for your account. 
      </h4>
          <h4>Best regards,</h4>
          <h4><strong>EduCheck Team</strong></h4>
          <p>If you have any questions, feel free to contact us at this email or call us at +216 52759645.</p>`,
          null
);

  await sendDiplomaEmail(emailValidator,"EduCheck Account Details",null,
  `<title>EduCheck Account Details</title>
          <h3>To ${name},</h3>
          <p>We are thrilled to inform you that your request to join EduCheck has been successfully validated.</p>
          <p>Below are your account details:
          Here are your login details for your account:\n
          <h4>Blockchain Address: <h2> ${address} </h2>\n</h4>
        Before you log in to your account,Please open the link below and register you face Id for more security.\n
         http://localhost:3000/registerFaceInstitute/${uuid2} and please change your password for the first login to create a password for your account. 
      </p>
          <p>Best regards,</p>
          <p><strong>EduCheck Team</strong></p>
          <p>If you have any questions, feel free to contact us at this email or call us at +216 52759645.</p>`,
          null
);
}else{
  await sendDiplomaEmail(emailOfficer,"EduCheck Account Rejected",null,
  `<title>EduCheck Account Request Rejected</title>
<body>
          <h1>To ${name},</h1>
          <p>We are sorry to inform you that your request to join EduCheck has been rejected.</p>
          <p>Contact our service agents for more details </p>
          <p>Best regards,</p>
          <p><strong>EduCheck Team</strong></p>
          <p>If you have any questions, feel free to contact us at this email or call us at +216 52759645.</p>
</body>`,null
);
  await sendDiplomaEmail(emailValidator,"EduCheck Account Rejected",null,
  `<title>EduCheck Account Request Rejected</title>
<body>
          <h1>To ${name},</h1>
          <p>We are sorry to inform you that your request to join EduCheck has been rejected.</p>
          <p>Contact our service agents for more details </p>
          <p>Best regards,</p>
          <p><strong>EduCheck Team</strong></p>
          <p>If you have any questions, feel free to contact us at this email or call us at +216 52759645.</p>
</body>`,null
);
}
  }
 
//////////////////
  updateInstituteStatus = async (id,status) => {
    console.log("update inst id:",id);
      try {
        // Send a PATCH request to the server to update the institute status
        const response = await fetch(`http://localhost:5000/institutes/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: status })
        });
        if (!response.ok) {
          throw new Error('Error updating institute status');
        }
        // Update the institute state with the new status
        const updatedInstitute = await response.json();
        console.log('Institute status updated to approved:', updatedInstitute);
      } catch (error) {
        console.error('Error updating institute status:', error);
      }
    };
    
    // Define a function to fetch institutes
 fetchInstitutes = async (selectedStatuses) => {
  try {
    const statusQuery = selectedStatuses.length > 0 ? `status=${selectedStatuses.join(',')}` : '';
        console.log("statusQuery", statusQuery);
    
        const response = await fetch(`http://localhost:5000/institutes?${statusQuery}`, {
          method: 'GET',
    headers: {
      'Content-Type': 'application/json'
          }
        });
    
    if (!response.ok) {
      throw new Error('Failed to fetch institutes');
    }
    
        const data = await response.json();
        this.setState({ InstitutesRegisteredData: data });
    console.log('Fetched institutes:', data);
    return data;
  } catch (error) {
    console.error('Error fetching institutes:', error);
    return null;
  }
};

    
    //fonction asyncrone  peut contenir des opérations asynchrones telles que des appels à des API externes ou des fonctions qui retournent des promesses.(await,catch, then..)
    handleReject = async(e,i) => {
      e.preventDefault();
      const { InstitutesRegisteredData } = this.state;
  const selectedInstitute = InstitutesRegisteredData[i];
  const note = prompt('Do you want to add a note explaining the rejection to the institute ?');
  if (note !== null) {
this.setState({note:note});
      console.log('Note added:', note);
      this.updateInstituteStatus(selectedInstitute._id,'rejected');
     await this.sendEmail('rejected');
      console.log('email sent successfully');
      this.setState({showAlertRejected:true});
this.sendNotification(`your request to add this institute account is rejected for some reasons: ${note}`,"EduCheck Server",selectedInstitute.emailOfficer,'rejected');
this.componentDidMount();
  } else {
      // User clicked Cancel in the prompt dialog
      console.log('No note added');
  }
      
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

 handleStatusSelection = (status) => {
    if (this.state.selectedStatuses.includes(status)) {
        this.setState({selectedStatuses:this.state.selectedStatuses.filter((s) => s !== status)});
    } else {
      this.setState({selectedStatuses:[...this.state.selectedStatuses, status]})
    }
};
    render(){
        const {address, loading} =this.state;
        if (!loading) {
          return <div>Loading...</div>;
        }
        const statusSuggestions = ['created', 'approved', 'rejected', 'deleted'];
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
            {/*<button onClick={this.sendAddUniversity}>Send Universities</button>*/}
       {/* */}
            <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
					<div  className="head">
						<h3 style={{ color:"#4285F4" }}>List of Registered Institutes</h3>
						<i  className='bx bx-search' ></i>
            <div style={{ position:"relative" }}>
            <i style={{ position:"absolute"}} className='bx bx-filter' onClick={() => this.setState({showSuggestions:!this.state.showSuggestions})}></i>
            {this.state.showSuggestions && (
                <ul style={{ position:"absolute", right:"100%",top:"100%",backgroundColor:"#fff" ,padding:"20px",borderRadius:"20%"}}>
                    {statusSuggestions.map((status, index) => (
                         <li key={index} style={{ marginRight: '10px', marginBottom: '5px' }}>
                         <label style={{ display: 'flex', alignItems: 'center' }}>
                             <input
                                 type="checkbox"
                                 checked={this.state.selectedStatuses.includes(status)}
                                 onChange={() => this.handleStatusSelection(status)}
                             />
                             <td><span style={{ marginLeft: '5px' }} className={`status yes`}>{status}</span></td>
                         </label>
                     </li>
                    ))}
                </ul>
            )}
            </div>
					</div>
					<table>
						<thead>
							<tr style={{  marginRight:"20px" }}>
								<th>Institute University</th>
								<th>Institute Name</th>
								<th>Institute Acronym</th>
								<th>Institute Ref</th>
								<th>Officer Email</th>
								<th>Validator Email</th>
								<th>Contact</th>
								<th>website</th>
								<th>Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody style={{right:"20px"}}>
  {this.state.InstitutesRegisteredData.map((institute, i) => (
    <tr key={i}>
      <td>{institute.universityName}</td>
      <td>{institute.instName}</td>
      <td>{institute.instAcronym}</td>
      <td>{institute.instRef}</td>
      <td>{institute.officerEmail}</td>
      <td>{institute.validatorEmail}</td>
      <td>{institute.contact}</td>
      <td>{institute.website}</td>
      <td style={{ left: "20px" }}>
                {institute.status === "approved" && (
                    <span className="status yes">Approved</span>
                )}
                {institute.status === "created" && (
                    <span className="status pending">Created</span>
                )}
                {institute.status === "rejected" && (
                    <span className="status no">Rejected</span>
                )}
            </td>
      <td>
      {institute.status === "rejected"||"created" && ( <button className="status yes" onClick={(e) => this.addInstituteAccount(e,i)}>Add</button>)}
        {institute.status === "approved"||"created" && (<button className="status pending" onClick={(e) => this.handleReject(e,i)}>Reject</button>)}
        {/** delete account from blockchaine */}
        {institute.status === "approved" && (<button className="status no" onClick={(e) => this.handleReject(e,i)}>Delete</button>)}
     
        </td>
      {/* Add more table cells for other fields */}
    </tr>
  ))}
</tbody>
					</table>
				</div>
        </div>
        <div>
            {this.state.showAlertApproved && (
                <Alert message="Event status updated to approved!" type="success" onClose={this.handleCloseAlert}/>
            )}
            {this.state.showAlertRejected && (
                <Alert message="Event status updated to rejected!" type="error" onClose={this.handleCloseAlert}/>
            )}
        </div>
       </main> 
    );
}
}
export default AddInstitute;
{/**<div className="hash">
                <h2 style={{ color:"#576389" }}>AddInstitute</h2>
                    <div  className='signup'>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large' onSubmit={this.handleSubmit}>
                                <div className='add-departement'>
                                  <h4>Account Address</h4>
                                  <input className="form-input1" style={{backgroundColor:"#576389",color:"#fff"}} value={address} readOnly/>
                                </div>

                                <Form.Field required className='add-departement'>
                                  <h4>Ref</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='ref'
                                        value={this.state.ref}
                                        autoComplete="ref"
                                        onChange={e => this.setState({ ref: e.target.value })}
                                    />
                                  </Form.Field>

                                <Form.Field required className='add-departement'>
                                  <h4>Name</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='name'
                                        value={this.state.name}
                                        autoComplete="name"
                                        onChange={e => this.setState({ name: e.target.value })}
                                    />
                                     <Form.Field required>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='acronym'
                                        value={this.state.acronym}
                                        autoComplete="name"
                                        onChange={e => this.setState({ acronym: e.target.value })}
                                    />
                                </Form.Field>
                                </Form.Field>
                              
                                <Form.Field required className='add-departement'>
                                  <h4>Officer Email</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='email'
                                        value={this.state.emailOfficer}
                                        autoComplete="name"
                                        onChange={e => this.setState({ emailOfficer: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field required className='add-departement'>
                                  <h4>Validator Email</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='email'
                                        value={this.state.emailValidator}
                                        autoComplete="name"
                                        onChange={e => this.setState({ emailValidator: e.target.value })}
                                    />
                                </Form.Field>
                               
                                <Form.Field required className='add-departement'>
                                  <h4>Website</h4>
                                    <input
                                     className="form-input1"
                                        type='text'
                                        placeholder='WebSite'
                                        value={this.state.WebSite}
                                        autoComplete="WebSite"
                                        onChange={e => this.setState({ WebSite: e.target.value })}
                                    />
                                </Form.Field>
                               
                                <Form.Field className='add-departement' required style={{ display:"flex",flexDirection: "row" }}>
                  <h4>Diplomas</h4>
                  {this.state.diplomasNames.map((diploma, index) => (
                <div key={index}>
                    <input
                        className="form-input1"
                        type='text'
                        placeholder={`Diploma Name ${index + 1}`}
                        value={diploma}
                        onChange={e => this.handleChangeDiplomas(index, 'name', e.target.value)}
                    />
                    <input
                        className="form-input1"
                        type='text'
                        placeholder={`Diploma Ref ${index + 1}`}
                        value={this.state.diplomasRefs[index]}
                        onChange={e => this.handleChangeDiplomas(index, 'ref', e.target.value)}
                    />
                </div>
            ))}
                                    <button type="button" className='btn' onClick={this.handleAddDiploma}>
                                           +
                                    </button>
                                </Form.Field>
                                <Form.Field>
                                    <Button type='submit' class="btn"  primary fluid size='large' >
                                        Add
                                    </Button>
                                </Form.Field>

                            </Form>
                        </Card.Content>
                      </Card>
                      </div>
      </div>  */}