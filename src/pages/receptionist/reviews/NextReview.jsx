import React, { useEffect, useState } from "react";
import NavTabs from "../../../component/tabs/NavTabs";
import "../../physio/patient/patient.css";
import AxiosInstance from "../../../utilities/AxiosInstance";
import NextReviewTable from "../../../component/tables/NextReviewTable";

const NextReview = () => {
  const currentPage = "home";
  const currentTab = "next review";
  const [data, setData] = useState([]);

  const userInfo = JSON.parse(sessionStorage.getItem("user"));

  const getNextReviewPatients = async () => {
    try {
      const response = await AxiosInstance.get(
        `/assessmentform/get-nextreview/${userInfo.u_vClinicId}`
      );
      setData(response.data.response?.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNextReviewPatients();
  }, []);

  return (
    <div className=" bg-gray-100 min-h-screen">
      {/* Headers */}
      <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] animationtext m-0">
          Next Review
        </h1>
      </div>
      <hr className="my-2" />
      <NavTabs currentPage={currentPage} currentTab={currentTab} />

      <div className="mt-6">
        {/* Table */}
        <div>
          <NextReviewTable data={data} />
        </div>
      </div>
    </div>
  );
};

export default NextReview;
