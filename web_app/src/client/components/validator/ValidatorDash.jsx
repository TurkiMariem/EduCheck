import React, { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import Home from '../../client/home/Home';
import Dashboard from './Dashboard';
import PendingDiploma from './PendingDiploma';
import StudentInformation from './StudentInformation';
import ValidatedDiploma from './ValidatedDiploma';
import ValidatorAccount from './ValidatorAccount';
import './style.css';
const ValidatorDash = () => {
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
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const renderContent = () => {
    switch (selectedItem) {
      case 'home':
        return <Home/>;
      case 'dashboard':
        return <Dashboard/>;
      case 'PendingDiploma':
        return <PendingDiploma/>;
      case 'ValidatedDiploma':
        return <ValidatedDiploma/>;
  
      case 'StudentInformations':
        return <StudentInformation/>;
      case 'account':
        return <ValidatorAccount/>;
      default:
        return  <Dashboard/>;
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
    <body>
    <section id="sidebar" className={isSidebarOpen ? '' : 'hide'}>
      <a href="#" className="brand">
        <img src="./images/casquette-diplome.png" style={{ width: "50px", margin: "10px" }} />
        <span style={{ fontFamily: "serif" }} className="text">DiplomaVerif</span>
      </a>
      <ul className="side-menu top">
        <li onClick={() => handleMenuItemClick('home')}>
          <NavLink to="/"className="link" >
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
        <li onClick={() => handleMenuItemClick('PendingDiploma')}>
          <NavLink className="link" activeClassName="active">
          <i  className='bx bx-timer' ></i>
            <span className="text">Pending Diploma</span>
          </NavLink>
        </li>
        <li onClick={() => handleMenuItemClick('ValidatedDiploma')}>
          <NavLink className="link" activeClassName="active">
          <i  className='bx bx-list-check' ></i>
            <span className="text">Validated Diploma</span>
          </NavLink>
        </li>
        <li onClick={() => handleMenuItemClick('StudentInformations')}>
          <NavLink className="link" activeClassName="active">
          <i  className='bx bx-file' ></i>
            <span className="text">Student Informations</span>
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
export default ValidatorDash;
