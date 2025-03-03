import React from "react";

function PatientInformation({ patientInfo }) {
  console.log(patientInfo);

  if (!patientInfo) {
    return (
      <div className="mt-4 w-full min-h-[40vh] shadow-lg rounded-md border-t-4 border-gray-400 bg-white">
        <div className="p-6 text-center text-gray-600">
          No patient information available.
        </div>
      </div>
    );
  }

  const {
    p_vName,
    p_egender,
    p_iAge,
    p_emStatus,
    p_vPhone,
    p_vEmail,
    p_voccupation,
    p_tAddress,
    p_vctime,
    p_date,
    p_vdm,
    p_vht,
    p_fbmi,
    p_fheight,
    p_fweight,
    p_vrptname,
    p_vrptnumber,
    p_vrdrname,
    p_vrdrnumber,
    p_jcall1,
    p_jcall2,
    p_jcall3,
    p_vappointmentfor,
    p_vassessmentby,
    p_jservice,
    p_vcenquiry,
    p_vptincharge,
    p_vpattype,
  } = patientInfo;

  const formatedDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="mt-4 w-full min-h-[40vh] shadow-lg rounded-md border-t-4 border-gray-400 bg-white">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Name</h3>
                <p className="text-gray-900">{p_vName}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Patient Type</h3>
                <p className="text-gray-900">{p_vpattype}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Age</h3>
                <p className="text-gray-900">{p_iAge}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Gender</h3>
                <p className="text-gray-900">{p_egender}</p>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Marital Status</h3>
                <p className="text-gray-900">{p_emStatus}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Address</h3>
                <p className="text-gray-900">{p_tAddress}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Tel / Mobile</h3>
                <p className="text-gray-900">{p_vPhone}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">
                  Convenient Call Time
                </h3>
                <p className="text-gray-900">{p_vctime}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Email</h3>
                <p className="text-gray-900">{p_vEmail}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Occupation</h3>
                <p className="text-gray-900">{p_voccupation}</p>
              </div>
              <div className="flex flex-col justify-between">
                <h1>Referred by:</h1>
                <div className="flex items-center justify-between">
                  <table className="min-w-full table-auto bg-white rounded-lg border-collapse shadow-md">
                    <thead className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
                      <tr>
                        <th className="px-4 py-2">Prefix</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientInfo?.p_referredby?.map((referredBy, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{referredBy.prefix}</td>
                          <td className="px-4 py-2">{referredBy.name}</td>
                          <td className="px-4 py-2">
                            {referredBy.phoneNumber}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-600">Service For</h3>
                <ul className="list-disc pl-6 text-gray-900">
                  {p_jservice?.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-600">Follow up calls</h3>
                <h3 className="font-bold text-gray-600">Call 1</h3>

                <table className="min-w-full table-auto bg-white rounded-lg border-collapse shadow-md">
                  <thead className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Time</th>
                      <th className="px-4 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                      <tr>
                        <td className="px-4 py-2">{formatedDate(p_jcall1?.date)}</td>
                        <td className="px-4 py-2">{p_jcall1?.time}</td>
                        <td className="px-4 py-2">{p_jcall1?.notes}</td>
                      </tr>
                    
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="font-bold text-gray-600">Call 2</h3>

                <table className="min-w-full table-auto bg-white rounded-lg border-collapse shadow-md">
                  <thead className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Time</th>
                      <th className="px-4 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr >
                        <td className="px-4 py-2">{formatedDate(p_jcall2?.date)}</td>
                        <td className="px-4 py-2">{p_jcall2?.time}</td>
                        <td className="px-4 py-2">{p_jcall2?.notes}</td>
                      </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="font-bold text-gray-600">Call 3</h3>

                <table className="min-w-full table-auto bg-white rounded-lg border-collapse shadow-md">
                  <thead className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Time</th>
                      <th className="px-4 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                        <td className="px-4 py-2">{formatedDate(p_jcall3?.date)}</td>
                        <td className="px-4 py-2">{p_jcall3?.time}</td>
                        <td className="px-4 py-2">{p_jcall3?.notes}</td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Assessment & Center Details Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
              Assessment & Center Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Assessment Date</h3>
                <p className="text-gray-900">{formatedDate(p_date)}</p>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">DM</h3>
                <p className="text-gray-900">{p_vdm}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">HT</h3>
                <p className="text-gray-900">{p_vht}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">BMI</h3>
                <p className="text-gray-900">{p_fbmi}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Height</h3>
                <p className="text-gray-900">{p_fheight}</p>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Weight</h3>
                <p className="text-gray-900">{p_fweight}</p>
              </div>
              <hr />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  For Center Use Only
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-600">Appointment For</h3>
                    <p className="text-gray-900">{p_vappointmentfor}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-600">
                      Customer Enquiry Received By
                    </h3>
                    <p className="text-gray-900">{p_vcenquiry}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-600">
                      Assessment Done By
                    </h3>
                    <p className="text-gray-900">{p_vassessmentby}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-600">
                      Patient Incharge
                    </h3>
                    <p className="text-gray-900">{p_vptincharge}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientInformation;
