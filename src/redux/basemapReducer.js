// src/redux/basemapReducer.js

const initialState = "map-switch-default";

const basemapReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BASEMAP":
      return action.payload;
    default:
      return state;
  }
};

export default basemapReducer;
