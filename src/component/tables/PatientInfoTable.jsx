import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import "./Table.css";
import AxiosInstance from "../../utilities/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { IoMdPersonAdd } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import BillForm from "../forms/NormalBillForm";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { FaWhatsapp } from "react-icons/fa";

const PatientInfoTable = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [patientTypeFilter, setPatientTypeFilter] = useState("");

  const navigate = useNavigate();

  const user = sessionStorage.getItem("user");
  const clinic_id = JSON.parse(user)?.u_vClinicId;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.post(
        "/patient/get-patientByClinicId",
        {
          id: clinic_id,
          params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            search: search || "",
            gender: genderFilter || "",
            patientType: patientTypeFilter || "",
          },
        }
      );

      setData(response.data.response || []);
      setPagination((prev) => ({
        ...prev,
        total: filteredData.length,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [
    pagination.current,
    pagination.pageSize,
    search,
    genderFilter,
    patientTypeFilter,
  ]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on search
  };

  const handleGenderFilterChange = (e) => {
    setGenderFilter(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on filter change
  };

  const handlePatientTypeFilterChange = (e) => {
    setPatientTypeFilter(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on filter change
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = search
      ? Object.values(item).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      : true;

    const matchesGender = genderFilter ? item.p_egender === genderFilter : true;
    const matchesType = patientTypeFilter
      ? item.p_epatient_type === patientTypeFilter
      : true;

    return matchesSearch && matchesGender && matchesType;
  });

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "p_vid",
      sorter: true,
    },
    {
      title: "Name",
      dataIndex: "p_vName",
      sorter: true,
    },
    {
      title: "Mobile Number",
      dataIndex: "p_vPhone",
      sorter: true,
    },
    {
      title: "Edit",
      render: (patient) => (
        <Link
          to={`/receptionist/enquiry-registration/${patient.p_vid}`}
          className="bg-slate-600 px-3 py-1 rounded shadow-md text-white text-base hover:text-slate-600 hover:bg-slate-600 hover:bg-opacity-20"
        >
          Edit
        </Link>
      ),
    },
    {
      title: "View",
      render: (patient) => (
        <Link
          to={`/patient-details/${patient.p_vid}`}
          className="bg-blue-500 px-3 py-1 rounded shadow-md text-white text-base hover:text-blue-600 hover:bg-blue-600 hover:bg-opacity-20"
        >
          View
        </Link>
      ),
    },

    {
      title: "Bill",
      render: (patient) => (
        <Link
          to={`/receptionist/all-bills/${patient.p_vid}`}
          className="bg-red-500 px-3 py-1 rounded shadow-md text-white text-base hover:text-red-600 hover:bg-red-600 hover:bg-opacity-20"
        >
          View
        </Link>
      ),
    },
    {
      title: "Greetings",
      render: (patient) => (
        <Link to={`/patient-greetings/${patient.p_vid}`}
        className="flex items-center justify-center">
          <div className="w-fit px-3 flex items-center duration-200 justify-center gap-2 bg-green-500 rounded shadow-md text-white text-base hover:text-green-600 hover:bg-green-600 hover:bg-opacity-20">
            <i>
              <FaWhatsapp size={20} />
            </i>
            <p className="my-1">View</p>
          </div>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between max-lg:flex-col max-lg:gap-4 items-center mt-4 pb-5">
        <div className="flex max-md:flex-col max-lg:flex-row max-lg:w-full md:flex-wrap max-md:w-fit items-center gap-4">
          <div className="flex items-center gap-2 bg-white pr-0 relative rounded shadow-md">
            <input
              type="text"
              className="w-44 max-sm:w-full px-4 py-2 outline-none rounded-lg"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
            />
            <IoSearchOutline className="absolute right-2" />
          </div>
          <select
            className="px-4 py-2 max-sm:w-full min-w-44 border rounded shadow-md"
            value={genderFilter}
            onChange={handleGenderFilterChange}
          >
            <option value="">Filter by Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Others</option>
          </select>
        </div>

        <div className="flex flex-row max-lg:w-full items-center gap-2 flex-wrap mx-4">
          {selectedRows.length > 0 && (
            <div
              className={`bg-red-500 text-white px-4 py-2 border rounded-lg shadow-md w-fit flex items-center gap-2 max-sm:gap-0`}
            >
              <button>
                <p className="max-sm:hidden">Delete Patient</p>
              </button>
              <AiFillDelete size={20} />
            </div>
          )}
        </div>
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record.p_vid}
        dataSource={filteredData} // Use filteredData for local filtering
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={modalData?.billType.toUpperCase() + " " + "BILL"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {modalData && (
          <>
            {" "}
            {modalData?.billType === "normal" && (
              <div className="border-t-4 border-[--navbar-bg-color] rounded-md p-4 shadow-md w-full">
                <BillForm
                  modelData={modalData}
                  setIsModalVisible={setIsModalVisible}
                />
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default PatientInfoTable;
