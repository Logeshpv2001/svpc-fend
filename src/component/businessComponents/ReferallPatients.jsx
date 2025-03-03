import React, { useState, useMemo } from 'react';
import { Users, Share2, Instagram, Facebook, Youtube, UserPlus, Plus } from 'lucide-react';

const ReferallPatients = () => {
  const [referralSources, setReferralSources] = useState([
    {
      id: 1,
      name: 'Social Media Referrals',
      sources: [
        { platform: 'Instagram', count: 45 },
        { platform: 'Facebook', count: 32 },
        { platform: 'Youtube', count: 12 }
      ]
    },
    {
      id: 2,
      name: 'Walk-in Patients',
      count: 76
    },
    {
      id: 3,
      name: 'Patient to Patient',
      count: 54
    },
    {
      id: 4,
      name: 'Doctor Referrals',
      doctors: [
        { name: 'Dr. Emily Chen', count: 25 },
        { name: 'Dr. Michael Rodriguez', count: 18 },
        { name: 'Dr. Sarah Johnson', count: 35 }
      ]
    }
  ]);

  const [newDoctor, setNewDoctor] = useState({ name: '', count: 0 });

  const totalReferrals = useMemo(() => {
    return referralSources.reduce((total, source) => {
      if (source.sources) {
        return total + source.sources.reduce((sourceTotal, platform) => sourceTotal + platform.count, 0);
      }
      if (source.doctors) {
        return total + source.doctors.reduce((doctorTotal, doctor) => doctorTotal + doctor.count, 0);
      }
      return total + source.count;
    }, 0);
  }, [referralSources]);

  const incrementReferral = (sourceId, index = null) => {
    setReferralSources(prev => 
      prev.map(source => {
        if (source.id === sourceId) {
          if (source.sources && index !== null) {
            const updatedSources = [...source.sources];
            updatedSources[index] = {
              ...updatedSources[index],
              count: updatedSources[index].count + 1
            };
            return { ...source, sources: updatedSources };
          }
          if (source.doctors && index !== null) {
            const updatedDoctors = [...source.doctors];
            updatedDoctors[index] = {
              ...updatedDoctors[index],
              count: updatedDoctors[index].count + 1
            };
            return { ...source, doctors: updatedDoctors };
          }
          return { ...source, count: source.count + 1 };
        }
        return source;
      })
    );
  };

  const addNewDoctor = () => {
    if (newDoctor.name.trim()) {
      setReferralSources(prev => 
        prev.map(source => {
          if (source.id === 4) {
            return {
              ...source,
              doctors: [
                ...source.doctors,
                { 
                  name: newDoctor.name.trim(), 
                  count: newDoctor.count 
                }
              ]
            };
          }
          return source;
        })
      );
      setNewDoctor({ name: '', count: 0 });
    }
  };

  const renderSocialMediaReferrals = (sources) => {
    const socialIcons = {
      'Instagram': Instagram,
      'Facebook': Facebook,
      'Youtube': Youtube
    };

    return sources.map((platform, index) => {
      const SocialIcon = socialIcons[platform.platform] || Share2;
      return (
        <div 
          key={platform.platform} 
          className="flex justify-between items-center border-b last:border-b-0 py-2"
        >
          <div className="flex items-center space-x-2">
            <SocialIcon className="h-5 w-5 text-gray-600" />
            <span className="text-gray-800">{platform.platform}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold text-lg mr-2">Referrals:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold">{platform.count}</span>
            <button
              onClick={() => incrementReferral(1, index)}
              className="text-green-500 hover:bg-green-50 p-1 rounded-full"
              title={`Add ${platform.platform} Referral`}
            >
              <UserPlus className="h-4 w-4" />
            </button>
          </div>
        </div>
      );
    });
  };

  const renderDoctorReferrals = (doctors) => {
    return doctors.map((doctor, index) => (
      <div 
        key={doctor.name} 
        className="flex justify-between items-center border-b last:border-b-0 py-2"
      >
        <div className="flex flex-col">
          <span className="text-gray-800 font-semibold">{doctor.name}</span>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold mr-2">Referrals:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold">{doctor.count}</span>
          </div>
        </div>
        <button
          onClick={() => incrementReferral(4, index)}
          className="text-green-500 hover:bg-green-50 p-2 rounded-full"
          title={`Add ${doctor.name} Referral`}
        >
          <UserPlus className="h-5 w-5" />
        </button>
      </div>
    ));
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10">
      <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Users className="mr-2 text-blue-600" />
          Patient Referral Sources
        </h2>
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            <span>Total Referrals: {totalReferrals}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Social Media Referrals */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center">
            <Share2 className="mr-2 text-blue-500" />
            Social Media Referrals
          </h3>
          {renderSocialMediaReferrals(referralSources[0].sources)}
        </div>

        {/* Other Referral Sources */}
        <div className="space-y-4">
          {referralSources.slice(1, 3).map((source) => (
            <div
              key={source.id}
              className="border p-4 rounded-lg flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{source.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-blue-600 font-bold">Referrals:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold">{source.count}</span>
                </div>
              </div>
              <button
                className="text-green-500 hover:bg-green-50 p-2 rounded-full"
                onClick={() => incrementReferral(source.id)}
                title={`Add ${source.name} Referral`}
              >
                <UserPlus className="h-5 w-5" />
              </button>
            </div>
          ))}

          {/* Doctor Referrals */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Doctor Referrals
            </h3>
            {renderDoctorReferrals(referralSources[3].doctors)}
            
            {/* New Doctor Input */}
            <div className="mt-4 flex space-x-2">
              <input 
                type="text"
                placeholder="Enter Doctor's Name"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input 
                type="number"
                placeholder="Initial Referrals"
                value={newDoctor.count}
                onChange={(e) => setNewDoctor(prev => ({ ...prev, count: parseInt(e.target.value) || 0 }))}
                className="w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={addNewDoctor}
                className="bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferallPatients;
