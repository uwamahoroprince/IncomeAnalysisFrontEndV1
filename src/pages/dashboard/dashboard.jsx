import axios from "axios";
import React, { useEffect, useState } from "react";
import Widget from "../../components/ui/widget/widget";
import { url } from "../../constants/url";

const Dashboard = () => {
  const [totalSubscription, setTotalSubscription] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  let activeSub = 0;
  let inactiveSub = 0;
  let isLoaded = true;
  const getData = async () => {
    try {
      if (isLoaded) {
        //getting total size of subscription
        const sub = await axios.get(`${url.memberShip}`);
        const subData = sub.data.data;
        setTotalSubscription(subData.length);
        //getting total size of activities
        const act = await axios.get(`${url.activity}`);
        const actData = act.data.data;
        setTotalActivities(actData.length);
        //gettin total size of transaction
        const tra = await axios.get(`${url.transaction}`);
        const traData = tra.data.data;
        setTotalTransactions(traData.length);
        //getting total size of accounts
        const acc = await axios.get(`${url.acoount}`);
        const accData = acc.data.data;
        setTotalAccounts(accData.length);
        for (const key in subData) {
          if (subData[key].status === "active") {
            activeSub = activeSub + 1;
          } else {
            inactiveSub = inactiveSub + 1;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
    return () => {
      isLoaded = false;
    };
  }, []);
  return (
    <>
      <div className="content container-fluid">
        <div className="row">
          <Widget
            title="Total Subscription"
            number={totalSubscription}
            icon="fa-solid fa-basketball"
            iconBackground="dash-widget-icon bg-1"
            persentage={60}
            arrow="fas fa-arrow-up me-1"
            subTitle="Since Last Week"
            arrowColor="text-success me-1"
          />
          <Widget
            title="Total Activities"
            number={totalActivities}
            icon="fa-solid fa-dumbbell"
            iconBackground="dash-widget-icon bg-2"
            persentage={11}
            arrow="fas fa-arrow-up me-1"
            subTitle="Since Last Week"
            arrowColor="text-success me-1"
          />
          <Widget
            title="Total Transactions"
            number={totalTransactions}
            icon="fas fa-dollar-sign"
            iconBackground="dash-widget-icon bg-3"
            persentage={73}
            arrow="fas fa-arrow-up me-1"
            subTitle="Since Last Week"
            arrowColor="text-success me-1"
          />
          <Widget
            title="Total Accounts "
            number={totalAccounts}
            icon="fa-solid fa-suitcase"
            iconBackground="dash-widget-icon bg-4"
            persentage={3}
            arrow="fas fa-arrow-down me-1"
            subTitle="Since Last Week"
            arrowColor="text-danger me-1"
          />
          <Widget
            title="Active Subscription"
            number={activeSub}
            icon="fa-solid fa-a"
            iconBackground="dash-widget-icon bg-5"
            persentage={11}
            arrow="fas fa-arrow-up me-1"
            subTitle="Since Last Week"
            arrowColor="text-up me-1"
          />
          <Widget
            title="Inactive Subscription"
            number={inactiveSub}
            icon="fa-solid fa-i"
            iconBackground="dash-widget-icon bg-6"
            persentage={1}
            arrow="fas fa-arrow-down me-1"
            subTitle="Since Last Week"
            arrowColor="text-danger me-1"
          />
        </div>
      </div>
    </>
  );
};
export default Dashboard;
