// import { response } from 'express';
import React from 'react';
import '../components/conference/style.css';

import './VerifyDiploma.css';
function VerifyDiplomaNotFound() {
    return (<div>

     <div className="verify-diploma-container ">
      <h1 style={{ color: '#CCE0EC' }}>Diploma Verification For ID : </h1>
      <h4 style={{ color: '#CCE0EC' }}></h4>
      <div className="content-container" style={{ display:'flex',flex: 1}}>
        <div id="contentV">
          <h1>Diploma Not registred </h1>
          <img src={"../certifNotValide.png"}></img>
          </div>
          </div>
          </div>
      </div>)
  }
  

export default VerifyDiplomaNotFound;
