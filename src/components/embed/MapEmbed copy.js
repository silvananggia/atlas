import React, { useEffect, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ"; 
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, toLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import { Translate } from "ol/interaction";
import Collection from "ol/Collection";
import Icon from "ol/style/Icon";
import Overlay from "ol/Overlay";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
const MapComponent = () => {
  const centerMap = [118.0149, -2.5489];
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [marker, setMarker] = useState(null);
  const [userLocation, setUserLocation] = useState([0,0]);
  const [markerPosition, setMarkerPosition] = useState(centerMap);

  useEffect(() => {
        
   


    const map = new Map({
      target: "map",
      controls: defaultControls(),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(centerMap),
        zoom: 6,
      }),
    });

    setMap(map);

    const potential = new TileLayer({
      source: new XYZ({
        url: "http://10.27.59.239/potential/{z}/{x}/{-y}.png",
      }),
    });



    const userMarkerSource = new VectorSource();
    const userMarkerLayer = new VectorLayer({
      source: userMarkerSource,
      zIndex: 1,
    });

    map.addLayer(userMarkerLayer);

    const userMarkerFeature = new Feature({
      geometry: new Point(fromLonLat([0, 0])),
    });
    userMarkerFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 6,
          zIndex: 1,
          fill: new Fill({
            color: "#3399CC",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 2,
          }),
        }),
      })
    );
    userMarkerSource.addFeature(userMarkerFeature);
    userMarkerLayer.setZIndex(1);
    setUserMarker(userMarkerFeature);

    const markerSource = new VectorSource();
    const markerLayer = new VectorLayer({
      source: markerSource,
      zIndex: 2,
    });

    map.addLayer(markerLayer);

    const markerFeature = new Feature({
      geometry: new Point(fromLonLat(centerMap)),
    });
    markerFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "images/location-pin.png", 
          zIndex: 2,
        }),
      })
    );
    markerSource.addFeature(markerFeature);
    markerLayer.setZIndex(2);
    setMarker(markerFeature);

    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    map.addInteraction(translate);

    const markerOverlay = new Overlay({
      element: document.getElementById("marker-overlay"),
      positioning: "bottom-center",
      offset: [0, -20],
    });
    map.addOverlay(markerOverlay);

    const userMarkerOverlay = new Overlay({
      element: document.getElementById("user-marker-overlay"),
      positioning: "bottom-center",
      offset: [0, -20],
    });
    map.addOverlay(userMarkerOverlay);

    userMarkerFeature.on("change", () => {
      const coordinates = userMarkerFeature.getGeometry().getCoordinates();
      const lonLat = toLonLat(coordinates);
      userMarkerOverlay.setPosition(coordinates);
      setUserLocation(lonLat);
    });

    markerFeature.on("change", () => {
      const coordinates = markerFeature.getGeometry().getCoordinates();
      const lonLat = toLonLat(coordinates);
      markerOverlay.setPosition(coordinates);
      setMarkerPosition(lonLat);

      window.parent.postMessage(
        {
          type: "MarkerPosition",
          latitude: lonLat[1],
          longitude: lonLat[0],
        },
        "http://localhost:8000"
      );
    });

    // Get the device's current location and zoom to it
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lonLat = [position.coords.longitude, position.coords.latitude];
        const coordinates = fromLonLat(lonLat);

        // Set the map's view to the device's location
        map.getView().setCenter(coordinates);
        map.getView().setZoom(15); // Adjust the zoom level as needed

        // Set the user's marker's position to the device's location
        userMarkerFeature.getGeometry().setCoordinates(coordinates);

        // Set the marker's position to the device's location
        markerFeature.getGeometry().setCoordinates(coordinates);

        // Update the user marker position state
        setUserLocation(lonLat);
        // Update the marker position state
        setMarkerPosition(lonLat);
      });
    }

    return () => {
      map.removeInteraction(translate);
    };
  }, []);

  return (
    <div>
      <div id="map" className="map"></div>
      <p id="coordinates">
        Latitude: {markerPosition[1].toFixed(6)}, Longitude:{" "}
        {markerPosition[0].toFixed(6)}
      </p>
      <p id="user-coordinates">
        User Latitude: {userLocation[1].toFixed(6)}, User Longitude:{" "}
        {userLocation[0].toFixed(6)}
      </p>
    </div>
  );
};

export default MapComponent;
