import React from "react";

function SwapReturnTable({ materialData, setSwapContant }) {
  console.log(materialData);
  return (
    <div className="flex flex-col gap-4">
      <button
        className="bg-[--navbar-bg-color] w-fit hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-200 text-white px-2 py-1 rounded"
        onClick={() => setSwapContant(false)}
      >
        Back
      </button>
      <div className="overflow-auto max-h-[400px] text-nowrap text-center rounded-md shadow-md">
        <table className="table-auto w-full">
          <thead className="bg-[--navbar-bg-color] text-white">
            <tr>
              <th className="text-center px-2 py-2">Material Name</th>
              <th className="text-center px-2 py-2">Material Size</th>
              <th className="text-center px-2 py-2">Return Units</th>
              <th className="text-center px-2 py-2">Unit Amount</th>
              <th className="text-center px-2 py-2">Total Return Amount</th>
            </tr>
          </thead>
          <tbody className="text-center divide-y divide-gray-200">
            {materialData?.map((item) => (
              <tr key={item.rem_vID}>
                <td className="px-2 py-1">{item.rem_vMaterial_Name}</td>
                <td className="px-2 py-1">{item.rem_vMaterial_Size}</td>
                <td className="px-2 py-1">{item.rem_iReturn_Units}</td>
                <td className="px-2 py-1">{item.rem_iUnit_Amount}</td>
                <td className="px-2 py-1">{item.rem_iTotal_Return_Amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SwapReturnTable;
