import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import NavTabs from "../../../component/tabs/NavTabs";
import { MdOutlineAddchart, MdRefresh } from "react-icons/md";
import DailyReportForm from "../../../component/forms/DailyReportForm";
import DailyReportTable from "../../../component/tables/DailyReportTable";
import AxiosInstance from "../../../utilities/AxiosInstance";

const DailyReport = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dailyReport, setDailyReport] = useState([]);
  const [totalCensusPatientsDateWise, setTotalCensusPatientsDateWise] =
    useState([]);
  const [dailyCollectionAsOn, setDailyCollectionAsOn] = useState({
    daily_total: 0,
    package_total: 0,
    bill_total: 0,
    total_amt: 0,
  });
  const [dailyCollectionCard, setDailyCollectionCard] = useState({
    bill_total: 0,
    daily_total: 0,
    package_total: 0,
    sitting_total: 0,
    total_amt: 0,
  });
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const userInfo = JSON.parse(sessionStorage.getItem("user"));

  const currentPageTab = "Patient";
  const currentTab = "Daily Report";

  const getCurrentMonth = () => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "long" });
    return month;
  };

  const getCurrentYear = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    return year;
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
    handleGetCensus();
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const getDailyCollectionCard = async () => {
    try {
      const response = await AxiosInstance.get(
        `/dailyreport/get-dailycollection/${userInfo?.u_vClinicId}/${
          new Date().toISOString().split("T")[0]
        }`
      );
      setDailyCollectionCard(
        response.data.response || {
          bill_total: "0",
          daily_total: "0.00",
          package_total: "0.00",
          sitting_total: "0.00",
          total_amt: "0.00",
        }
      );
      console.log(response.data.response, "response1");
    } catch (error) {
      console.log(error);
    }
  };

  const getDailyCollection = async () => {
    try {
      const response = await AxiosInstance.get(
        `/dailyreport/get-dailycollection/${userInfo?.u_vClinicId}`
      );
      setDailyCollectionAsOn(
        response.data.response || {
          daily_total: 0,
          package_total: 0,
          bill_total: 0,
          total_amt: 0,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getDailyReport = async () => {
    try {
      const response = await AxiosInstance.get(
        `/census/get-total-census-service/${userInfo?.u_vClinicId}`
      );
      setDailyReport(response.data.response || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    await getDailyReport();
    setSelectedDate("");
    setTotalCensusPatientsDateWise([]);
    setData([]);
  };

  const handleGetCensus = async () => {
    try {
      const response = await AxiosInstance.post(
        `/census/get-total-census-service-by-date`,
        {
          cs_vclinicid: userInfo.u_vClinicId,
          cs_vcensusdate: new Date().toISOString().split("T")[0],
        }
      );
      console.log(response, "response");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    getDailyCollection();
    getDailyCollectionCard();
  }, []);

  return (
    <div>
      {/* Headers */}
      <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] animationtext m-0">
          V3 Clinic - Daily Report ({getCurrentMonth()}-{getCurrentYear()})
        </h1>
      </div>
      <hr className="my-2 bg-[--navbar-bg-color]" />
      <NavTabs currentPage={currentPageTab} currentTab={currentTab} />
      <div className="flex flex-wrap w-full gap-5 overflow-auto my-5">
        <div className="min-w-[250px] border border-[--navbar-bg-color] overflow-hidden rounded-md min-h-[120px] shadow-md flex flex-col justify-between items-center">
          <h1 className="bg-[--navbar-bg-color] text-white w-full text-center py-1">
            {dailyReport?.[0]?.service}
          </h1>
          <div className="overflow-hidden flex flex-col w-full">
            <div className="p-2 w-full flex flex-row justify-evenly items-center">
              <div className="flex flex-col gap-2">
                <p className="bg-blue-200 px-2 rounded-md">Male</p>
                <p className="bg-blue-200 px-2 rounded-md text-center">
                  {dailyReport?.[0]?.male_count}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="bg-pink-200 px-2 rounded-md">Female</p>
                <p className="bg-pink-200 px-2 rounded-md text-center">
                  {dailyReport?.[0]?.female_count}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-[250px] border border-[--navbar-bg-color] overflow-hidden rounded-md min-h-[120px] shadow-md flex flex-col justify-between items-center">
          <h1 className="bg-[--navbar-bg-color] text-white w-full text-center py-1">
            {dailyReport?.[1]?.service}
          </h1>
          <div className="overflow-hidden flex flex-col w-full">
            <div className="p-2 w-full flex flex-row justify-evenly items-center">
              <div className="flex flex-col gap-2">
                <p className="bg-blue-200 px-2 rounded-md">Male</p>
                <p className="bg-blue-200 px-2 rounded-md text-center">
                  {dailyReport?.[1]?.male_count}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="bg-pink-200 px-2 rounded-md">Female</p>
                <p className="bg-pink-200 px-2 rounded-md text-center">
                  {dailyReport?.[1]?.female_count}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-[250px] border border-[--navbar-bg-color] overflow-hidden gap-3 rounded-md min-h-[120px] shadow-md flex flex-col items-center">
          <h1 className="bg-[--navbar-bg-color] text-white w-full text-center py-1">
            {dailyReport?.[2]?.service}
          </h1>
          <div className="overflow-hidden flex flex-col items-center justify-center w-full">
            <div className="p-2 w-full flex flex-row justify-evenly items-center">
              <div className="flex flex-col gap-2">
                <p className="bg-blue-200 px-2 rounded-md">Male</p>
                <p className="bg-blue-200 px-2 rounded-md text-center">
                  {dailyReport?.[2]?.male_count}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="bg-pink-200 px-2 rounded-md">Female</p>
                <p className="bg-pink-200 px-2 rounded-md text-center">
                  {dailyReport?.[2]?.female_count}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-[250px] border border-[--navbar-bg-color] overflow-hidden  p-2 rounded-md min-h-[120px] shadow-md flex flex-col items-center">
          <div className="flex flex-row items-center justify-between w-full border-b-2 border-gray-300">
            <h1 className="text-base font-bold text-center flex items-center justify-center">
              {dailyReport?.[3]?.service}
            </h1>
            <p className="text-base font-bold bg-blue-200 px-2 rounded-md text-center">
              {dailyReport?.[3]?.male_count}
            </p>
            <p className="text-base font-bold bg-pink-200 px-2 rounded-md text-center">
              {dailyReport?.[3]?.female_count}
            </p>
          </div>
          <div className="flex flex-row gap-5 items-center text-center justify-between w-full border-b-2 border-gray-300">
            <h1 className="m-0">DAILY COLLECTION</h1>
            <p className="text-2xl font-bold text-[--navbar-bg-color] m-0">
              {dailyCollectionCard.total_amt}
            </p>
          </div>
          <div className="flex flex-row gap-5 items-center justify-between w-full">
            <h1 className="m-0">COLLECTION AS ON</h1>
            <p className="text-2xl font-bold text-[--navbar-bg-color] m-0">
              {dailyCollectionAsOn.total_amt}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-100 px-3 rounded text-blue-700 font-semibold hover:bg-blue-200 duration-300 flex items-center gap-2 border border-blue-500"
        >
          <MdRefresh size={20} />
        </button>
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 p-2 rounded text-white font-semibold hover:bg-blue-600 duration-300 flex items-center gap-2"
        >
          <span>Add Report</span> <MdOutlineAddchart size={20} />
        </button>
      </div>
      <div className="my-5">
        <DailyReportTable
          data={data}
          totalCensusPatientsDateWise={totalCensusPatientsDateWise}
        />
      </div>
      <Modal
        title="Add Daily Report"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <DailyReportForm
          setIsModalVisible={setIsModalVisible}
          dailyCollectionAsOn={dailyCollectionAsOn}
          dailyCollectionCard={dailyCollectionCard}
        />
      </Modal>
    </div>
  );
};

export default DailyReport;
