import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import bg from "@/public/location.png";

interface PropsMap {
  iconSize: number;
  lat: any;
  lng: any;
  style: object;
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
          className="map"
          center={{ lat: Number(lat), lng: Number(lng) }}
          zoom={10}
          style={style}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={{ lat: Number(lat), lng: Number(lng) }}
            icon={GetIcon(iconSize)}
          >
            <Popup>Vị trí hiện tại của bạn</Popup>
          </Marker>
        </MapContainer>
      )}
      {!lat && !lng && (
        <MapContainer className="map" center={[1, 1]} zoom={10} style={style}>
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
