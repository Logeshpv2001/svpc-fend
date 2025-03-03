import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Users, AlertCircle, RefreshCw, Clock, Star, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookedAppointments = () => {
  const navigate = useNavigate();
  // Enhanced appointments data with more metrics
  const [appointmentsData, setAppointmentsData] = useState([
    { 
      month: 'Jan', 
      bookings: 120, 
      cancelations: 1, 
      reschedules: 10,
      averageBookingTime: 45,  
      customerSatisfaction: 4.2  
    },
    { 
      month: 'Feb', 
      bookings: 145, 
      cancelations: 2, 
      reschedules: 12,
      averageBookingTime: 50,
      customerSatisfaction: 4.3
    },
    { 
      month: 'Mar', 
      bookings: 180, 
      cancelations: 2, 
      reschedules: 18,
      averageBookingTime: 52,
      customerSatisfaction: 4.4
    },
    { 
      month: 'Apr', 
      bookings: 200, 
      cancelations: 3, 
      reschedules: 22,
      averageBookingTime: 55,
      customerSatisfaction: 4.5
    },
    { 
      month: 'May', 
      bookings: 230, 
      cancelations: 3, 
      reschedules: 25,
      averageBookingTime: 58,
      customerSatisfaction: 4.6
    },
    { 
      month: 'Jun', 
      bookings: 250, 
      cancelations: 4, 
      reschedules: 30,
      averageBookingTime: 60,
      customerSatisfaction: 4.7
    }
  ]);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Calculate total and growth metrics
  const totalBookings = appointmentsData.reduce((sum, item) => sum + item.bookings, 0);
  const lastMonthBookings = appointmentsData[appointmentsData.length - 1].bookings;
  const previousMonthBookings = appointmentsData[appointmentsData.length - 2].bookings;
  const growthPercentage = ((lastMonthBookings - previousMonthBookings) / previousMonthBookings * 100).toFixed(1);

  // Metrics calculation
  const metrics = {
    totalBookings,
    avgBookings: (totalBookings / appointmentsData.length).toFixed(0),
    totalCancelations: appointmentsData.reduce((sum, item) => sum + item.cancelations, 0),
    totalReschedules: appointmentsData.reduce((sum, item) => sum + item.reschedules, 0),
    avgBookingTime: appointmentsData[appointmentsData.length - 1].averageBookingTime,
    avgCustomerSatisfaction: appointmentsData[appointmentsData.length - 1].customerSatisfaction.toFixed(1)
  };

  const [activeTab, setActiveTab] = useState('chart');

  // Render tab buttons with responsive design
  const renderTabButtons = (mobile = false) => (
    <div className={`${mobile ? 'flex flex-col space-y-2' : 'flex space-x-2'}`}>
      <button 
        onClick={() => {
          setActiveTab('chart');
          setIsMobileMenuOpen(false);
        }}
        className={`
          ${mobile ? 'w-full' : ''} 
          px-4 py-2 rounded-md 
          ${activeTab === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
        `}
      >
        Visualization
      </button>
      <button 
        onClick={() => {
          setActiveTab('table');
          setIsMobileMenuOpen(false);
        }}
        className={`
          ${mobile ? 'w-full' : ''} 
          px-4 py-2 rounded-md 
          ${activeTab === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
        `}
      >
        Detailed Table
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
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
      {/* Mobile Header with Hamburger Menu */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Calendar className="mr-2 text-blue-600" size={20} />
          Appointments
        </h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-600"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 p-6 md:hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">View Options</h2>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          {renderTabButtons(true)}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 w-full">
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Calendar className="mr-3 text-blue-600" size={24} />
            Booked Appointments Dashboard
          </h2>
          
          <div className="hidden md:block">
            {renderTabButtons()}
          </div>
        </div>

        {/* Responsive Content Area */}
        {activeTab === 'chart' && (
          <div className="w-full h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0' }}
                  labelStyle={{ fontWeight: 'bold' }}
                  formatter={(value, name) => [value, 
                    name === 'bookings' ? 'Bookings' : 
                    name === 'cancelations' ? 'Cancelations' : 
                    name === 'reschedules' ? 'Reschedules' :
                    name === 'averageBookingTime' ? 'Avg Booking Time' : 
                    'Customer Satisfaction'
                  ]}
                />
                <Legend />
                
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="cancelations" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="reschedules" 
                  stroke="#10B981" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'table' && (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 md:p-3 text-left text-xs md:text-sm">Month</th>
                  <th className="border p-2 md:p-3 text-left text-xs md:text-sm">Bookings</th>
                  <th className="border p-2 md:p-3 text-left text-xs md:text-sm">Cancelations</th>
                  <th className="border p-2 md:p-3 text-left text-xs md:text-sm">Reschedules</th>
                  <th className="border p-2 md:p-3 text-left text-xs md:text-sm">Avg Booking Time</th>
                  <th className="border p-2 md:p-3 text-left text-xs md:text-sm">Satisfaction</th>
                </tr>
              </thead>
              <tbody>
                {appointmentsData.map((data) => (
                  <tr key={data.month} className="hover:bg-gray-50">
                    <td className="border p-2 md:p-3 text-xs md:text-sm">{data.month}</td>
                    <td className="border p-2 md:p-3 text-blue-600 font-bold text-xs md:text-sm">{data.bookings}</td>
                    <td className="border p-2 md:p-3 text-red-600 text-xs md:text-sm">{data.cancelations}</td>
                    <td className="border p-2 md:p-3 text-green-600 text-xs md:text-sm">{data.reschedules}</td>
                    <td className="border p-2 md:p-3 text-xs md:text-sm">{data.averageBookingTime}</td>
                    <td className="border p-2 md:p-3 font-bold text-xs md:text-sm">{data.customerSatisfaction}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Statistics - Responsive Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-center">
              <Users className="mr-2 text-green-600" size={20} />
              <p className="text-xs sm:text-sm text-gray-600">Avg Monthly Bookings</p>
            </div>
            <p className="text-base sm:text-lg font-bold text-blue-600">{metrics.avgBookings}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-center">
              <AlertCircle className="mr-2 text-red-600" size={20} />
              <p className="text-xs sm:text-sm text-gray-600">Total Cancelations</p>
            </div>
            <p className="text-base sm:text-lg font-bold text-red-600">{metrics.totalCancelations}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-center">
              <RefreshCw className="mr-2 text-green-600" size={20} />
              <p className="text-xs sm:text-sm text-gray-600">Total Reschedules</p>
            </div>
            <p className="text-base sm:text-lg font-bold text-green-600">{metrics.totalReschedules}</p>
          </div>
        </div>

        {/* Performance Highlights - Responsive Grid */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Performance Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                <TrendingUp className="mr-2 text-blue-600" size={16} />
                Monthly Growth Rate
              </p>
              <p className={`text-base sm:text-lg font-bold ${growthPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growthPercentage > 0 ? '+' : ''}{growthPercentage}%
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                <Clock className="mr-2 text-purple-600" size={16} />
                Avg Booking Time
              </p>
              <p className="text-base sm:text-lg font-bold text-purple-600">{metrics.avgBookingTime} mins</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                <Star className="mr-2 text-yellow-600" size={16} />
                Avg Customer Satisfaction
              </p>
              <p className="text-base sm:text-lg font-bold text-yellow-600">{metrics.avgCustomerSatisfaction}/5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookedAppointments;