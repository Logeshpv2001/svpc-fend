import React from "react";
import { useNavigate } from "react-router-dom";
import NavTabs from "../../../component/tabs/NavTabs";
import { Space, Switch, Tabs } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import AssessmentForm from "../../../component/forms/AssessmentForm";
import AssessmentSheet from "../../../component/forms/AssessmentSheet";
import { IoMdArrowRoundBack } from "react-icons/io";
import PaymentForm from "../../../component/forms/PaymentForm";
import Treatment from "../../../component/treatment/Treatment";

const Assessment = () => {
  const currentPage = "patient";
  const currentTab = "assessment form";
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-between items-center max-md:items-start max-md:mb-2 max-md:flex-col">
        <NavTabs currentPage={currentPage} currentTab={currentTab} />

        <button
          onClick={() => navigate(-1)}
          className="bg-[#075985] text-white font-medium flex flex-row items-center gap-2 px-4 py-2 rounded-md hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-200 ease-out hover:shadow-md"
        >
          <IoMdArrowRoundBack /> Back
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <Tabs
          defaultActiveKey="1"
          animated={{ inkBar: true, tabPane: true }}
          tabBarStyle={{ fontWeight: "bold" }}
          className=""
        >
          <TabPane tab="Assessment" key="2">
            <div  className="mt-4 flex flex-col gap-5 w-full min-h-[60vh] shadow-md rounded-md border-t-2 border-gray-300 p-2">
              <AssessmentForm />
              <AssessmentSheet />
              <Treatment />
            </div>
          </TabPane>

        </Tabs>
      </div>
    </div>
  );
};

export default Assessment;
