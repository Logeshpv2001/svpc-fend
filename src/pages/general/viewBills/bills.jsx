import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import CheckinCheckoutTable from "../../../component/tables/CheckinCheckoutTable";
import CensusTable from "../../../component/tables/DailyCensusTable";
import Item from "antd/es/list/Item";
import DailyCensusTable from "../../../component/tables/DailyCensusTable";
import RehabCensusTable from "../../../component/tables/RehabCensusTable";
import TotalRehabCensusTable from "../../../component/tables/TodayRehabCensusTable";
import TotalDailyCensusTable from "../../../component/tables/TodayDailyCensusTable";
import DailyBills from "../../../component/viewBills/DailyBills";
import AxiosInstance from "../../../utilities/AxiosInstance";
import PackageBills from "../../../component/viewBills/PackageBills";
import AgencyBills from "../../../component/viewBills/AgencyBills";

const { TabPane } = Tabs;

const Bills = () => {
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const clinicId = userInfo?.u_vClinicId;
  const [clinicData, setClinicData] = useState([]);
  const getClinicData = async () => {
    try {
      const response = await AxiosInstance.get(
        `/clinic/get-clinicId/${clinicId}`
      );
      setClinicData(response.data.response);
      console.log(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClinicData();
  }, []);
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] animationtext m-0">
          Bills
        </h1>
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <Tabs defaultActiveKey="old/new" size="large">
          <Item tab="Daily Bills" key="old/new">
            <DailyBills
              clinicId={clinicId}
              address={clinicData?.c_tAddress}
              phone={clinicData?.c_vPhone}
            />
          </Item>

          <Item tab="Package BIlls" key="daily_census">
            <PackageBills
              clinicId={clinicId}
              address={clinicData?.c_tAddress}
              phone={clinicData?.c_vPhone}
            />
          </Item>

          <Item tab="Agency Bills" key="rehab_census">
            <AgencyBills
              clinicId={clinicId}
              address={clinicData?.c_tAddress}
              phone={clinicData?.c_vPhone}
            />
          </Item>

          <Item tab="Return Bills" key="today_daily_census">
            <TotalDailyCensusTable />
          </Item>

          {/* <Item tab="Today Rehab Census" key="today_rehab_census">
            <TotalRehabCensusTable />
          </Item> */}
        </Tabs>
      </div>
    </div>
  );
};

export default Bills;
