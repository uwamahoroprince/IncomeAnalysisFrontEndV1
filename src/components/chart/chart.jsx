import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../constants/url";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const COLORS = ["#0088FE", "#00C49F"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const Chart = () => {
  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const isfound = true;
  const pieData = [];

  const [barData, setBarData] = useState();
  const [amountFromActivity, setAmountFromActivity] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [total, setTotal] = useState(0);
  let valuePairState = [];
  const getAllSubscriptions = async () => {
    let addedAmount = 0;
    try {
      const response = await axios.get(`${url.memberShip}`);
      const data = response.data.data;
      for (const key in data) {
        for (const innerKey in data[key].activity) {
          console.log();
          let id = data[key].activity[innerKey];
          console.log(`${url.activity}/${id}`);
          let response = await axios.get(`${url.activity}/${id}`);
          const amount = response.data.data.amountPermonth;
          addedAmount = addedAmount + amount;
        }
      }
      setAmountFromActivity(addedAmount);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllTransactions = async () => {
    let exp = 0;
    let inc = 0;
    try {
      let expensePerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let incomePerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const response = await axios.get(`${url.transaction}`);
      const data = response.data.data;

      for (const key in data) {
        let month = new Date(data[key].createdAt).getMonth() + 1;
        if (data[key].type === "expense") {
          exp = exp + data[key].amount;
          expensePerMonth[month] = expensePerMonth[month] + data[key].amount;
        } else {
          inc = inc + data[key].amount;
          incomePerMonth[month] = incomePerMonth[month] + data[key].amount;
        }

        let index = valuePairState.findIndex((el) => el.month === month);
        // console.log(index);
        if (index != -1) {
          valuePairState[index] = {
            month: month,
            x: expensePerMonth[month],
            y: incomePerMonth[month],
          };
          //   console.log(valuePairState);
        } else {
          if (data[key].type === "expense") {
            valuePairState.push({
              month: month,
              x: data[key].amount,
              y: 0,
            });
            // console.log(valuePairState);
          } else {
            valuePairState.push({
              month: month,
              x: 0,
              y: data[key].amount,
            });
            // console.log(valuePairState);
          }
        }
      }
      let newData = [];

      for (const key in valuePairState) {
        let monthInWord;
        for (let i = 1; i <= 12; i++) {
          if (i == valuePairState[key].month) {
            monthInWord = allMonths[i];
          }
        }

        newData.push({
          name: `${monthInWord}`,
          Expense: valuePairState[key].x,
          Income: valuePairState[key].y + amountFromActivity,
          amt: valuePairState[key].x,
        });
      }
      setBarData(newData);
    } catch (error) {
      console.log(error);
    }
    setTotalExpense(exp);
    setTotalIncome(inc + amountFromActivity);
  };
  pieData.push(
    {
      name: "Income",
      value: totalIncome,
    },
    {
      name: "Expense",
      value: totalExpense,
    }
  );
  useEffect(() => {
    getAllTransactions();
    getAllSubscriptions();
    // getTotalAmountFromSubscription();

    return () => {
      isfound = false;
    };
  }, []);
  return (
    <>
      <div className="row m-3">
        <div className="col-xl-7 d-flex">
          <div className="card flex-fill  border border-secondry">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title">Transaction Analytics</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap flex-md-nowrap">
                <div className="w-md-100 d-flex align-items-center mb-3 flex-wrap flex-md-nowrap">
                  <div>
                    <span>Total</span>
                    <p className="h5 text-primary me-5">
                      {totalExpense + totalIncome}
                      <span className="h6 text-dark">Rwf</span>
                    </p>
                  </div>
                  <div>
                    <span>Expenses</span>
                    <p className="h5 text-danger me-5">
                      {totalExpense} <span className="h6 text-dark">Rwf</span>
                    </p>
                  </div>
                  <div>
                    <span>Income</span>
                    <p className="h5 text-dark me-5">
                      {totalIncome} <span className="h6 text-dark">Rwf</span>
                    </p>
                  </div>
                </div>{" "}
                *
              </div>
              <div id="sales_chart">
                <BarChart
                  width={600}
                  height={300}
                  data={barData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 5,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Income"
                    fill="#8884d8"
                    background={{ fill: "#eee" }}
                  />
                  <Bar dataKey="Expense" fill="#82ca9d" />
                </BarChart>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-5 d-flex">
          <div className="card flex-fill  border border-secondry">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title">Pie Transaction Analytics</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap flex-md-nowrap">
                <div className="">
                  {/* <div>
                    <span className="h4">Guid</span>
                  </div>
                  <br /> */}
                  <div>
                    <div
                      className="badge"
                      style={{
                        background: "#00C49F",
                        width: "20px",
                        height: "10px",
                      }}
                    >
                      {" "}
                    </div>
                    <span className="h5">Expense</span>
                  </div>

                  <div>
                    <div
                      className="badge"
                      style={{
                        background: "#0088FE",
                        width: "20px",
                        height: "10px",
                      }}
                    >
                      {" "}
                    </div>
                    <span className="h5">Income</span>
                  </div>
                </div>
              </div>
              <div id="sales_chart">
                <PieChart width={500} height={400}>
                  <Pie
                    data={pieData}
                    cx={200}
                    cy={150}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Chart;
