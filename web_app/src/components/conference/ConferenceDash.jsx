import React, { useEffect, useState } from 'react';
import { FaHome, FaUserFriends } from 'react-icons/fa';
import { GiDiploma, GiVideoConference } from "react-icons/gi";
import { MdDelete, MdFeedback, MdOutlineSupportAgent } from 'react-icons/md';
import { SiCreatereactapp } from "react-icons/si";
import { TbCertificate } from "react-icons/tb";
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Certificate from './Certificate';
import ConferenceDetailsSection from './ConferenceDetailsSection';
import CreateConference from './CreateConference';
import DashboardConf from './DashboardConference';
import MyConferences from './MyConferences';
import Organizers from './Organizers';
import Participants from './Participants';
import Speakers from './Speakers';

import axios from 'axios';
import CertificateTable from './CertificateTable';
import GenerateCertificate from './certificateGenerate';
import CertificateTemplate from './certificateTemplate';
import './style.css';
const ConferenceDash = ({selectedItem: initialSelectedItem}) => {
  //const { loggedIn, setLoggedIn, interfaceName, setInterfaceName, diplomaId, setDiplomaId } = useGlobalContext();
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifSection, setNotifSection] = useState(false);
  const confEmail=localStorage.getItem('confEmail');

  const toggleDropdown1 = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
  };
  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const [showChoices, setShowChoices] = useState(false);
    const toggleChoices = () => {
      setShowChoices(!showChoices);
    };
    const fetchNotifications = async (confEmail) => {
      try {
        const response = await fetch(`http://localhost:5000/notifications?to=${confEmail}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
        console.log("notifications",data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };


  useEffect(() => {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
    allSideMenu.forEach(item=> {
        const li = item.parentElement;
        item.addEventListener('click', function () {
            allSideMenu.forEach(i=> {
                i.parentElement.classList.remove('active');
            })
            li.classList.add('active');
        })
    });
    // TOGGLE SIDEBAR
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');
    
    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
    })
    const searchButton = document.querySelector('#content nav form .form-input button');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');
    searchButton.addEventListener('click', function (e) {
        if(window.innerWidth < 576) {
            e.preventDefault();
            searchForm.classList.toggle('show');
            if(searchForm.classList.contains('show')) {
                searchButtonIcon.classList.replace('bx-search', 'bx-x');
            } else {
                searchButtonIcon.classList.replace('bx-x', 'bx-search');
            }
        }
    })
    if(window.innerWidth < 768) {
        sidebar.classList.add('hide');
    } else if(window.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
    window.addEventListener('resize', function () {
        if(this.innerWidth > 576) {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
            searchForm.classList.remove('show');
        }
    })
    const switchMode = document.getElementById('switch-mode');
    switchMode.addEventListener('change', function () {
        if(this.checked) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    });
    fetchNotifications(confEmail);
  },[]);
  const [selectedItem, setSelectedItem] = useState(initialSelectedItem);
  const renderContent = () => {
    switch (selectedItem) {
      case 'dashboard':
        return <DashboardConf/>;
      case 'createConference':
        return <CreateConference/>;
      case 'Speakers':
        return <Speakers/>;
      case 'Participants':
        return <Participants/>;
      case 'Organizers':
        return <Organizers/>;
      case 'Certificates':
        return <Certificate/>;
      case 'DisplayCertificates':
        return <CertificateTable/>;
      case 'myConferences':
        return <MyConferences/>;
        case 'conferenceDetailsSection':
          return <ConferenceDetailsSection />
        case 'Templates':
          return <CertificateTemplate />
        case 'generateCertificates':
          return <GenerateCertificate />
      default:
        return  <DashboardConf/>;
    }
  };
  const handleFeedbackClick = async () => {
    const name = localStorage.getItem('confEmail');
    const feedback = window.prompt('Write your feedback:');
    
    if (feedback) {
      try {
        const response = await axios.post('http://localhost:5000/feedbacks', { name: name, content: feedback, image: null });
  
        if (response.status === 201) {
          toast.success('Feedback submitted successfully!');
        } else {
          throw new Error('Failed to submit feedback');
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        toast.error('Failed to submit feedback.');
      }
    } else if (feedback === "") {
      toast.info('Feedback cannot be empty.');
    } else {
      toast.info('Feedback submission canceled.');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:5000/notifications/${notificationId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
  
      console.log('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  const handleMenuItemClick = (item) => {
    setSelectedItem(item);
  };
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const toggleAccount = () => {
    setIsOpenAccount(!isOpenAccount);
    console.log("opened");
  };
  return (
    <>
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
    <body>
    <section id="sidebar" className={isSidebarOpen ? '' : 'hide'}>
      <a href="#" className="brand">
        <img src="/images/casquette-diplome.png" style={{ width: "50px", margin: "10px" }} />
        <span style={{ fontFamily: "serif" }} className="text">EduCheck</span>
      </a>
      <ul className="side-menu top" >
        <li onClick={() => handleMenuItemClick('home')}>
          <NavLink to="/conferenceHome"className="link" >
            <FaHome className='bx' />
            <span className="text">Home</span>
          </NavLink>
        </li>
        <li onClick={() => handleMenuItemClick('dashboard')}>
          <NavLink className="link" activeClassName="active">
          <i  className='bx bxs-dashboard' ></i>
            <span className="text">Dashboard</span>
          </NavLink>
        </li>
        <li onClick={() => handleMenuItemClick('createConference')} className="dropdown-wrapper">
          <NavLink className="link">
            <SiCreatereactapp className='bx' />
            <span className="text">Create Conference</span>
          </NavLink>
        </li>
        <li onClick={() => handleMenuItemClick('myConferences')} className="dropdown-wrapper">
          <NavLink className="link">
            <GiVideoConference className='bx' />
            <span className="text">My Conferences</span>
          </NavLink>
        </li>
        <li onClick={() => handleMenuItemClick('Organizers')} className="dropdown-wrapper">
          <NavLink className="link">
            <FaUserFriends className='bx' />
            <span className="text">Organizers</span>
          </NavLink>
        </li>
        <li onClick={() => handleMenuItemClick('Speakers')} className="dropdown-wrapper">
          <NavLink className="link">
            <MdOutlineSupportAgent className='bx' />
            <span className="text">Speakers</span>
          </NavLink>
        </li>
        <li onClick={() => handleMenuItemClick('Participants')} className="dropdown-wrapper">
          <NavLink className="link">
            <MdOutlineSupportAgent className='bx' />
            <span className="text">Participants</span>
          </NavLink>
        </li>
        <li onClick={toggleDropdown1} className="dropdown-wrapper">
          <NavLink className="link">
            <GiDiploma className='bx' />
            <span className="text">Certificates</span>
          </NavLink>
          {isDropdownOpen1 && (
            <ul className="dropdown-menu" style={{ position:"absolute",top:"50px"}}>
              <li onClick={() => handleMenuItemClick('Certificates')}>
          <NavLink style={{ backgroundColor:"#D4DDEE" }} className="link" >
            <GiDiploma className='bx' />
            <span className="text">Certifie From XLSX File</span>
          </NavLink>
        </li>
              <li onClick={() => handleMenuItemClick('DisplayCertificates')}>
          <NavLink style={{ backgroundColor:"#D4DDEE" }} className="link" >
            <FaUserFriends className='bx' />
            <span className="text">See All Certificates</span>
          </NavLink>
        </li>
             
            </ul>
          )}
        </li>
        <li onClick={() => handleMenuItemClick('Templates')} className="dropdown-wrapper">
          <NavLink className="link">
            <TbCertificate className='bx' />
            <span className="text">Templates</span>
          </NavLink>
        </li>
        
      </ul>
		<ul  className="side-menu">
    <li onClick={() => handleMenuItemClick('account')}>
				<a href="#">
					<i  className='bx bx-user' ></i>
					<span  className="text">Account</span>
				</a>
			</li>
			<li onClick={() => handleMenuItemClick('settings')}>
				<a href="#">
					<i  className='bx bxs-cog' ></i>
					<span  className="text">Settings</span>
				</a>
			</li>
			<li onClick={() => handleMenuItemClick('logout')}>
				<a href="#"  className="logout">
					<i  className='bx bxs-log-out-circle' ></i>
					<span  className="text">Logout</span>
				</a>
			</li>
		</ul>
	</section>
	<section id="content">
		<nav>
        <i class='bx bx-menu' onClick={toggleSidebar} ></i>
            			<a href="#"  className="nav-link">Institues</a>
			<form action="#">
				<div  className="form-input">
					<input type="search" placeholder="Search..." />
					<button type="submit"  className="search-btn"><i  className='bx bx-search' ></i></button>
				</div>
			</form>
      <MdFeedback onClick={handleFeedbackClick} style={{ cursor: 'pointer', fontSize: '24px' }}/>
			<input type="checkbox" id="switch-mode" hidden />

			<label htmlFor="switch-mode"  className="switch-mode"></label>
			<a href="#"  className="notification">
				<i  className='bx bxs-bell' onClick={()=>setNotifSection(!notifSection)}></i>
        {/** notifications */}
				<span  className="num">8</span>
        {notifSection && (
  <ul style={{width:"300px", boxShadow: "0 8px 8px rgba(0,0,0,0.2)" , overflowY: "auto",height:"500px",backgroundColor: "#fff", position: "absolute", display: "flex", flexDirection: "column", top: "40px", right: "0px", padding: "10px", borderRadius: "5%" }}>
    {notifications.map((notification) => {
      let colorBack = "#E4E4E4";
      let colorFront = "#576389";
      let img='';
      if (notification.type === "rejected") {
        colorBack = "#F8C0BB";
        colorFront = "#9C2C23";
      } else if (notification.type === "approved") {
        colorBack = "#DDE5BF";
        colorFront = "#53BB6F";
      }
      if(notification.from ==="EduCheck Server"){
        img='./images/casquette-diplome.png';
      }
      return <li key={notification._id} style={{fontSize:"12px",display:"flex",flex:1,margin:"4px", padding:"10px",borderRadius:"5%",color: colorFront, backgroundColor: colorBack }}>
        <img src={img} width="40px" ></img>
        <div style={{display:"flex",flexDirection:"column"}}>
        <span style={{ fontSize:"20px" }}>{notification.from}</span>
        {notification.content}
        </div><MdDelete style={{ fontSize:"30px" }} onClick={()=>deleteNotification(notification._id)} /></li>;
    })}
  </ul>
)}

			</a>
      <div>
      <a href="#" className="profile" onClick={toggleAccount}>
        <img src="./images/people.png" alt="Profile" />
      </a>
      {isOpenAccount && (
        <div className="dropdown-account" style={{ width:"1000px",height:"1000px",position: "absolute", right: "10px", top: "0px", zIndex: 1000 }}>
            <ul className="dropdown-account" >
              <li onClick={() => handleMenuItemClick('account')}>
          <NavLink style={{ backgroundColor:"#D4DDEE" }}  to="/" className="link" >
            <FaHome className='bx' />
            <span className="text">Account</span>
          </NavLink>
        </li>
              <li onClick={() => handleMenuItemClick('settings')}>
          <NavLink style={{ backgroundColor:"#D4DDEE" }}  to="/" className="link" >
            <FaHome className='bx' />
            <span className="text">Settings</span>
          </NavLink>
        </li>
              <li onClick={() => handleMenuItemClick('logout')}>
          <NavLink style={{ backgroundColor:"#D4DDEE" }}  to="/" className="link" >
            <FaHome className='bx' />
            <span className="text">Logout</span>
          </NavLink>
        </li>
             
            </ul>
            </div>
          )}
          </div>
  
   
		</nav>
    {renderContent()}
	</section>
    </body>
    </>
  )}
export default ConferenceDash;
