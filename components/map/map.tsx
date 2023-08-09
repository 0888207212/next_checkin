"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { FullscreenControl } from "react-leaflet-fullscreen";
import "react-leaflet-fullscreen/styles.css";
import bg from "@/public/location.png";

interface PropsMap {
  iconSize: number;
  lat: any;
  lng: any;
  style: string;
}

const GetIcon = (iconSize: any) => {
  return L.icon({
    iconUrl: `${bg.src}`,
    iconSize: iconSize,
  });
};

const Map = ({ iconSize, lat, lng, style }: PropsMap) => {
  return (
    <div>
      {lat && lng && (
        <MapContainer
          className={style}
          center={{ lat: Number(lat), lng: Number(lng) }}
          zoom={100}
          // style={style}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FullscreenControl />
          <Marker
            position={{ lat: Number(lat), lng: Number(lng) }}
            icon={GetIcon(iconSize)}
          >
            <Popup>Vị trí hiện tại của bạn</Popup>
          </Marker>
        </MapContainer>
      )}
      {!lat && !lng && (
        <MapContainer
          className={style}
          center={[21.033333, 105.849998]}
          zoom={100}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
