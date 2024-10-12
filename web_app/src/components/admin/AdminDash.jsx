import React, { useEffect, useState } from 'react';
import { BiSolidInstitution } from "react-icons/bi";
import { FaHome, FaQuestionCircle } from 'react-icons/fa';
import { GiDiploma, GiVideoConference } from "react-icons/gi";
import { LiaCertificateSolid } from "react-icons/lia";
import { MdAccountBalance, MdAddToHomeScreen, MdDelete } from "react-icons/md";
import { NavLink } from 'react-router-dom';
//import Home from '../../home/Home';
import { FcCollaboration } from 'react-icons/fc';
import { GrTableAdd } from 'react-icons/gr';
import { RiCustomerService2Line } from 'react-icons/ri';
import AddInstitute from './AddInstitute';
import AdminAccount from './AdminAccount';
import CertificateList from './CertificateList';
import BoostRequests from './ConferenceBoost';
import ConferenceList from './ConferenceList';
import Dashboard from './DashboardAdmin';
import DiplomaList from './DiplomaList';
import HandleAccounts from './HandleAccounts';
import HowItWork from './HowItWorks';
import SelectInstitute from './SelectInstitute';
import Collaborators from './collaborators';
import FeedbackBoost from './feedbacks';
import Services from './services';
import './styleAdmin.css';
const AdminDash = ({children}) => {
	const [isOpenInstitutes, setIsOpenInstitutes] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifSection, setNotifSection] = useState(false);
  const toggleDropdown = () => {
    setIsOpenInstitutes(!isOpenInstitutes);
  };
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const [showChoices, setShowChoices] = useState(false);
    const toggleChoices = () => {
      setShowChoices(!showChoices);
    };
    const fetchNotifications = async (server) => {
      try {
        const response = await fetch(`http://localhost:5000/notifications?from=${server}`);
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
    })
    fetchNotifications("eduCheck Server")
  },[]);
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
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const renderContent = () => {
    switch (selectedItem) {
      case 'home':
        return <Dashboard/>;
      case 'dashboard':
        return <Dashboard/>;
      case 'addInstitute':
        return <AddInstitute/>;
      case 'selectInstitute':
        return <SelectInstitute/>;
      case 'conferences':
        return <ConferenceList />;
      case 'boost':
        return <BoostRequests />;
      case 'feedback':
        return <FeedbackBoost />;
      case 'diplomas':
        return <DiplomaList/>;
      case 'Certificates':
        return <CertificateList/>;
        case 'How It Works ?':
        return <HowItWork />;
      case 'services':
        return <Services />;
      case 'Collaborators':
        return <Collaborators />;
      case 'accounts':
        return <HandleAccounts />;
      case 'account':
        return <AdminAccount />;
      default:
        return <Dashboard />;
    }
  };
  const handleMenuItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <>
    <body>
    <section id="sidebar" className={isSidebarOpen ? '' : 'hide'} style={{ position:"absolute" }}>
		<a href="#"  className="brand">
        <img src="./images/casquette-diplome.png" style={{width:"50px",margin:"10px"}}/>
			<span style={{ fontFamily:"serif"}} className="text">EduCheck</span>
		</a>
		<ul className="side-menu top" >    
			<li onClick={() => handleMenuItemClick('home')}>
            <NavLink to="/" className="link" activeClassName="active">
            <FaHome className='bx'/>
            <span  className="text">Home</span>
            </NavLink>
			</li>
			<li className="active" onClick={() => handleMenuItemClick('dashboard')}>
			<a className="link" activeClassName="active">
            <i  className='bx bxs-dashboard' ></i>
            <span  className="text">Dashboard</span>
			</a>
			</li>
			<li >
            <a className="link" activeClassName="active" onClick={()=>handleMenuItemClick('addInstitute')}>
            <BiSolidInstitution className='bx' />
            <span  className="text">Institutes</span>
            </a>
			{isOpenInstitutes && (
        <ul style={{ position:"relative" }} >
          <li onClick={() => handleMenuItemClick('addInstitute')}>
           <a className="link" activeClassName="active">Add Institute</a>
		   <BiSolidInstitution className='bx' />
          </li>
          <li onClick={() => handleMenuItemClick('selectInstitute')}>
            <a className="link" activeClassName="active">Select Institute</a>
			<BiSolidInstitution className='bx' />
          </li>
        </ul>
      )}
			</li>
			<li onClick={() => handleMenuItemClick('conferences')}>
            <a className="link" activeClassName="active">
            <GiVideoConference className='bx' />
            <span  className="text">Conferences</span>
            </a>
			</li >
			<li onClick={() => handleMenuItemClick('boost')}>
            <a className="link" activeClassName="active">
            <GrTableAdd className='bx' />
            <span  className="text">Boost Requests</span>
            </a>
			</li >
			<li onClick={() => handleMenuItemClick('feedback')}>
            <a className="link" activeClassName="active">
            <MdAddToHomeScreen className='bx' />
            <span  className="text">Boost Feedbacks</span>
            </a>
			</li >
			<li  onClick={() => handleMenuItemClick('diplomas')} >
            <a className="link" activeClassName="active">
            <GiDiploma className='bx' />
            <span  className="text">Diplomas</span>
            </a>
			</li>
			<li  onClick={() => handleMenuItemClick('Certificates')} >
            <a className="link" activeClassName="active">
            <LiaCertificateSolid className='bx' />
            <span  className="text">Certificates</span>
            </a>
			</li>
      <li  onClick={() => handleMenuItemClick('How It Works ?')} >
            <a className="link" activeClassName="active">
            <FaQuestionCircle className='bx' />
            <span  className="text">How It Works ?</span>
            </a>
			</li>
			<li  onClick={() => handleMenuItemClick('services')} >
            <a className="link" activeClassName="active">
            <RiCustomerService2Line className='bx' />
            <span  className="text">Services</span>
            </a>
			</li>
			<li  onClick={() => handleMenuItemClick('Collaborators')} >
            <a className="link" activeClassName="active">
            <FcCollaboration className='bx' />
            <span  className="text">Collaborators</span>
            </a>
			</li>
			<li  onClick={() => handleMenuItemClick('accounts')} >
            <a className="link" activeClassName="active">
            <MdAccountBalance className='bx' />
            <span  className="text">Accounts</span>
            </a>
			</li>
		</ul>
		<ul  className="side-menu" style={{ position:"relative" }}>
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
	<section id="content" className='con'>
		<nav>
        <i class='bx bx-menu' onClick={toggleSidebar} ></i>
            			<a href="#"  className="nav-link">Institues</a>
			<form action="#">
				<div  className="form-input">
					<input type="search" placeholder="Search..." />
					<button type="submit"  className="search-btn"><i  className='bx bx-search' ></i></button>
				</div>
			</form>
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
        <span>{notification.from}</span>
        {notification.content}<MdDelete style={{ fontSize:"25px" }} onClick={()=>deleteNotification(notification._id)} /> </div> </li>;
    })}
  </ul>
)}

			</a>
			<a href="#"  className="profile">
				<img src="./images/people.png"/>
			</a>
		</nav>
		{renderContent()}
	</section>
	
    </body>
    </>
  )}
export default AdminDash;
