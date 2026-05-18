import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type ListingMapProps = {
  latitude: number;
  longitude: number;
  title: string;
  location: string;
};

export function ListingMap({
  latitude,
  longitude,
  title,
  location,
}: ListingMapProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-[2rem] border border-neutral-200">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={{
          height: "350px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{title}</strong>
            <br />
            {location}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}