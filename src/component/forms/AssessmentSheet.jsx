import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import AxiosInstance from "../../utilities/AxiosInstance";
import { useParams } from "react-router-dom";
import { message } from "antd";

const AssessmentSheet = () => {
  const { patient_id } = useParams();

  const [rows, setRows] = useState([
    { as_tproblem: "", as_tgoal: "", as_tplan: "" },
  ]);

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };

  const user = sessionStorage.getItem("user");
  const userData = JSON.parse(user);

  const handleProblemChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].as_tproblem = value;
    setRows(updatedRows);
    setSheetData((prev) => ({ ...prev, as_jproblemlist: updatedRows }));
  };

  const handleGoalChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].as_tgoal = value;
    setRows(updatedRows);
    setSheetData((prev) => ({ ...prev, as_jproblemlist: updatedRows }));
  };

  const handlePlanChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].as_tplan = value;
    setRows(updatedRows);
    setSheetData((prev) => ({ ...prev, as_jproblemlist: updatedRows }));
  };

  const [sheetData, setSheetData] = useState({
    as_jposture: [],
    as_twmuscles: "",
    as_tmuscles: "",
    as_tshoulder_flexor_right: "",
    as_tshoulder_flexor_left: "",
    as_tshoulder_extensor_right: "",
    as_tshoulder_extensor_left: "",
    as_tshoulder_abductor_right: "",
    as_tshoulder_abductor_left: "",
    as_tshoulder_adductor_right: "",
    as_tshoulder_adductor_left: "",
    as_telbow_flexor_right: "",
    as_telbow_flexor_left: "",
    as_telbow_extensor_right: "",
    as_telbow_extensor_left: "",
    as_twrist_porsiflexor_right: "",
    as_twrist_porsiflexor_left: "",
    as_twrist_plantarflexor_right: "",
    as_twrist_plantarflexor_left: "",
    as_thip_flexor_right: "",
    as_thip_flexor_left: "",
    as_thip_extensor_right: "",
    as_thip_extensor_left: "",
    as_thip_abductor_right: "",
    as_thip_abductor_left: "",
    as_thip_adductor_right: "",
    as_thip_adductor_left: "",
    as_tknee_flexor_right: "",
    as_tknee_flexor_left: "",
    as_tknee_extensor_right: "",
    as_tknee_extensor_left: "",
    as_tankle_porsiflexor_right: "",
    as_tankle_porsiflexor_left: "",
    as_tankle_plantarflexor_right: "",
    as_tankle_plantarflexor_left: "",
    as_tright_romjoint: "",
    as_tleft_romjoint: "",
    as_tbalance_static: "",
    as_tbalance_dynamic: "",
    as_tcoordination: "",
    as_tgait: "",
    as_equads: "",
    as_eachilles: "",
    as_ebiceps: "",
    as_tdiagnosis: "",
    as_tfun_assessment: "",
    as_jproblemlist: rows,
    as_vpayment: "",
  });

  const getAssessment = async () => {
    try {
      const response = await AxiosInstance.get(
        `/assessmentsheet/get-assessmentsheet/${patient_id}`
      );
      const data = response.data.response;
      setSheetData(data || "");
      if (data && data.as_jproblemlist) {
        setRows(data.as_jproblemlist);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      ...sheetData,
      as_vclinic_id: userData.u_vClinicId,
      as_vpatient_id: patient_id,
      as_jproblemlist: rows.filter(
        (row) => row.as_tproblem || row.as_tgoal || row.as_tplan
      ),
    };

    try {
      const response = await AxiosInstance.post(
        "/assessmentsheet/add-assessmentsheet",
        requestBody
      );
      if (response.data.status == 201) {
        // Add success handling
        if (response.data.status === 201) {
          message.success(response.data.message);
        } else {
          message.error(response.data.message);
        }
        getAssessment();
      }
    } catch (error) {
      // Add error handling
      message.error("Failed to add assessment");
      console.error("Error saving assessment sheet:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const requestBody = {
      ...sheetData,
      as_vclinic_id: userData.u_vClinicId,
      as_vpatient_id: patient_id,
      as_jproblemlist: rows.filter(
        (row) => row.as_tproblem || row.as_tgoal || row.as_tplan
      ),
    };

    try {
      const response = await AxiosInstance.patch(
        `/assessmentsheet/edit-assessmentsheet/${patient_id}`,
        requestBody
      );

      message.success(response.data.message);

      getAssessment();
    } catch (error) {
      // Add error handling
      message.error("failed to update assessment sheet");
      console.error("Error saving assessment sheet:", error);
    }
  };

  useEffect(() => {
    getAssessment();
  }, []);

  return (
    <div className="w-full">
      {/* <NavTabs currentPage={currentPage} currentTab={currentTab} /> */}
      <div className="flex items-center justify-center mb-6 w-full">
        <h1 className="text-3xl font-bold text-gray-800">
          Clinical Assessment Sheet
        </h1>
      </div>
      <div className="flex flex-row flex-wrap w-full items-center justify-between gap-4 mb-6">
        <div className="flex flex-col space-y-2 w-80">
          <label className="font-medium text-xl">Posture: </label>
          <CreatableSelect
            isMulti
            options={[
              { value: "Head Tilt", label: "Head Tilt" },
              { value: "Shoulder Level", label: "Shoulder Level" },
              { value: "Thoracic Kyphosis", label: "Thoracic Kyphosis" },
              { value: "ASIS", label: "ASIS" },
              { value: "Scoliosis", label: "Scoliosis" },
              { value: "Genu Varum", label: "Genu Varum" },
              { value: "Hyperextended", label: "Hyperextended" },
              { value: "Pes Planus", label: "Pes Planus" },
              { value: "Forward Head", label: "Forward Head" },
              { value: "Rounded Shoulder", label: "Rounded Shoulder" },
              { value: "Lumbar Lordosis", label: "Lumbar Lordosis" },
              { value: "PSIS", label: "PSIS" },
              { value: "Genu Valgum", label: "Genu Valgum" },
              { value: "Genu Recurvatum", label: "Genu Recurvatum" },
              { value: "Pes Cavus", label: "Pes Cavus" },
              { value: "Hallux Valgus", label: "Hallux Valgus" },
            ]}
            className="w-full shadow-md"
            styles={{
              menuList: (base) => ({
                ...base,
                maxHeight: "200px",
                overflowY: "auto",
                whiteSpace: "nowrap",
              }),
            }}
            value={
              sheetData.as_jposture
                ? sheetData.as_jposture.map((value) => ({
                    value,
                    label: value,
                  }))
                : []
            }
            onChange={(selectedOptions) => {
              setSheetData((prev) => ({
                ...prev,
                as_jposture: selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : [],
              }));
            }}
          />{" "}
        </div>
        <div className="flex flex-col space-y-2 w-80">
          <label className="font-medium text-xl">Weak Muscles: </label>
          <input
            type="text"
            value={sheetData.as_twmuscles}
            name="as_twmuscles"
            className="border rounded-md p-2 shadow-md"
            placeholder="Enter weak muscles"
            onChange={(e) =>
              setSheetData((prev) => ({
                ...prev,
                as_twmuscles: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col space-y-2 w-80">
          <label className="font-medium text-xl">Tight Muscles: </label>
          <input
            type="text"
            value={sheetData.as_tmuscles}
            name="as_tmuscles"
            className="border rounded-md p-2 shadow-md"
            placeholder="Enter tight muscles"
            onChange={(e) =>
              setSheetData((prev) => ({
                ...prev,
                as_tmuscles: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <hr />
      <div className="flex flex-col w-full gap-4 mb-6">
        <h1 className="font-medium text-xl">MMT</h1>
        <div className="flex flex-row max-lg:flex-col gap-4 w-full">
          <div className="flex flex-col w-full space-y-2">
            <h1 className="font-medium text-lg">Upper Limber</h1>
            <div className="flex flex-col gap-4 w-full">
              <div className="w-full">
                <h1>Shoulder</h1>
                <div className="flex flex-row gap-4 w-full">
                  <table className="w-full max-w-2xl text-center mx-auto border-collapse border border-gray-200 overflow-hidden rounded-md shadow-md">
                    <thead className="bg-[--navbar-bg-color] text-white w-full">
                      <tr>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium ">
                          {" "}
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium ">
                          Right
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium ">
                          Left
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Flexor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tshoulder_flexor_right"
                              value={sheetData.as_tshoulder_flexor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tshoulder_flexor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tshoulder_flexor_left"
                              value={sheetData.as_tshoulder_flexor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tshoulder_flexor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Extensor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tshoulder_extensor_right"
                              value={sheetData.as_tshoulder_extensor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tshoulder_extensor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tshoulder_extensor_left"
                              value={sheetData.as_tshoulder_extensor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tshoulder_extensor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Abductor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tshoulder_abductor_right"
                              value={sheetData.as_tshoulder_abductor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tshoulder_abductor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tshoulder_abductor_left"
                              value={sheetData.as_tshoulder_abductor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tshoulder_abductor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Adductor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tshoulder_adductor_right"
                              value={sheetData.as_tshoulder_adductor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tshoulder_adductor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tshoulder_adductor_left"
                              value={sheetData.as_tshoulder_adductor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tshoulder_adductor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="w-full">
                <h1>Elbow</h1>
                <div className="flex flex-row gap-4 w-full">
                  <table className="w-full max-w-2xl mx-auto border-collapse border border-gray-200 overflow-hidden rounded-md shadow-md">
                    <thead className="bg-[--navbar-bg-color] w-full">
                      <tr>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium text-white">
                          {" "}
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium text-white">
                          Right
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium text-white">
                          Left
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Flexor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_telbow_flexor_right"
                              value={sheetData.as_telbow_flexor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_telbow_flexor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_telbow_flexor_left"
                              value={sheetData.as_telbow_flexor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_telbow_flexor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Extensor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_telbow_extensor_right"
                              value={sheetData.as_telbow_extensor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_telbow_extensor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_telbow_extensor_left"
                              value={sheetData.as_telbow_extensor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_telbow_extensor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="w-full">
                <h1>Wrist</h1>
                <div className="flex flex-row gap-4 w-full">
                  <table className="w-full max-w-2xl mx-auto border-collapse border border-gray-200 overflow-hidden rounded-md shadow-md">
                    <thead className="bg-[--navbar-bg-color] w-full">
                      <tr>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium ">
                          {" "}
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium text-white">
                          Right
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium text-white">
                          Left
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Porsiflexor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_twrist_porsiflexor_right"
                              value={sheetData.as_twrist_porsiflexor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_twrist_porsiflexor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_twrist_porsiflexor_left"
                              value={sheetData.as_twrist_porsiflexor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_twrist_porsiflexor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Plantarflexor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_twrist_plantarflexor_right"
                              value={sheetData.as_twrist_plantarflexor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_twrist_plantarflexor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_twrist_plantarflexor_left"
                              value={sheetData.as_twrist_plantarflexor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_twrist_plantarflexor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="flex flex-col w-full space-y-2">
            <h1 className="font-medium text-lg">Lower Limber</h1>
            <div className="flex flex-col gap-4 w-full">
              <div className="w-full">
                <h1>Hip</h1>
                <div className="flex flex-row gap-4 w-full">
                  <table className="w-full max-w-2xl text-center mx-auto border-collapse border border-gray-200 overflow-hidden rounded-md shadow-md">
                    <thead className="bg-[--navbar-bg-color] text-white w-full">
                      <tr>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium ">
                          {" "}
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium ">
                          Right
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium ">
                          Left
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Flexor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_thip_flexor_right"
                              value={sheetData.as_thip_flexor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_thip_flexor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_thip_flexor_left"
                              value={sheetData.as_thip_flexor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_thip_flexor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Extensor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_thip_extensor_right"
                              value={sheetData.as_thip_extensor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_thip_extensor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_thip_extensor_left"
                              value={sheetData.as_thip_extensor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_thip_extensor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Abductor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_thip_abductor_right"
                              value={sheetData.as_thip_abductor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_thip_abductor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_thip_abductor_left"
                              value={sheetData.as_thip_abductor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_thip_abductor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Adductor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_thip_adductor_right"
                              value={sheetData.as_thip_adductor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_thip_adductor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_thip_adductor_left"
                              value={sheetData.as_thip_adductor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_thip_adductor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="w-full">
                <h1>Knee</h1>
                <div className="flex flex-row gap-4 w-full">
                  <table className="w-full max-w-2xl mx-auto border-collapse border border-gray-200 overflow-hidden rounded-md shadow-md">
                    <thead className="bg-[--navbar-bg-color] w-full">
                      <tr>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium text-white">
                          {" "}
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium text-white">
                          Right
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium text-white">
                          Left
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Flexor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tknee_flexor_right"
                              value={sheetData.as_tknee_flexor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tknee_flexor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tknee_flexor_left"
                              value={sheetData.as_tknee_flexor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tknee_flexor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Extensor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tknee_extensor_right"
                              value={sheetData.as_tknee_extensor_right}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tknee_extensor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tknee_extensor_left"
                              value={sheetData.as_tknee_extensor_left}
                              className="w-full shadow-md border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tknee_extensor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="w-full">
                <h1>Ankle</h1>
                <div className="flex flex-row gap-4 w-full">
                  <table className="w-full max-w-2xl mx-auto border-collapse border border-gray-200 overflow-hidden rounded-md shadow-md">
                    <thead className="bg-[--navbar-bg-color] w-full">
                      <tr>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium ">
                          {" "}
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium text-white">
                          Right
                        </th>
                        <th className="p-3 border border-gray-200 text-left text-sm font-medium text-white">
                          Left
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Porsi flexor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tankle_porsiflexor_right"
                              value={sheetData.as_tankle_porsiflexor_right}
                              className="w-full border shadow-md border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tankle_porsiflexor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tankle_porsiflexor_left"
                              value={sheetData.as_tankle_porsiflexor_left}
                              className="w-full border shadow-md border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tankle_porsiflexor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-3 border border-gray-200 text-sm font-medium bg-[#075985] bg-opacity-20 text-black">
                          <div>
                            <label>Plantar flexor</label>
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tankle_plantarflexor_right"
                              value={sheetData.as_tankle_plantarflexor_right}
                              className="w-full border shadow-md border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Right value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tankle_plantarflexor_right: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td className="p-3 border border-gray-200">
                          <div>
                            <input
                              type="text"
                              name="as_tankle_plantarflexor_left"
                              value={sheetData.as_tankle_plantarflexor_left}
                              className="w-full border shadow-md border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Left value"
                              onChange={(e) =>
                                setSheetData((prev) => ({
                                  ...prev,
                                  as_tankle_plantarflexor_left: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-row max-lg:flex-col gap-4 w-full my-5">
        <h1 className="font-medium text-xl text-nowrap">ROM-JOINT</h1>
        <div className="flex flex-row max-md:flex-col gap-4 w-full ">
          <input
            type="text"
            name="as_tright_romjoint"
            value={sheetData.as_tright_romjoint}
            placeholder="Enter Right ROM-JOINT"
            className="w-full border border-gray-200 rounded-md shadow-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[30px] resize-none"
            onChange={(e) =>
              setSheetData((prev) => ({
                ...prev,
                as_tright_romjoint: e.target.value,
              }))
            }
          />
          <input
            type="text"
            name="as_tleft_romjoint"
            value={sheetData.as_tleft_romjoint}
            placeholder="Enter Left ROM-JOINT"
            className="w-full border border-gray-200 rounded-md shadow-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[30px] resize-none"
            onChange={(e) =>
              setSheetData((prev) => ({
                ...prev,
                as_tleft_romjoint: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <hr />
      <div className="flex flex-row max-lg:flex-col gap-4 w-full my-5">
        <div className="flex flex-col gap-4 text-nowrap">
          <div className="flex flex-col gap-4 w-full text-nowrap">
            <div className="flex flex-row max-lg:flex-col justify-between items-center px-5 py-2 rounded-md gap-4 w-full bg-white">
              <label className="text-[--navbar-bg-color] font-semibold text-lg">
                Balance Static:
              </label>
              <input
                type="text"
                name="as_tbalance_static"
                value={sheetData.as_tbalance_static}
                placeholder="Enter Balance Static"
                className="w-fit border border-gray-200 rounded-md shadow-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[30px] resize-none"
                onChange={(e) =>
                  setSheetData((prev) => ({
                    ...prev,
                    as_tbalance_static: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-row max-lg:flex-col justify-between items-center px-5 py-2 rounded-md gap-4 w-full bg-white">
              <label className="text-[--navbar-bg-color] font-semibold text-lg">
                Balance Dynamic:
              </label>
              <input
                type="text"
                name="as_tbalance_dynamic"
                value={sheetData.as_tbalance_dynamic}
                placeholder="Enter Balance Dynamic"
                className="w-fit border border-gray-200 rounded-md shadow-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[30px] resize-none"
                onChange={(e) =>
                  setSheetData((prev) => ({
                    ...prev,
                    as_tbalance_dynamic: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-nowrap">
          <div className="flex flex-col gap-4 w-full text-nowrap">
            <div className="flex flex-row max-lg:flex-col justify-between items-center px-5 py-2 rounded-md gap-4 w-full bg-white">
              <label className="text-[--navbar-bg-color] font-semibold text-lg">
                Co-ordination:
              </label>
              <input
                type="text"
                name="as_tcoordination"
                value={sheetData.as_tcoordination}
                placeholder="Enter Co-ordination"
                className="w-fit border border-gray-200 rounded-md shadow-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[30px] resize-none"
                onChange={(e) =>
                  setSheetData((prev) => ({
                    ...prev,
                    as_tcoordination: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-row max-lg:flex-col justify-between items-center px-5 py-2 rounded-md gap-4 w-full bg-white">
              <label className="text-[--navbar-bg-color] font-semibold text-lg">
                Gait:
              </label>
              <input
                type="text"
                name="as_tgait"
                value={sheetData.as_tgait}
                placeholder="Enter Gait"
                className="w-fit border border-gray-200 rounded-md shadow-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[30px] resize-none"
                onChange={(e) =>
                  setSheetData((prev) => ({
                    ...prev,
                    as_tgait: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-4 w-full my-5">
        {/* Reflexes Section */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="font-medium text-xl">Reflexes</h1>
          <div className="flex flex-row max-lg:flex-col gap-4 w-full">
            {/* Quads */}
            <div className="flex flex-row items-center justify-between gap-4 px-5 py-2 rounded-md bg-white w-fit shadow-md">
              <h1 className="text-[--navbar-bg-color] font-semibold text-xl border-r pr-4 border-[--navbar-bg-color]">
                Quads
              </h1>
              <label className="font-semibold text-sm text-nowrap">
                <input
                  className="mr-2"
                  type="radio"
                  name="as_equads"
                  value="right"
                  checked={sheetData.as_equads === "right"}
                  onChange={(e) =>
                    setSheetData((prev) => ({
                      ...prev,
                      as_equads: e.target.value,
                    }))
                  }
                />
                Right
              </label>
              <label className="font-semibold text-sm text-nowrap">
                <input
                  className="mr-2"
                  type="radio"
                  name="as_equads"
                  value="left"
                  checked={sheetData.as_equads === "left"}
                  onChange={(e) =>
                    setSheetData((prev) => ({
                      ...prev,
                      as_equads: e.target.value,
                    }))
                  }
                />
                Left
              </label>
            </div>

            {/* Achilles */}
            <div className="flex flex-row items-center justify-between gap-4 px-5 py-2 rounded-md bg-white w-fit shadow-md">
              <h1 className="text-[--navbar-bg-color] font-semibold text-xl border-r pr-4 border-[--navbar-bg-color]">
                Achilles
              </h1>
              <label className="font-semibold text-sm text-nowrap">
                <input
                  className="mr-2"
                  type="radio"
                  name="achilles"
                  value="right"
                  checked={sheetData.as_eachilles === "right"}
                  onChange={(e) =>
                    setSheetData((prev) => ({
                      ...prev,
                      as_eachilles: e.target.value,
                    }))
                  }
                />
                Right
              </label>
              <label className="font-semibold text-sm text-nowrap">
                <input
                  className="mr-2"
                  type="radio"
                  name="achilles"
                  value="left"
                  checked={sheetData.as_eachilles === "left"}
                  onChange={(e) =>
                    setSheetData((prev) => ({
                      ...prev,
                      as_eachilles: e.target.value,
                    }))
                  }
                />
                Left
              </label>
            </div>

            {/* Biceps */}
            <div className="flex flex-row items-center justify-between gap-4 px-5 py-2 rounded-md bg-white w-fit shadow-md">
              <h1 className="text-[--navbar-bg-color] font-semibold text-xl border-r pr-4 border-[--navbar-bg-color]">
                Biceps
              </h1>
              <label className="font-semibold text-sm text-nowrap">
                <input
                  className="mr-2"
                  type="radio"
                  name="biceps"
                  value="right"
                  checked={sheetData.as_ebiceps === "right"}
                  onChange={(e) =>
                    setSheetData((prev) => ({
                      ...prev,
                      as_ebiceps: e.target.value,
                    }))
                  }
                />
                Right
              </label>
              <label className="font-semibold text-sm text-nowrap">
                <input
                  className="mr-2"
                  type="radio"
                  name="biceps"
                  value="left"
                  checked={sheetData.as_ebiceps === "left"}
                  onChange={(e) =>
                    setSheetData((prev) => ({
                      ...prev,
                      as_ebiceps: e.target.value,
                    }))
                  }
                />
                Left
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <h1 className="font-medium text-xl">Functional Assessment</h1>
          <textarea
            type="text"
            name="as_tfun_assessment"
            value={sheetData.as_tfun_assessment}
            placeholder="Enter Functional Assessment"
            className="w-full shadow-md border resize-none border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSheetData((prev) => ({
                ...prev,
                as_tfun_assessment: e.target.value,
              }))
            }
          />
        </div>

        {/* Diagnosis Section */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="font-medium text-xl">Diagnosis</h1>
          <input
            type="text"
            name="as_tdiagnosis"
            value={sheetData.as_tdiagnosis}
            placeholder="Enter Diagnosis"
            className="w-full shadow-md border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSheetData((prev) => ({
                ...prev,
                as_tdiagnosis: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <hr />
      <div className="flex flex-col gap-4 w-full my-5">
        <div className="overflow-x-auto shadow-md">
          <table className="w-full border-collapse border rounded-md overflow-hidden">
            <thead className="bg-[--navbar-bg-color] text-white">
              <tr>
                <th className="border p-4 text-left rounded-l-md">
                  Problem List
                </th>
                <th className="border p-4 text-left">Goals</th>
                <th className="border p-4 text-left">Plan</th>
                <th className="border p-4 text-center rounded-r-md">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(rows) &&
                rows.map((row, index) => {
                  return (
                    <tr key={index} className="bg-gray-100 odd:bg-white">
                      <td className="border p-3">
                        <input
                          name="as_tproblem"
                          value={row.as_tproblem}
                          type="text"
                          placeholder={`Enter Problem ${index + 1}`}
                          className="min-w-44 rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) =>
                            handleProblemChange(index, e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-3">
                        <input
                          type="text"
                          name="as_tgoal"
                          value={row.as_tgoal}
                          placeholder={`Enter Goal ${index + 1}`}
                          className="min-w-44 rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) =>
                            handleGoalChange(index, e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-3">
                        <input
                          type="text"
                          name="as_tplan"
                          value={row.as_tplan}
                          placeholder={`Enter Plan ${index + 1}`}
                          className="min-w-44 rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) =>
                            handlePlanChange(index, e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-3 text-center">
                        <button
                          onClick={() => handleDeleteRow(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => setRows([...rows, {}])}
          className="self-start px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
        >
          Add Row
        </button>
      </div>
      <div className="flex flex-row max-lg:flex-col gap-4 items-center w-full my-5">
        <h1 className="font-medium text-xl text-nowrap">Payment Details</h1>
        <div className="flex flex-row w-full items-center justify-center">
          <input
            type="text"
            name="as_vpayment"
            placeholder="Enter Payment Method"
            value={sheetData.as_vpayment}
            className="w-full rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSheetData((prev) => ({
                ...prev,
                as_vpayment: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <div className="flex flex-row max-lg:flex-col gap-4 items-center w-full my-5 justify-center">
        {sheetData.id ? (
          <button
            onClick={handleUpdate}
            className="self-start px-4 py-2 w-40 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
          >
            Update
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="self-start px-4 py-2 w-40 rounded-md bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default AssessmentSheet;
