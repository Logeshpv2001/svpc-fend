import React, { useEffect, useState } from "react";
import "./Bill.css";
import "../../physio/patient/patient.css";
import { Link, useNavigate } from "react-router-dom";

import { Table } from "antd";

import { IoSearchOutline } from "react-icons/io5";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../utilities/AxiosInstance";

const Bill = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

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
      title: "Generate",
      render: (patient) => {
        const handleMenuClick = ({ key }) => {
          switch (key) {
            case "bill":
              navigate(`/physio/daily-bill/${patient.p_vid}`);
              break;
            case "package":
              navigate(`/physio/package-bill/${patient.p_vid}`);
              break;
            case "agency":
              navigate(`/receptionist/agency-bill/${patient.p_vid}`);
              break;
            case "return":
              navigate(`/receptionist/return-bill/${patient.p_vid}`);
              break;
            default:
              break;
          }
        };

        const menuItems = [
          {
            key: "bill",
            label: (
              <Link
                to="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Daily Receipt
              </Link>
            ),
          },
          {
            key: "package",
            label: (
              <Link
                to="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Package Receipt
              </Link>
            ),
          },
          {
            key: "agency",
            label: (
              <Link
                to="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Agency Receipt
              </Link>
            ),
          },
          {
            key: "return",
            label: (
              <Link
                to="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Return Receipt
              </Link>
            ),
          },
        ];

        const menu = (
          <Menu
            className="bg-white rounded-md shadow-lg"
            items={menuItems}
            onClick={handleMenuClick}
          />
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomCenter">
            <button className="bg-red-500 px-3 py-1 rounded text-white shadow-md text-base hover:text-red-500 hover:bg-red-500 duration-200 hover:bg-opacity-20">
              Bill <DownOutlined />
            </button>
          </Dropdown>
        );
      },
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
    </div>
  );
};

export default Bill;
