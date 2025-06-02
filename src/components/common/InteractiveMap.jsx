import React, { useState, useEffect } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Button } from "../ui/button";
export default function InteractiveMap({ isStationPin = false, handlePins }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_GMAPS_KEY,
  });

  // ⇢ keep the map's centre here
  const [center, setCenter] = useState({ lat: 30, lng: 70 }); // fallback
  const [pins, setPins] = useState([]);

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

  /* ↻ pin helpers */
  const addPin = (e) => {
    e.latLng &&
      setPins((p) => [
        ...p,
        { id: crypto.randomUUID(), lat: e.latLng.lat(), lng: e.latLng.lng() },
      ]);
  };

  const removePin = (id) => setPins((p) => p.filter((m) => m.id !== id));
  const clearPins = () => setPins([]);

  if (loadError) return <p>Error: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading map…</p>;
  console.log("pins", pins);
  const defaultPinUrl =
    "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png";
  return (
    <>
      {/* <Button
        variant="destructive"
        onClick={clearPins}
        style={{ margin: "8px 0" }}
      >
        Clear All
      </Button> */}

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center} // ← lives in state, updates after geolocation
        zoom={15}
        onClick={addPin}
      >
        {isStationPin ? (
          <Marker
            position={{ lat: p.lat, lng: p.lng }}
            onClick={() => removePin(p.id)}
            icon={{
              url: defaultPinUrl, // same graphic as the default
              scaledSize: new google.maps.Size(25, 40), // 2× original
            }}
          />
        ) : (
          pins.map((p) => (
            <>
              {/* <AdvancedMarker
              position={{ lat: p.lat, lng: p.lng }}
              onClick={() => removePin(p.id)}
              content={
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#2563eb",
                    boxShadow: "0 0 0 4px white",
                  }}
                />
              }
            /> */}
              <Marker
                key={p.id}
                position={{ lat: p.lat, lng: p.lng }}
                onClick={() => removePin(p.id)}
                // optional custom icon:
                // icon={{
                //   // path: google.maps.SymbolPath.CIRCLE,
                //   path: "@/Asset/Image/station_pin_svg.svg",
                //   scale: 8,
                //   fillColor: "#2563eb",
                //   fillOpacity: 1,
                //   strokeWeight: 0,
                // }}
              />
            </>
          ))
        )}
      </GoogleMap>
    </>
  );
}

// src/components/InteractiveMap.jsx
// import React, { useState } from "react";
// import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

// export default function InteractiveMap() {
//   // Only the core Maps JS API is needed now
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GMAPS_KEY,
//   });

//   const [pins, setPins] = useState([]);

//   if (loadError) return <p>Error loading map: {loadError.message}</p>;
//   if (!isLoaded) return <p>Loading map…</p>;

//   function handleMapClick(e) {
//     if (!e.latLng) return;
//     const lat = e.latLng.lat();
//     const lng = e.latLng.lng();

//     setPins((prev) => [...prev, { lat, lng }]);
//     console.log("New pin:", lat, lng); // or POST to your backend, etc.
//   }

//   return (
//     <GoogleMap
//       mapContainerStyle={{ width: "100%", height: 400 }}
//       center={{ lat: 30, lng: 70 }}
//       zoom={15}
//       onClick={handleMapClick}
//     >
//       {pins.map((p, i) => (
//         <Marker key={i} position={{ lat: p.lat, lng: p.lng }} />
//       ))}
//     </GoogleMap>
//   );
// }

// // src/components/InteractiveMap.jsx
// import React, { useState } from "react";
// import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

// const LIBRARIES = ["places", "geometry"]; // keep outside component

// export default function InteractiveMap() {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GMAPS_KEY,
//     libraries: LIBRARIES,
//   });

//   const [pins, setPins] = useState([]);

//   if (loadError) return <p>Error loading map: {loadError.message}</p>;
//   if (!isLoaded) return <p>Loading map…</p>;

//   async function handleMapClick(e) {
//     if (!e.latLng) return;
//     const lat = e.latLng.lat();
//     const lng = e.latLng.lng();

//     const geocoder = new window.google.maps.Geocoder();
//     const res = await geocoder.geocode({ location: { lat, lng } });
//     const address = res.results?.[0]?.formatted_address || "Unknown location";

//     setPins((prev) => [...prev, { lat, lng, address }]);
//   }

//   return (
//     <GoogleMap
//       mapContainerStyle={{ width: "100%", height: 400 }}
//       center={{ lat: 30, lng: 70 }}
//       zoom={15}
//       onClick={handleMapClick}
//     >
//       {pins.map((p, i) => (
//         <Marker
//           key={i}
//           position={{ lat: p.lat, lng: p.lng }}
//           title={p.address}
//         />
//       ))}
//     </GoogleMap>
//   );
// }
