"use client";

import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import "./style.css";

interface PropsMap {
  lat: any;
  lng: any;
  style: string;
}

const ggMapApiKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

function GoogleMaps({ lat, lng, style }: PropsMap) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: ggMapApiKey,
  });

  return isLoaded ? (
    <div className={style}>
      {lat && lng && (
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
          }}
          center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
          zoom={18}
        >
          <Marker
            position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
          ></Marker>
        </GoogleMap>
      )}
      {!lat && !lng && (
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
          }}
          center={{ lat: 21.033333, lng: 105.849998 }}
          zoom={18}
        ></GoogleMap>
      )}
    </div>
  ) : (
    <></>
  );
}

export default React.memo(GoogleMaps);
