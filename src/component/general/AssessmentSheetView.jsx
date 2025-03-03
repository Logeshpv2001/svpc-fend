import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";
import { useParams } from "react-router-dom";

const AssessmentSheetView = () => {
  const { patient_id } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    const getAssessmentSheet = async () => {
      const response = await AxiosInstance.get(
        `assessmentsheet/get-assessmentsheet/${patient_id}`
      );
      setData(response.data.response || []);
    };

    getAssessmentSheet();
  }, []);

  return (
    <div className="flex flex-col p-5 bg-white rounded-lg shadow-md border-t-4 border-gray-400">
      <div>
        <h1 className="flex justify-center text-center py-2 font-bold text-2xl">Assessment Sheet View</h1>
      </div>
      <hr  />
      <div className="flex flex-col gap-4 mt-4">
        <div className="p-2 rounded">
          <span className="font-bold text-lg">Posture: </span>
          <span>{data?.as_jposture?.join(", ")}</span>
        </div>
        <hr />
        <div className="p-2 rounded">
          <span className="font-bold text-lg">Weak Muscles: </span>
          <span>{data.as_twmuscles}</span>
        </div>
        <hr />
        <div className="p-2 rounded">
          <span className="font-bold text-lg">Tight Muscles: </span>
          <span>{data.as_tmuscles}</span>
        </div>
        <hr />
        {/* table */}
        <div className="w-full">
          <h1 className="font-bold text-xl">MMT</h1>
          <div className="flex flex-row gap-4 mt-4 w-full max-lg:flex-col">
            <div className="flex flex-col w-full ">
              <h1 className="text-xl font-semibold">Upper Limb</h1>
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="font-bold">Shoulder</h1>
                  <div className="grid grid-cols-2 border rounded-md p-2 shadow-md bg-neutral-100">
                    <div className="p-2 flex flex-row justify-between border-r border-b ">
                      <span className="font-bold">Right Shoulder Flexor: </span>
                      <span>{data.as_tshoulder_flexor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-l border-b">
                      <span className="font-bold">Left Shoulder Flexor: </span>
                      <span>{data.as_tshoulder_flexor_left}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-r border-b">
                      <span className="font-bold">
                        Right Shoulder Extensor:{" "}
                      </span>
                      <span>{data.as_tshoulder_extensor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-l border-b">
                      <span className="font-bold">
                        Left Shoulder Extensor:{" "}
                      </span>
                      <span>{data.as_tshoulder_extensor_left}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between  border-t border-r border-b">
                      <span className="font-bold">
                        Right Shoulder Abductor:{" "}
                      </span>
                      <span>{data.as_tshoulder_abductor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between  border-t border-l border-b">
                      <span className="font-bold">
                        Left Shoulder Abductor:{" "}
                      </span>
                      <span>{data.as_tshoulder_abductor_left}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between  border-t border-r">
                      <span className="font-bold">
                        Right Shoulder Adductor:{" "}
                      </span>
                      <span>{data.as_tshoulder_adductor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between  border-t border-l">
                      <span className="font-bold">
                        Left Shoulder Adductor:{" "}
                      </span>
                      <span>{data.as_tshoulder_adductor_left}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="font-bold">Elbow</h1>
                  <div className="grid grid-cols-2  border rounded-md p-2 shadow-md bg-neutral-100">
                    <div className="p-2 flex flex-row justify-between border-r border-b">
                      <span className="font-bold">Right Elbow Flexor: </span>
                      <span>{data.as_telbow_flexor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-l border-b">
                      <span className="font-bold">Left Elbow Flexor: </span>
                      <span>{data.as_telbow_flexor_left}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-r">
                      <span className="font-bold">Right Elbow Extensor: </span>
                      <span>{data.as_telbow_extensor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-l">
                      <span className="font-bold">Left Elbow Extensor: </span>
                      <span>{data.as_telbow_extensor_left}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="font-bold">Wrist</h1>
                  <div className="grid grid-cols-2 border rounded-md p-2 shadow-md bg-neutral-100">
                    <div className="p-2 flex flex-row justify-between border-r border-b">
                      <span className="font-bold">
                        Right Wrist Porsiflexor:{" "}
                      </span>
                      <span>{data.as_twrist_porsiflexor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-l border-b">
                      <span className="font-bold">
                        Left Wrist Porsiflexor:{" "}
                      </span>
                      <span>{data.as_twrist_porsiflexor_left}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-r">
                      <span className="font-bold">
                        Right Wrist Plantarflexor:{" "}
                      </span>
                      <span>{data.as_twrist_plantarflexor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-l">
                      <span className="font-bold">
                        Left Wrist Plantarflexor:{" "}
                      </span>
                      <span>{data.as_twrist_plantarflexor_left}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <h1 className="text-xl font-semibold">Lower Limb</h1>
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="font-bold">Hip</h1>
                  <div className="grid grid-cols-2 border rounded-md p-2 shadow-md bg-neutral-100">
                    <div className="p-2 flex flex-row justify-between border-r border-b">
                      <span className="font-bold">Right Hip Flexor: </span>
                      <span>{data.as_thip_flexor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-l border-b">
                      <span className="font-bold">Left Hip Flexor: </span>
                      <span>{data.as_thip_flexor_left}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-r border-b">
                      <span className="font-bold">Right Hip Extensor: </span>
                      <span>{data.as_thip_extensor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-l border-b">
                      <span className="font-bold">Left Hip Extensor: </span>
                      <span>{data.as_thip_extensor_left}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-r border-b">
                      <span className="font-bold">Right Hip Abductor: </span>
                      <span>{data.as_thip_abductor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-l border-b">
                      <span className="font-bold">Left Hip Abductor: </span>
                      <span>{data.as_thip_abductor_left}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-r">
                      <span className="font-bold">Right Hip Adductor: </span>
                      <span>{data.as_thip_adductor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-l">
                      <span className="font-bold">Left Hip Adductor: </span>
                      <span>{data.as_thip_adductor_left}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="font-bold">Knee</h1>
                  <div className="grid grid-cols-2 border rounded-md p-2 shadow-md bg-neutral-100">
                    <div className="p-2 flex flex-row justify-between border-r border-b">
                      <span className="font-bold">Right Knee Flexor: </span>
                      <span>{data.as_tknee_flexor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-l border-b">
                      <span className="font-bold">Left Knee Flexor: </span>
                      <span>{data.as_tknee_flexor_left}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-r">
                      <span className="font-bold">Right Knee Extensor: </span>
                      <span>{data.as_tknee_extensor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-l">
                      <span className="font-bold">Left Knee Extensor: </span>
                      <span>{data.as_tknee_extensor_left}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="font-bold">Ankle</h1>
                  <div className="grid grid-cols-2 border rounded-md p-2 shadow-md bg-neutral-100">
                    <div className="p-2 flex flex-row justify-between border-r border-b">
                      <span className="font-bold">
                        Right Ankle Dorsiflexor:{" "}
                      </span>
                      <span>{data.as_tankle_porsiflexor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-l border-b">
                      <span className="font-bold">
                        Left Ankle Dorsiflexor:{" "}
                      </span>
                      <span>{data.as_tankle_porsiflexor_left}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-r">
                      <span className="font-bold">
                        Right Ankle Plantarflexor:{" "}
                      </span>
                      <span>{data.as_tankle_plantarflexor_right}</span>
                    </div>
                    <div className="p-2 flex flex-row justify-between border-t border-l">
                      <span className="font-bold">
                        Left Ankle Plantarflexor:{" "}
                      </span>
                      <span>{data.as_tankle_plantarflexor_left}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-2 gap-4 border rounded-md p-2 shadow-md bg-white">
          <div className="p-2 rounded">
            <span className="font-bold">RIGHT ROMJOINT: </span>
            <span>{data.as_tright_romjoint}</span>
          </div>
          <div className="p-2 rounded">
            <span className="font-bold">LEFT ROMJOINT: </span>
            <span>{data.as_tleft_romjoint}</span>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4 border rounded-md p-2 shadow-md bg-white">
          <div>
            <div className="p-2 rounded">
              <span className="font-bold">BALANCE STATIC: </span>
              <span>{data.as_tbalance_static}</span>
            </div>
            <div className="p-2 rounded">
              <span className="font-bold">BALANCE DYNAMIC: </span>
              <span>{data.as_tbalance_dynamic}</span>
            </div>
          </div>
          <div>
            <div className="p-2 rounded">
              <span className="font-bold">COORDINATION: </span>
              <span>{data.as_tcoordination}</span>
            </div>
            <div className="p-2 rounded">
              <span className="font-bold">GAIT: </span>
              <span>{data.as_tgait}</span>
            </div>{" "}
          </div>
        </div>
        <hr />
        <div className="flex flex-row max-lg:flex-col gap-4 border rounded-md p-2 shadow-md bg-white">
          <div className="p-2 rounded">
            <span className="font-bold">QUADS: </span>
            <span>{data.as_equads}</span>
          </div>
          <div className="p-2 rounded">
            <span className="font-bold">ACHILLES: </span>
            <span>{data.as_eachilles}</span>
          </div>
          <div className="p-2 rounded">
            <span className="font-bold">BICEPS: </span>
            <span>{data.as_ebiceps}</span>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-2 gap-4 border rounded-md p-2 shadow-md bg-white">
          <div className="p-2 rounded">
            <span className="font-bold">DIAGNOSIS: </span>
            <span>{data.as_tdiagnosis}</span>
          </div>
        </div>
        <hr />
        <div className="">
          <h2 className="font-bold">Problem List:</h2>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 border rounded-md p-2 shadow-md">
            {data.as_jproblemlist?.length > 0 &&
              data.as_jproblemlist?.map((problem, index) => (
                <div
                  key={index}
                  className="p-2 border bg-white shadow-md"
                >
                  <p className="font-bold">Problem {index + 1}</p>
                  <div className="p-2 flex flex-row gap-2 max-2xl:flex-wrap">
                    <p className="flex flex-row justify-between w-full bg-zinc-200 p-2 rounded-md shadow-md">
                      <span className="font-bold">Problem:</span>{" "}
                      {problem.as_tproblem}
                    </p>
                    <p className="flex flex-row justify-between w-full bg-zinc-200 p-2 rounded-md shadow-md">
                      <span className="font-bold">Goal:</span>{" "}
                      {problem.as_tgoal}
                    </p>
                    <p className="flex flex-row justify-between w-full bg-zinc-200 p-2 rounded-md shadow-md">
                      <span className="font-bold">Plan:</span>{" "}
                      {problem.as_tplan}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <hr />
        <div className="gap-4 border rounded-md p-2 shadow-md bg-white">
          <span className="font-bold">PAYMENT: </span>
          <span>{data.as_vpayment}</span>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSheetView;
