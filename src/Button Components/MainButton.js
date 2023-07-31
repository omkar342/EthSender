import React from "react";
import "./MainButton.css";

const MainButton = ({ title, handleOnClick }) => {
  return (
    <div className="button_component">
      <button
        onClick={handleOnClick}
        style={
          title === "Withdraw"
            ? {
                backgroundColor: "#fff",
                color: "#000",
              }
            : {}
        }
        className="button"
      >
        {title}
      </button>
    </div>
  );
};

export default MainButton;
