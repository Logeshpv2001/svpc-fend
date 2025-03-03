import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";
import { message, Modal } from "antd";

const DailyReportTable = ({ data }) => {
  const userInfo = JSON.parse(sessionStorage.getItem("user")) || {};
  const [totalCensusPatientsDateWise, setTotalCensusPatientsDateWise] =
    useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  const itemsPerPage = 7;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter data based on date
  const filteredData = filterDate
    ? totalCensusPatientsDateWise.filter((item) => {
        const itemDate = new Date(item.adr_vdate).toLocaleDateString("en-GB");
        return itemDate === new Date(filterDate).toLocaleDateString("en-GB");
      })
    : totalCensusPatientsDateWise;

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setIsModalVisible(true);
  };

  const handleFilterChange = (e) => {
    setFilterDate(e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setFilterDate("");
    setCurrentPage(1);
  };

  const getTotalCensusPatientsDateWise = async () => {
    try {
      const response = await AxiosInstance.get(
        `/dailyreport/get-all/${userInfo.u_vClinicId}`
      );
      setTotalCensusPatientsDateWise(response.data.response || []);
    } catch (error) {
      console.log(error);
      setTotalCensusPatientsDateWise([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await AxiosInstance.patch(
        `/dailyreport/edit-dailyreport/${editData.adr_vid}`,
        editData
      );
      if (response.status === 200) {
        setIsModalVisible(false);
        getTotalCensusPatientsDateWise();
        message.success("Edited successfully");
      }
    } catch (error) {
      console.error(error);
      message.error(error);
    }
  };

  const handleDelete = async (item) => {
    try {
      const response = await AxiosInstance.patch(
        `/dailyreport/softdelete-dailyreport/${item.adr_vid}`
      );
      if (response.status === 200) {
        getTotalCensusPatientsDateWise();
        message.success("Deleted successfully");
      }
    } catch (error) {
      console.error(error);
      message.error(error);
    }
  };

  useEffect(() => {
    getTotalCensusPatientsDateWise();
  }, []);

  return (
    <div>
      {/* Filter */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="date"
          value={filterDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <button
          onClick={handleClearFilter}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Clear Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-center ">
          <thead className="text-white">
            <tr>
              <th className="border bg-[--navbar-bg-color] p-2" rowSpan="3">
                S.No
              </th>
              <th className="border bg-[--navbar-bg-color] p-2" rowSpan="3">
                DATE
              </th>
              <th className="border bg-[--navbar-bg-color] p-2" colSpan="4">
                NEURO
              </th>
              <th className="border bg-[--navbar-bg-color] p-2" colSpan="4">
                ORTHO
              </th>
              <th className="border bg-[--navbar-bg-color] p-2" colSpan="2">
                PFD
              </th>
              <th className="border bg-[--navbar-bg-color] p-2" rowSpan="3">
                TOTAL CENSUS
              </th>
              <th className="border bg-[--navbar-bg-color] p-2" rowSpan="3">
                DAILY COLLECTION
              </th>
              <th className="border bg-[--navbar-bg-color] p-2" rowSpan="3">
                COLLECTION AS ON
              </th>
              <th className="border bg-[--navbar-bg-color] p-2" rowSpan="3">
                ACTION
              </th>
            </tr>
            <tr>
              <th className="border bg-[--navbar-bg-color] p-2" colSpan="2">
                OLD
              </th>
              <th className="border bg-[--navbar-bg-color] p-2" colSpan="2">
                NEW
              </th>
              <th className="border bg-[--navbar-bg-color] p-2" colSpan="2">
                OLD
              </th>
              <th className="border bg-[--navbar-bg-color] p-2" colSpan="2">
                NEW
              </th>
              <th className="border bg-[--navbar-bg-color] p-2"></th>
              <th className="border bg-[--navbar-bg-color] p-2"></th>
            </tr>
            <tr>
              <th className="border bg-[--navbar-bg-color] p-2">F</th>
              <th className="border bg-[--navbar-bg-color] p-2">M</th>
              <th className="border bg-[--navbar-bg-color] p-2">F</th>
              <th className="border bg-[--navbar-bg-color] p-2">M</th>
              <th className="border bg-[--navbar-bg-color] p-2">F</th>
              <th className="border bg-[--navbar-bg-color] p-2">M</th>
              <th className="border bg-[--navbar-bg-color] p-2">F</th>
              <th className="border bg-[--navbar-bg-color] p-2">M</th>
              <th className="border bg-[--navbar-bg-color] p-2">F</th>
              <th className="border bg-[--navbar-bg-color] p-2">M</th>
            </tr>
          </thead>

          <tbody>
            {[...filteredData].reverse().map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2 text-nowrap">
                  {new Date(item.adr_vdate).toLocaleDateString("en-GB")}
                </td>
                <td className="border p-2">{item.adr_neuro_fmale || "0"}</td>
                <td className="border p-2">{item.adr_neuro_male || "0"}</td>
                <td className="border p-2">{}</td>
                <td className="border p-2">{}</td>
                <td className="border p-2">{item.adr_ortho_fmale || "0"}</td>
                <td className="border p-2">{item.adr_ortho_male || "0"}</td>
                <td className="border p-2">{}</td>
                <td className="border p-2">{}</td>
                <td className="border p-2">{item.adr_pfd_fmale}</td>
                <td className="border p-2">{item.adr_pfd_male}</td>
                <td className="border p-2">{item.adr_tcemsus}</td>
                <td className="border p-2">{item.adr_dcoll}</td>
                <td className="border p-2">{item.adr_collon}</td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white p-2 rounded-md"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-md"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Daily Report"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        {editData && (
          <div className="flex flex-col gap-4">
            <div>
              <label>Neuro Female (Old):</label>
              <input
                type="number"
                name="adr_neuro_fmale"
                value={editData.adr_neuro_fmale}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>Neuro Male (Old):</label>
              <input
                type="number"
                name="adr_neuro_male"
                value={editData.adr_neuro_male}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>Ortho Female (Old):</label>
              <input
                type="number"
                name="adr_ortho_fmale"
                value={editData.adr_ortho_fmale}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>Ortho Male (Old):</label>
              <input
                type="number"
                name="adr_ortho_male"
                value={editData.adr_ortho_male}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>PFD Female:</label>
              <input
                type="number"
                name="adr_pfd_fmale"
                value={editData.adr_pfd_fmale}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>PFD Male:</label>
              <input
                type="number"
                name="adr_pfd_male"
                value={editData.adr_pfd_male}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>Total Census:</label>
              <input
                type="number"
                name="adr_tcemsus"
                value={editData.adr_tcemsus}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>Daily Collection:</label>
              <input
                type="number"
                name="adr_dcoll"
                value={editData.adr_dcoll}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>Collection As On:</label>
              <input
                type="number"
                name="adr_collon"
                value={editData.adr_collon}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        <button
          className="border p-2 mx-1"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`border p-2 mx-1 ${
              currentPage === i + 1 ? "bg-gray-200" : ""
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="border p-2 mx-1"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DailyReportTable;
