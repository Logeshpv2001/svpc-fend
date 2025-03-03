import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./component/Navbar/Navbar";
import Sidebar from "./component/sidebar/Sidebar";
import { useSelector } from "react-redux";
import Home from "./pages/receptionist/home/Home";
import Bill from "./pages/receptionist/bills/Bill";
import NextReview from "./pages/receptionist/reviews/NextReview";
import TodayPatients from "./pages/physio/patient/TodayPatients";
import ViewPatient from "./pages/physio/patient/ViewPatient";
import BookAppointment from "./pages/physio/patient/BookAppointment";
import Login from "./pages/general/login/Login";
import EnquiryRegistraionForm from "./component/forms/EnquiryRegistraionForm";
import MasterLogin from "../src/pages/general/login/MasterLogin";
import ClinicTable from "./component/tables/ClinicTable";
import PatientDetails from "./pages/general/patientDetails/PatientDetails";
import Assessment from "./pages/general/assessment/Assessment";
import Employees from "./pages/physio/employee/Employees";
import Attendance from "./pages/physio/employee/Attendance";
import Analyist from "./pages/master/Analyist";
import Expenditure from "./pages/general/inventory/Expenditure";
import DailyReport from "./pages/physio/reports/DailyReport";
import BookedAppointment from "./component/businessComponents/BookedAppointments";
import Diagnosis from "./component/businessComponents/Diagnosis";
import Revenue from "./component/businessComponents/Revenue";
import ReferallPatients from "./component/businessComponents/ReferallPatients";
import PhysioTherapy from "./component/businessComponents/PhysioTherapy";
import Count from "./component/businessComponents/Count";
import RehabBill from "./pages/receptionist/bills/RehabBill";
import Sittings from "./pages/general/sittings/Sittings";
import AgencyBill from "./pages/receptionist/bills/AgencyBill";
import BillDetails from "./pages/receptionist/bills/BillDetails";
import PatientBills from "./pages/receptionist/bills/PatientBills";
import PatientGreet from "./pages/general/patientDetails/PatientGreet";
import Census from "./pages/general/census/Census";
import BillsAndPayments from "./pages/physio/bill/BillsAndPayments";
import DailyBill from "./pages/physio/bill/DailyBill";
import PackageBill from "./pages/physio/bill/PackageBill";
import DailyBillGenerate from "./pages/receptionist/bills/daily/DailyBillGenerate";
import { BillGenerate } from "./pages/receptionist/bills/daily/BillGenerate";
import PackageBillGen from "./pages/receptionist/bills/PackageBillGen";
import PurchaseCreate from "./component/general/PurchaseCreate";
import PurchaseTableMaterial from "./component/tables/inventory/PurchaseTableMaterial";
import ReturnInnerTab from "./component/tables/inventory/ReturnInnerTab";
import AgencyBillViewReturn from "./component/general/AgencyBillViewReturn";
import ReturnBills from "./pages/receptionist/bills/ReturnBills";
import Bills from "./pages/general/viewBills/bills";

const AppContent = () => {
  const isOpen = useSelector((state) => state.toggle.isOpen);
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen min-w-screen">
      {location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/master-login" ? (
        ""
      ) : (
        <Navbar />
      )}
      <div className="flex flex-row ">
        {location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/master-login" ? (
          ""
        ) : (
          <Sidebar />
        )}
        <div
          className={`${
            location.pathname === "/" ||
            location.pathname === "/login" ||
            location.pathname === "/master-login"
              ? "w-screen h-screen"
              : isOpen
              ? "w-[80vw]"
              : "w-[95vw]"
          } p-10 max-sm:p-4 max-sm:fixed max-sm:w-full bg-slate-100 ${
            location.pathname === "/" ||
            location.pathname === "/login" ||
            location.pathname === "/master-login"
              ? "h-screen flex w-screen items-center justify-center"
              : "h-[90vh]"
          } overflow-auto`}
        >
          <Routes>
            {/* General */}
            <Route path="/master-admin" element={<ClinicTable />} />
            <Route path="/master/analyist" element={<Analyist />} />
            <Route
              path="/patient-details/:patient_id"
              element={<PatientDetails />}
            />
            <Route path="/expenditure" element={<Expenditure />} />
            <Route path="/census" element={<Census />} />
            <Route path="/receptionist/view-bills" element={<Bills />} />
            {/* Receptionist */}
            <Route path="/master-login" element={<MasterLogin />} />
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/receptionist/patient-info" element={<Home />} />
            <Route path="/receptionist/bill" element={<Bill />} />
            <Route
              path="/receptionist/billdetails/:id"
              element={<BillDetails />}
            />
            <Route
              path="/receptionist/sittings/:patientid/:packageid"
              element={<Sittings />}
            />
            <Route path="/receptionist/next-review" element={<NextReview />} />
            <Route
              path="/receptionist/daily-bill/:id"
              element={<DailyBillGenerate />}
            />
            <Route
              path="/receptionist/daily-bills-generate/:id"
              element={<BillGenerate />}
            />
            <Route
              path="/receptionist/agency-bill/:id"
              element={<AgencyBill />}
            />
            <Route
              path="/receptionist/packageBill/:id"
              element={<PackageBillGen />}
            />

            <Route
              path="/receptionist/rehab-bill/:id"
              element={<RehabBill />}
            />
            <Route
              path="/receptionist/enquiry-registration"
              element={<EnquiryRegistraionForm />}
            />
            <Route
              path="/receptionist/enquiry-registration/:patient_id"
              element={<EnquiryRegistraionForm />}
            />
            <Route
              path="/receptionist/booked-appointment"
              element={<BookAppointment />}
            />

            <Route
              path="/receptionist/all-bills/:id"
              element={<PatientBills />}
            />
            <Route
              path="/receptionist/purchase/create"
              element={<PurchaseCreate />}
            />

            <Route path="/patient-greetings/:id" element={<PatientGreet />} />
            <Route
              path="/receptionist/purchase/material/:id"
              element={<PurchaseTableMaterial />}
            />
            <Route
              path="/receptionist/purchase/return"
              element={<ReturnInnerTab />}
            />
            <Route
              path="/agency-bill-view/return"
              element={<AgencyBillViewReturn />}
            />
            <Route
              path="/receptionist/return-bill/:id"
              element={<ReturnBills />}
            />
            {/* Physio */}
            <Route path="/physio/today-patient" element={<TodayPatients />} />
            <Route path="/physio/view-patient" element={<ViewPatient />} />
            <Route path="/physio/next-review" element={<NextReview />} />
            <Route
              path="/physio/booked-appointment"
              element={<BookAppointment />}
            />
            <Route
              path="/physio/assessment/:patient_id"
              element={<Assessment />}
            />
            <Route path="/physio/employees" element={<Employees />} />
            <Route path="/physio/daily-report" element={<DailyReport />} />
            <Route
              path="/physio/employees/attendance"
              element={<Attendance />}
            />
            <Route
              path="/physio/employees/bills-and-payments"
              element={<BillsAndPayments />}
            />
            <Route path="/physio/daily-bill/:id" element={<DailyBill />} />
            <Route path="/physio/package-bill/:id" element={<PackageBill />} />
            {/* Master */}
            <Route path="/Count" element={<Count />} />
            <Route path="/BookedAppointments" element={<BookedAppointment />} />
            <Route path="/Diagnosis" element={<Diagnosis />} />
            <Route path="/Revenue" element={<Revenue />} />
            <Route path="/ReferallPatients" element={<ReferallPatients />} />
            <Route path="/PhysioTherapy" element={<PhysioTherapy />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
