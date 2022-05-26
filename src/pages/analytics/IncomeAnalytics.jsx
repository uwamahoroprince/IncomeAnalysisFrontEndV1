import React, { useState, useEffect } from "react";
import { url } from "../../constants/url";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Modal from "react-modal/lib/components/Modal";

const IncomeAnalysis = () => {
  const [mapData, setMapData] = useState([]);
  const valuePairState = [];
  const [predictAmount,setPredictAmount] = useState(0);
  const [predicted,setPredicted] = useState({});
  const [modelState, setModelState] = useState({
    model: null,
    trained: false,
    predictedValue: "Click on train",
    valueToPredict: 1,
  });
  const [actiNumber,setActNumber] = useState(0);
  const getAllTransactions = async () => {
    try {
      let expensePerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let incomePerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const response = await axios.get(`${url.transaction}`);
      const data = response.data.data;
      for (const key in data) {
        let month = new Date(data[key].createdAt).getMonth() + 1;
        if (data[key].type === "expense") {
          expensePerMonth[month] = expensePerMonth[month] + data[key].amount;
        } else {
          incomePerMonth[month] = incomePerMonth[month] + data[key].amount;
        }

        let index = valuePairState.findIndex((el) => el.month === month);
        // console.log(index);
        
          //   console.log(valuePairState);
        
          if (data[key].type === "expense") {
            valuePairState.push({
              month: month,
              x: data[key].amount,
              y: data[key].amount + 30000 + key,
              clients:Math.floor(Math.random() * 100),
              subscription:Math.floor(Math.random() * 100),
              numberOfAccounts:Math.floor(Math.random() * 10),
              numberOfActivities:Math.floor(Math.random() * 10),
              refundedSubscription:Math.floor(Math.random() * 10)
            });
            // console.log(valuePairState);
          } else {
            valuePairState.push({
              month: month,
              x:  data[key].amount - 30000 - key,
              y: data[key].amount,
              clients:Math.floor(Math.random() * 100),
              subscription:Math.floor(Math.random() * 100),
              numberOfAccounts:Math.floor(Math.random() * 10),
              numberOfActivities:Math.floor(Math.random() * 10),
              refundedSubscription:Math.floor(Math.random() * 10)
            });
            // console.log(valuePairState);
          }
      }
      setMapData(valuePairState);
      //   console.log(valuePairState);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllSubscription = async () => {
    try {
      const response = await axios.get(`${url.memberShip}`);
      const data = response.data.data;
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getActivityNumber = async () => {
    try {
     const response = await axios.get(`${url.activity}`);
     const activityNumber = response.data.data;
     setActNumber(activityNumber.length);
    } catch (error) {
      console.log(error)
    }
  }
  const trainHandler = () => {
    try {
      let xValues = [],
        yValues = [];

      valuePairState.forEach((val, index) => {
        xValues.push(val.x);
        yValues.push(val.y);
      });
      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
      const xs = tf.tensor2d(xValues, [xValues.length, 1]);
      const ys = tf.tensor2d(yValues, [yValues.length, 1]);

      model.fit(xs, ys, { epochs: 250 }).then(() => {
        setModelState({
          ...modelState,
          model: model,
          trained: true,
          predictedValue: "Ready for making predictions",
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handlePredict = () => {
    const predictedValue = modelState.model
      .predict(tf.tensor2d([modelState.valueToPredict], [1, 1]))
      .arraySync()[0][0];

    setModelState({
      ...modelState,
      predictedValue: predictedValue,
    });
  };
  const handelModelChange = (e) =>
    setModelState({
      ...modelState,
      [e.target.name]: [parseInt(e.target.value)],
    });

  useEffect(() => {
    getAllTransactions();
    getAllSubscription();
    getActivityNumber();
    console.log("running")
  }, [predicted]);

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
    setPredicted(0);
  }
  function formtPoints(){
    return Math.floor(Math.random() * 10);
  }
  const handlepyPredict = async() =>{
    try {
      const response = await axios.post('http://localhost:8000',{
       "amount":predictAmount,
      });
      console.log(response.data)
      setPredicted(response.data);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row">
            <div className="col-3">
            <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success mb-3"
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Export Data to Excel Sheet"/>
            </div>
            <div className="col-6">
            
            <a onClick={openModal} href="#">
              <i className="btn btn-primary"> <span className="text-light">Predict an Income</span></i>
             
            </a>
          
            </div>
          </div>
          <table id="table-to-xls" className="table table-stripped table-hover datatable">
            <thead className="thead-light">
              <tr>
                <th>Expense</th>
                <th>Income</th>
                <th>Number Of Clients</th>
                <th>Number Of Subcription</th>
                <th>Number Of Account</th>
                <th>Number Of Activities</th>
                <th>Refunded Subcription</th>
              </tr>
            </thead>
            <tbody>
              {mapData.length != 0 ? (
                mapData.map((data) => (
                  <tr>
                    <td className="text-primary">{data.x}</td>
                    <td className="items-primary">{data.y}</td>
                    <td className="items-primary">{data.clients}</td>
                    <td className="items-primary">{data.subscription}</td>
                    <td className="items-primary">{data.numberOfAccounts}</td>
                    <td className="items-primary">{data.numberOfActivities}</td>
                    <td className="items-primary">{data.refundedSubscription}</td>
                  </tr>
                ))
              ) : (
                <span>no train data</span>
              )}
            </tbody>
          </table>

          <br />
          <input
            type="number"
            value={modelState.valueToPredict}
            name="valueToPredict"
            onChange={handelModelChange}
            placeholder="enter a number"
          />

          <button onClick={handlePredict} disabled={!modelState.trained}>
            Predict
          </button>
          <button onClick={trainHandler}>Train</button>
          <div className="m-2">
            <span className="h6">Predicted Income </span>
            <br />
            {modelState.predictedValue}
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
                  <h4 className="mb-0">Predict an Income</h4>
                </div>
              </div>
              <div className="modal-body">
                <div className="bank-inner-details">
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                      <label>Investment Amount</label>
                        <input
                          required
                          value={predictAmount}
                          onChange={(predictAmount) => setPredictAmount(predictAmount.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="Expense Amount"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>Predicred</label>
                        <span>Predicted Income: {predicted.prediction} </span><br/>
                        <span>Accurancy: {predicted.accuracy}.</span><span>{predicted.decimal} %</span>
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
                <div className="col-sm-2 bank-details-btn">
                  <a
                    onClick={handlepyPredict}
                    className="btn btn-success bank-cancel-btn"
                  >
                    Predict
                  </a>
                </div>
                
              </div>
            </div>
          </form>
        </Modal>
    </>
  );
};
export default IncomeAnalysis;
