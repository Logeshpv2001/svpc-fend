import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import NavTabs from "../../../component/tabs/NavTabs";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { useParams } from "react-router-dom";
import AgencyBillView from "../../../component/general/AgencyBillView";
import DailyBillView from "../../../component/general/DailyBillView";
import PackageBillView from "../../../component/general/PackageBillView";
import ReturnBillView from "../../../component/general/ReturnBillView";

const { TabPane } = Tabs;

const PatientBills = () => {
  const currentPage = "Patient";
  const currentTab = "Bills";

  const { id } = useParams();

  const [personalData, setPersonalData] = useState([]);

  const getPatientDetails = async () => {
    try {
      const response = await AxiosInstance.get(`/patient/get-patient/${id}`);
      setPersonalData(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPatientDetails();
  }, []);

  const renderDailyBill = () => <DailyBillView personalData={personalData} />;

  const renderAgencyBill = () => <AgencyBillView personalData={personalData} />;

  const renderReturnBill = () => <ReturnBillView personalData={personalData} />;

  const renderPackageBill = () => (
    <PackageBillView personalData={personalData} />
  );

  return (
    <div>
      <div>
        <NavTabs currentPage={currentPage} currentTab={currentTab} />
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Clinic Receipt" key="1">
          {renderDailyBill()}
        </TabPane>
        <TabPane tab="Package Receipt" key="2">
          {renderPackageBill()}
        </TabPane>
        <TabPane tab="Agency Receipt" key="3">
          {renderAgencyBill()}
        </TabPane>
        <TabPane tab="Return Receipt" key="4">
          {renderReturnBill()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PatientBills;
