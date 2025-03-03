import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdViewAgenda } from "react-icons/md";
import { Modal } from "antd";
import AxiosInstance from "../../utilities/AxiosInstance";

const EmployeeList = ({ employees, onEditEmployee }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null); // Holds the employee to be viewed
  const itemsPerPage = 10;

  const filteredEmployees = employees?.filter((employee) =>
    Object.values(employee).some((value) =>
      value?.toLowerCase?.().includes(filterText.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredEmployees?.length / itemsPerPage);
  const currentPageData = filteredEmployees?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  async function handleView(e_vEmp_id) {
    try {
      const response = await AxiosInstance.get(
        `/employee/get-employee/${e_vEmp_id}`
      );
      setViewEmployee(response.data.response); // Set the employee data
      setIsModalVisible(true); // Show the modal
    } catch (error) {
      console.log(error);
    }
  }

  const closeModal = () => {
    setIsModalVisible(false);
    setViewEmployee(null); // Clear the employee data
  };

  return (
    <div>
      {/* Search Input */}
      <div className="relative my-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="pl-10 pr-4 py-2 shadow-md border rounded-lg w-fit focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-md shadow-md text-nowrap">
        <table className="employee-table w-full text-center bg-white">
          <thead className="bg-[--navbar-bg-color] text-white sticky top-0">
            <tr>
              <th className="p-2 border">S.No</th>
              <th className="p-2 border">Employee ID</th>
              <th className="p-2 border">Employee Name</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Phone Number</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">View</th>
              <th className="p-2 border">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData?.map((employee, index) => (
              <tr key={index}>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{employee.e_vEmp_id}</td>
                <td className="p-2 border">{employee.e_vName}</td>
                <td className="p-2 border">{employee.e_vrole}</td>
                <td className="p-2 border">{employee.e_vPhone}</td>
                <td className="p-2 border">{employee.e_vEmail}</td>
                <td className="p-2 border">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleView(employee.e_vEmp_id)}
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-red-500 hover:text-red-800 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                    >
                      <MdViewAgenda className="text-lg" />
                      View
                    </button>
                  </div>
                </td>
                <td className="p-2 border">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => onEditEmployee(employee)}
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                    >
                      <FaEdit className="text-lg" />
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-4 mb-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border rounded-md"
        >
          <IoIosArrowBack />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white border rounded-md"
        >
          <IoIosArrowForward />
        </button>
      </div>

      {/* Ant Design Modal for View */}
      <Modal
        title="Employee Details"
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {viewEmployee ? (
          <div className="p-4 gap-2 flex flex-col border-t-4 border-[--navbar-bg-color] rounded-md shadow-md">
            <p className="w-full flex justify-between items-center">
              <strong>ID:</strong> {viewEmployee.e_vEmp_id}
            </p>
            <p className="w-full flex justify-between items-center">
              <strong>Name:</strong> {viewEmployee.e_vName}
            </p>
            <p className="w-full flex justify-between items-center">
              <strong>Role:</strong> {viewEmployee.e_vrole}
            </p>
            <p className="w-full flex justify-between items-center">
              <strong>Phone:</strong> {viewEmployee.e_vPhone}
            </p>
            <p className="w-full flex justify-between items-center">
              <strong>Email:</strong> {viewEmployee.e_vEmail}
            </p>
            <p className="w-full flex justify-between items-center">
              <strong>Address:</strong> {viewEmployee.e_tAddress}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeList;
