import React, { useEffect, useState } from "react";
import { url } from "../../constants/url";
import axios from "axios";
import Modal from "react-modal/lib/components/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transaction = () => {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [client, setClient] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [singleClient, setSingleClient] = useState("");
  let found = false;

  function toastify(message) {
    toast(message, { position: toast.POSITION.TOP_CENTER });
  }
  const handleSubmit = async (event) => {
    let response;
    event.preventDefault();

    try {
      if (!status) {
        response = await axios.post(`${url.transaction}`, {
          type: "expense",
          amount: amount,
          client: client,
          description: description,
        });
        toastify(response.data.message);
      } else {
        response = await axios.put(`${url.transaction}/${updateId}`, {
          type: "expense",
          amount: amount,
          client: client,
          description: description,
        });
        toastify(response.data.message);
      }
      setStatus(false);
    } catch (error) {
      console.log(error);
    }
    setType("");
    setClient("");
    setAmount("");
    setResponseMessage(Math.floor(Math.random() * 10000));
    setStatus(false);
    closeModal();
  };
  const getData = async () => {
    try {
      const response = await axios.get(`${url.transaction}`);
      setAllTransactions(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getClients = async () => {
    let response;
    try {
      response = await axios.get(`${url.client}`);
      const data = response.data.data;
      console.log(data);
      setAllClients(data);
    } catch (error) {
      toastify(response.data.message);
      console.log(error);
    }
  };
  function getSingleClient(clientId) {
    let name;
    for (const key in allClients) {
      if (allClients[key]._id === clientId) {
        name = allClients[key].name;
        break;
      }
    }
    return name;
  }
  const deleteData = async (id) => {
    let response;
    try {
      const response = await axios.delete(`${url.transaction}/${id}`);
      setResponseMessage(Math.floor(Math.random() * 10000));
      toastify(response.data.message);
    } catch (error) {
      toastify(response.data.message);
      console.log(error);
    }
  };
  const getSingleTransactionForUpdate = async (trnsId) => {
    try {
      const response = await axios.get(`${url.transaction}/${trnsId}`);
      const trans = response.data.data;
      setAmount(trans.amount);
      setDescription(trans.description);
      setStatus(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    getClients();
    console.log("running");
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
              <h3 className="page-title">Expense</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Expense List</li>
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
                      <i data-feather="plus-circle"></i>Expense
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
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Client</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTransactions.length !== 0 ? (
                        allTransactions.map((data, index) => (
                          <tr>
                            <td>{data.type}</td>
                            <td>{data.amount}</td>
                            <td>{getSingleClient(data.client)}</td>
                            <td>
                              <span
                                onClick={() => {
                                  openModal();
                                  setUpdateId(data._id);
                                  getSingleTransactionForUpdate(data._id);
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
                  <h4 className="mb-0">Record New Transaction</h4>
                </div>
              </div>
              <div className="modal-body">
                <div className="bank-inner-details">
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Amount</label>
                        <input
                          required
                          value={amount}
                          onChange={(amount) => setAmount(amount.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="Amount"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Client (Optional)</label>
                        <select
                          className="form-control"
                          onChange={(client) => setClient(client.target.value)}
                        >
                          <option value="" selected disabled>
                            Select Client
                          </option>
                          {allClients.length !== 0 ? (
                            allClients.map((data, index) => (
                              <option value={data._id}>{data.name}</option>
                            ))
                          ) : (
                            <span>No Client Found</span>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <label>Description</label>
                      <textarea
                        required
                        value={description}
                        onChange={(description) =>
                          setDescription(description.target.value)
                        }
                        className="form-control"
                        placeholder="More About Transaction"
                      ></textarea>
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
export default Transaction;
