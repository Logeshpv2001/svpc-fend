import React, { useState } from 'react';
import { 
  ComposedChart, 
  Area, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUpIcon } from 'lucide-react';

const Revenue = () => {
  const [activeView, setActiveView] = useState('daily');

  const formatRupees = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);

  const dailyData = [
    { name: '2024-11-01', revenue: 40000, target: 45000 },
    { name: '2024-11-02', revenue: 30000, target: 45000 },
    { name: '2024-11-03', revenue: 50000, target: 45000 },
    { name: '2024-11-04', revenue: 48000, target: 45000 },
    { name: '2024-11-05', revenue: 60000, target: 45000 },
    { name: '2024-11-06', revenue: 45000, target: 45000 },
    { name: '2024-11-07', revenue: 55000, target: 45000 },
  ];

  const weeklyData = [
    { name: 'W1', revenue: 220000, target: 250000 },
    { name: 'W2', revenue: 250000, target: 250000 },
    { name: 'W3', revenue: 280000, target: 250000 },
    { name: 'W4', revenue: 260000, target: 250000 },
  ];

  const monthlyData = [
    { name: 'Jan', revenue: 1200000, target: 1000000 },
    { name: 'Feb', revenue: 1350000, target: 1000000 },
    { name: 'Mar', revenue: 1500000, target: 1000000 },
    { name: 'Apr', revenue: 1400000, target: 1000000 },
    { name: 'May', revenue: 1600000, target: 1000000 },
    { name: 'Jun', revenue: 1700000, target: 1000000 },
  ];

  const currentData =
    activeView === 'daily' ? dailyData :
    activeView === 'weekly' ? weeklyData :
    monthlyData;

  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = totalRevenue / currentData.length || 0;
  const targetRevenue = currentData[0]?.target * currentData.length || 0;
  const performancePercentage = ((totalRevenue / targetRevenue) * 100).toFixed(1);

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-7xl mx-auto mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
          <TrendingUpIcon size={24} className="text-green-500 mr-3" />
          Revenue Tracking
        </h2>

        {/* View Selector */}
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1 mt-4 md:mt-0">
          {['daily', 'weekly', 'monthly'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
                ${activeView === view 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-200'}`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-700 flex items-center justify-center">
            Total Revenue
          </p>
          <p className="text-2xl font-bold text-green-800">
            {formatRupees(totalRevenue)}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700 flex items-center justify-center">
            Avg {activeView.charAt(0).toUpperCase() + activeView.slice(1)} Revenue
          </p>
          <p className="text-2xl font-bold text-blue-800">
            {formatRupees(averageRevenue)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-700 flex items-center justify-center">
            Performance
          </p>
          <p className={`text-2xl font-bold ${
            performancePercentage > 100 ? 'text-green-800' : 'text-red-800'
          }`}>
            {performancePercentage}%
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatRupees(value).replace('₹', '')} />
            <Tooltip
              formatter={(value, name) => [
                formatRupees(value),
                name === 'revenue' ? 'Revenue' : 'Target',
              ]}
              contentStyle={{
                backgroundColor: '#f9f9f9',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              fill="rgba(34, 197, 94, 0.2)"
              stroke="#22c55e"
              strokeWidth={3}
            />
            <Bar dataKey="target" barSize={20} fill="rgba(59, 130, 246, 0.3)" />
            <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Revenue;
