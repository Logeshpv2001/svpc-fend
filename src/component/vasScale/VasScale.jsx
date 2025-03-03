import React from "react";
import "./VasScale.css";
import { useDispatch, useSelector } from "react-redux";
import { setPainLevel } from "../../redux/slices/vasScaleSlice";

const VasScale = () => {
  const dispatch = useDispatch();
  const painLevel = useSelector((state) => state.vasScale.painLevel);
  const handleSliderChange = (e) => {
    dispatch(setPainLevel(Number(e.target.value)));
  };

  return (
    <div className="vas-scale-container">
      <h3>VAS Scale</h3>
      <div className="scale-container gray">
        <input
          type="range"
          min="0"
          max="10"
          value={painLevel}
          onChange={handleSliderChange}
          className="pain-slider"
        />
      </div>
      <div className="scale-labels">
        <span>Pain Level {painLevel}</span>
        <span>No Pain (0)</span>
        <span>Worst Pain (10)</span>
      </div>
    </div>
  );
};

export default VasScale;
