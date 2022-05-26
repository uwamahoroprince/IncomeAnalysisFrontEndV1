import React from "react";
import "./login.css";
import logo from "../../img/nlogo1.jpeg";
import { url } from "../../constants/url";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [userName, setUsetName] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url.authentication}`, {
        userName,
        password,
      });
      window.location.reload(false);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("logedUser", response.data.names);
      localStorage.setItem("logedEmail", response.data.email);
      console.log(response.data.userName);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="login-page bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1 ">
              <div className="bg-white shadow rounded ">
                <div className="row">
                  <div className="col-md-7 pe-0">
                    <div className="form-left h-100 py-5 px-5">
                      <form action="" className="row g-4">
                        <div className="col-12">
                          <label>
                            Username<span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <div className="input-group-text">
                              <i className="bi bi-person-fill"></i>
                            </div>
                            <input
                              type="text"
                              value={userName}
                              onChange={(userName) =>
                                setUsetName(userName.target.value)
                              }
                              className="form-control"
                              placeholder="Enter Username"
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <label>
                            Password<span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <div className="input-group-text">
                              <i className="bi bi-lock-fill"></i>
                            </div>
                            <input
                              type="password"
                              value={password}
                              onChange={(password) =>
                                setPassword(password.target.value)
                              }
                              className="form-control"
                              placeholder="Enter Password"
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <button
                            type="submit"
                            onClick={signIn}
                            className="btn btn-primary px-4 float-end mt-4"
                          >
                            login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-5 ps-0 d-none d-md-block">
                    <div className="form-right h-100  text-white text-center pt-5">
                      <img src={logo} alt="logo" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
