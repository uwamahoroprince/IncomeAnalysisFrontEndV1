import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { url } from "../../constants/url";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BudgetPlan = () => {
  const [form, setForm] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allAccount, setAllAcount] = useState([]);
  const [account, setAcount] = useState({});
  const [expectedIncome, setExpectedIncome] = useState("");
  function toastMessage(message) {
    toast(message);
  }

  const handleOnAdNew = (event) => {
    event.preventDefault();
    const inputState = {
      transaction: "",
      ammount: "",
    };
    setForm((prev) => [...prev, inputState]);
  };
  const onChange = (index, event) => {
    event.preventDefault();
    event.persist();
    setForm((prev) => {
      return prev.map((item, i) => {
        if (i !== index) {
          return item;
        }
        return {
          ...item,
          [event.target.name]: event.target.value,
        };
      });
    });
  };
  const onHandleRemoveField = (e, index) => {
    e.preventDefault();
    setForm((prev) => prev.filter((item) => item != prev[index]));
  };
  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url.budgetPlan}`, {
        expense: form,
        endDate: endDate,
        startDate: startDate,
        account: account._id,
        name: name,
        description: description,
        expectedIncome: expectedIncome,
      });
      const message = response.data.data.message;
      toastMessage("BudgetPlan Created");
    } catch (error) {
      console.log(error);
      toastMessage("error while creating budget");
    }
  };
  const getAccounts = async () => {
    try {
      const response = await axios.get(`${url.acoount}`);
      setAllAcount(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);
  return (
    <form className="form-group mt-5 d-flex align-items-center justify-content-center">
      <fieldset className="border text-center border-dark">
        <legend className="text-primary h4 d-flex justify-content-around">
          Create New Budget Plan
          <Link to="/budgetView" className="btn btn-success">
            <span>Budget List</span>
          </Link>
        </legend>
        <div className="form-header modal-body" style={{ width: "620px" }}>
          <fieldset className="border text-center border-dark">
            <legend className="h6">Budget Period</legend>
            <div className="row align-items-center justify-content-center">
              <div className="col-md-5 col-sm-5">
                <div className="form-group">
                  <label>Budget Name</label>
                  <input
                    placeholder="Budget Name"
                    required
                    value={name}
                    onChange={(name) => setName(name.target.value)}
                    type="text"
                    className="form-control text-center"
                  />
                </div>
              </div>
              <div className="col-md-5 col-sm-5">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="More About Budget"
                    required
                    value={description}
                    onChange={(description) =>
                      setDescription(description.target.value)
                    }
                    type="text"
                    className="form-control text-center"
                  />
                </div>
              </div>
              <div className="col-md-5 col-sm-5">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    required
                    value={startDate}
                    onChange={(startDate) =>
                      setStartDate(startDate.target.value)
                    }
                    type="date"
                    className="form-control text-center"
                  />
                </div>
              </div>
              <div className="col-md-5 col-sm-5">
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    required
                    value={endDate}
                    onChange={(endDate) => setEndDate(endDate.target.value)}
                    type="date"
                    className="form-control text-center"
                  />
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset className="border text-center mt-4 border-dark">
            <legend className="h6">Account & Income</legend>
            <div className="row align-items-center justify-content-center">
              <div className="col-md-5 col-sm-5">
                <div className="form-group">
                  <label>Account</label>
                  <select
                    onChange={(account) => setAcount(account.target.value)}
                    className="form-select form-control"
                  >
                    {allAccount.length != 0 ? (
                      allAccount.map((data, index) => (
                        <option key={index} value={data}>
                          {data.name}
                        </option>
                      ))
                    ) : (
                      <option>no account Found</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="col-md-5 col-sm-5">
                <div className="form-group">
                  <label>Expected Income</label>
                  <input
                    required
                    value={expectedIncome}
                    onChange={(expectedIncome) =>
                      setExpectedIncome(expectedIncome.target.value)
                    }
                    placeholder="Expected Income"
                    type="number"
                    className="form-control text-center"
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <fieldset className="border m-3 text-center border-dark">
          <legend className="h6">Expense Section</legend>
          {form.map((item, index) => (
            <div className="row modal-body ">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control text-center"
                  name="transaction"
                  value={item.transaction}
                  placeholder="Expense Name"
                  onChange={(e) => onChange(index, e)}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control text-center"
                  name="ammount"
                  value={item.ammount}
                  placeholder="Amount"
                  onChange={(e) => onChange(index, e)}
                />
              </div>
              <div className="col">
                <button
                  className="btn btn-danger"
                  onClick={(e) => onHandleRemoveField(e, index)}
                >
                  X
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn-primary h6 mt-2 " onClick={handleOnAdNew}>
            Add new Expense
          </button>
        </fieldset>

        <div className="row align-items-center justify-content-center mb-2">
          <div className="col-md-6">
            <button className="btn btn-success mt-2" onClick={postData}>
              save
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  );
};
export default BudgetPlan;
