import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import BodyPointerBackSide from "../bodyPointer/BodyPointerBackSide";
import BodyPointerFrontSide from "../bodyPointer/BodyPointerFrontSide";
import BodyPointerRightSide from "../bodyPointer/BodyPointerRightSide";
import BodyPointerLeftSide from "../bodyPointer/BodyPointerLeftSide";
import VasScale from "../../component/vasScale/VasScale";
import { useDispatch, useSelector } from "react-redux";
import AxiosInstance from "../../utilities/AxiosInstance";
import { useParams } from "react-router-dom";
import {
  updateBackSide,
  updateFrontSide,
  updateLeftSide,
  updateRightSide,
} from "../../redux/slices/pointerSlice";
import { setPainLevel } from "../../redux/slices/vasScaleSlice";
import { message } from "antd";

const AssessmentForm = () => {
  const dispatch = useDispatch();

  const { patient_id } = useParams();

  // get data from child components
  const frontSidePointers = useSelector((state) => state.pointer.frontSide);
  const backSidePointers = useSelector((state) => state.pointer.backSide);
  const leftSidePointers = useSelector((state) => state.pointer.leftSide);
  const rightSidePointers = useSelector((state) => state.pointer.rightSide);
  const painLevel = useSelector((state) => state.vasScale.painLevel);

  // Date function
  const todayDate = new Date().toISOString().split("T")[0];

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // GET user info from sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("user"));

  const [file, setFile] = useState(null);

  // Initializing formData with proper default values
  const [formData, setFormData] = useState({
    a_vclinic_id: userInfo.u_vClinicId || "",
    a_vpatient_id: patient_id,
    a_assessmentdate: new Date(),
    a_tcomplaints: "",
    a_tpmh: "",
    a_jonset: [],
    a_jnature: [],
    a_jtype: [],
    a_jaggravating_factor: [],
    a_jsleep_disturbance: [],
    a_jspl_ques: [],
    a_timplants: "",
    a_tred_flags: "",
    a_iscale: 0,
    a_tinvestigation: "",
    a_tdiagnosis: "",
    a_ttreatment_advised: "",
    a_thome_advice: "",
    a_epayment_proposal: "",
    a_jbodytouchpoint_front: [],
    a_jbodytouchpoint_back: [],
    a_jbodytouchpoint_left: [],
    a_jbodytouchpoint_right: [],
    a_tclinical_notes: "",
    a_nextre: "",
  });

  // Update formData when painLevel changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      a_iscale: painLevel || 0,
    }));
  }, [painLevel]);

  const [oldfile, setOldFile] = useState(null);

  const getAssessmentForm = async () => {
    try {
      const response = await AxiosInstance.get(
        `/assessmentform/get-assessmentform/${patient_id}`
      );
      setFormData(response?.data?.response || "");
      dispatch(setPainLevel(Number(response?.data?.response?.a_iscale || 0)));
      dispatch(
        updateBackSide(response?.data?.response?.a_jbodytouchpoint_back)
      );
      dispatch(
        updateFrontSide(response?.data?.response?.a_jbodytouchpoint_front)
      );
      dispatch(
        updateLeftSide(response?.data?.response?.a_jbodytouchpoint_left)
      );
      dispatch(
        updateRightSide(response?.data?.response?.a_jbodytouchpoint_right)
      );
    } catch (error) {
      console.error("Error fetching assessment form:", error);
    }
  };

  const handlePointerDataUpdate = (side, newPositions) => {
    setFormData((prevData) => ({
      ...prevData,
      [`a_jbodytouchpoint_${side}`]: newPositions,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      if (type === "checkbox") {
        return { ...prevData, [name]: checked };
      } else if (type === "file") {
        setFile(e.target.files[0]);
        return prevData; // Return prevData to maintain the state
      } else if (Array.isArray(prevData[name])) {
        return { ...prevData, [name]: [...prevData[name], value] };
      }
      return { ...prevData, [name]: value };
    });
  };

  const handleSelectChange = (name, selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();

      if (file) {
        form.append("file", file);
      }

      // Append the rest of the data
      const formDataToSend = {
        ...formData,
        a_vpatient_id: patient_id,
        a_assessmentdate: formatDate(formData.a_assessmentdate),
        a_vclinic_id: userInfo.u_vClinicId,
        a_jbodytouchpoint_front: frontSidePointers,
        a_jbodytouchpoint_back: backSidePointers,
        a_jbodytouchpoint_left: leftSidePointers,
        a_jbodytouchpoint_right: rightSidePointers,
        a_nextre: formatDate(formData.a_nextre),
      };

      // Append JSON string of the form data
      form.append("data", JSON.stringify(formDataToSend));

      // Make API request
      const response = await AxiosInstance.post(
        "/assessmentform/add-assessment",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 201) {
        message.success(response.data.message);
        getAssessmentForm();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("failed submitting form");
    }
  };

  const handleUpdate = async () => {
    try {
      const form = new FormData();

      if (file) {
        form.append("file", file);
      }

      // Append the rest of the data
      const formDataToSend = {
        ...formData,
        a_vpatient_id: patient_id,
        a_assessmentdate: formatDate(formData.a_assessmentdate),
        a_vclinic_id: userInfo.u_vClinicId,
        a_jbodytouchpoint_front: frontSidePointers,
        a_jbodytouchpoint_back: backSidePointers,
        a_jbodytouchpoint_left: leftSidePointers,
        a_jbodytouchpoint_right: rightSidePointers,
        a_nextre: formatDate(formData.a_nextre),
      };

      // Append JSON string of the form data
      form.append("data", JSON.stringify(formDataToSend));

      const response = await AxiosInstance.patch(
        `/assessmentform/edit-assessment/${patient_id}`,
        form
      );
      // console.log(response);
      message.success(response.data.message);      
      getAssessmentForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("failed submitting form");
    }
  };

  useEffect(() => {
    getAssessmentForm();
  }, []);
  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-6 w-full" >
        <h1 className="text-3xl  font-bold text-gray-800">
          Clinical Assessment Form
        </h1>
      </div>

      <div className="flex flex-row flex-wrap w-full items-center gap-4 mb-6">
        <div className="flex flex-col space-y-2 w-80">
          <label className="font-medium">
            Date: <span className="text-red-500">*</span>{" "}
          </label>
          <input
            name="a_assessmentdate"
            type="date"
            required
            className="border rounded-md p-2"
            value={formatDate(formData?.a_assessmentdate) || todayDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col space-y-2 w-80">
          <label className="font-medium">Present Complaints: </label>
          <input
            name="a_tcomplaints"
            value={formData?.a_tcomplaints}
            type="text"
            className="border rounded-md p-2"
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col space-y-2 w-80">
          <label className="font-medium">PMH / Injury / Surgery</label>
          <input
            name="a_tpmh"
            value={formData?.a_tpmh}
            type="text"
            className="border rounded-md p-2"
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">PAIN</h1>
        <div className="flex flex-col gap-6">
          <div className="w-full col-auto grid grid-cols-2 max-lg:grid-cols-1 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Onset: </label>
              <CreatableSelect
                isMulti
                options={[
                  { value: "Insidious", label: "Insidious" },
                  { value: "Sudden", label: "Sudden" },
                  { value: "ADL", label: "ADL" },
                ]}
                onChange={(selectedOptions) =>
                  handleSelectChange("a_jonset", selectedOptions)
                }
                value={formData?.a_jonset?.map((option) => ({
                  value: option,
                  label: option,
                }))}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Nature: </label>
              <CreatableSelect
                isMulti
                options={[
                  { value: "Sharp", label: "Sharp" },
                  { value: "Dull", label: "Dull" },
                  { value: "Burning", label: "Burning" },
                  { value: "Aching", label: "Aching" },
                  { value: "Numb", label: "Numb" },
                  { value: "Constant", label: "Constant" },
                  { value: "Variable", label: "Variable" },
                  { value: "Radiation", label: "Radiation" },
                ]}
                onChange={(selectedOptions) =>
                  handleSelectChange("a_jnature", selectedOptions)
                }
                value={formData?.a_jnature?.map((option) => ({
                  value: option,
                  label: option,
                }))}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Type: </label>
              <CreatableSelect
                isMulti
                options={[
                  { value: "Constant", label: "Constant" },
                  { value: "Intermittent", label: "Intermittent" },
                ]}
                onChange={(selectedOptions) =>
                  handleSelectChange("a_jtype", selectedOptions)
                }
                value={formData?.a_jtype?.map((option) => ({
                  value: option,
                  label: option,
                }))}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Aggravating Factor: </label>
              <CreatableSelect
                isMulti
                options={[
                  { value: "Sitting", label: "Sitting" },
                  { value: "Standing", label: "Standing" },
                  { value: "Bending", label: "Bending" },
                  { value: "Walking", label: "Walking" },
                  { value: "Alt.position", label: "Alt.position" },
                ]}
                onChange={(selectedOptions) =>
                  handleSelectChange("a_jaggravating_factor", selectedOptions)
                }
                value={formData?.a_jaggravating_factor?.map((option) => ({
                  value: option,
                  label: option,
                }))}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Sleep Disturbance: </label>
              <CreatableSelect
                isMulti
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
                onChange={(selectedOptions) =>
                  handleSelectChange("a_jsleep_disturbance", selectedOptions)
                }
                value={formData?.a_jsleep_disturbance?.map((option) => ({
                  value: option,
                  label: option,
                }))}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Spl Ques: </label>
              <CreatableSelect
                isMulti
                options={[
                  { value: "Cough / sneeze", label: "Cough / sneeze" },
                  { value: "para / anaesthesia", label: "para / anaesthesia" },
                  { value: "Thoracic pain", label: "Thoracic pain" },
                  { value: "Headache", label: "Headache" },
                  { value: "Weakness", label: "Weakness" },
                  { value: "Dizziness", label: "Dizziness" },
                  { value: "Saddle Anaesthesia", label: "Saddle Anaesthesia" },
                  { value: "Bladder / Bowel", label: "Bladder / Bowel" },
                ]}
                className="w-full"
                onChange={(selectedOptions) =>
                  handleSelectChange("a_jspl_ques", selectedOptions)
                }
                value={formData?.a_jspl_ques?.map((option) => ({
                  value: option,
                  label: option,
                }))}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Implants: </label>
              <input
                name="a_timplants"
                value={formData?.a_timplants}
                type="text"
                className="border rounded-md p-2"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Red Flags: </label>
              <input
                name="a_tred_flags"
                value={formData?.a_tred_flags}
                type="text"
                className="border rounded-md p-2"
                onChange={handleInputChange}
              />
            </div>
          </div>{" "}
          <div className="flex flex-row items-center justify-center flex-wrap gap-5 w-full">
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center gap-5 w-fit">
              {/* Human Body Image */}
              <h1>Front Side</h1>
              <BodyPointerFrontSide
                onPointerDataUpdate={(newPositions) =>
                  handlePointerDataUpdate("front", newPositions)
                }
              />
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center gap-5 w-fit">
              {/* Human Body Image */}
              <h1>Back Side</h1>
              <BodyPointerBackSide
                onPointerDataUpdate={(newPositions) =>
                  handlePointerDataUpdate("back", newPositions)
                }
              />
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center gap-5 w-fit">
              <h1>Right Side</h1>
              <BodyPointerRightSide
                onPointerDataUpdate={(newPositions) =>
                  handlePointerDataUpdate("right", newPositions)
                }
              />
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center gap-5 w-fit">
              <h1>Left Side</h1>
              <BodyPointerLeftSide
                onPointerDataUpdate={(newPositions) =>
                  handlePointerDataUpdate("left", newPositions)
                }
              />
            </div>
          </div>
          <div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">VAS scale: </label>
              <VasScale />
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <label className="font-medium">Clinical Notes: </label>
              <textarea
                name="a_tclinical_notes"
                value={formData?.a_tclinical_notes}
                type="text"
                className="w-full border rounded-md p-2 resize-none"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col max-sm:flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="font-medium">Investigation: </label>
            <div className="flex max-sm:flex-col justify-between gap-6">
              <input
                name="a_tinvestigation"
                value={formData?.a_tinvestigation}
                type="text"
                className="border w-full rounded-md p-2"
                onChange={handleInputChange}
              />
              <input
                type="file"
                name="a_tfilepath"
                accept=".pdf,.png,.jpg,.jpeg"
                className="border w-full rounded-md p-2"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex max-sm:flex-col justify-between gap-6">
            <div className="flex flex-col space-y-2 w-full">
              <label className="font-medium">Diagnosis: </label>
              <input
                name="a_tdiagnosis"
                value={formData?.a_tdiagnosis}
                type="text"
                className="w-full border rounded-md p-2"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <label className="font-medium">Treatment Advised: </label>
              <input
                name="a_ttreatment_advised"
                value={formData?.a_ttreatment_advised}
                type="text"
                className="w-full border rounded-md p-2"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex  max-sm:flex-col justify-between gap-6 items-center">
            <div className="flex flex-col space-y-2 w-full">
              <label className="font-medium">Home Advice: </label>
              <input
                name="a_thome_advice"
                value={formData?.a_thome_advice}
                type="text"
                className="border rounded-md p-2"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <label className="font-medium">Next Review: </label>
              <input
                name="a_nextre"
                value={formatDate(formData?.a_nextre)}
                type="date"
                className="border rounded-md p-2"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <div className="flex max-sm:flex-col w-full gap-4">
              <label className="font-medium">Payment Proposal: </label>
              <div className="flex items-center gap-5">
                {/* Daily Payment Option */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="a_epayment_proposal"
                    value="daily"
                    className="mr-2"
                    onChange={handleInputChange}
                    checked={formData?.a_epayment_proposal === "daily"}
                  />
                  Daily
                </label>

                {/* Rehab Payment Option */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="a_epayment_proposal"
                    value="rehab"
                    className="mr-2"
                    onChange={handleInputChange}
                    checked={formData?.a_epayment_proposal === "rehab"}
                  />
                  Rehab
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full  my-4 flex items-center justify-center">
          {formData.id ? (
            <button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 w-40 rounded-md transition duration-200"
            >
              Update
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-blue-600  hover:bg-blue-700 text-white font-medium py-2 px-4 w-40 rounded-md transition duration-200"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;
