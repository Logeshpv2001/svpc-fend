import React, { useEffect } from "react";
import body from "../../assets/body/human_layout_2.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFrontSide,
  clearFrontPointer,
} from "../../redux/slices/pointerSlice";

function BodyPointerFrontSide() {
  const dispatch = useDispatch();
  const frontSidePointers = useSelector((state) => state.pointer.frontSide);

  useEffect(() => {
    dispatch(updateFrontSide([]));
  }, [dispatch]);

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPosition = { x, y };

    // Add the new position to the Redux state
    const updatedPositions = [...frontSidePointers, newPosition];
    dispatch(updateFrontSide(updatedPositions));
  };
  const handleRemovePointer = (index) => {
    // Dispatch the removePointer action with the index of the pointer to remove
    dispatch(clearFrontPointer(index));
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[200px] h-[400px] relative">
        <img src={body} alt="body" className="w-[200px] h-[400px] absolute" />
        <div className="w-[200px] h-[400px] absolute" onClick={handleClick}>
          {frontSidePointers?.map((pos, index) => (
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
                e.stopPropagation();
                handleRemovePointer(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BodyPointerFrontSide;
