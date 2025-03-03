import { ArrowLeftIcon } from "lucide-react";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";

function SwapReturnBillView({
  setReturnBillSwap,
  returnBillSwap,
  returnBillMaterials = [],
}) {
  const { id } = useParams();
  console.log(id, "id");
  console.log(returnBillSwap, "returnBillSwap");
  console.log(returnBillMaterials, "returnBillMaterials");

  return (
    <div className="p-4 flex flex-col gap-4">
      <button
        className="bg-[--navbar-bg-color] w-fit text-[--light-navbar-bg-color] hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-150 px-2 py-1 rounded flex items-center gap-2"
        onClick={() => setReturnBillSwap(false)}
      >
        <FaArrowLeft /> Back
      </button>
      {returnBillMaterials.length > 0 ? (
        <div className="overflow-x-auto text-nowrap text-center rounded-md">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-[--navbar-bg-color] text-white">
                <th className="py-2 px-4 border-b">S.No</th>
                <th className="py-2 px-4 border-b">Material Name</th>
                <th className="py-2 px-4 border-b">Company Name</th>
                <th className="py-2 px-4 border-b">Supplier Name</th>
                <th className="py-2 px-4 border-b">Return Units</th>
                <th className="py-2 px-4 border-b">Seal Units</th>
                <th className="py-2 px-4 border-b">Unit Amount</th>
                <th className="py-2 px-4 border-b">Total Return Amount</th>
              </tr>
            </thead>
            <tbody>
              {returnBillMaterials.map((item, index) => (
                <tr key={item.brm_vID} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">
                    {item.brm_vMaterial_Name}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {item.brm_vCompany_Name}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {item.brm_vSupplier_Name}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {item.brm_iReturn_Units}
                  </td>
                  <td className="py-2 px-4 border-b">{item.brm_iSeal_Units}</td>
                  <td className="py-2 px-4 border-b">
                    {item.brm_iUnit_Amount}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {item.brm_iTotal_Return_Amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No return materials available.</p>
      )}
    </div>
  );
}

export default SwapReturnBillView;
