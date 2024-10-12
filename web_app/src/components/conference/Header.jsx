import React, { useState } from 'react';
import Navbar from './Navbar';
import './header.css';
const Header = () => {
  const [navbar, setnavbar] = useState(false);
  return (
    <div style={{ display:"flex",justifyContent:"space-between" }}>
         <img src="./images/logo.png" style={{ width:"150px",zIndex:100 }} onClick={() => setnavbar(!navbar)}></img>
      <div style={{ zIndex:90 }}>
      {navbar && <Navbar/>}
        </div>  
      
   {/* <ul className='headerMenu'>
        <li>Home</li>
        <li>Conferences</li>
        <li>Agenda</li>
        <li>Plans</li>
        <li>Why Us ?</li>
        <li>About</li>
        <li>Contact</li>
  </ul> */}
    </div>
  )
}

export default Header