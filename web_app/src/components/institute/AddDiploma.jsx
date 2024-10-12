import { nanoid } from "nanoid";
import QRCode from 'qrcode';
import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Card, Form } from "semantic-ui-react";
import Web3 from "web3";
import { getContractInstanceInst } from "../../contractServices";
import './style.css';

import axios from "axios";
import * as emailjs from "emailjs-com";

class AddDiploma extends Component  {
  
  constructor(props) {
    super(props);

    this.state = {
      ipfsHash: "",
      institutename:"",
      student_name: "",
      email:"",
      date_of_birth: new Date(),
      mention: "",
      status:'',
      password:"",
      dateRemiseDiplome:new Date(),
      studentId:"",
      numCIN:"",
      diplomaHash:"",
      fileHash:"",
      buffer: null,
      fileUrl: "",
      instituteInfo: {},
      institute: [],
      selectedDepartment: '',
      qrCodeUrl:null
    };
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUrlClick=this.handleUrlClick.bind(this);
    this.handleDepartmentChange=this.handleDepartmentChange.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.handleGradutionDate=this.handleGradutionDate.bind(this);
    this.sendNotificationToInstitute=this.sendNotificationToInstitute.bind(this);
    
  }
  getFileUrlFromIPFS = async (hash) => {
    try {
      const response = await axios.get(`http://localhost:5000/getFileUrlFromIPFS/${hash}`);
      return (response.data.url);
    } catch (error) {
      console.error('Error fetching file URL from IPFS:', error);
    }
  };
 uploadFileToIPFS = async (file) => {
	try {
	  const formData = new FormData();
	  formData.append('file', file);
  
	  // Make a POST request to the server's upload file endpoint
	  const response = await axios.post('http://localhost:5000/uploadFileToIPFS', formData, {
		headers: {
		  'Content-Type': 'multipart/form-data'
		}
	  });
  
	  // If the request is successful, return the IPFS hash of the uploaded file
	  return response.data.hash;
	} catch (error) {
	  // Handle errors, such as network issues or server errors
	  console.error('Error uploading file:', error);
	  throw new Error('Failed to upload file');
	}
  };
  handleChange(date) {
    this.setState({
      date_of_birth:date
    });
  }
  handleGradutionDate(date) {
    this.setState({
      dateRemiseDiplome:date
    });
  }

  handleFileSelect = async (e) => {
    e.preventDefault();
    //accéder à la liste des fichiers
    const file = e.target.files[0];
    //utilise FileReader pour lire le contenu du fichier
    const reader = new window.FileReader();
    //lire le contenu du fichier sous forme de tableau d'ocet(ArrayBuffer)
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      //le contenu de fichier est lu et stocké dans fileBuffer en utilisant arrayBuffer()
      const fileBuffer = await file.arrayBuffer();
      //blob:type de données binaire qui permet de stocker des données de taille importante :images,video..
      const buffer = new Blob([fileBuffer], { type: file.type });
      this.setState({ buffer });
      console.log("buffer", buffer);
      
      // Appel de la fonction d'upload de fichier pour ajouter le fichier à IPFS
      const fileHash = await this.uploadFileToIPFS(file, "5cb213825901858442a4", "c1d4aa1cd6337b8f3cf3c4bc18bb9de93c3d709b0175e594cdba0b94069a6982");
  
      // Stockage du hash IPFS dans l'état local
      this.setState({ ipfsHash: fileHash });
      
      //affiche hash dans le console 
      console.log(
        `Fichier ajouté avec succès avec le hash IPFS : ${fileHash}`
      );
      const fileUrl = await this.getFileUrlFromIPFS(fileHash);
      // Stockage de l'URL dans l'état local
      this.setState({ fileUrl });
      // Affichage de l'URL dans la console
      console.log("L'URL du fichier est : ", fileUrl);
      
    };
  };

  sendNotificationToInstitute = async () => {
    const storageContract= await getContractInstanceInst();   
        if (!storageContract || !storageContract.instance) {
        console.error("Erreur lors de la récupération de l'instance du contrat");
        return;
        } const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const accountAddress = accounts[0]; 
        const email = await storageContract.instance.methods.getEmailFromAddress().call({ from: accountAddress });

    const templateParams = {
      to_email: email,
      message: 'A new diploma has been successfully added.'
  };
  
  emailjs.send('service_ts9gwnu', 'template_67607bd', templateParams, 'UBJPOXynwuM1qwZMP')
  .then((result) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });
  };

 
  
handleSubmit = async (event) => {
    event.preventDefault();
    
    const storageContract= await getContractInstanceInst();   
        if (!storageContract || !storageContract.instance) {
        console.error("Erreur lors de la récupération de l'instance du contrat");
        return;
        }
    const {institute,student_name,email,mention,numCIN,selectedDepartment}=this.state;
    // Expression régulière pour vérifier 8 chiffres
    const numCINRegex = /^\d{8}$/; 
    if (!numCINRegex.test(numCIN)) {
      alert("The CIN number must be composed of 8 digits!");
      return;
    }
    console.log(institute);
   

    const date_of_birth = this.state.date_of_birth.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const dateRemiseDiplome=this.state.dateRemiseDiplome.toLocaleDateString('fr-FR',{day:'2-digit' , month: '2-digit', year: 'numeric'});
    //condition que tout les chammps sont remplis
    if (!institute || !student_name || !email || !mention || !numCIN || !date_of_birth || !dateRemiseDiplome || !selectedDepartment) {
      alert("Please fill in all fields!");
      return;
    }
    const fileHash = this.state.ipfsHash;
    const diplomaId = nanoid();
    //gérer un qrcode
    const diplomaInfo = {
      id:diplomaId,
      instituteName: institute[institute.length - 1].name,
      department: this.state.selectedDepartment,
      studentName: student_name,
      email:email,
      dateOfBirth: date_of_birth,
      mention: mention,
      dateRemiseDiplome: dateRemiseDiplome,
      numCIN: numCIN,
      diplomaHash:fileHash
    };
    QRCode.toDataURL(JSON.stringify(diplomaInfo), (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      this.setState({ qrCodeUrl: url });
    });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const accountAddress = accounts[0]; 
        
    try{
      const addDiplome= await storageContract.instance.methods.addStudentForInstitute(accountAddress,diplomaInfo.instituteName,student_name,email,date_of_birth,mention,dateRemiseDiplome,numCIN,diplomaInfo.department,diplomaInfo.diplomaHash,diplomaInfo.id).send({
        from:accountAddress, 
        gas:1000000
      });
        if(addDiplome.status=== true){
          console.log("student added successfully");
          const existe = await storageContract.instance.methods.getStudentsForInstitute(accountAddress).call();
          console.log("student exist", existe);
          alert("L'étudiant a été ajouté avec succès !");

        }else{
          alert(" la transaction est échoué");
        }
    }catch (error){
      alert("erreur lors de l'ajout de l'etudient");
    }
    console.log(diplomaInfo);
  };
  handleUrlClick(e) {
    e.preventDefault();
    window.open(this.state.fileUrl, '_blank');
  }
  handleDepartmentChange = (event) => {
    this.setState({ selectedDepartment: event.target.value });
}

  async componentDidMount(){
    const storageContract = await getContractInstanceInst();
    if (!storageContract || !storageContract.instance) {
      console.error("Erreur lors de la récupération de l'instance du contrat");
    return;
  }


  const institute = [];
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  const accountAddress = accounts[0];
  const info = await storageContract.instance.methods.getMyInstitute().call({from: accountAddress}); 
  console.log("info",info);
  
  institute.push({
      name: info[2],
      diplomasRefs: info[6],
    });
    console.log(institute);
  this.setState({
    institute,
    instituteInfo: institute[institute.length - 1],
  });
}


    render(){
      const { instituteInfo } = this.state;
      console.log("instituteInfo",instituteInfo);
      console.log("instituteInfo.diplomasRef",instituteInfo.diplomasRefs);
    
        return(
          <>
          <main>
          <div  className="head-title">
          <h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>A</span>
              <span style={{color: '#EA4335'}}>d</span>
              <span style={{color: '#FBBC05'}}>d</span>{' '}
              <span style={{color: '#4285F4'}}>D</span>
              <span style={{color: '#34A853'}}>i</span>
              <span style={{color: '#EA4335'}}>p</span>
              <span style={{color: '#FBBC05'}}>l</span>
              <span style={{color: '#4285F4'}}>o</span>
              <span style={{color: '#EA4335'}}>m</span>
              <span style={{color: '#FBBC05'}}>a</span>
            </h1>
            </div>
                        <Card fluid centered>
                            <Card.Content>
                                <Form size='large' onSubmit={this.handleSubmit} className="register-diploma-form">
                                  <div>
                                      <label>Name:</label>
                                      <input type="text" value={instituteInfo.name} readOnly />
                                      </div>
                                  <div>
                                      <label>Diploma Ref:</label>
                                      <input onChange={this.handleDepartmentChange}></input>
                                      {/*<select onChange={this.handleDepartmentChange}>
                                        <option value="">-- Select diploma reference --</option>
                                        {instituteInfo.diplomasRefs && instituteInfo.diplomasRefs.map((department, index) => (
                                          <option key={index} value={department}>{department}</option>
                                        ))}
                                        </select> */}
                                  </div>
                                  <Form.Field required>
                                      <label >Student Name:</label>
                                        <input
                                            type='text'
                                            placeholder='student name'
                                            value={this.state.student_name}
                                            autoComplete="student name"
                                            onChange={e => this.setState({ student_name: e.target.value })}
                                        />
                                  </Form.Field>
                                  <Form.Field required>
                                      <label >Email:</label>
                                        <input
                                            type='text'
                                            placeholder='email'
                                            value={this.state.email}
                                            autoComplete="email"
                                            onChange={e => this.setState({ email: e.target.value })}
                                        />
                                  </Form.Field>
                                  <Form.Field required>
                                      <label >Date of birth</label>
                                         <DatePicker
                                            selected={this.state.date_of_birth}
                                            onChange={this.handleChange}
                                            dateFormat="dd/MM/yyyy"
                                         />
                                    
                                  </Form.Field>
                                    
                                  <Form.Field required>
                                       <label className='inline' htmlFor='mention'>Mention:</label>
                                           <select
                                              id='mention'
                                              name='mention'
                                              value={this.state.mention}
                                              onChange={(e) => this.setState({ mention: e.target.value })}
                                            >
                                                <option value=''>--Select a mention--</option>
                                                <option value='Fairly good honours'>Fairly good honours</option>
                                                <option value='Good honours'>Good honours</option>
                                                <option value='Very good honours'>Very good honours</option>
                                                <option value='Excellent honours'>Excellent honours</option>
                                                </select>
                                  </Form.Field>
                                  <Form.Field required>
                                       <label >Graduation date</label>
                                          <DatePicker
                                             selected={this.state.dateRemiseDiplome}
                                             onChange={this.handleGradutionDate}
                                             dateFormat="dd/MM/yyyy"
                                          />
                                       
  
                                  </Form.Field>
                                      <Form.Field required>
                                         <label >Num CIN:</label>
                                         <input
                                            type='text'
                                            placeholder='num cin'
                                            value={this.state.numCIN}
                                            autoComplete="numcin"
                                            onChange={e => this.setState({ numCIN: e.target.value })}
                                         />
                                  </Form.Field>
                                    
                                  <Form.Field>
                                       <label>Upload diploma file:</label>
                                       <input
                                          type='file'
                                          onChange={this.handleFileSelect}
                                       />
                                  </Form.Field>

                                    {this.state.fileUrl &&
                                    <div>
                                       <p>File URL:</p>
                                       <div className="file-url">
                                          <a href="#" onClick={this.handleUrlClick}>{this.state.fileUrl}</a>
                                       </div>
                                    </div>
                                     }

                                    <Form.Button secondary size='large' type='submit'>
                                      Register
                                    </Form.Button>
                                    {this.state.qrCodeUrl && (
                                      <div className="qr-code-container">
                                        <img src={this.state.qrCodeUrl} alt="Code QR" />
                                           </div>
                                    )}
            </Form>
          </Card.Content>
        </Card>
        </main>
</>
);
    }
    
}

export default AddDiploma; 