import React from "react";
import Typography from "@mui/material/Typography";
import { Divider, Slider } from "@mui/material";

const FloatingButton = ({
  basemapOptions,
  basemap,
  changeBasemap,
  potentialLayerOpacity,
  handlePotentialLayerOpacityChange,
  faskesType
}) => {
  return (
    <div className="embed-floating-button">
      <Typography id="opacity-slider-label" fontSize={12}>
        Peta Potensi {faskesType.toUpperCase()}: 
      </Typography>{" "}
      <div className="opacity-slider">
      <Slider
        value={potentialLayerOpacity}
        onChange={handlePotentialLayerOpacityChange}
        size="small"
        aria-labelledby="opacity-slider-label"
        step={0.1}
        min={0}
        max={1}
        
      />
      </div>
      <Divider/>
      <Typography id="opacity-slider-label" fontSize={12}>
        Peta Dasar :
      </Typography>{" "}
      <div className="basemap-option">
        {basemapOptions.map((option) => (
          <div className="button-container-embed">
            <div
              key={option.key}
              className={`image ${basemap === option.key ? "active" : ""}`}
              id={option.key}
              onClick={() => changeBasemap(option.key)}
            ></div>
            <div className={`label ${basemap === option.key ? "active" : ""}`}>
              {option.label}
            </div>{" "}
            {/* Label below div */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingButton;
