import React, { useEffect, useState } from "react";
import body from "../../assets/body/human_layout_3.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  updateLeftSide,
  clearLeftPointer,
} from "../../redux/slices/pointerSlice";

function BodyPointerLeftSide() {
  const dispatch = useDispatch();
  const leftSidePointers = useSelector((state) => state.pointer.leftSide); // Get Redux state
  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPosition = { x, y };

    const updatedPositions = [...leftSidePointers, newPosition];
    dispatch(updateLeftSide(updatedPositions)); // Dispatch the update action
  };

  useEffect(() => {
    dispatch(updateLeftSide([])); // Clear the frontSide state when the component mounts
  }, [dispatch]);

  const handleRemovePointer = (index) => {
    // Dispatch the removePointer action with the index of the pointer to remove
    dispatch(clearLeftPointer(index));
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[200px] h-[400px] relative">
        <img src={body} alt="body" className="w-[200px] h-[400px] absolute" />
        <div className="w-[200px] h-[400px] absolute" onClick={handleClick}>
          {leftSidePointers?.map((pos, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: pos.x - 5,
                top: pos.y - 5,
                width: "15px",
                height: "15px",
                backgroundColor: "red",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering `handleClick`
                handleRemovePointer(index); // Remove the clicked pointer
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BodyPointerLeftSide;
