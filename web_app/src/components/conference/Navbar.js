import React, { useState } from "react";
import { FaHome, FaQuestionCircle } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { GiVideoConference } from "react-icons/gi";
import { IoMdContacts } from "react-icons/io";
import { MdAddCard, MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import "./navbar.css";


function Navbar() {
  const [button, setButton] = useState(true);
  console.log("button", button);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else setButton(true);
  };

  window.addEventListener("resize", () => {
    showButton();
  });

  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className="navbar1">
        <div className="navbar-container">
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              <FaHome />
              
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/conference" className="nav-links" onClick={closeMobileMenu}>
              <MdDashboard />
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/services"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                <GiVideoConference />
                My Conferences
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/services"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                <MdAddCard />
                Create Conference
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/services"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                <FaQuestionCircle />
               How It Works ?
              </Link>
            </li>
           
            <li className="nav-item">
              <Link
                to="/services"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                <FcAbout />
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/services"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                <IoMdContacts />
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/sign-up"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
               Connect Wallet
              </Link>
            </li>
          </ul>
         
        </div>
      </nav>
    </>
  );
}

export default Navbar;
