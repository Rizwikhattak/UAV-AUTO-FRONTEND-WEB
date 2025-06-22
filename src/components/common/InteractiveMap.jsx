import React, { useState, useEffect } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Button } from "../ui/button";

export default function InteractiveMap({
  displayOnly = false,
  pins = [],
  onPinsChange,
  mode = "route", // "station" or "route"
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_GMAPS_KEY,
  });

  // ⇢ keep the map's centre here
  const [center, setCenter] = useState({ lat: 30, lng: 70 }); // fallback
  const [localPins, setLocalPins] = useState(pins || []);

  /* 1️⃣  Get current location once on mount */
  useEffect(() => {
    if (!navigator.geolocation) return; // browser doesn't support it
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lng: longitude });
      },
      (err) => console.error("Geolocation error:", err), // user denied / device off
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  }, []);

  // Update local pins when props change
  useEffect(() => {
    setLocalPins(pins || []);
  }, [pins]);

  /* ↻ pin helpers */
  const addPin = (e) => {
    if (displayOnly) return; // Don't add pins in display mode

    if (e.latLng) {
      const newPin = {
        id: crypto.randomUUID(),
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        type: mode,
      };

      let updatedPins;

      if (mode === "station") {
        // For stations, replace existing pin (only one allowed)
        updatedPins = [newPin];
      } else {
        // For routes, add to existing pins (multiple allowed)
        updatedPins = [...localPins, newPin];
      }

      setLocalPins(updatedPins);

      // Notify parent component
      if (onPinsChange) {
        onPinsChange(updatedPins);
      }
    }
  };

  const removePin = (id) => {
    if (displayOnly) return; // Don't remove pins in display mode

    const updatedPins = localPins.filter((m) => m.id !== id);
    setLocalPins(updatedPins);

    // Notify parent component
    if (onPinsChange) {
      onPinsChange(updatedPins);
    }
  };

  const clearPins = () => {
    if (displayOnly) return; // Don't clear pins in display mode

    setLocalPins([]);
    if (onPinsChange) {
      onPinsChange([]);
    }
  };

  if (loadError) return <p>Error: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading map…</p>;

  // Different pin styles for different types
  const getMarkerIcon = (pinType) => {
    if (pinType === "station") {
      return {
        url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png",
        scaledSize: new google.maps.Size(25, 40),
      };
    } else {
      // Route/geofence points - default marker or custom style
      return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#2563eb",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#ffffff",
      };
    }
  };

  return (
    <>
      {!displayOnly && (
        <div className="mb-2 flex justify-between items-center">
          <Button variant="destructive" onClick={clearPins} size="sm">
            Clear All ({localPins.length})
          </Button>
          {mode === "station" && (
            <span className="text-sm text-gray-600">
              Click anywhere to {localPins.length > 0 ? "move" : "add"} station
              pin
            </span>
          )}
        </div>
      )}

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={displayOnly ? 12 : 15}
        onClick={addPin}
        options={{
          disableDoubleClickZoom: displayOnly,
          gestureHandling: displayOnly ? "cooperative" : "auto",
        }}
      >
        {localPins.map((p) => (
          <Marker
            key={p.id}
            position={{ lat: p.lat, lng: p.lng }}
            onClick={() => removePin(p.id)}
            icon={getMarkerIcon(p.type)}
            title={displayOnly ? `${p.type} pin` : `Click to remove`}
          />
        ))}
      </GoogleMap>
    </>
  );
}
