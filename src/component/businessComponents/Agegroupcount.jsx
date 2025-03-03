import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Agegroupcount = () => {
  // Sample age group data
  const [ageGroupData, setAgeGroupData] = useState([
    { name: '0-18', value: 1500, color: '#3B82F6' },
    { name: '19-25', value: 2800, color: '#10B981' },
    { name: '26-35', value: 3500, color: '#F43F5E' },
    { name: '36-45', value: 2200, color: '#8B5CF6' },
    { name: '46-55', value: 1800, color: '#F59E0B' },
    { name: '56+', value: 1200, color: '#6B7280' }
  ]);

  // Calculate total for percentage
  const total = ageGroupData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile View */}
      <div className="block md:hidden">
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Age Group Distribution</h2>
            <div className="text-gray-600 font-medium">
              Total: {total.toLocaleString()}
            </div>
          </div>

          {/* Mobile Pie Chart */}
          <div className="w-full h-64">
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
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {ageGroupData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} Users`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Mobile Detailed Breakdown */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Age Group Details</h3>
            <div className="grid grid-cols-2 gap-2">
              {ageGroupData.map((group) => (
                <div
                  key={group.name}
                  className="bg-gray-50 rounded-lg p-2 flex items-center"
                >
                  <div
                    className="w-3 h-3 mr-2 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <div>
                    <div className="text-sm font-medium">{group.name}</div>
                    <div className="text-xs text-gray-500">
                      {group.value.toLocaleString()} ({((group.value / total) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Age Group Distribution</h2>
            <div className="text-gray-600 font-medium">
              Total Patients: {total.toLocaleString()}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center">
            {/* Desktop Pie Chart */}
            <div className="w-full md:w-2/3 h-[400px]">
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
                      `${name}: ${value.toLocaleString()} (${(percent * 100).toFixed(1)}%)`
                    }
                  >
                    {ageGroupData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value.toLocaleString()} Users`,
                      name
                    ]}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    formatter={(value) => {
                      const currentEntry = ageGroupData.find(e => e.name === value);
                      const percentage = ((currentEntry.value / total) * 100).toFixed(1);
                      return `${value} (${percentage}%)`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Desktop Detailed Breakdown */}
            <div className="w-full md:w-1/3 mt-4 md:mt-0 md:pl-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Age Group Patients</h3>
                {ageGroupData.map((group) => (
                  <div
                    key={group.name}
                    className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div
                      className="w-4 h-4 mr-3 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    <span className="flex-grow">{group.name}</span>
                    <span className="font-medium">
                      {group.value.toLocaleString()}
                      <span className="text-gray-500 ml-1 text-sm">
                        ({((group.value / total) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agegroupcount;