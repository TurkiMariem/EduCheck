import { ReactNavbar } from "overlay-navbar";
//import "overlay-navbar/ReactNavbar.min.css";
import React, { Component } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import { UpcomingConf } from "../components/conference/upcomingConf";
import Parallax from './Parallax';
import Footer from "./footer";
class Home extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      diplomaId: null,
      interfaceName: ''
    };
  }

render() {
  const { loggedIn, diplomaId } = this.state;
  function Link({ uri, text }) {
      return <a href={uri} target="_blank" rel="noreferrer">{text}</a>;
  }
  
    if(loggedIn){
      //naviguer à l'interface admin 
      if(this.state.interfaceName==="admin"){
        return<Navigate to ='/admin'/>;
        //naviguer à l'interface institute
      }else if (this.state.interfaceName==="institute"){
        return<Navigate to= '/institute'/>;
        //naviguer à l'interface verifier/id
      }else if (this.state.interfaceName==="validator"){
        return<Navigate to= '/validator'/>;
        //naviguer à l'interface verifier/id
      }else if (this.state.interfaceName==="conference"){
        return<Navigate to= '/conference'/>;
      }else if (this.state.interfaceName==="verifier" && diplomaId !== null){
        return <Navigate to= {`/verifier/${diplomaId}`}/>;
      }else{
        return <div>Invalid interface name.</div>;
      }
     }else{

  return (
   <>
   <ReactNavbar 
      burgerSize="15"
      burgerColor="white"
      burgerColorHover=""
      navColor1="#95B8D1"
      navColor2="#B8E0D2"
      navColor3="#F2E6C5"
      navColor4="#EFD2BE"
      logo="./images/logo.png"
      logoWidth="200px"
      logoHoverSize="15px"
      logoHoverColor="#B8E0D2"
      logoTransition="0.5"
      logoAnimationTime="1"
      link1Text="Login"
      link2Text="Verify"
      link3Text="Register"
      link4Text="Contact"
      link1Url="Login"
      link2Url="Verify"
      link3Url="Register"
      link4Url="Contact"
      link1Size="3vmax"
      link2Size="3vmax"
      link3Size="3vmax"
      link4Size="3vmax"
      link1Padding="1vmax"
      nav2justifyContent="flex-end"
      link1Margin="1vmax"
      link2Margin="0"
      link3Margin="0"
      link4Margin="1vmax"
      nav3justifyContent="flex-start"
      link1Color="#576389"
      link2Color="#576389"
      link3Color="#576389"
      link4Color="#576389"
      nav4justifyContent="flex-start"
      searchIconMargin="0.5vmax"
      cartIconMargin="1vmax"
      profileIconMargin="0.5vmax"
      searchIconColor="#121212"
      cartIconColor="#121212"
      profileIconColor="#121212"
      SearchIconElement={<FaSearch />}
    />
    <div className="parallax">
<Parallax/>
<UpcomingConf/>
<Footer/>
</div>

 </>)}}}
export default Home;