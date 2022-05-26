import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import { url } from "../../constants/url";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Accounts = () => {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [allAccounts, setAllAccounts] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [status, setStatus] = useState(false);

  function toastfy(message) {
    toast(message);
  }
  const handleSubmit = async (event) => {
    let response;
    event.preventDefault();

    try {
      if (!status) {
        response = await axios.post(`${url.acoount}`, {
          name: name,
          currency: currency,
          amount: amount,
          description: description,
        });
        toastfy("Account Created");
        setResponseMessage(Math.floor(Math.random() * 100));
      } else {
        response = await axios.put(`${url.acoount}/${updateId}`, {
          name: name,
          currency: "Rwf",
          amount: amount,
          description: description,
        });
        toastfy("Account Updated");
        setResponseMessage(Math.floor(Math.random() * 100));
      }
      setStatus(false);
    } catch (error) {
      console.log(error);
      toastfy("An Error Accrued");
    }

    setResponseMessage(response.statusText);
    closeModal();
  };
  const getData = async () => {
    try {
      const accounts = await axios.get(`${url.acoount}`);
      setAllAccounts(accounts.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteData = async (id) => {
    try {
      const account = await axios.delete(`${url.acoount}/${id}`);
      setResponseMessage(account.data.message);
      toastfy("Account Deleted");
      setResponseMessage(Math.floor(Math.random() * 100));
    } catch (error) {
      console.log(error);
      toastfy(
        "other Entities has dependency to this account, it can't be Deleted"
      );
    }
  };
  function dateFormatter(date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth() + 1;
    const day = new Date(date).getDay() + 1;
    return `${year}-${month}-${day}`;
  }
  const getSingleAccount = async (accountId) => {
    try {
      const response = await axios.get(`${url.acoount}/${accountId}`);
      const data = response.data.data;
      console.log(data);
      setName(data.name);
      setAmount(data.amount);
      setCurrency(data.currency);
      setDescription(data.description);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
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
    setName("");
    setAmount("");
    setCurrency("");
    setDescription("");
    setStatus(null);
  }
  return (
    <>
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Account</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Account List</li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="row m-4"
          style={{
            display: "flex",
            alignItems: "right",
            justifyContent: "right",
          }}
        >
          <div className="col-sm-2 bg-primary m-2">
            <a onClick={openModal} href="#">
              <i className="fas fa-plus m-2 btn btn-primary"></i>
              <span className="text-light">Add New</span>
            </a>
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
                        <th>Currency</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAccounts.length !== 0 ? (
                        allAccounts.map((data, index) => (
                          <tr>
                            <td>{data.name}</td>
                            <td className="text-primary">{data.amount}</td>
                            <td>{data.currency}</td>
                            <td className="items-text">
                              {dateFormatter(data.createdAt)}
                            </td>
                            <td>Active</td>
                            <td>
                              <span
                                onClick={() => {
                                  openModal();
                                  setStatus(true);
                                  setUpdateId(data._id);
                                  getSingleAccount(data._id);
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
                  <h4 className="mb-0">Create New Account</h4>
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
                          placeholder="Name of Account"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Currency</label>
                        <select
                          onChange={(currency) =>
                            setCurrency(currency.target.value)
                          }
                          className="form-select form-control"
                        >
                          <option value="Rwf">Rwf</option>
                          <option value="$">$</option>
                          <option value="€">€</option>
                        </select>
                      </div>
                    </div>
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
                        <label>Start Date</label>
                        <input
                          required
                          type="date"
                          className="form-control"
                          placeholder="%"
                        />
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
export default Accounts;
