// FloatingButton.js

import React from "react";

const FloatingButton = ({ basemapOptions, basemap, changeBasemap }) => {
  return (
    
    <div className="floating-button">
     

      {basemapOptions.map((option) => (
        <div className="button-container">
          <div
            key={option.key}
            className={`image ${basemap === option.key ? "active" : ""}`}
            id={option.key}
            onClick={() => changeBasemap(option.key)}
          ></div>
          <div className={`label ${basemap === option.key ? "active" : ""}`}>{option.label}</div> {/* Label below div */}
        </div>
      ))}
    </div>
  );
};

export default FloatingButton;
