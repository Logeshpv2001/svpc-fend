import React, { useEffect, useState } from "react";
import { FaMale } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";
const DashboardCard = ({ data }) => {
  return (
    <div className="my-4 grid max-md:grid-cols-1 max-lg:grid-cols-2 grid-cols-4 gap-4">
      {data.map((card) => (
        <div
          key={card.id}
          className={`p-4 rounded-lg flex flex-row flex-wrap items-center justify-evenly shadow-md hover:shadow-lg transition-all bg-gradient-to-tl ${card.color}`}
        >
          <div className="mr-4 bg-white p-2 rounded-full shadow-inner">
            {card.icon}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-center">{card.title}</h3>
            <p className="text-2xl font-bold bg-white shadow-inner rounded-xl text-center">
              {card.count || 0}
            </p>
            {(card.title === "Today Patients" ||
              card.title === "Tomorrow Patients") && (
              <div className="flex flex-row flex-wrap gap-5 w-full items-center justify-center">
                <p className="flex items-center justify-center text-blue-500 ring-4 ring-blue-500 ring-opacity-50 p-2 rounded-full transition duration-300">
                  <FaMale className="text-2xl" />
                  <span className="ml-2">{card.male || 0}</span>
                </p>
                <p className="flex items-center justify-center text-pink-500 ring-4 ring-pink-500 ring-opacity-50 p-2 rounded-full transition duration-300">
                  <FaFemale className="text-2xl" />
                  <span className="ml-2">{card.female || 0}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
