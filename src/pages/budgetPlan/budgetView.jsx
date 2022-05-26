import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../constants/url";
import Modal from "react-modal/lib/components/Modal";

const BudgetView = () => {
  const [budget, setBudget] = useState([]);
  const [singleBudget, setSingleBudget] = useState([]);
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState([]);
  const getData = async () => {
    try {
      const response = await axios.get(`${url.budgetPlan}`);
      const data = response.data.data;
      setBudget(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getbudgetDetails = async (budgetId) => {
    try {
      const response = await axios.get(`${url.budgetPlan}/${budgetId}`);
      const details = response.data.data.expense;
      const foundDescription = response.data.data.description;
      let singleAmount = 0;
      setSingleBudget(details);
      setDescription(foundDescription);
      for (const key in details) {
        singleAmount =
          parseFloat(singleAmount) + parseFloat(details[key].ammount);
      }
      setTotal(singleAmount);
      console.log(details);
    } catch (error) {
      console.log(error);
    }
  };
  const dateConverter = (date) => {
    const day = new Date(date).getDay();
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();
    const fullDate = `${day}-${month}-${year}`;
    return fullDate;
  };

  useEffect(() => {
    getData();
    console.log("running");
  }, []);
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
      <div className="row d-flex align-items-center justify-content-center mt-5">
        <div className="col-sm-11">
          <div className="card card-table">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-stripped table-hover datatable">
                  <thead className="thead-light">
                    <tr>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>

                      <th>Expected Income</th>
                      <th>More</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget.length !== 0 ? (
                      budget.map((data, index) => (
                        <tr>
                          <td>{data.name}</td>
                          <td>{dateConverter(data.startDate)}</td>
                          <td>{dateConverter(data.endDate)}</td>
                          <td className="text-primary">Active</td>

                          <td>{data.expectedIncome}</td>
                          <td>
                            <div
                              onClick={() => {
                                openModal();
                                getbudgetDetails(data._id);
                              }}
                              className="btn btn-secondary"
                            >
                              View
                            </div>
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
                  <div className="form-header text-center mb-0">
                    <h4 className="mb-0">Expenses</h4>
                  </div>
                </div>
                <div className="modal-body">
                  <div className="bank-inner-details">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="card card-table">
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-stripped table-hover datatable">
                                <thead className="thead-light">
                                  <tr>
                                    <th>No</th>
                                    <th>Expense Name</th>
                                    <th>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {singleBudget.length !== 0 ? (
                                    singleBudget.map((data, index) => (
                                      <>
                                        <tr>
                                          <td>{index + 1}</td>
                                          <td>{data.transaction}</td>
                                          <td>{data.ammount}</td>
                                        </tr>
                                      </>
                                    ))
                                  ) : (
                                    <span>not details found</span>
                                  )}
                                  <>
                                    <tr>
                                      <td colspan="2">
                                        <div className="badge bg-success ">
                                          Total :{" "}
                                        </div>
                                        &nbsp; <span>{total}</span>
                                      </td>
                                    </tr>
                                  </>
                                  {description ? (
                                    <tr>
                                      <td colspan="2">
                                        <div className="badge bg-light text-success">
                                          Description :
                                        </div>
                                        <br />
                                        <span>{description}</span>
                                      </td>
                                    </tr>
                                  ) : (
                                    <></>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
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
                </div>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
};
export default BudgetView;
