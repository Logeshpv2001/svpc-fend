import React from "react";
import HeroSection from "../../../component/hero/HeroSection";
import PatientInfoTable from "../../../component/tables/PatientInfoTable";

const Home = () => {
  return (
    <div>
      {/* Headers */}
      <HeroSection role={"receptionist"} />

      {/* patient table */}
      <div className="max-w-full overflow-x-auto">
        <PatientInfoTable />
      </div>
    </div>
  );
};

export default Home;
