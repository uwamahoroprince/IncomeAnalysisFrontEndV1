import React, { useState } from "react";
import logo from "../../../img/nlogo1.jpeg";

const TopBar = () => {
  const logOut = () => {
    try {
      localStorage.setItem("token", "");
      localStorage.setItem("role", "");
      localStorage.setItem("user", "");
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{ backgroundColor: "#3098ae" }}
        className="header border border-secondry"
      >
        <div className="header-left">
          <a href="#" className="logo">
            <img
              style={{ width: "100px", height: "150px" }}
              src={logo}
              alt="no logo"
            />
          </a>
        </div>

        {/* <a href="javascript:void(0);" id="toggle_btn">
          <i className="fas fa-bars"></i>
        </a> */}
        <a className="mobile_btn" id="mobile_btn">
          <i className="fas fa-bars"></i>
        </a>

        <ul className="nav nav-tabs user-menu">
          <li className="nav-item dropdown has-arrow main-drop">
            <a href="#" data-bs-toggle="dropdown">
              <span className="user-img">
                {/* <img src="assets/img/profiles/avatar-01.jpg" alt="" /> */}
                <span className="status online"></span>
              </span>
              <span>
                {!localStorage.getItem("loged")
                  ? " "
                  : localStorage.getItem("loged")}
              </span>
              <i
                style={{ color: "red" }}
                onClick={logOut}
                className="fa-solid fa-power-off"
              ></i>
            </a>
            {/* <div className="dropdown-menu">
              <a className="dropdown-item" href="profile.html">
                <i data-feather="user" className="me-1"></i> Profile
              </a>
              <a className="dropdown-item" href="settings.html">
                <i data-feather="settings" className="me-1"></i> Settings
              </a>
              <a className="dropdown-item" href="login.html">
                <i data-feather="log-out" className="me-1"></i> Logout
              </a>
            </div> */}
          </li>
        </ul>
      </div>
    </>
  );
};
export default TopBar;
