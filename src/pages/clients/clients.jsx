import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import { url } from "../../constants/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Clients = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [status, setStatus] = useState(false);
  const handleSubmit = async (event) => {
    let response;
    event.preventDefault();

    try {
      if (!status) {
        response = await fetch(`${url.client}`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
          }),
        });
      } else {
        response = await fetch(`${url.client}/${updateId}`, {
          method: "PUT",
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
          }),
        });
      }
      status(false);
    } catch (error) {
      console.log(error);
    }
    setName("");
    setEmail("");
    setPhone("");
    setResponseMessage(response.statusText);
    toast(responseMessage);
    closeModal();
  };
  const getData = async () => {
    try {
      const clients = await axios.get(`${url.client}`);
      console.log(clients.data.data);
      setAllClients(clients.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteData = async (id) => {
    try {
      const client = await axios.delete(`${url.client}/${id}`);
      setResponseMessage(client.data.message);
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
              <h3 className="page-title">Clients</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Clients List</li>
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
                      <i data-feather="plus-circle"></i>Account
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
                        <th>email</th>
                        <th>phone</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allClients.length !== 0 ? (
                        allClients.map((data, index) => (
                          <tr>
                            <td>{data.name}</td>
                            <td className="text-primary">{data.email}</td>
                            <td>{data.phone}</td>
                            <td className="items-text">{data.createdAt}</td>
                            <td>
                              <span
                                onClick={() => {
                                  openModal();
                                  status(true);
                                  setUpdateId(data._id);
                                }}
                                className="btn btn-sm btn-white text-success me-2"
                              >
                                <i className="far fa-edit me-1"></i> Edit
                              </span>
                              <span
                                onClick={() => {
                                  deleteData(data._id);
                                }}
                                className="btn btn-sm btn-white text-danger"
                              >
                                <i className="far fa-trash-alt me-1"></i>
                                Delete
                              </span>
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
                  <h4 className="mb-0">Create New Clients</h4>
                </div>
              </div>
              <div className="modal-body">
                <div className="bank-inner-details">
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Account Name</label>
                        <input
                          required
                          value={name}
                          onChange={(name) => setName(name.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="Name of Clients"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Account Phone</label>
                        <input
                          required
                          value={phone}
                          onChange={(phone) => setPhone(phone.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="phone of Clients"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          required
                          value={email}
                          onChange={(email) => setEmail(email.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input required type="date" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>Description (Optional) </label>
                        <textarea
                          required
                          value={description}
                          onChange={(description) =>
                            setDescription(description.target.value)
                          }
                          className="form-control"
                          placeholder="More About Account"
                        ></textarea>
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
export default Clients;
