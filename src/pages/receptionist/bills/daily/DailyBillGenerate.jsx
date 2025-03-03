import React, { useEffect, useState } from "react";
import NavTabs from "../../../../component/tabs/NavTabs";
import { Link, useParams, useNavigate } from "react-router-dom";
import AxiosInstance from "../../../../utilities/AxiosInstance";
import { Empty } from "antd";
import { IoMdArrowRoundBack } from "react-icons/io";

const DailyBillGenerate = () => {
  const navigate = useNavigate();
  const currentPage = "Patient";
  const currentTab = "daily Bills";
  const [dailyBills, setDailyBills] = useState([]);
  const { id } = useParams();
  const getDailyBills = async () => {
    try {
      const response = await AxiosInstance.post(
        "/dailybill/getdailybillbypatientid",
        {
          db_vpatient_id: id,
        }
      );

      setDailyBills(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDailyBills();
  }, []);

  return (
    <div>
      <NavTabs currentPage={currentPage} currentTab={currentTab} />
      <button
        className="bg-[--navbar-bg-color] mb-4 gap-3 flex-nowrap flex items-center justify-center px-4 hover:shadow-md p-2 hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-200 text-white rounded-md"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowRoundBack /> Back
      </button>
      <div className="bg-gray-50 rounded-lg shadow-md p-10 px-0 flex w-full flex-row flex-wrap items-center justify-evenly gap-5">
        {dailyBills?.length > 0 ? (
          dailyBills?.map((bill, index) => (
            <div
              key={bill.db_vid}
              className="w-full md:w-96 bg-gradient-to-r from-white to-gray-50 p-8 rounded-xl shadow-lg border-l-4 border-[--navbar-bg-color] transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col items-center">
                  <div className="flex gap-3 flex-row items-center justify-center">
                    <div className="h-8 w-8 bg-[--navbar-bg-color] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 m-0">
                      Bill #{bill.db_vid}
                    </h1>
                  </div>
                  <Link
                    to={`/receptionist/daily-bills-generate/${bill.db_vid}`}
                    className="px-4 py-2 bg-[--navbar-bg-color] text-white rounded-lg hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] transform transition-all duration-300 flex items-center gap-2"
                  >
                    <span>View Details</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
                {bill.db_vtreatmetndoneby && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center flex-row justify-start gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 p-1 text-[--navbar-bg-color] bg-[--light-navbar-bg-color] rounded-md"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-700 m-0">
                        <span className="font-semibold">Treatment by:</span>
                        <span className="ml-2 text-gray-800 bg-[--light-navbar-bg-color] px-2 py-1 rounded-full">
                          {bill.db_vtreatmetndoneby}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
};

export default DailyBillGenerate;
