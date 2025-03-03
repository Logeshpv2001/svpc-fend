import React from "react";
import HeroSection from "../../../component/hero/HeroSection";
import TodayPatientCard from "../../../component/cards/TodayPatientCard";
import "./patient.css";

const TodayPatients = () => {
  return (
    <div>
      <HeroSection role={"physio"} />

      <div>
        <TodayPatientCard />
      </div>
    </div>
  );
};

export default TodayPatients;
