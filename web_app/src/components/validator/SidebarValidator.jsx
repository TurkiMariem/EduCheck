import React from "react";
import {
    FaBars,
    FaHome,
    FaList
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
const SidebarValidator = ({children})=>{
    const menuItem=[
        {
            path:'/',
            name:'HomePage',
            icon: <FaHome className="nav-logo-color" />,
            className: 'home-icon'
        },
        
        {
            path:'/listPendingDiploma',
            name:'List Pending Diploma',
            icon: <FaList className="list-icon-color" />,
            className: 'list-icon'

        },
        {
            path:'/ListDiplomabis',
            name:'List Validated Diploma',
            icon:<FaList className="list-icon-color"/>,
            className:'list-icon'
        }
    ];
    const style = {
        paddingRight: '200px'
    }
    
    
    return(
        <div style={style}>
        <div className="container">
            <div className="sidebare">
                <div className="top_section">
                   <h1 className="logo">Institute: Validator</h1>
                   <div className="bars">
                    <FaBars/>
                   </div>
                </div>
                {
                    menuItem.map((item, index)=>(
                        <NavLink to={item.path} key={index} className="link" activeclassName="active">
                            <div className={`link_container ${item.className}`}>
                                {item.icon}
                                <div className="link_text">{item.name}</div>
                            </div>
                        </NavLink>
                    ))
                }
                
            </div>
            <main>{children}</main>
            
        </div>
       
       </div>
    );
};
export default SidebarValidator;