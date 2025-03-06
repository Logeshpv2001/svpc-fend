import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";
import { message } from "antd";

const DailyReportForm = ({ setIsModalVisible }) => {
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const [formData, setFormData] = useState({
    adr_vdate: new Date().toISOString().split("T")[0],
    adr_ortho_fmale: "",
    adr_ortho_male: "",
    adr_neuro_fmale: "",
    adr_neuro_male: "",
    adr_pfd_fmale: "",
    adr_pfd_male: "",
    adr_tcemsus: "",
    adr_dcoll: "",
    adr_collon: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getDailyCollectionCard = async () => {
    try {
      const response = await AxiosInstance.get(
        `/dailyreport/get-dailycollection/${userInfo?.u_vClinicId}/${
          new Date().toISOString().split("T")[0]
        }`
      );
      setFormData((prev) => ({
        ...prev,
        adr_dcoll: response.data.response.total_amt,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const getDailyCollection = async () => {
    try {
      const response = await AxiosInstance.get(
        `/dailyreport/get-dailycollection/${userInfo?.u_vClinicId}`
      );
      setFormData((prev) => ({
        ...prev,
        adr_collon: response.data.response.total_amt,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      adr_vclinicid: userInfo.u_vClinicId,
      ...formData,
    };
    console.log(payload, "payload");
    try {
      const response = await AxiosInstance.post(
        "/dailyreport/add-dailyreport",
        payload
      );

      if (response.data.status === 201) {
        message.success(response.data.message);
        setIsModalVisible(false);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting daily report:", error);
      message.error("Failed to submit daily report");
    }
  };

  const fetchDailyReportData = async () => {
    try {
      const response = await AxiosInstance.post(
        "/census/get-total-census-service-by-date",
        {
          cs_vcensusdate: formData.adr_vdate,
          cs_vclinicid: userInfo.u_vClinicId,
        }
      );
      console.log(response, "response");

      if (response.data.response) {
        setFormData((prev) => ({
          ...prev,
          adr_ortho_fmale: response?.data?.response["Ortho"]?.female_count || 0,
          adr_ortho_male: response?.data?.response["Ortho"]?.male_count || 0,
          adr_neuro_fmale: response?.data?.response["Neuro"]?.female_count || 0,
          adr_neuro_male: response?.data?.response["Neuro"]?.male_count || 0,
          adr_pfd_fmale:
            response?.data?.response["Pelvic Floor Dysfunction"]
              ?.female_count || 0,
          adr_pfd_male:
            response?.data?.response["Pelvic Floor Dysfunction"]?.male_count ||
            0,
          adr_tcemsus:
            response?.data?.response["Total Census Patients"]?.service_count ||
            0,
        }));
      }
    } catch (error) {
      console.error("Error fetching daily report:", error);
      message.error("Failed to fetch daily report data");
    }
  };
  useEffect(() => {
    fetchDailyReportData();
    getDailyCollectionCard();
    getDailyCollection();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <form className="space-y-2" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="adr_vdate" className="text-base font-semibold mb-1">
            Date
          </label>
          <input
            type="date"
            id="adr_vdate"
            name="adr_vdate"
            value={formData.adr_vdate}
            onChange={handleChange}
            className="border border-gray-300 p-1 rounded"
            disabled
          />
        </div>

        <div className="">
          <div>
            <h1 className="text-base font-semibold mb-2">Ortho</h1>
            <div className="flex items-center gap-4">
              <input
                type="number"
                name="adr_ortho_fmale"
                placeholder="Female"
                value={formData.adr_ortho_fmale}
                onChange={handleChange}
                className="border border-pink-300 p-1 rounded w-full"
                disabled
              />
              <input
                type="number"
                name="adr_ortho_male"
                placeholder="Male"
                value={formData.adr_ortho_male}
                onChange={handleChange}
                className="border border-blue-300 p-1 rounded w-full"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="">
          <div>
            <h1 className="text-base font-semibold mb-2">Neuro</h1>
            <div className="flex items-center gap-4">
              <input
                type="number"
                name="adr_neuro_fmale"
                placeholder="Female"
                value={formData.adr_neuro_fmale}
                onChange={handleChange}
                className="border border-pink-300 p-1 rounded w-full"
                disabled
              />
              <input
                type="number"
                name="adr_neuro_male"
                placeholder="Male"
                value={formData.adr_neuro_male}
                onChange={handleChange}
                className="border border-blue-300 p-1 rounded w-full"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="pfd" className="text-lg font-semibold mb-1 block">
              PFD
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                name="adr_pfd_fmale"
                placeholder="Female"
                value={formData.adr_pfd_fmale}
                onChange={handleChange}
                className="border border-pink-300 p-1 rounded w-full"
                disabled
              />
              <input
                type="number"
                name="adr_pfd_male"
                placeholder="Male"
                value={formData.adr_pfd_male}
                onChange={handleChange}
                className="border border-blue-300 p-1 rounded w-full"
                disabled
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="adr_tcemsus"
              className="text-lg font-semibold mb-1 block"
            >
              Total Census
            </label>
            <input
              type="number"
              name="adr_tcemsus"
              value={formData.adr_tcemsus}
              onChange={handleChange}
              className="border border-gray-300 p-1 rounded w-full"
              disabled
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="adr_dcoll"
              className="text-lg font-semibold mb-1 block"
            >
              Daily Collection
            </label>
            <input
              type="number"
              name="adr_dcoll"
              value={formData.adr_dcoll}
              onChange={handleChange}
              className="border border-gray-300 p-1 rounded w-full"
            />
          </div>
          <div>
            <label
              htmlFor="adr_collon"
              className="text-lg font-semibold mb-1 block"
            >
              Collection as on
            </label>
            <input
              type="number"
              name="adr_collon"
              value={formData.adr_collon}
              onChange={handleChange}
              className="border border-gray-300 p-1 rounded w-full"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold px-4 py-1 rounded w-fit hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyReportForm;
