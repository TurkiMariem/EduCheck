import React, { useState } from "react";
import { AiOutlinePlus } from 'react-icons/ai';
import {
    FaBars,
    FaHome,
    FaList
} from "react-icons/fa";
import '../../Sidebar.css';

import { NavLink } from "react-router-dom";
const SidebarInstitute = ({children})=>{
    const menuItem=[
        {
            path:'/',
            name:'HomePage',
            icon: <FaHome className="nav-logo-color" />,
            className: 'home-icon'
        },
        {
            name:'AddDiploma',
            icon: <AiOutlinePlus className="add-icon-color" />,
            className: 'add-icon',
            choices: [
                {
                  name: 'Add Diploma',
                  path: '/addDiploma',
                  icon: <AiOutlinePlus className="add-icon-color" />,
                  className: 'add-icon',
                },
                {
                  name: 'Add Multiple',
                  path: '/addMultipleDiploma',
                  icon: <AiOutlinePlus className="add-icon-color" />,
                  className: 'add-icon',
                }
              ]
        },

        {
            path:'/listDiploma',
            name:'ListDiploma',
            icon: <FaList className="list-icon-color" />,
            className: 'list-icon'

        },
        {
            path:'/filterDiploma',
            name:'FilterDiploma',
            icon:<FaList className="list-icon-color"/>,
            className:'list-icon'
        }
    ];
    const style = {
        paddingRight: '200px'
    }
    const [showChoices, setShowChoices] = useState(false);

  const toggleChoices = () => {
    setShowChoices(!showChoices);
  };
    
    return(
        <div style={style}>
        <div className="container">
            <div className="sidebare">
                <div className="top_section">
                   <h1 className="logo">Institute</h1>
                   <div className="bars">
                    <FaBars/>
                   </div>
                </div>
                {
                    <ul>
                    {menuItem.map((item, index) => (
                        <li key={index}>
                        {item.choices ? (
                            <div className="dropdown">
                                <div
                                    
                                    className={`link_container ${item.className}`}
                                    onClick={toggleChoices}
                                >
                                {item.icon}
                                <div className="link_text">{item.name}</div>
                                </div>
                            {showChoices && (
                                <ul className="dropdown-content">
                                    {item.choices.map((choice, choiceIndex) => (
                                        <li key={choiceIndex}>
                                            <NavLink to={choice.path} className="link" activeClassName="active">
                                                {choice.name}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        ) : (
                            <NavLink to={item.path} className="link" activeClassName="active">
                                <div className={`link_container ${item.className}`}>
                                    {item.icon}
                                    <div className="link_text">{item.name}</div>
                                </div>
                            </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
                }
                
            </div>
            <main>{children}</main>
            
        </div>
       
       </div>
    );
};
export default SidebarInstitute;