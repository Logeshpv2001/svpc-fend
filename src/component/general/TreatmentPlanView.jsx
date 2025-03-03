import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";
import { useParams } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";
import { message } from "antd";
import TreatmentPlanGraph from "../../component/graphs/TreatmentPlanGraph";

const TreatmentPlanView = () => {
  const { patient_id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinic_id = user.u_vClinicId;
  const userName = user.u_vName;
  const [treatmentPlan, setTreatmentPlan] = useState([]);
  const [editablePlan, setEditablePlan] = useState(null);

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getTreatmentDetails = async () => {
    try {
      const response = await AxiosInstance.post(
        "/treatment/get-treatment-plans",
        {
          tp_vpid: patient_id,
          tp_vclinicid: clinic_id,
        }
      );
      setTreatmentPlan(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (plan) => {
    setEditablePlan({
      tp_vclinicid: clinic_id,
      tp_vtid: plan.tp_vtid,
      tp_vreassdoneby: userName,
      tp_vpid: patient_id,
      tp_iscale: plan.tp_iscale,
      tp_vpcomp: plan.tp_vpcomp,
      tp_vtproto: plan.tp_vtproto,
      tp_vdate: plan.tp_vdate,
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await AxiosInstance.patch(
        `/treatment/delete-treatmnet/${id}`
      );
      if (response.data.status == 200) {
        message.success("Treatment plan deleted successfully");
        getTreatmentDetails();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await AxiosInstance.patch(
        "/treatment/edit-treatment-plan",
        editablePlan
      );
      if (response.data.status == 200) {
        message.success("Treatment plan updated successfully");
        getTreatmentDetails();
      } else {
        message.error(response.data.message);
      }
      setEditablePlan(null);
    } catch (error) {
      message.error("Error updating treatment plan, please try again");
      console.log(error);
    }
  };

  useEffect(() => {
    getTreatmentDetails();
  }, [patient_id]);

  return (
    <div className=" flex flex-col p-5 bg-white rounded-lg shadow-md border-t-4 border-gray-400 overflow-auto">
      <h1 className="flex justify-center text-center font-bold text-2xl text-gray-800 py-2">
        Program Card View
      </h1>
      {editablePlan && (
        <div className="flex gap-2 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vas Scale
            </label>
            <input
              type="number"
              placeholder="Vas scale"
              value={editablePlan.tp_iscale}
              onChange={(e) =>
                setEditablePlan({ ...editablePlan, tp_iscale: e.target.value })
              }
              min={0}
              className="border border-gray-500 rounded-md px-2 py-1 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Present Complaint
            </label>
            <input
              type="text"
              placeholder="Present Complaint"
              value={editablePlan.tp_vpcomp}
              onChange={(e) =>
                setEditablePlan({ ...editablePlan, tp_vpcomp: e.target.value })
              }
              className="border border-gray-500 rounded-md px-2 py-1 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Treatment Protocol
            </label>
            <input
              type="text"
              placeholder="Treatment Protocol"
              value={editablePlan.tp_vtproto}
              onChange={(e) =>
                setEditablePlan({ ...editablePlan, tp_vtproto: e.target.value })
              }
              className="border border-gray-500 rounded-md px-2 py-1 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={editablePlan.tp_vdate}
              onChange={(e) =>
                setEditablePlan({ ...editablePlan, tp_vdate: e.target.value })
              }
              className="border border-gray-500 rounded-md px-2 py-1 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              className="bg-green-500 px-2 py-1 rounded-md text-white font-semibold"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      )}
      <div className="overflow-auto shadow-md rounded-md">
        <table className="text-center shadow-md w-full text-nowrap">
          <thead className="bg-[--navbar-bg-color] text-white">
            <tr>
              <th className="px-4 py-2 text-sm font-medium">S NO</th>
              <th className="px-4 py-2 text-sm font-medium rounded-tl-md">
                Reassessment done by
              </th>

              {/* <th className="px-4 py-2 text-sm font-medium">Name</th> */}
              <th className="px-4 py-2 text-sm font-medium">Vas scale</th>
              <th className="px-4 py-2 text-sm font-medium">
                Present Complaint
              </th>
              <th className="px-4 py-2 text-sm font-medium">
                Treatment Protocol
              </th>
              <th className="px-4 py-2 text-sm font-medium">Date</th>
              <th className="px-4 py-2 text-sm font-medium">Edit</th>
              <th className="px-4 py-2 text-sm font-medium rounded-tr-md">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {treatmentPlan.map((plan, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-1">{index + 1}</td>
                <td className="px-4 py-1">{plan.tp_vreassdoneby}</td>

                {/* <td className="px-4 py-1">{plan.tp_vname}</td> */}
                <td className="px-4 py-1">{plan.tp_iscale}</td>
                <td className="px-4 py-1">{plan.tp_vpcomp}</td>
                <td className="px-4 py-1">{plan.tp_vtproto}</td>
                <td className="px-4 py-1">{formattedDate(plan.tp_vdate)}</td>
                <td className="px-4 py-1">
                  <button
                    className="text-gray-900"
                    onClick={() => handleEdit(plan)}
                  >
                    <GrEdit size={18} />
                  </button>
                </td>
                <td className="px-4 py-1">
                  <button
                    onClick={() => handleDelete(plan.tp_vtid)}
                    className="text-red-500"
                  >
                    <MdDeleteForever size={25} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TreatmentPlanGraph data={treatmentPlan} />
    </div>
  );
};

export default TreatmentPlanView;
