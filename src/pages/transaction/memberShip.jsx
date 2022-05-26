import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import { url } from "../../constants/url";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
toast.configure();
const MemberShip = () => {
  const [activity, setActivity] = useState([]);
  const [allClient, setAllClient] = useState([]);
  const [allActivity, setAllActivity] = useState([]);
  const [client, setClient] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [allData, setAllData] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [status, setStatus] = useState(false);
  const [subsActivities, setSubsActivities] = useState([]);
  const [renderActivities, setRenderActivities] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const names = localStorage.getItem("logedUser");
  const logedemail = localStorage.getItem("logedEmail");

  const [totalCost, setTotalConst] = useState(0);
  let ismount = false;
  function toastfy(message) {
    toast(message);
  }
  const handleSubmit = async (event) => {
    let response;
    event.preventDefault();

    try {
      if (!status) {
        response = await axios.post(`${url.memberShip}`, {
          activity: activity,
          client: client,
          startDate: startDate,
          endDate: endDate,
        });
        setResponseMessage(Math.floor(Math.random() * 10000));
      } else {
        response = await axios.put(`${url.memberShip}/${updateId}`, {
          activity: activity.value,
          client: client,
          startDate: startDate,
          endDate: endDate,
        });
        setResponseMessage(Math.floor(Math.random() * 10000));
      }
      setStatus(false);
    } catch (error) {
      console.log(error);
    }
    setClient("");
    setStartDate("");
    setEndDate("");
    setResponseMessage(response.statusText);
    toastfy(response.data.message);
    closeModal();
  };
  const getData = async () => {
    try {
      const allData = await axios.get(`${url.memberShip}`);
      if (!ismount) {
        setAllData(allData.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteData = async (id) => {
    let allData;
    try {
      allData = await axios.delete(`${url.memberShip}/${id}`);
      setResponseMessage(Math.floor(Math.random() * 10000));
      setResponseMessage(allData.data.message);
    } catch (error) {
      console.log(error);
    }
    toast(allData.data.message);
  };
  const getClients = async () => {
    try {
      const response = await axios.get(`${url.client}`);
      setAllClient(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  function findSingleClient(clientId) {
    let name;
    for (const key in allClient) {
      if (allClient[key]._id === clientId) {
        name = allClient[key].name;
        break;
      }
    }
    return name;
  }
  function findSubcribedActivities(activities) {
    let newactivities = [];
    for (const key in activities.activity) {
      for (const innerKey in allActivity) {
        if (renderActivities[innerKey]._id === activities.activity[key]) {
          newactivities.push(renderActivities[innerKey]);
        }
      }
    }
    setSubsActivities(newactivities);
  }
  function dateFormatter(date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth() + 1;
    const day = new Date(date).getDay() + 1;
    return `${year}-${month}-${day}`;
  }
  const option = [];
  const getActivities = async () => {
    try {
      const response = await axios.get(`${url.activity}`);
      setAllActivity(response.data.data);
      setRenderActivities(response.data.data);
      const results = response.data.data;
      for (const key in results) {
        option.push({
          value: results[key]._id,
          label: results[key].name,
        });
      }
      setAllActivity(option);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (data) => {
    setActivity(data);
  };
  const getPayData = (data) => {
    localStorage.setItem("clientEmail", data.email);
    localStorage.setItem("clientNames", data.name);
    localStorage.setItem("clientPhone", data.phone);
  };
  console.log(localStorage.getItem("clientEmail"));
  const config = {
    public_key: "FLWPUBK_TEST-8f5bd8f2a9e558add35e1a039bb91622-X",
    tx_ref: Date.now(),
    amount: 100,
    currency: "RWF",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: `${logedemail}`,
      phonenumber: `${localStorage.getItem("clientPhone")}`,
      name: `${localStorage.getItem("clientNames")}`,
    },
    customizations: {
      title: "Nyarutarama Sport Trust Club",
      description: "Payment for Subscription",
      logo: "",
    },
  };
  const handleFlutterPayment = useFlutterwave(config);
  useEffect(() => {
    getData();
    getClients();
    getActivities();
    return () => {
      ismount = true;
    };
  }, [responseMessage]);
  const customCatStyles = {
    content: {
      top: "10%",
      left: "20%",
      right: "40%",
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
  const ActivitycustomCatStyles = {
    content: {
      top: "10%",
      left: "30%",
      right: "40%",
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
  const [isActivityModalOpen, setIsActivityModalOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function openActivityModal() {
    setIsActivityModalOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }
  function closeActivityModal() {
    setIsActivityModalOpen(false);
  }
  return (
    <>
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">SubScription</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">SubScription List</li>
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
                      <i data-feather="plus-circle"></i>SubScription
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
                        <th>Client</th>
                        <th>Start Date</th>
                        <th>End Date At</th>
                        <th>Status</th>
                        <th>Activity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.length !== 0 ? (
                        allData.map((data, index) => (
                          <tr>
                            <td className="items-text">
                              {findSingleClient(data.client)}
                            </td>
                            <td className="items-text">
                              {dateFormatter(data.startDate)}
                            </td>
                            <td className="items-text">
                              {dateFormatter(data.endDate)}
                            </td>
                            <td className="items-text text-primary">
                              {data.status}
                            </td>
                            <td>
                              <div
                                onClick={() => {
                                  openActivityModal();
                                  findSubcribedActivities(data);
                                }}
                                className="btn btn-secondary"
                              >
                                View
                              </div>
                            </td>
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
                  <h4 className="mb-0">Create New Subscription</h4>
                </div>
              </div>
              <div className="modal-body">
                <div className="bank-inner-details">
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <Select
                          placeholder="Search Activity"
                          closeMenuOnSelect={false}
                          options={allActivity}
                          isMulti
                          isSearchable
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Client</label>
                        <select
                          onChange={(client) => setClient(client.target.value)}
                          className="form-select form-control"
                        >
                          <option>Select Client</option>
                          {allClient.length != 0 ? (
                            allClient.map((data, index) => (
                              <option
                                onClick={() => getPayData(data)}
                                key={index}
                                value={data._id}
                              >
                                {data.name}
                              </option>
                            ))
                          ) : (
                            <span>No Client Found</span>
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          required
                          type="date"
                          className="form-control"
                          placeholder="End Date"
                          onChange={(sDate) => setStartDate(sDate.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          required
                          type="date"
                          className="form-control"
                          placeholder="End Date"
                          onChange={(eDate) => setEndDate(eDate.target.value)}
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
                          placeholder="More About Subsctiption"
                        ></textarea>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <select
                          onChange={(paymentMethod) =>
                            setPaymentMethod(paymentMethod.target.value)
                          }
                          className="form-select form-control"
                        >
                          <option value="" selected disabled>
                            Select Payment Method
                          </option>
                          <option value="Cash">Cash</option>
                          <option value="Mobile Money">Mobile Money</option>
                        </select>
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
                {paymentMethod === "Cash" ? (
                  <div className=" col-sm-2 bank-details-btn">
                    <button
                      onClick={handleSubmit}
                      className="btn btn btn-success bank-save-btn"
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <></>
                )}
                {paymentMethod === "Mobile Money" ? (
                  <div className=" col-sm-2 bank-details-btn">
                    <button
                      className="btn btn btn-success bank-save-btn"
                      onClick={() => {
                        handleFlutterPayment({
                          callback: (response) => {
                            console.log(response);
                            console.log(response.status);
                            if (response.status === "successful") {
                              axios
                                .post(`${url.memberShip}`, {
                                  activity: activity,
                                  client: client,
                                  startDate: startDate,
                                  endDate: endDate,
                                })
                                .then((res) =>
                                  toastfy("Subscription SuccessFully Paid")
                                )
                                .catch((err) => console.log(err));
                              closeModal();
                              setResponseMessage(
                                Math.floor(Math.random() * 10000)
                              );
                            }

                            closePaymentModal(); // this will close the modal programmatically
                          },
                          onClose: () => {
                            closeModal();
                            setResponseMessage(
                              Math.floor(Math.random() * 10000)
                            );
                          },
                        });
                      }}
                    >
                      Proceed
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </form>
        </Modal>
        <Modal
          isOpen={isActivityModalOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeActivityModal}
          style={ActivitycustomCatStyles}
          contentLabel="Example Modal"
        >
          <form
            className="modal-dialog modal-dialog-centered modal-lg"
            novalidate=""
          >
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header text-start mb-0">
                  <h4 className="mb-0">Subscribed Activities</h4>
                </div>
              </div>
              <div className="modal-body">
                <div className="bank-inner-details">
                  <div className="row d-flex align-items-center justify-content-center">
                    <div className="col-sm-6">
                      {subsActivities.length != 0 ? (
                        subsActivities.map((data) => (
                          <>
                            <div className="badge bg-light text-dark ">
                              <div className="h6">{data.name}</div>
                            </div>
                            <br />
                          </>
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};
export default MemberShip;
