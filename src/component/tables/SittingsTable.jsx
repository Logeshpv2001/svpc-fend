import React, { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import AxiosInstance from "../../utilities/AxiosInstance";

const SittingsTable = ({ sittingsData, session, id }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addRow, setAddRow] = useState(false);
  const [formData, setFormData] = useState(
    sittingsData?.map((data) => ({
      ...data, // Spread the initial data to ensure all fields are initialized
      s_jhist: data.s_jhist?.map((sitting) => ({
        ...sitting,
        // Initialize each sitting's properties (like sitting, date, amount) with empty values.
      })),
    }))
  );

  // Handle change in each sitting's fields
  const handleInputChange = (parentIndex, index, e) => {
    const { name, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[parentIndex].s_jhist[index][name] = value;
    setFormData(updatedFormData);
  };

  // Handle add row form submission
  const addRowData = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      const response = await AxiosInstance.patch(
        `/sitting/edit-sitting-history/${id}`,
        formData
      );
      // Handle response here (e.g., close dialog or show success message)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <button className="px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl w-full md:w-auto mb-4 md:mb-0">
          Delete
        </button>
        <button
          onClick={() => setAddRow(true)}
          className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl w-full md:w-auto mb-4 md:mb-0"
        >
          Add
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              S.No
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Sitting Name
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Sitting Date
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Sitting Amount
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sittingsData?.map((data, parentIndex) =>
            data.s_jhist?.map((sitting, index) => (
              <tr key={`${parentIndex}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <input
                    type="text"
                    name="sitting"
                    value={formData[parentIndex].s_jhist[index].sitting}
                    onChange={(e) => handleInputChange(parentIndex, index, e)}
                    className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="date"
                    name="date"
                    value={formData[parentIndex].s_jhist[index].date}
                    onChange={(e) => handleInputChange(parentIndex, index, e)}
                    className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <input
                    type="number"
                    name="amount"
                    value={formData[parentIndex].s_jhist[index].amount}
                    onChange={(e) => handleInputChange(parentIndex, index, e)}
                    className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm w-full text-gray-500">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <MdModeEditOutline />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {addRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Sitting</h2>
            <form onSubmit={addRowData}>
              {formData?.map((data, parentIndex) =>
                data.s_jhist?.map((sitting, index) => (
                  <div key={`${parentIndex}-${index}`} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Sitting Name
                    </label>
                    <input
                      type="text"
                      name="sitting"
                      value={formData[parentIndex].s_jhist[index].sitting}
                      onChange={(e) => handleInputChange(parentIndex, index, e)}
                      className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Sitting Date
                    </label>
                    <input
                      type="text"
                      name="sitting"
                      value={formData[parentIndex].s_jhist[index].sitting}
                      onChange={(e) => handleInputChange(parentIndex, index, e)}
                      className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Sitting Name
                    </label>
                    <input
                      type="text"
                      name="sitting"
                      value={formData[parentIndex].s_jhist[index].sitting}
                      onChange={(e) => handleInputChange(parentIndex, index, e)}
                      className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                    />
                  </div>
                ))
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setAddRow(false)}
                  className="mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SittingsTable;
