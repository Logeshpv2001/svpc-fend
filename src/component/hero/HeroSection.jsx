import React from "react";
import receptionist from "../../assets/receptionist.png";
import seniorphysio from "../../assets/seniorphysio.png";

const HeroSection = ({ role }) => {
  return (
    <div className="flex flex-row justify-between w-full bg-[--hero-bg-color]">
      <div className="flex flex-col justify-center max-sm:w-full w-1/2">
        <h1 className="max-sm:text-xl text-4xl font-bold capitalize">
          Welcome, {" "}
            {(role === "physio" && "Senior Physio") ||
              (role === "receptionist" && "Receptionist") ||
              "master"}
          
        </h1>
        <p className="max-sm:text-base text-lg font-medium">
          Have a nice day at work
        </p>
      </div>
      <div className="max-sm:w-28 w-48">
        {role === "receptionist" ? (
          <img src={receptionist} alt="images" />
        ) : (
          <img src={seniorphysio} alt="images" />
        )}
      </div>
    </div>
  );
};

export default HeroSection;
