import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  Users2Icon, 
  CalendarIcon, 
  TrendingUpIcon
} from 'lucide-react';

const GenderGraph = () => {
  const [data, setData] = useState([
    { date: '2024-01', male: 45, female: 55, totalPatients: 320 },
    { date: '2024-02', male: 48, female: 52, totalPatients: 350 },
    { date: '2024-03', male: 50, female: 50, totalPatients: 400 },
    { date: '2024-04', male: 52, female: 48, totalPatients: 425 },
    { date: '2024-05', male: 47, female: 53, totalPatients: 375 }
  ]);

  const [selectedDate, setSelectedDate] = useState('');
  const [viewType, setViewType] = useState('percentage');

  const processedData = useMemo(() => {
    const filteredData = selectedDate
      ? data.filter(item => item.date === selectedDate)
      : data;

    return filteredData.map(item => ({
      ...item,
      maleLabel: `${item.male}%`,
      femaleLabel: `${item.female}%`
    }));
  }, [data, selectedDate]);

  const overallStats = useMemo(() => {
    const totalMale = data.reduce((sum, item) => sum + item.male, 0) / data.length;
    const totalFemale = data.reduce((sum, item) => sum + item.female, 0) / data.length;
    const totalPatients = data.reduce((sum, item) => sum + item.totalPatients, 0);
    const patientGrowth = ((data[data.length - 1].totalPatients - data[0].totalPatients) / data[0].totalPatients * 100).toFixed(1);

    return {
      averageMale: totalMale.toFixed(1),
      averageFemale: totalFemale.toFixed(1),
      totalPatients,
      patientGrowth
    };
  }, [data]);

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-7xl mx-auto mt-10">
      {/* Header Section */}
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
          <Users2Icon className="mr-4 text-blue-700" size={28} />
          Patient Gender Distribution
        </h2>

        <div className="flex flex-wrap space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="text-gray-600" size={20} />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Periods</option>
              {data.map(item => (
                <option key={item.date} value={item.date}>
                  {item.date}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart Container */}
        <div className="md:col-span-2 h-[250px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={processedData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                vertical={false} 
              />
              <XAxis 
                dataKey="date" 
                axisLine={{ stroke: '#9CA3AF' }}
                tickLine={false}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                label={{ 
                  value: 'Percentage (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '12px' }
                }}
                axisLine={{ stroke: '#9CA3AF' }}
                tickLine={false}
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#F3F4F6', 
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                labelStyle={{ fontWeight: 'bold', fontSize: '14px' }}
                formatter={(value, name) => [`${value}%`, name === 'male' ? 'Male' : 'Female']}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Bar dataKey="male" fill="#3B82F6" stackId="a" label={{ position: 'top' }} />
              <Bar dataKey="female" fill="#EC4899" stackId="a" label={{ position: 'top' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics Sidebar */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users2Icon className="mr-2 text-blue-700" size={24} />
              <span className="text-sm md:text-lg font-semibold text-gray-800">Total Patients</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-blue-900">
              {overallStats.totalPatients}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUpIcon className="mr-2 text-green-700" size={24} />
              <span className="text-sm md:text-lg font-semibold text-gray-800">Patient Growth</span>
            </div>
            <p className={`text-lg md:text-2xl font-bold ${overallStats.patientGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overallStats.patientGrowth > 0 ? '+' : ''}{overallStats.patientGrowth}%
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm md:text-base text-gray-700">Male</span>
              </div>
              <span className="font-bold text-blue-700">{overallStats.averageMale}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                <span className="text-sm md:text-base text-gray-700">Female</span>
              </div>
              <span className="font-bold text-pink-700">{overallStats.averageFemale}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderGraph;
