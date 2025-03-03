// import React, { useState, useMemo } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
// } from 'recharts';
// import { StethoscopeIcon, ActivityIcon, FlagIcon } from 'lucide-react';

// const PhysioTherapy = () => {
//   const [therapyData] = useState({
//     equipmentUsage: [
//       { name: 'Treadmill', usage: 85, total: 120, category: 'Cardio', maintenanceGap: 15, date: '2024-11-20' },
//       { name: 'Exercise Bike', usage: 70, total: 100, category: 'Cardio', maintenanceGap: 20, date: '2024-11-21' },
//       { name: 'Resistance Bands', usage: 95, total: 150, category: 'Strength', maintenanceGap: 10, date: '2024-11-22' },
//       { name: 'Physio Ball', usage: 60, total: 90, category: 'Core', maintenanceGap: 25, date: '2024-11-23' },
//       { name: 'Weight Machines', usage: 50, total: 80, category: 'Strength', maintenanceGap: 30, date: '2024-11-24' },
//     ],
//     therapyTypes: [
//       { name: 'Orthopedic', patients: 150, completionRate: 85, date: '2024-11-20' },
//       { name: 'Neurological', patients: 100, completionRate: 75, date: '2024-11-21' },
//       { name: 'Sports Injury', patients: 120, completionRate: 90, date: '2024-11-22' },
//       { name: 'Pediatric', patients: 80, completionRate: 65, date: '2024-11-23' },
//     ],
//   });

//   const [startDate, setStartDate] = useState(new Date('2024-11-20'));
//   const [endDate, setEndDate] = useState(new Date('2024-11-24'));

//   // Filter data based on date range
//   const filteredData = useMemo(() => {
//     const start = new Date(startDate).getTime();
//     const end = new Date(endDate).getTime();

//     return {
//       equipmentUsage: therapyData.equipmentUsage.filter((item) => {
//         const itemDate = new Date(item.date).getTime();
//         return itemDate >= start && itemDate <= end;
//       }),
//       therapyTypes: therapyData.therapyTypes.filter((item) => {
//         const itemDate = new Date(item.date).getTime();
//         return itemDate >= start && itemDate <= end;
//       }),
//     };
//   }, [therapyData, startDate, endDate]);

//   const COLORS = ['#3B82F6', '#10B981', '#F43F5E', '#8B5CF6', '#F97316'];

//   const presetDateRanges = [
//     { label: 'Today', range: [new Date(), new Date()] },
//     {
//       label: 'Last 7 Days',
//       range: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()],
//     },
//     {
//       label: 'Last 30 Days',
//       range: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()],
//     },
//   ];

//   return (
//     <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-7xl mx-auto mt-10">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
//           <StethoscopeIcon className="mr-4 text-blue-700" size={36} />
//           Physiotherapy Analytics Dashboard
//         </h2>
//         {/* Date Filters */}
//         <div className="flex flex-wrap gap-4">
//           <DatePicker
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             maxDate={endDate}
//             className="border border-gray-300 rounded px-4 py-2 text-sm shadow-sm w-full md:w-auto"
//             placeholderText="Start Date"
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={(date) => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//             className="border border-gray-300 rounded px-4 py-2 text-sm shadow-sm w-full md:w-auto"
//             placeholderText="End Date"
//           />
//           <div className="flex gap-2">
//             {presetDateRanges.map((preset) => (
//               <button
//                 key={preset.label}
//                 className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 onClick={() => {
//                   setStartDate(preset.range[0]);
//                   setEndDate(preset.range[1]);
//                 }}
//               >
//                 {preset.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
//         {/* Equipment Usage */}
//         <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-md">
//           <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
//             <ActivityIcon className="mr-3 text-blue-600" size={24} />
//             Equipment Usage
//           </h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={filteredData.equipmentUsage}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                 <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="usage" fill="#3B82F6" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Therapy Types */}
//         <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-md">
//           <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
//             <FlagIcon className="mr-3 text-green-600" size={24} />
//             Therapy Type Distribution
//           </h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={filteredData.therapyTypes} cx="50%" cy="50%" outerRadius={80} label>
//                   {filteredData.therapyTypes.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PhysioTherapy;

import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { StethoscopeIcon, ActivityIcon, FlagIcon } from 'lucide-react';

const PhysioTherapy = () => {
  const [therapyData] = useState({
    equipmentUsage: [
      { name: 'Treadmill', usage: 85, total: 120, category: 'Cardio', maintenanceGap: 15, date: '2024-11-20' },
      { name: 'Exercise Bike', usage: 70, total: 100, category: 'Cardio', maintenanceGap: 20, date: '2024-11-21' },
      { name: 'Resistance Bands', usage: 95, total: 150, category: 'Strength', maintenanceGap: 10, date: '2024-11-22' },
      { name: 'Physio Ball', usage: 60, total: 90, category: 'Core', maintenanceGap: 25, date: '2024-11-23' },
      { name: 'Weight Machines', usage: 50, total: 80, category: 'Strength', maintenanceGap: 30, date: '2024-11-24' },
    ],
    therapyTypes: [
      { name: 'Orthopedic', patients: 150, completionRate: 85, date: '2024-11-20' },
      { name: 'Neurological', patients: 100, completionRate: 75, date: '2024-11-21' },
      { name: 'Sports Injury', patients: 120, completionRate: 90, date: '2024-11-22' },
      { name: 'Pediatric', patients: 80, completionRate: 65, date: '2024-11-23' },
    ],
  });

  const [startDate, setStartDate] = useState(new Date('2024-11-20'));
  const [endDate, setEndDate] = useState(new Date('2024-11-24'));

  // Filter data based on date range
  const filteredData = useMemo(() => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return {
      equipmentUsage: therapyData.equipmentUsage.filter((item) => {
        const itemDate = new Date(item.date).getTime();
        return itemDate >= start && itemDate <= end;
      }),
      therapyTypes: therapyData.therapyTypes.filter((item) => {
        const itemDate = new Date(item.date).getTime();
        return itemDate >= start && itemDate <= end;
      }),
    };
  }, [therapyData, startDate, endDate]);

  const stats = useMemo(() => {
    const totalEquipment = filteredData.equipmentUsage.reduce((sum, item) => sum + item.total, 0);
    const totalUsage = filteredData.equipmentUsage.reduce((sum, item) => sum + item.usage, 0);
    const avgMaintenanceGap = filteredData.equipmentUsage.reduce(
      (sum, item) => sum + item.maintenanceGap,
      0
    ) / filteredData.equipmentUsage.length;

    const totalTherapyPatients = filteredData.therapyTypes.reduce((sum, item) => sum + item.patients, 0);
    const avgCompletionRate =
      filteredData.therapyTypes.reduce((sum, item) => sum + item.completionRate, 0) /
      filteredData.therapyTypes.length;

    return {
      totalEquipment,
      totalUsage: Math.round((totalUsage / totalEquipment) * 100),
      avgMaintenanceGap: avgMaintenanceGap.toFixed(1),
      totalTherapyPatients,
      avgCompletionRate: avgCompletionRate.toFixed(1),
    };
  }, [filteredData]);

  const COLORS = {
    equipment: ['#3B82F6', '#10B981', '#F43F5E', '#8B5CF6', '#F97316'],
    therapy: ['#2563EB', '#059669', '#DC2626', '#7C3AED'],
  };

  const presetDateRanges = [
    { label: 'Today', range: [new Date(), new Date()] },
    {
      label: 'Last 7 Days',
      range: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()],
    },
    {
      label: 'Last 30 Days',
      range: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()],
    },
  ];

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-7xl mx-auto mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          <StethoscopeIcon className="mr-4 text-blue-700" size={36} />
          Physiotherapy Analytics Dashboard
        </h2>
        {/* Date Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={endDate}
            className="border border-gray-300 rounded px-4 py-2 text-sm shadow-sm"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border border-gray-300 rounded px-4 py-2 text-sm shadow-sm"
            placeholderText="End Date"
          />
          <div className="flex gap-2">
            {presetDateRanges.map((preset) => (
              <button
                key={preset.label}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  setStartDate(preset.range[0]);
                  setEndDate(preset.range[1]);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ActivityIcon className="mr-3 text-blue-600" size={24} />
            Equipment Usage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredData.equipmentUsage}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                label={{
                  value: 'Usage (%)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 12 },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="usage" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FlagIcon className="mr-3 text-green-600" size={24} />
            Therapy Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredData.therapyTypes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="patients"
                label
              >
                {filteredData.therapyTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.therapy[index % COLORS.therapy.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} Patients`, name]}
                contentStyle={{
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PhysioTherapy;
