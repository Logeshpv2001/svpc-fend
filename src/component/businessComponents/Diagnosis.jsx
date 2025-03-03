import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, TrendingUpIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Diagnosis = () => {
  const navigate = useNavigate();
  const [fullDiagnosisData] = useState([
    { 
      month: 'Jan 2024', 
      date: new Date('2024-01-15'),
      knee: { patients: 120, revenuePerPatient: 500 },
      shoulder: { patients: 85, revenuePerPatient: 450 },
      hip: { patients: 65, revenuePerPatient: 600 },
      leg: { patients: 45, revenuePerPatient: 750 }
    },
    { 
      month: 'Feb 2024', 
      date: new Date('2024-02-15'),
      knee: { patients: 135, revenuePerPatient: 525 },
      shoulder: { patients: 95, revenuePerPatient: 475 },
      hip: { patients: 75, revenuePerPatient: 625 },
      leg: { patients: 55, revenuePerPatient: 775 }
    },
    { 
      month: 'Mar 2024', 
      date: new Date('2024-03-15'),
      knee: { patients: 150, revenuePerPatient: 550 },
      shoulder: { patients: 110, revenuePerPatient: 500 },
      hip: { patients: 80, revenuePerPatient: 650 },
      leg: { patients: 65, revenuePerPatient: 800 }
    },
    { 
      month: 'Apr 2024', 
      date: new Date('2024-04-15'),
      knee: { patients: 165, revenuePerPatient: 575 },
      shoulder: { patients: 120, revenuePerPatient: 525 },
      hip: { patients: 90, revenuePerPatient: 675 },
      leg: { patients: 75, revenuePerPatient: 825 }
    },
    { 
      month: 'May 2024', 
      date: new Date('2024-05-15'),
      knee: { patients: 180, revenuePerPatient: 600 },
      shoulder: { patients: 130, revenuePerPatient: 550 },
      hip: { patients: 100, revenuePerPatient: 700 },
      leg: { patients: 85, revenuePerPatient: 850 }
    }
  ]);

  const [dateRange, setDateRange] = useState({
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-05-31')
  });

  const colors = {
    knee: '#1E3A8A',
    shoulder: '#047857',
    hip: '#B91C1C',
    leg: '#5B21B6'
  };

  const filteredDiagnosisData = useMemo(() => {
    return fullDiagnosisData.filter(item => 
      item.date >= dateRange.startDate && 
      item.date <= dateRange.endDate
    );
  }, [fullDiagnosisData, dateRange]);

  const calculateRevenueGap = (data) => {
    if (data.length < 2) return [];
    return Object.keys(colors).map(diagnosis => {
      const firstMonth = data[0][diagnosis];
      const lastMonth = data[data.length - 1][diagnosis];
      const totalPatients = lastMonth.patients - firstMonth.patients;
      const totalRevenueChange = 
        (lastMonth.patients * lastMonth.revenuePerPatient) - 
        (firstMonth.patients * firstMonth.revenuePerPatient);
      return {
        diagnosis,
        color: colors[diagnosis],
        totalPatients,
        totalRevenueChange,
        percentageChange: ((totalRevenueChange / (firstMonth.patients * firstMonth.revenuePerPatient)) * 100).toFixed(1)
      };
    });
  };

  const revenueGapList = calculateRevenueGap(filteredDiagnosisData);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-7xl mx-auto mt-10">
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
      {/* Date Range Filter */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="text-blue-600" size={24} />
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-gray-700">From:</label>
            <input 
              type="date" 
              value={dateRange.startDate.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({
                ...prev, 
                startDate: new Date(e.target.value)
              }))}
              className="border rounded px-2 py-1"
            />
            <label className="text-gray-700">To:</label>
            <input 
              type="date" 
              value={dateRange.endDate.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({
                ...prev, 
                endDate: new Date(e.target.value)
              }))}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full h-[300px] lg:h-[500px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={filteredDiagnosisData.map(item => ({
              month: item.month,
              ...Object.keys(colors).reduce((acc, diagnosis) => ({
                ...acc,
                [diagnosis]: item[diagnosis].patients
              }), {})
            }))}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E5E7EB" 
              vertical={false} 
            />
            <XAxis 
              dataKey="month" 
              axisLine={{ stroke: '#9CA3AF' }}
              tickLine={false}
              style={{ fontSize: '14px' }}
            />
            <YAxis 
              label={{ 
                value: 'Number of Patients', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '14px' }
              }}
              axisLine={{ stroke: '#9CA3AF' }}
              tickLine={false}
              style={{ fontSize: '14px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#F3F4F6', 
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 'bold', fontSize: '16px' }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Legend 
              verticalAlign="top" 
              height={50}
              wrapperStyle={{ paddingBottom: '10px' }}
              formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1) + ' Pain'}
            />
            
            {Object.keys(colors).map(diagnosis => (
              <Bar 
                key={diagnosis}
                dataKey={diagnosis} 
                fill={colors[diagnosis]} 
                fillOpacity={0.8} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Gap List */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-4 text-green-700 text-3xl font-bold">₹</span>
          Revenue Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {revenueGapList.map(item => (
            <div 
              key={item.diagnosis} 
              className="p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-2">
                <div 
                  className="w-4 h-4 mr-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-md font-semibold text-gray-800 capitalize">
                  {item.diagnosis} Pain
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-lg">
                  Patients: 
                  <span className="font-bold ml-2 text-gray-700">
                    {item.totalPatients > 0 ? '+' : ''}{item.totalPatients}
                  </span>
                </p>
                <p className="text-lg">
                  Revenue Change: 
                  <span 
                    className={`font-bold ml-2 ${
                      item.totalRevenueChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ₹{Math.abs(item.totalRevenueChange).toLocaleString()}
                  </span>
                </p>
                <p className="text-lg">
                  Change: 
                  <span 
                    className={`font-bold ml-2 ${
                      item.percentageChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.percentageChange}%
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
