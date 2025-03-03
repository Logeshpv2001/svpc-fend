import React from "react";
import { Tabs } from "antd";
import CheckinCheckoutTable from "../../../component/tables/CheckinCheckoutTable";
import CensusTable from "../../../component/tables/DailyCensusTable";
import Item from "antd/es/list/Item";
import DailyCensusTable from "../../../component/tables/DailyCensusTable";
import RehabCensusTable from "../../../component/tables/RehabCensusTable";
import TotalRehabCensusTable from "../../../component/tables/TodayRehabCensusTable";
import TotalDailyCensusTable from "../../../component/tables/TodayDailyCensusTable";

const { TabPane } = Tabs;

const Census = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] animationtext m-0">
          Census
        </h1>
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <Tabs defaultActiveKey="old/new" size="large">
          <Item tab="Checkin / Checkout" key="old/new">
            <CheckinCheckoutTable />
          </Item>

          <Item tab="Daily Census" key="daily_census">
            <DailyCensusTable />
          </Item>


          <Item tab="Rehab Census" key="rehab_census">
            <RehabCensusTable />
          </Item>

          <Item tab="Today Daily Census" key="today_daily_census">
            <TotalDailyCensusTable />
          </Item>

          <Item tab="Today Rehab Census" key="today_rehab_census">
            <TotalRehabCensusTable />
          </Item>
        </Tabs>
      </div>
    </div>
  );
};

export default Census;
