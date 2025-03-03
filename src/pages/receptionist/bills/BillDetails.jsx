

import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import NavTabs from "../../../component/tabs/NavTabs";
import "./Bill.css";
import "../../physio/patient/patient.css";
import NormalBillTable from "../../../component/tables/NormalBillTable";
import RehabBillTable from "../../../component/tables/RehabBillTable";
import AxiosInstance from "../../../utilities/AxiosInstance";

const { TabPane } = Tabs;

const BillDetails = () => {
  const currentPage = "patient > bill";
  const currentTab = "details";

  const userInfo = JSON.parse(sessionStorage.getItem("user"));

  const [normalBillData, setNormalBillData] = useState([]);

  const [rehabBillData, setRehabBillData] = useState([]);

  const getNormalBillData = async () => {
    try {
      const response = await AxiosInstance.get(
        `/bill/normalbillby-clinicid/${userInfo.u_vClinicId}`
      );
      setNormalBillData(response.data.response || []);
    } catch (error) {
      console.log(error);
    }
  };
  const getRehabBillData = async () => {
    try {
      const response = await AxiosInstance.get(
        `/rehabbill/rehabbillby-clinicid/${userInfo.u_vClinicId}`
      );
      setRehabBillData(response.data.response || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRehabBillData();
    getNormalBillData();
  }, []);

  return (
    <div>
      {/* Headers */}
      <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] animationtext">
          Bills
        </h1>
      </div>{" "}
      <hr className="my-2" />
      <NavTabs currentPage={currentPage} currentTab={currentTab} />
      <div className="mt-4">
        {/* <Tabs
          defaultActiveKey="1"
          animated={{ inkBar: true, tabPane: true }}
          tabBarStyle={{ fontWeight: "bold" }}
        >
          <TabPane tab="Normal Bill" key="1">
            
          </TabPane> */}
          {/* <TabPane tab="Rehab Bill" key="2"> */}
            {/* <RehabBillTable billData={rehabBillData} /> */}
            <NormalBillTable billData={normalBillData} />
          {/* </TabPane> */}
        {/* </Tabs> */}
      </div>
    </div>
  );
};

export default BillDetails;
