import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const logOut = () => {
    try {
      localStorage.setItem("token", "");
      localStorage.setItem("role", "");
      localStorage.setItem("user", "");
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };

  const role = localStorage.getItem("role");
  console.log(role);
  return (
    <>
      <div
        className="sidebar mt-0 pt-0 border border-secondry"
        id="sidebar"
        style={{ backgroundColor: "#3098ae" }}
      >
        <div className="sidebar-inner">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li style={{ color: "#fff" }} className="menu-title ">
                <span className="text-light">Main</span>
              </li>
              <li className="active ">
                <Link to="/">
                  <i
                    style={{ color: "#fff" }}
                    className="fa-solid fa-gauge"
                    data-feather="home"
                  ></i>
                  <span className="text-light">Dashboard</span>
                </Link>
              </li>
              {role === "financeManager" ? (
                <>
                  <li>
                    <Link to="/accounts">
                      <i
                        style={{ color: "#fff" }}
                        className="fa-solid fa-suitcase"
                        data-feather="users"
                      ></i>
                      <span className="text-light">Accounts</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/budgetPlan">
                      <i
                        style={{ color: "#fff" }}
                        className="fa-solif fa-list"
                        data-feather="clipboard"
                      ></i>
                      <span className="text-light">BudgetPlan</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/transactions">
                      <i
                        style={{ color: "#fff" }}
                        className="fas fa-dollar-sign"
                        data-feather="package"
                      ></i>
                      <span className="text-light">Expense</span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/salesReport">
                      <i className="fa-solid fa-p" data-feather="package"></i>{" "}
                      <span className="text-light">Sales Reports</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/analytics">
                      <i
                        style={{ color: "#fff" }}
                        className="fas fa-dollar-sign"
                        data-feather="package"
                      ></i>
                      <span className="text-light">Income Analytics</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/subscription">
                      <i
                        style={{ color: "#fff" }}
                        className="fa-solid fa-basketball"
                        data-feather="package"
                      ></i>
                      <span className="text-light">SubScription</span>
                    </Link>
                  </li>
                </>
              ) : (
                ""
              )}
              {role === "manager" ? (
                <>
                  <li>
                    <Link to="/activities">
                      <i
                        style={{ color: "#fff" }}
                        className="fa-solid fa-dumbbell"
                        data-feather="file-text"
                      ></i>
                      <span className="text-light">Activity</span>
                    </Link>
                  </li>
                  <li></li>
                  <li>
                    <Link to="budgetView">
                      <i
                        style={{ color: "#fff" }}
                        className="fa-solid fa-person"
                        data-feather="credit-card"
                      ></i>
                      <span className="text-light">View Budget Plans</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/salesReport">
                      <i
                        style={{ color: "#FFF" }}
                        className="fa-solid fa-p"
                        data-feather="package"
                      ></i>
                      <span className="text-light">Sales Reports</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/analytics">
                      <i
                        style={{ color: "#fff" }}
                        className="fas fa-dollar-sign"
                        data-feather="package"
                      ></i>
                      <span className="text-light">Income Analytics</span>
                    </Link>
                  </li>
                </>
              ) : (
                <></>
              )}
              {role === "receptionist" ? (
                <>
                  <li>
                    <Link to="/clients">
                      <i
                        style={{ color: "#fff" }}
                        className="fa-solid fa-person"
                        data-feather="credit-card"
                      ></i>
                      <span className="text-light">Customers</span>
                    </Link>
                  </li>
                  <Link to="/subscription">
                    <i
                      style={{ color: "#fff" }}
                      className="fa-solid fa-basketball"
                      data-feather="package"
                    ></i>
                    <span>SubScription</span>
                  </Link>
                </>
              ) : (
                <></>
              )}
              {role === "admin" ? (
                <>
                  <li>
                    <Link to="/staff">
                      <i
                        style={{ color: "#fff" }}
                        class="fa-solid fa-users"
                        data-feather="package"
                      ></i>
                      <span className="text-light">Staff</span>
                    </Link>
                  </li>
                </>
              ) : (
                <></>
              )}
              {/* <li style={{ color: "#fff" }} className="menu-title ">
                <span className="text-light">Main</span>
              </li> */}
              <li onClick={logOut} className=" ">
                <Link to="/">
                  <i
                    style={{ color: "red" }}
                    className="fa-solid fa-power-off"
                    data-feather="home"
                  ></i>
                  <span className="text-light">Log Out</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default SideBar;
