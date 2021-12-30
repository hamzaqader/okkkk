import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './sidebardata';
import '../comp2/navbar.css';
import { IconContext } from 'react-icons';
import MenuItem from "@mui/material/MenuItem";
import { useLocation, useNavigate } from "react-router";
import Menu from "@mui/material/Menu";
import {  auth,
  onAuthStateChanged,
  signOut,
  ref,
  db,
  onChildAdded, } from "../config/firebase";


function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [userLogin, setUserLogin] = useState(false);
const [loader, setLoader] = useState(false);
const [userList, setUserList] = useState([]);
const [userData, setUserData] = useState({});
  const showSidebar = () => setSidebar(!sidebar);
 const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign out");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(location.state);
      } else {
        navigate("/");
      }
    });
  }, []);
  return (
    <>
    {loader ? (
        <h1>Loading...</h1>
      ) : (
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
         
         <p style={{color:"white",fontWeight:"bold",fontStyle:"italic",margin:"10px auto",fontSize:20}}>IOT BASED CATTLE FARM MANAGMENT SYSTEM</p>
         <button onClick={logout}>logout</button>
        </div>

        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
      )}
    </>
  );
}

export default Navbar;