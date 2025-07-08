import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapProps {
  latitude: number;
  longitude: number;
  onClick?: (lat: number, lng: number) => void;
  marker?: { latitude: number; longitude: number };
}

const Map: React.FC<MapProps> = ({ latitude, longitude, onClick, marker }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView(
        [latitude, longitude],
        13
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(leafletMapRef.current);

      if (onClick) {
        leafletMapRef.current.on("click", function (e: any) {
          onClick(e.latlng.lat, e.latlng.lng);
        });
      }
    }

    // Marker logic
    const markerLat = marker?.latitude ?? latitude;
    const markerLng = marker?.longitude ?? longitude;
    if (markerRef.current) {
      markerRef.current.setLatLng([markerLat, markerLng]);
    } else {
      markerRef.current = L.marker([markerLat, markerLng]).addTo(
        leafletMapRef.current!
      );
    }

    leafletMapRef.current.setView([markerLat, markerLng], 13);
  }, [latitude, longitude, marker, onClick]);

  return <div ref={mapRef} className="w-full h-64 rounded-lg shadow-md" />;
};

export default Map;
