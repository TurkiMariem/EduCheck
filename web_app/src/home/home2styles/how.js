import React, { Component } from "react";
import './how.css';
class How extends Component{
    constructor(props) {
        super(props);
        this.state = {
          title: '',
          picture: null,
          Steps:[],
          StepsConf:[],
          isEdit:false,
          StepId:''
        };
        this.StepPic = React.createRef();
      }
    componentDidMount=async()=>{
        try {
          const response = await fetch(`http://localhost:5000/Steps`,
         { method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
          const response1 = await fetch(`http://localhost:5000/StepsConf`,
         { method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
          if (!response.ok) {
            throw new Error('Failed to fetch Steps');
          }
          const data=await response.json();
          const dataConf=await response1.json();
          console.log("data",data);
          this.setState({Steps : data});
          this.setState({StepsConf : dataConf});
          console.log('Fetched Steps home:', this.state.Steps);
          return data;
        } catch (error) {
          console.error('Error fetching Steps:', error);
          return null;
        }
      }
    render() {
        return(
<>
<div className='how'>
<div class="row" style={{ display:"flex",justifyContent:"center",alignItems:"center" }}>
                <div class="col-md-12">
                    <div class="site-heading text-center" style={{ color:"#fff" }}>
                        <h2>How It <span style={{ color:"#AFCFD5" }}>Works ?</span></h2>
                        <h3>Steps for Institutes</h3>
</div>
</div>
</div>
<div className="rowHow">
        {this.state.Steps.map((step, index) => (
          <div className="box" key={index}>
            <div className="icon">{index + 1}</div>
            <img src={`./files/${step.picture}`}width={"150px"}></img>
            <div className="content" style={{ color:"#758EBC" }}>{step.title}</div>
</div>
        ))}
</div>
      <div class="row" style={{ display:"flex",justifyContent:"center",alignItems:"center" }}>
                <div class="col-md-12">
                    <div class="site-heading text-center" style={{ color:"#fff" ,marginTop:"50px"}}>
                        <h3>Steps for Conferenciers</h3>

</div>
</div>
</div>
<div className="rowHow">
        {this.state.StepsConf.map((step, index) => (
          <div className="box" key={index}>
            <div className="icon">{index + 1}</div>
            <img src={`./files/${step.pictureConf}`}width={"150px"}></img>
            <div className="content" style={{ color:"#758EBC" }}>{step.titleConf}</div>
</div>
        ))}
</div>
      
</div>
</>
        )}}
        export default How;