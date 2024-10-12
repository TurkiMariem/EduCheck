//import PushNotifications from '@pusher/push-notifications-web';
import React, { useEffect, useState } from 'react';
import { CgTemplate } from "react-icons/cg";
import { FaClipboardList, FaFilter, FaHome } from 'react-icons/fa';
import { GiDiploma } from "react-icons/gi";
import { IoIosPersonAdd } from 'react-icons/io';
import { MdFeaturedPlayList } from 'react-icons/md';
import { PiStudentBold } from "react-icons/pi";
import { RiFileAddFill } from 'react-icons/ri';
import { NavLink, useLocation } from 'react-router-dom';
import Home from '../../home/Home';
import DiplomaList from '../admin/DiplomaList';
import AddDiploma from './AddDiploma';
import Students from './AddMultipleDiploma';
import DashboardOfficer from './DashboardOfficer';
import Example from './FilterDiploma1';
import InstituteAccount from './InstituteAccount';
import Template from './Template';
import GenerateDiploma from './certificateGenerate';
import './style.css';
const InstituteDash = ({ initialSelectedItem}) => {
  const location = useLocation();
  //const { loggedIn, setLoggedIn, interfaceName, setInterfaceName, diplomaId, setDiplomaId } = useGlobalContext();
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);

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
  });
  const [selectedItem, setSelectedItem] = useState(initialSelectedItem);
  const renderContent = () => {
    switch (selectedItem) {
      case 'home':
        return <Home/>;
      case 'dashboard':
        return <DashboardOfficer/>;
      case 'addDiploma':
        return <AddDiploma/>;
      case 'Students':
        return <Students/>;
      case 'filterDiploma':
        return <Example/>;
      case 'diplomaList':
        return  <DiplomaList/>;
      case 'account':
        return  <InstituteAccount/>;
      case 'addStudents':
        return  <InstituteAccount/>;
      case 'diplomaTemplates':
        return  <Template/>;
      case 'diplomaGenerate':
        return  <GenerateDiploma/>;
      default:
        return  <DashboardOfficer/>;
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
 /* useEffect(() => {
    const emailoff=localStorage.getItem('emailOff')
    axios.get(`http://localhost:3000/generate-beams-token?userId=${emailoff}`)
      .then(response => {
        const beamsClient = new PushNotifications.Client({
          instanceId: '4e1c5286-875a-4d3f-934c-205103f25516',
        });

        beamsClient.start()
          .then(() => beamsClient.setUserId(emailoff, {
            tokenProvider: {
              fetchToken: () => response.data.token,
            },
          }))
          .then(() => console.log('Successfully registered and subscribed!'))
          .catch(console.error);

        beamsClient.on('notification', (payload) => {
          console.log('Received notification:', payload);
          // Handle the notification (e.g., show a toast or update the UI)
        });

        return () => {
          beamsClient.stop();
        };
      })
      .catch(console.error);
  }, []); */
  return (
    <>
    <body>
    <section id="sidebar" className={isSidebarOpen ? '' : 'hide'}>
      <a href="#" className="brand">
        <img src="./images/casquette-diplome.png" style={{ width: "50px", margin: "10px" }} />
        <span style={{ fontFamily: "serif" }} className="text">EduCheck</span>
      </a>
      <ul className="side-menu top" >
        <li onClick={() => handleMenuItemClick('home')}>
          <NavLink to="/"className="link"  activeClassName="active">
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
        <li onClick={toggleDropdown1} className="dropdown-wrapper" activeClassName="active">
          <NavLink className="link" activeClassName="active">
            <PiStudentBold className='bx' />
            <span className="text">Students</span>
          </NavLink>
          {isDropdownOpen1 && (
            <ul className="dropdown-menu" activeClassName="active">
              <li onClick={() => handleMenuItemClick('addStudents')}>
          <NavLink style={{ backgroundColor:"#D4DDEE" }} className="link" >
            <IoIosPersonAdd className='bx' />
            <span className="text">Add Students</span>
          </NavLink>
        </li>
              <li onClick={() => handleMenuItemClick('addDiploma')}>
          <NavLink style={{ backgroundColor:"#D4DDEE" }} className="link" >
            <RiFileAddFill className='bx' />
            <span className="text">Add Diploma</span>
          </NavLink>
        </li>
              <li onClick={() => handleMenuItemClick('Students')}>
          <NavLink style={{ backgroundColor:"#D4DDEE" }} className="link" >
            <FaClipboardList className='bx' />
            <span className="text">Students List</span>
          </NavLink>
        </li>
              <li onClick={() => handleMenuItemClick('diplomaList')}>
          <NavLink style={{ backgroundColor:"#D4DDEE" }} className="link" >
            <MdFeaturedPlayList className='bx' />
            <span className="text">Diploma List</span>
          </NavLink>
        </li>
              <li onClick={() => handleMenuItemClick('filterDiploma')}>
          <NavLink style={{ backgroundColor:"#D4DDEE" }} className="link" activeClassName="active" >
            <FaFilter className='bx' />
            <span className="text">Filter Diploma</span>
          </NavLink>
        </li>
             
            </ul>
          )}
        </li>
        <li onClick={() => handleMenuItemClick('diplomaGenerate')}>
          <a className="link">
            <GiDiploma className='bx' />
            <span className="text">Diploma Generate</span>
          </a>
        </li>
        <li onClick={() => handleMenuItemClick('diplomaTemplates')} activeClassName="active">
          <a className="link">
            <CgTemplate className='bx' />
            <span className="text">Diploma Templates</span>
          </a>
        </li>
      </ul>
		<ul  className="side-menu">
    <li onClick={() => handleMenuItemClick('account')} >
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
			<input type="checkbox" id="switch-mode" hidden />
			<label htmlFor="switch-mode"  className="switch-mode"></label>
			<a href="#"  className="notification">
				<i  className='bx bxs-bell' ></i>
				<span  className="num">8</span>
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
export default InstituteDash;
