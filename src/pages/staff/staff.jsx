import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import { url } from "../../constants/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Staff = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [status, setStatus] = useState(false);
  const handleSubmit = async (event) => {
    let response;
    event.preventDefault();

    try {
      if (!status) {
        response = await axios.post(`${url.register}`, {
          name,
          userName,
          password,
          email,
          role,
        });
      } else {
        response = await axios.put(`${url.register}/${updateId}`, {
          name,
          userName,
          password,
          email,
          role,
        });
      }
      setStatus(false);
      setResponseMessage(Math.floor(Math.random() * 10000));
    } catch (error) {
      console.log(error);
    }
    setName("");
    setUserName("");
    setPassword("");
    setEmail("");
    setRole("");
    setResponseMessage(response.statusText);
    toastify(response.message);
    closeModal();
  };
  function toastify(message) {
    toast(message);
  }
  const getData = async () => {
    try {
      const staff = await axios.get(`${url.register}`);
      const data = staff.data.data;
      setAllUsers(data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteData = async (id) => {
    try {
      const staff = await axios.delete(`${url.register}/${id}`);
      setResponseMessage(staff.data.message);
      toastify(staff.message);
    } catch (error) {
      console.log(error);
    }
  };
  const getSingleStaff = async (staffId) => {
    console.log("this is staff id", staffId);
    try {
      const response = await axios.get(`${url.register}/${staffId}`);
      const foundStaff = response.data.data;
      console.log(foundStaff);
      setName(foundStaff.name);
      setUserName(foundStaff.userName);
      setEmail(foundStaff.email);
      setRole(foundStaff.role);
      setStatus(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [responseMessage]);
  const customCatStyles = {
    content: {
      top: "10%",
      left: "30%",
      right: "20%",
      background: "#fff",
      opacity: 1,
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "2%",
      outline: "none",
    },
    overlay: {
      backgroundColor: "rgba(238, 228, 248, 0.80)",
    },
  };
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Staff</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Staff List</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-sm-2 pull-right card invoices-tabs-card">
          <div className="card-body card-body pt-0 pb-0">
            <div className="invoices-main-tabs border-0 pb-0">
              <div className="row align-items-center">
                <div className="col-lg-12 col-md-12">
                  <div className="invoices-settings-btn invoices-settings-btn-one">
                    <a
                      onClick={openModal}
                      href="#"
                      className="btn"
                      data-bs-toggle="modal"
                      data-bs-target="#add_items"
                    >
                      <i data-feather="plus-circle"></i>Staff
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-sm-11">
            <div className="card card-table">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-stripped table-hover datatable">
                    <thead className="thead-light">
                      <tr>
                        <th>Name</th>
                        <th>UserName</th>
                        <th>Email</th>
                        <th>Role</th>
                        {/* <th>PassWord</th> */}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.length !== 0 ? (
                        allUsers.map((data, index) => (
                          <tr>
                            <td>{data.name}</td>
                            <td>{data.userName}</td>
                            <td>{data.email}</td>
                            <td>{data.role}</td>
                            {/* <td>{data.password}</td> */}

                            <td>
                              <span
                                onClick={() => {
                                  openModal();
                                  setUpdateId(data._id);

                                  getSingleStaff(data._id);
                                }}
                                className="btn btn-sm btn-white text-success me-2"
                              >
                                <i className="far fa-edit me-1"></i> Edit
                              </span>
                              {/* <span
                                onClick={() => {
                                  deleteData(data._id);
                                }}
                                className="btn btn-sm btn-white text-danger"
                              >
                                <i className="far fa-trash-alt me-1"></i>
                                Delete
                              </span> */}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>no Data Found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customCatStyles}
          contentLabel="Example Modal"
        >
          <form
            className="modal-dialog modal-dialog-centered modal-lg"
            novalidate=""
          >
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header text-start mb-0">
                  <h4 className="mb-0">Create New Staff</h4>
                </div>
              </div>
              <div className="modal-body">
                <div className="bank-inner-details">
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Staff Name</label>
                        <input
                          required
                          value={name}
                          onChange={(name) => setName(name.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="Name of Staff"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          onChange={(role) => setRole(role.target.value)}
                          className="form-select form-control"
                        >
                          <option value="" selected disabled>
                            Select Role
                          </option>
                          <option value="admin">Admin</option>
                          <option value="receptionist">Receptionist</option>
                          <option value="manager">Manager</option>
                          <option value="financeManager">FinanceManager</option>
                          <option value="supervisor">Supervisor</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>User Name</label>
                        <input
                          required
                          value={userName}
                          onChange={(name) => setUserName(name.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="User Name of Staff"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Staff Password</label>
                        <input
                          required
                          value={password}
                          onChange={(password) =>
                            setPassword(password.target.value)
                          }
                          type="password"
                          className="form-control"
                          placeholder="Password of Staff"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>Staff Email</label>
                        <input
                          required
                          value={email}
                          onChange={(email) => setEmail(email.target.value)}
                          type="email"
                          className="form-control"
                          placeholder="Email of Staff"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row d-flex align-items-center justify-content-center">
                <div className="col-sm-2 bank-details-btn">
                  <a
                    onClick={closeModal}
                    className="btn btn-danger bank-cancel-btn"
                  >
                    Cancel
                  </a>
                </div>
                <div className=" col-sm-2 bank-details-btn">
                  <button
                    onClick={handleSubmit}
                    className="btn btn btn-success bank-save-btn"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};
export default Staff;
