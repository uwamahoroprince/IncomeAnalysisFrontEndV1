import React, { useEffect, useState } from "react";
import { url } from "../../constants/url";
import axios from "axios";
import Modal from "react-modal/lib/components/Modal";
import { ToastContainer, toast } from "react-toastify";
const Activity = () => {
  const [name, setName] = useState("");
  const [amountPermonth, setAmountPermonth] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [allActiviteis, setAllActiviteis] = useState([]);
  const [updateId, setUpdateId] = useState("");

  const [status, setStatus] = useState(false);
  const handleSubmit = async (event) => {
    let response;
    event.preventDefault();

    try {
      if (!status) {
        response = await fetch(`${url.activity}`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            amountPermonth: amountPermonth,
          }),
        });
      } else {
        response = await fetch(`${url.activity}/${updateId}`, {
          method: "PUT",
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            amountPermonth: amountPermonth,
          }),
        });
      }
      status(false);
    } catch (error) {
      console.log(error);
    }
    setName("");
    setAmountPermonth("");
    setResponseMessage(response.statusText);
    toast(responseMessage);
    closeModal();
  };
  const getData = async () => {
    try {
      const accounts = await axios.get(`${url.activity}`);
      console.log(accounts.data.data);
      setAllActiviteis(accounts.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteData = async (id) => {
    try {
      const activity = await axios.delete(`${url.activity}/${id}`);
      setResponseMessage(activity.data.message);
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
              <h3 className="page-title">Activity</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Activity List</li>
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
                      <i data-feather="plus-circle"></i>Activity
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
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allActiviteis.length !== 0 ? (
                        allActiviteis.map((data, index) => (
                          <tr>
                            <td>{data.name}</td>
                            <td className="text-primary">
                              {data.amountPermonth}
                            </td>
                            <td>Active</td>
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
                  <h4 className="mb-0">Create New Activity</h4>
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
                          placeholder="Name of Activity"
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Amount</label>
                        <input
                          required
                          value={amountPermonth}
                          onChange={(amountPermonth) =>
                            setAmountPermonth(amountPermonth.target.value)
                          }
                          type="text"
                          className="form-control"
                          placeholder="Amount"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          required
                          type="date"
                          className="form-control"
                          placeholder="%"
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
export default Activity;
