import React from "react";

const NavTabs = ({ currentTab, currentPage }) => {
  return (
    <div className="my-4">
      <h1 className="lowercase text-xl tracking-wide text-slate-700">
        {currentPage} {">"}{" "}
        <span className="text-blue-700 font-bold">{currentTab}</span>
      </h1>
    </div>
  );
};

export default NavTabs;
