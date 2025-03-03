import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ComposedChart,
  Area,
} from "recharts";
import {
  Users2Icon,
  CalendarIcon,
  TrendingUpIcon,
  BarChart3Icon,
  BarChartHorizontalIcon,
} from "lucide-react";

const PatientDemographicsDashboard = () => {
  const clinicId = JSON.parse(sessionStorage.getItem("user"));
  const countData = async () => {
    try {
      const response = await AxiosInstance.post(
        "/analytics/patient-analytics",
        {
          clinicId: clinicId.u_vClinicId,
        }
      );
      const data = response.data;
      setAgeGroupData(
        data.response.ageGroupDistribution.map((item) => ({
          name: item.ageGroup,
          value: item.count,
          color: getColorForAgeGroup(item.ageGroup),
        }))
      );
      setPatientData(data.response.monthlyPatients);

      // Transform gender data
      const genderDistribution = data.response.genderDistribution.reduce(
        (acc, item) => {
          if (item.gender === "male") {
            acc.malePatients = item.count;
          } else if (item.gender === "female") {
            acc.femalePatients = item.count;
          }
          return acc;
        },
        { malePatients: 0, femalePatients: 0 }
      );

      const total =
        genderDistribution.malePatients + genderDistribution.femalePatients;
      const transformedGenderData = [
        {
          malePatients: genderDistribution.malePatients,
          femalePatients: genderDistribution.femalePatients,
          malePercentage:
            total > 0
              ? ((genderDistribution.malePatients / total) * 100).toFixed(1)
              : "0",
          femalePercentage:
            total > 0
              ? ((genderDistribution.femalePatients / total) * 100).toFixed(1)
              : "0",
        },
      ];

      setGenderData(transformedGenderData);

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getColorForAgeGroup = (ageGroup) => {
    const colorMap = {
      "0-18": "#3B82F6",
      "19-25": "#10B981",
      "26-35": "#F43F5E",
      "36-45": "#8B5CF6",
      "46-55": "#F59E0B",
      "56+": "#6B7280",
    };
    return colorMap[ageGroup] || "#6B7280";
  };

  useEffect(() => {
    countData();
  }, []);

  // Patient Growth Data with Multiple Metrics
  const [patientData, setPatientData] = useState([]);

  // genderData
  const [genderData, setGenderData] = useState([]);

  // Age Group Data
  const [ageGroupData, setAgeGroupData] = useState([]);

  // Calculate total for age group
  const ageGroupTotal = ageGroupData.reduce(
    (sum, entry) => sum + entry.value,
    0
  );
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-2xl rounded-2xl p-4 md:p-8 w-full max-w-7xl mx-auto mt-10 space-y-8">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="bg-[--navbar-bg-color] text-white px-4 py-2 rounded-md mb-4 hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] transition duration-300 ease-in-out flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
      </div>{" "}
      {/* Patient Growth Overview */}
      <div className="bg-gray-50 rounded-xl p-4 md:p-6 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <BarChartHorizontalIcon
              className="mr-2 md:mr-4 text-blue-700"
              size={32}
            />
            Patient Growth Trends
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Composed Chart for Multiple Metrics */}
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={patientData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#f5f5f5" />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#8884d8"
                  strokeWidth={3}
                  name="Total Patients"
                />
                <Bar
                  dataKey="newPatients"
                  barSize={20}
                  fill="#82ca9d"
                  name="New Patients"
                />
                <Area
                  type="monotone"
                  dataKey="returningPatients"
                  fill="rgba(130, 202, 157, 0.3)"
                  stroke="#82ca9d"
                  name="Returning Patients"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Distribution Bar Chart */}
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border rounded shadow">
                          <p className="text-blue-600">{`Male: ${payload[0].value} (${payload[0].payload.malePercentage}%)`}</p>
                          <p className="text-pink-600">{`Female: ${payload[1].value} (${payload[1].payload.femalePercentage}%)`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <CartesianGrid stroke="#f5f5f5" />
                <Bar
                  dataKey="malePatients"
                  fill="#3B82F6"
                  name="Male Patients"
                />
                <Bar
                  dataKey="femalePatients"
                  fill="#EC4899"
                  name="Female Patients"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Age Group Distribution Section */}
      <div className="bg-gray-50 rounded-xl p-4 md:p-6 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
            <BarChart3Icon className="mr-2 md:mr-4 text-green-700" size={28} />
            Age Group Distribution
          </h2>
          <div className="text-gray-600 font-medium">
            Total Patients: {ageGroupTotal.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Age Group Pie Chart */}
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) =>
                    `${name}: ${value.toLocaleString()} (${(
                      percent * 100
                    ).toFixed(1)}%)`
                  }
                >
                  {ageGroupData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} Patients`,
                    name,
                  ]}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  formatter={(value, entry) => {
                    const currentEntry = ageGroupData.find(
                      (e) => e.name === value
                    );
                    const percentage = (
                      (currentEntry.value / ageGroupTotal) *
                      100
                    ).toFixed(1);
                    return `${value} (${percentage}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Age Group Breakdown */}
          <div className="flex flex-col justify-center space-y-4">
            {ageGroupData.map((group) => (
              <div
                key={group.name}
                className="bg-white rounded-lg p-4 shadow-md flex items-center"
              >
                <div
                  className="w-6 h-6 mr-4 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <div className="flex-grow">
                  <div className="font-semibold text-gray-800">
                    {group.name} Years
                  </div>
                  <div className="text-sm text-gray-500">
                    {((group.value / ageGroupTotal) * 100).toFixed(1)}% of Total
                    Patients
                  </div>
                </div>
                <div className="font-bold text-blue-700">
                  {group.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDemographicsDashboard;
