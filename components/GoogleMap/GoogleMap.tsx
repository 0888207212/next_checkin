"use client";

import { useState, memo, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "./style.css";

interface PropsMap {
  lat: any;
  lng: any;
  info: string;
  checkoutLat?: any;
  checkoutLng?: any;
  checkoutInfo?: string;
  style: string;
}

const ggMapApiKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

function GoogleMaps({
  lat,
  lng,
  info,
  checkoutLat,
  checkoutLng,
  checkoutInfo,
  style,
}: PropsMap) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: ggMapApiKey,
  });

  const [activeMarkerCheckIn, setActiveMarkerCheckIn] = useState(false);
  const [activeMarkerCheckOut, setActiveMarkerCheckOut] = useState(false);
  const [checkOverlap, setCheckOverlap] = useState(true);

  useEffect(() => {
    if (lat && lng && checkoutLat && checkoutLng) {
      if (lat === checkoutLat && lng === checkoutLng) {
        setCheckOverlap(false);
      }
    }
  }, [lat, lng, checkoutLat, checkoutLng]);

  const handleActiveMarkerCheckIn = () => {
    setActiveMarkerCheckIn(true);
  };

  const handleMouseOverCheckIn = () => {
    setActiveMarkerCheckIn(false);
  };

  const handleActiveMarkerCheckOut = () => {
    setActiveMarkerCheckOut(true);
  };

  const handleMouseOverCheckOut = () => {
    setActiveMarkerCheckOut(false);
  };

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
          options={{ gestureHandling: "greedy", fullscreenControl: true }}
        >
          <Marker
            position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
            onClick={handleActiveMarkerCheckIn}
            onMouseOver={handleMouseOverCheckIn}
          >
            {activeMarkerCheckIn && (
              <InfoWindow
                position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
              >
                <div>
                  <strong className="text-[#004D40]">Checkin: </strong>
                  {info}
                </div>
              </InfoWindow>
            )}
          </Marker>
          {checkoutLat && checkoutLng && checkOverlap && (
            <Marker
              position={{
                lat: parseFloat(checkoutLat),
                lng: parseFloat(checkoutLng),
              }}
              onClick={handleActiveMarkerCheckOut}
              onMouseOver={handleMouseOverCheckOut}
            >
              {activeMarkerCheckOut && (
                <InfoWindow
                  position={{
                    lat: parseFloat(checkoutLat),
                    lng: parseFloat(checkoutLng),
                  }}
                >
                  <div>
                    <strong className="text-[#FF5722]">Checkout: </strong>
                    {checkoutInfo}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}
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

export default memo(GoogleMaps);
