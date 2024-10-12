import React, { Component } from 'react';
import { FaEdit } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Card, Form } from 'semantic-ui-react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class HowItWork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      picture: null,
      Steps:[''],
      isEdit:false,
      StepId:'',
      titleStu: '',
      pictureStu: null,
      StepsStu:[''],
      isEdit:false,
      StepIdStu:'',
      titleConf: '',
      pictureConf: null,
      StepsConf:[''],
      isEdit:false,
      StepIdConf:'',
      showAddStepConf:false,
      showAddStepInst:false,
      showAddStepStu:false,
    };
    this.StepPic = React.createRef();
  }
  componentDidMount=async()=>{
    const url='http://localhost:5000/steps';
    const urlConf='http://localhost:5000/stepsConf';
    const urlStu='http://localhost:5000/stepsStu';
    try {
      const response = await fetch(url,
     { method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
      const responseConf = await fetch(urlConf,
     { method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
      const responseStu = await fetch(urlStu,
     { method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
      if (!response.ok) {
        throw new Error('Failed to fetch Steps');
      }
      const data=await response.json();
      const dataConf=await responseConf.json();
      const dataStu=await responseStu.json();
      console.log("data",data);
      console.log("data Conf",dataConf);
      console.log("data",dataStu);
      this.setState({Steps : data});
      this.setState({StepsConf : dataConf});
      this.setState({StepsStu : dataStu});
      console.log('Fetched Steps:', this.state.Steps);
      return data;
    } catch (error) {
      console.error('Error fetching Steps:', error);
      return null;
    }
  }
  sendAddStep= async () => {
    const {   title, picture } = this.state;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", picture);
    console.log('Form submitted with data:', { title, picture });
  
    const url = 'http://localhost:5000/steps';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to register Step');
      }
  
      const result = await response.text();
      console.log("result StepRegister", result);
      toast.success("Step added successfully !");
      this.setState({
        title: '',
      description: '',
      picture: null,
      Steps:[''],
      isEdit:false,
      StepId:'',
      SelectedIndex:0,
      });
      this.componentDidMount();
      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  /////////////////////edit 
  sendEditStep = async () => {
    const { title, picture, StepId } = this.state;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("picture", picture);
    console.log('Form submitted with data:', { title, picture, StepId });
  
    const url = `http://localhost:5000/steps/${StepId}`;
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to update Step');
      }
  
      const result = await response.json();
      console.log("result StepUpdate ", result);
      toast.success("Step Updated successfully !");
      this.setState({
        title: '',
        picture: null,
        Steps: [''],
        isEdit: false,
        StepId: ''
      });
      this.componentDidMount();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  handleDeleteStep= async (index) => {
    const sp=this.state.Steps[index];
    this.setState({
      StepId: sp._id,});
      console.log("this.state.StepId",this.state.StepId);
    const confirmDelete = window.confirm('Are you sure you want to delete the Step?');
    if (!confirmDelete) {
      return; // User clicked Cancel, so exit the function
    }
    const url = `http://localhost:5000/steps/${this.state.StepId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete Step');
      }
  
      const result = await response.text();
      console.log("result StepDelete ", result);
      toast.success("Step Deleted successfully !");
      // Refresh the list of Steps
      this.componentDidMount(); // Assuming fetchSteps is a function that fetches the list of Steps from the server
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  handleEdit = (index) => {
    this.setState({SelectedIndex:index});
    console.log('Edit Stepat index:', index);
    const sp=this.state.Steps[index];
    console.log("sp", sp);
    this.setState({
      StepId: sp._id,
      title: sp.title,
      picture: sp.picture,
    });
this.setState({isEdit:!this.state.isEdit});
    // Implement your logic to update the state or perform other actions
  };
  sendAddStepConf= async () => {
    const {   titleConf, pictureConf } = this.state;
    const formData = new FormData();
    formData.append("titleConf", titleConf);
    formData.append("image", pictureConf);
    console.log('Form submitted with data:', { titleConf, pictureConf });
    const url = 'http://localhost:5000/stepsConf';
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to register Step');
      }
  
      const result = await response.text();
      console.log("result StepRegister", result);
      toast.success("Step added successfully !");
      this.setState({
        titleConf: '',
      descriptionConf: '',
      pictureConf: null,
      StepsConf:[''],
      isEdit:!this.state.isEdit,
      StepIdConf:'',
      SelectedIndex:0,
      });
      this.componentDidMount();
      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  /////////////////////edit 
  sendEditStepConf = async () => {
    const { titleConf, pictureConf, StepIdConf } = this.state;
    const formData = new FormData();
    formData.append("title", titleConf);
    formData.append("picture", pictureConf);
    console.log('Form submitted with data:', { titleConf, pictureConf, StepIdConf });
  
    const url = `http://localhost:5000/stepsConf/${StepIdConf}`;
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to update Step');
      }
  
      const result = await response.json();
      console.log("result StepUpdate ", result);
      toast.success("Step Updated successfully !");
      this.setState({
        titleConf: '',
        pictureConf: null,
        StepsConf: [''],
        isEdit: false,
        StepIdConf: ''
      });
      this.componentDidMount();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  handleDeleteStepConf= async (index) => {
    const sp=this.state.StepsConf[index];
    this.setState({
      StepIdConf: sp._id,});
      console.log("this.state.StepId",this.state.StepIdConf);
    const confirmDelete = window.confirm('Are you sure you want to delete the Step?');
    if (!confirmDelete) {
      return; // User clicked Cancel, so exit the function
    }
    const url = `http://localhost:5000/stepsConf/${this.state.StepIdConf}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete Step');
      }
  
      const result = await response.text();
      console.log("result StepDelete ", result);
      toast.success("Step Deleted successfully !");
      // Refresh the list of Steps
      this.componentDidMount(); // Assuming fetchSteps is a function that fetches the list of Steps from the server
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  handleEditConf = (index) => {
    this.setState({SelectedIndex:index});
    console.log('Edit Stepat index:', index);
    const sp=this.state.StepsConf[index];
    console.log("sp", sp);
    this.setState({
      StepIdConf: sp._id,
      titleConf: sp.title,
      pictureConf: sp.picture,
    });
this.setState({isEdit:true});
    // Implement your logic to update the state or perform other actions
  };
  sendAddStepStu= async () => {
    const {   titleStu, pictureStu } = this.state;
    const formData = new FormData();
    formData.append("title", titleStu);
    formData.append("image", pictureStu);
    console.log('Form submitted with data:', { titleStu, pictureStu });
  
    const url = 'http://localhost:5000/stepsStu';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to register Step');
      }
  
      const result = await response.text();
      console.log("result StepRegister", result);
      toast.success("Step added successfully !");
      this.setState({
        titleStu: '',
      descriptionStu: '',
      pictureStu: null,
      StepsStu:[''],
      isEdit:false,
      StepIdStu:'',
      SelectedIndex:0,
      });
      this.componentDidMount();
      // Handle successful event registration (e.g., show success message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  /////////////////////edit 
  sendEditStepStu = async () => {
    const { titleStu, pictureStu, StepIdStu } = this.state;
    const formData = new FormData();
    formData.append("title", titleStu);
    formData.append("picture", pictureStu);
    console.log('Form submitted with data:', { titleStu, pictureStu, StepIdStu });
  
    const url = `http://localhost:5000/stepsStu/${StepIdStu}`;
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to update Step');
      }
  
      const result = await response.json();
      console.log("result StepUpdate ", result);
      toast.success("Step Updated successfully !");
      this.setState({
        titleStu: '',
        pictureStu: null,
        StepsStu: [''],
        isEdit: false,
        StepIdStu: ''
      });
      this.componentDidMount();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  handleDeleteStepStu= async (index) => {
    const sp=this.state.Steps[index];
    this.setState({
      StepId: sp._id,});
      console.log("this.state.StepId",this.state.StepId);
    const confirmDelete = window.confirm('Are you sure you want to delete the Step?');
    if (!confirmDelete) {
      return; // User clicked Cancel, so exit the function
    }
    const url = `http://localhost:5000/stepsStu/${this.state.StepId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete Step');
      }
  
      const result = await response.text();
      console.log("result StepDelete ", result);
      toast.success("Step Deleted successfully !");
      // Refresh the list of Steps
      this.componentDidMount(); // Assuming fetchSteps is a function that fetches the list of Steps from the server
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };
  handleEditStu = (index) => {
    this.setState({SelectedIndex:index});
    console.log('Edit Stepat index:', index);
    const sp=this.state.StepsStu[index];
    console.log("sp", sp);
    this.setState({
      StepIdStu: sp._id,
      titleStu: sp.title,
      pictureStu: sp.picture,
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
    this.setState({ pictureConf: file },() => {
        console.log("this.state.file", this.state.pictureConf);});
    this.setState({ pictureStu: file },() => {
        console.log("this.state.file", this.state.pictureStu);});
  }

  handleChange = (event, fieldName) => {
    this.setState({ [fieldName]: event.target.value });
  }
  addConfStep=()=>{
    this.setState({showAddStepConf:!this.state.showAddStepConf});
    this.setState({showAddStepInst:false});
    this.setState({showAddStepStu:false});
  }
  addInstStep=()=>{
    this.setState({showAddStepConf:false});
    this.setState({showAddStepInst:!this.state.showAddStepInst});
    this.setState({showAddStepStu:false});
  }
  addStuStep=()=>{
    this.setState({showAddStepConf:false});
    this.setState({showAddStepInst:false});
    this.setState({showAddStepStu:!this.state.showAddStepStu});
  }
  render() {
    const { title, description, picture,titleConf,titleStu,isEdit,Steps } = this.state;
    return (
      <main>
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

      <div  className="head-title">
            <div  className="left">
          <h1 className="google-search-heading">
           
              <span style={{color: '#4285F4'}}>H</span>
              <span style={{color: '#EA4335'}}>o</span>
              <span style={{color: '#FBBC05'}}>w</span>{" "}{" "}
              <span style={{color: '#4285F4'}}>I</span>
              <span style={{color: '#34A853'}}>t</span>{" "}{" "}
              <span style={{color: '#EA4335'}}>W</span>
              <span style={{color: '#4285F4'}}>o</span>
              <span style={{color: '#FBBC05'}}>r</span>
              <span style={{color: '#34A853'}}>k</span>
              <span style={{color: '#EA4335'}}>s</span>{" "}
              <span style={{color: '#4285F4'}}>?</span>
            </h1>
            <h4>What We Offer</h4>
            </div>
            </div>
       
       {this.state.showAddStepInst&& (<div className="hash" style={{ padding:"20px",margin:"20px" ,width:"95%"}}>
            
          <h2 style={{ color: "#576389" }}>{isEdit?"Update ":"Add "} Step for Institute</h2>
          <div className='signup'>
            <Card fluid centered>
              <Card.Content>
                <Form size='large' onSubmit={isEdit? this.sendEditStep:this.sendAddStep} enctype="multipart/form-data">

                  <Form.Field required className='add-departement'>
                    <h4>Step Id</h4>
                    {isEdit?(<input
                    style={{ backgroundColor:"#AFCFD5"}}
                      className="form-input1"
                      type='readOnly'
                      value={this.state.SelectedIndex + 1}
                     
                    />):(
                      <input
                    style={{ backgroundColor:"#AFCFD5"}}
                      className="form-input1"
                      type='readOnly'
                      value={Steps.length +1}
                     
                    />
                    )}
                     </Form.Field>
                     <h4>Step Description</h4>
                  <Form.Field required className='add-departement'>
                    
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Step Description'
                      value={title}
                      autoComplete="title"
                      onChange={(e) => this.handleChange(e, 'title')}
                      style={{ height:"80px" }}
                    />
                     </Form.Field>
            
                    <Form.Field required className='add-departement' style={{ marginBottom:"10px" }}>
                    <h4>Step Icon</h4>
                                  <input type="file"
            accept="image/*"  ref={this.StepPic}
        onChange={this.handleFileChange} 
       id="image" name="image" />
                                </Form.Field>
                  <button className="btn" type="submit" style={{left:"80%",position:"relative", backgroundColor:isEdit?"#FBBC05":"#576389" }}>{isEdit?"Update ":"Add "} Step</button>
                </Form>
              </Card.Content>
            </Card>
          </div>
        </div>)}
       {this.state.showAddStepConf&& (<div className="hash" style={{ padding:"20px",margin:"20px" ,width:"95%"}}>
            
          <h2 style={{ color: "#FD7238" }}>{isEdit?"Update ":"Add "} Step for Conferencier</h2>
          <div className='signup'>
            <Card fluid centered>
              <Card.Content>
                <Form size='large' onSubmit={isEdit? this.sendEditStepConf:this.sendAddStepConf} enctype="multipart/form-data">

                  <Form.Field required className='add-departement'>
                    <h4>Step Id</h4>
                    {isEdit?(<input
                    style={{ backgroundColor:"#FFE0D3"}}
                      className="form-input1"
                      type='readOnly'
                      value={this.state.SelectedIndex + 1}
                     
                    />):(
                      <input
                    style={{ backgroundColor:"#FFE0D3"}}
                      className="form-input1"
                      type='readOnly'
                      value={this.state.StepsConf.length +1}
                     
                    />
                    )}
                     </Form.Field>
                     <h4>Step Description</h4>
                  <Form.Field required className='add-departement'>
                    
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Step Description'
                      value={titleConf}
                      autoComplete="title"
                      onChange={(e) => this.handleChange(e, 'titleConf')}
                      style={{ height:"80px" }}
                    />
                     </Form.Field>
            
                    <Form.Field required className='add-departement' style={{ marginBottom:"10px" }}>
                    <h4>Step Icon</h4>
                                  <input type="file"
            accept="image/*"  ref={this.StepPic}
        onChange={this.handleFileChange} 
       id="image" name="image" />
                                </Form.Field>
                  <button className="btn" type="submit" style={{left:"80%",position:"relative", backgroundColor:isEdit?"#FBBC05":"#576389" }}>{isEdit?"Update ":"Add "} Step</button>
                </Form>
              </Card.Content>
            </Card>
          </div>
        </div>)}
       {this.state.showAddStepStu&& (<div className="hash" style={{ padding:"20px",margin:"20px" ,width:"95%"}}>
            
          <h2 style={{ color: "#FBCB25" }}>{isEdit?"Update ":"Add "} Step for Student</h2>
          <div className='signup'>
            <Card fluid centered>
              <Card.Content>
                <Form size='large' onSubmit={isEdit? this.sendEditStepStu:this.sendAddStepStu} enctype="multipart/form-data">

                  <Form.Field required className='add-departement'>
                    <h4>Step Id</h4>
                    {isEdit?(<input
                    style={{ backgroundColor:"#FFF2C6"}}
                      className="form-input1"
                      type='readOnly'
                      value={this.state.SelectedIndex + 1}
                     
                    />):(
                      <input
                    style={{ backgroundColor:"#FFF2C6"}}
                      className="form-input1"
                      type='readOnly'
                      value={this.state.StepsStu.length +1}
                     
                    />
                    )}
                     </Form.Field>
                     <h4>Step Description</h4>
                  <Form.Field required className='add-departement'>
                    
                    <input
                      className="form-input1"
                      type='text'
                      placeholder='Step Description'
                      value={titleStu}
                      autoComplete="title"
                      onChange={(e) => this.handleChange(e, 'titleStu')}
                      style={{ height:"80px" }}
                    />
                     </Form.Field>
            
                    <Form.Field required className='add-departement' style={{ marginBottom:"10px" }}>
                    <h4>Step Icon</h4>
                                  <input type="file"
            accept="image/*"  ref={this.StepPic}
        onChange={this.handleFileChange} 
       id="image" name="image" />
                                </Form.Field>
                  <button className="btn" type="submit" style={{left:"80%",position:"relative", backgroundColor:isEdit?"#FBBC05":"#576389" }}>{isEdit?"Update ":"Add "} Step</button>
                </Form>
              </Card.Content>
            </Card>
          </div>
        </div>)}
        {this.props.hideTable ? null : (<main>
            <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#D4DDEE" }}>
					<div  className="head">
						<h3>Steps List for Institutes</h3>
            <span style={{ fontSize:"16px" ,fontStyle:"underline"}} onClick={()=>this.addInstStep()}> Add Institute Step
            <IoIosAddCircle style={{ fontSize:"26px" }}/>
              </span>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Step Id</th>
								<th>Step Icon</th>
								<th>Step Description</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
            {this.state.Steps.map((Step, index) => {
    return (
      <tr key={index}>
        <td>{index+1}</td>
        <td>
          <img src={`../files/${Step.picture}`}></img>
        </td>
        <td>
          <p>{Step.title}</p>
        </td>
        <td>
        <span  onClick={() => this.handleEdit(index)}><FaEdit /></span>
        <span  onClick={() => this.handleDeleteStep(index)}><MdDelete /></span>
        </td>
      </tr>
    );
  })}
						</tbody>
					</table>
				</div>
				</div>
            <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#FFE0D3",color:"#FD7238"  }}>
					<div  className="head">
						<h3>Steps List for Conferenciers</h3>
            <span style={{ fontSize:"16px" ,fontStyle:"underline"}} onClick={()=>this.addConfStep()}> Add Conference Step
            <IoIosAddCircle style={{ fontSize:"26px" }}/>
              </span>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Step Id</th>
								<th>Step Icon</th>
								<th>Step Description</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
            {this.state.StepsConf.map((Step, index) => {
    return (
      <tr key={index}>
        <td>{index+1}</td>
        <td>
          <img src={`../files/${Step.pictureConf}`}></img>
        </td>
        <td>
          <p>{Step.titleConf}</p>
        </td>
        <td>
        <span  onClick={() => this.handleEditConf(index)}><FaEdit /></span>
        <span  onClick={() => this.handleDeleteStepConf(index)}><MdDelete /></span>
        </td>
      </tr>
    );
  })}
						</tbody>
					</table>
				</div>
				</div>
            <div  className="table-data">
				<div  className="order" style={{ backgroundColor:"#FFF2C6",color:"#FBCB25" }}>
					<div  className="head">
						<h3>Steps List for Verifiers</h3>
            <span style={{ fontSize:"16px" ,fontStyle:"underline"}} onClick={()=>this.addStuStep()}> Add Verifiers Step
            <IoIosAddCircle style={{ fontSize:"26px" }}/>
              </span>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Step Id</th>
								<th>Step Icon</th>
								<th>Step Description</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
            {this.state.StepsStu.map((Step, index) => {
    return (
      <tr key={index}>
        <td>{index+1}</td>
        <td>
          <img src={`../files/${Step.pictureStu}`}></img>
        </td>
        <td>
          <p>{Step.titleStu}</p>
        </td>
        <td>
        <span  onClick={() => this.handleEditStu(index)}><FaEdit /></span>
        <span  onClick={() => this.handleDeleteStepStu(index)}><MdDelete /></span>
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

export default HowItWork;
