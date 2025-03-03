import React, { useEffect, useState } from "react";
import { Modal, Input, Form, Button, message } from "antd";
import { IoPersonAdd } from "react-icons/io5";
import AxiosInstance from "../../../utilities/AxiosInstance";
import EmployeeList from "../../../component/tables/EmployeeList";
import { MdScheduleSend } from "react-icons/md";
import { Link } from "react-router-dom";

const Employees = () => {
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null); // State to hold employee being edited
  const [form] = Form.useForm();

  const getEmployees = async () => {
    try {
      const response = await AxiosInstance.get(
        `/employee/get-employee-clinicid/${userInfo.u_vClinicId}`
      );
      setEmployees(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployees();
  }, [userInfo.u_vClinicId]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingEmployee(null); // Reset editing state
  };

  const handleFormSubmit = async (values) => {
    try {
      const apiUrl = editingEmployee
        ? `/employee/edit-employee/${editingEmployee.e_vEmp_id}`
        : `/employee/add-employee`;

      const response = await AxiosInstance[editingEmployee ? "patch" : "post"](
        apiUrl,
        {
          ...values,
          e_vClinic_id: userInfo.u_vClinicId,
        }
      );
      

      if (response.data.status === 201 || response.data.status === 200) {
        message.success(response.data.message);
        form.resetFields();
        setIsModalVisible(false);
        setEditingEmployee(null); // Clear editing state
        getEmployees();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Error saving employee");
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee); // Set employee to edit
    form.setFieldsValue(employee); // Populate the form with employee data
    setIsModalVisible(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] animationtext m-0">
          Employees
        </h1>
      </div>
      <div className="mt-10">
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              showModal();
              setEditingEmployee(null); // Ensure it's in add mode
            }}
            className="flex items-center gap-2 bg-green-500 p-2 rounded-lg text-white"
          >
            <span>Add Employee</span>
            <IoPersonAdd />
          </button>

          <Link
            to={"/physio/employees/attendance"}
            className="flex items-center gap-2 bg-blue-500 p-2 rounded-lg text-white"
          >
            <span>Attendance</span>
            <MdScheduleSend />
          </Link>
        </div>
      </div>

      <Modal
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Employee Name"
            name="e_vName"
            rules={[
              { required: true, message: "Please enter the employee name" },
            ]}
          >
            <Input placeholder="Enter employee name" className="shadow-md" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="e_vrole"
            rules={[{ required: true, message: "Please enter the role" }]}
          >
            <Input placeholder="Enter role" className="shadow-md" />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="e_vPhone"
            rules={[
              { required: true, message: "Please enter the phone number" },
              { pattern: /^[0-9]+$/, message: "Phone number must be numeric" },
              {
                min: 10,
                message: "Phone number must be at least 10 digits long",
              },
              {
                max: 15,
                message: "Phone number must be at most 15 digits long",
              },
            ]}
          >
            <Input placeholder="Enter phone number" className="shadow-md" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="e_vEmail"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" className="shadow-md" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="e_tAddress"
            rules={[{ required: true, message: "Please enter the address" }]}
          >
            <Input placeholder="Enter address" className="shadow-md" />
          </Form.Item>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit">
              {editingEmployee ? "Update" : "Submit"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Employee List */}
      <div>
        <EmployeeList
          employees={employees}
          onEditEmployee={handleEditEmployee}
          style
        />
      </div>
    </div>
  );
};

export default Employees;
