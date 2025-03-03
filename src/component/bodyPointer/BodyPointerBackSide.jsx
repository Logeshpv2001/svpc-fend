import React, { useEffect } from "react";
import body from "../../assets/body/human_layout_1.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  clearBackPointer,
  updateBackSide,
} from "../../redux/slices/pointerSlice";

function BodyPointerBackSide() {
  const dispatch = useDispatch();
  const backSidePointers = useSelector((state) => state.pointer.backSide); // Get Redux state

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPosition = { x, y };

    // Add the new position to the Redux state
    const updatedPositions = [...backSidePointers, newPosition];
    dispatch(updateBackSide(updatedPositions)); // Dispatch the update action
  };

  useEffect(() => {
    dispatch(updateBackSide([])); // Clear the frontSide state when the component mounts
  }, [dispatch]);

  const handleRemovePointer = (index) => {
    // Dispatch the removePointer action with the index of the pointer to remove
    dispatch(clearBackPointer(index));
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[200px] h-[400px] relative">
        <img src={body} alt="body" className="w-[200px] h-[400px] absolute" />
        <div className="w-[200px] h-[400px] absolute" onClick={handleClick}>
          {backSidePointers?.map((pos, index) => (
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

export default BodyPointerBackSide;
