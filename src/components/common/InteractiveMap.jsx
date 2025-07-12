import React, { useState, useEffect } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Button } from "../ui/button";

export default function InteractiveMap({
  displayOnly = false,
  pins = [],
  onPinsChange,
  mode = "route", // "station" or "route"
  handleDeletePins,
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GMAPS_KEY,
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
    const deletedPin = localPins.find((m) => m.id === id);
    handleDeletePins(deletedPin);

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
        <div className="mb-2 flex justify-between items-center gap-2 flex-col sm:flex-row">
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

// Different marker options for Google Maps

// Different marker options for Google Maps

// const getMarkerIcon = (pinType) => {
//   if (pinType === "station") {
//     return {
//       url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png",
//       scaledSize: new google.maps.Size(25, 40),
//     };
//   } else {
//     // Route/geofence points - Choose from these options:

//     // 1. SYMBOL PATH OPTIONS (Built-in shapes)

//     // Circle (current)
//     return {
//       path: google.maps.SymbolPath.CIRCLE,
//       scale: 8,
//       fillColor: "#2563eb",
//       fillOpacity: 1,
//       strokeWeight: 2,
//       strokeColor: "#ffffff",
//     };

//     // Arrow pointing forward
//     return {
//       path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
//       scale: 4,
//       fillColor: "#dc2626",
//       fillOpacity: 1,
//       strokeWeight: 2,
//       strokeColor: "#ffffff",
//     };

//     // Arrow pointing backward
//     return {
//       path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
//       scale: 4,
//       fillColor: "#16a34a",
//       fillOpacity: 1,
//       strokeWeight: 2,
//       strokeColor: "#ffffff",
//     };

//     // 2. CUSTOM SVG PATHS

//     // Custom star shape
//     return {
//       path: "M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z",
//       fillColor: "#fbbf24",
//       fillOpacity: 1,
//       strokeColor: "#f59e0b",
//       strokeWeight: 2,
//       scale: 0.8,
//     };

//     // Custom diamond shape
//     return {
//       path: "M 0,-20 L 20,0 L 0,20 L -20,0 Z",
//       fillColor: "#8b5cf6",
//       fillOpacity: 1,
//       strokeColor: "#7c3aed",
//       strokeWeight: 2,
//       scale: 0.8,
//     };

//     // Custom triangle
//     return {
//       path: "M 0,-20 L 17,10 L -17,10 Z",
//       fillColor: "#06b6d4",
//       fillOpacity: 1,
//       strokeColor: "#0891b2",
//       strokeWeight: 2,
//       scale: 1,
//     };

//     // 3. USING GOOGLE'S STANDARD MARKER IMAGES

//     // Default Google marker (red)
//     return {
//       url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png",
//       scaledSize: new google.maps.Size(22, 40),
//     };

//     // Different colored markers
//     return {
//       url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
//       scaledSize: new google.maps.Size(32, 32),
//     };

//     return {
//       url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
//       scaledSize: new google.maps.Size(32, 32),
//     };

//     return {
//       url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
//       scaledSize: new google.maps.Size(32, 32),
//     };

//     return {
//       url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
//       scaledSize: new google.maps.Size(32, 32),
//     };

//     return {
//       url: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
//       scaledSize: new google.maps.Size(32, 32),
//     };

//     // 4. USING CUSTOM ICONS/IMAGES

//     // You can use any image URL
//     return {
//       url: "/path/to/your/custom-icon.png",
//       scaledSize: new google.maps.Size(30, 30),
//       anchor: new google.maps.Point(15, 15), // Center the icon
//     };

//     // 5. LETTERS/NUMBERS ON MARKERS

//     // Numbered markers (1-9)
//     return {
//       url: "https://maps.google.com/mapfiles/marker_black1.png",
//       scaledSize: new google.maps.Size(20, 34),
//     };

//     // Letter markers (A-Z)
//     return {
//       url: "https://maps.google.com/mapfiles/marker_blackA.png",
//       scaledSize: new google.maps.Size(20, 34),
//     };
//   }
// };

// // BONUS: Dynamic marker based on index or properties
// const getDynamicMarkerIcon = (pinType, index) => {
//   if (pinType === "route") {
//     const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];
//     const color = colors[index % colors.length];

//     return {
//       path: google.maps.SymbolPath.CIRCLE,
//       scale: 8,
//       fillColor: color,
//       fillOpacity: 1,
//       strokeWeight: 2,
//       strokeColor: "#ffffff",
//     };
//   }
//   // ... rest of logic
// };

// // BONUS: Animated marker (bouncing)
// const getAnimatedMarkerIcon = (pinType) => {
//   if (pinType === "route") {
//     return {
//       path: google.maps.SymbolPath.CIRCLE,
//       scale: 8,
//       fillColor: "#dc2626",
//       fillOpacity: 1,
//       strokeWeight: 2,
//       strokeColor: "#ffffff",
//       animation: google.maps.Animation.BOUNCE, // Add this to Marker component
//     };
//   }
//   // ... rest of logic
// };

// // USAGE EXAMPLES:

// // 1. Use different colors for each route point
// {localPins.map((p, index) => (
//   <Marker
//     key={p.id}
//     position={{ lat: p.lat, lng: p.lng }}
//     onClick={() => removePin(p.id)}
//     icon={getDynamicMarkerIcon(p.type, index)}
//     title={displayOnly ? `${p.type} pin` : `Click to remove`}
//   />
// ))}

// // 2. Add animation to markers
// {localPins.map((p) => (
//   <Marker
//     key={p.id}
//     position={{ lat: p.lat, lng: p.lng }}
//     onClick={() => removePin(p.id)}
//     icon={getMarkerIcon(p.type)}
//     animation={google.maps.Animation.DROP} // or BOUNCE
//     title={displayOnly ? `${p.type} pin` : `Click to remove`}
//   />
// ))}

// // 3. Use custom labels
// {localPins.map((p, index) => (
//   <Marker
//     key={p.id}
//     position={{ lat: p.lat, lng: p.lng }}
//     onClick={() => removePin(p.id)}
//     icon={getMarkerIcon(p.type)}
//     label={{
//       text: `${index + 1}`,
//       color: "white",
//       fontSize: "12px",
//       fontWeight: "bold"
//     }}
//     title={displayOnly ? `${p.type} pin` : `Click to remove`}
//   />
// ))}

// // BONUS: Animated marker (bouncing)
// const getAnimatedMarkerIcon = (pinType) => {
//   if (pinType === "route") {
//     return {
//       path: google.maps.SymbolPath.CIRCLE,
//       scale: 8,
//       fillColor: "#dc2626",
//       fillOpacity: 1,
//       strokeWeight: 2,
//       strokeColor: "#ffffff",
//       animation: google.maps.Animation.BOUNCE, // Add this to Marker component
//     };
//   }
//   // ... rest of logic
// };

// USAGE EXAMPLES:

// 1. Use different colors for each route point
// {
//   localPins.map((p, index) => (
//     <Marker
//       key={p.id}
//       position={{ lat: p.lat, lng: p.lng }}
//       onClick={() => removePin(p.id)}
//       icon={getDynamicMarkerIcon(p.type, index)}
//       title={displayOnly ? `${p.type} pin` : `Click to remove`}
//     />
//   ));
// }

// // 2. Add animation to markers
// {
//   localPins.map((p) => (
//     <Marker
//       key={p.id}
//       position={{ lat: p.lat, lng: p.lng }}
//       onClick={() => removePin(p.id)}
//       icon={getMarkerIcon(p.type)}
//       animation={google.maps.Animation.DROP} // or BOUNCE
//       title={displayOnly ? `${p.type} pin` : `Click to remove`}
//     />
//   ));
// }

// // 3. Use custom labels
// {
//   localPins.map((p, index) => (
//     <Marker
//       key={p.id}
//       position={{ lat: p.lat, lng: p.lng }}
//       onClick={() => removePin(p.id)}
//       icon={getMarkerIcon(p.type)}
//       label={{
//         text: `${index + 1}`,
//         color: "white",
//         fontSize: "12px",
//         fontWeight: "bold",
//       }}
//       title={displayOnly ? `${p.type} pin` : `Click to remove`}
//     />
//   ));
// }

// import React, { useState, useEffect } from "react";
// import {
//   useLoadScript,
//   GoogleMap,
//   Marker,
//   Polyline,
// } from "@react-google-maps/api";
// import { Button } from "../ui/button";

// export default function InteractiveMap({
//   displayOnly = false,
//   pins = [],
//   onPinsChange,
//   mode = "route", // "station" or "route"
//   handleDeletePins,
// }) {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GMAPS_KEY,
//   });

//   // ⇢ keep the map's centre here
//   const [center, setCenter] = useState({ lat: 30, lng: 70 }); // fallback
//   const [localPins, setLocalPins] = useState(pins || []);

//   /* 1️⃣  Get current location once on mount */
//   useEffect(() => {
//     if (!navigator.geolocation) return; // browser doesn't support it
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setCenter({ lat: latitude, lng: longitude });
//       },
//       (err) => console.error("Geolocation error:", err), // user denied / device off
//       { enableHighAccuracy: true, timeout: 10_000 }
//     );
//   }, []);

//   // Update local pins when props change
//   useEffect(() => {
//     setLocalPins(pins || []);
//   }, [pins]);

//   /* ↻ pin helpers */
//   const addPin = (e) => {
//     if (displayOnly) return; // Don't add pins in display mode

//     if (e.latLng) {
//       const newPin = {
//         id: crypto.randomUUID(),
//         lat: e.latLng.lat(),
//         lng: e.latLng.lng(),
//         type: mode,
//       };

//       let updatedPins;

//       if (mode === "station") {
//         // For stations, replace existing pin (only one allowed)
//         updatedPins = [newPin];
//       } else {
//         // For routes, add to existing pins (multiple allowed)
//         updatedPins = [...localPins, newPin];
//       }

//       setLocalPins(updatedPins);

//       // Notify parent component
//       if (onPinsChange) {
//         onPinsChange(updatedPins);
//       }
//     }
//   };

//   const removePin = (id) => {
//     if (displayOnly) return; // Don't remove pins in display mode

//     const updatedPins = localPins.filter((m) => m.id !== id);
//     setLocalPins(updatedPins);
//     const deletedPin = localPins.find((m) => m.id === id);
//     handleDeletePins(deletedPin);

//     // Notify parent component
//     if (onPinsChange) {
//       onPinsChange(updatedPins);
//     }
//   };

//   const clearPins = () => {
//     if (displayOnly) return; // Don't clear pins in display mode

//     setLocalPins([]);
//     if (onPinsChange) {
//       onPinsChange([]);
//     }
//   };

//   if (loadError) return <p>Error: {loadError.message}</p>;
//   if (!isLoaded) return <p>Loading map…</p>;

//   // Different pin styles for different types
//   const getMarkerIcon = (pinType) => {
//     if (pinType === "station") {
//       return {
//         url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png",
//         scaledSize: new google.maps.Size(25, 40),
//       };
//     } else {
//       // Route/geofence points - default marker or custom style
//       return {
//         path: google.maps.SymbolPath.CIRCLE,
//         scale: 8,
//         fillColor: "#2563eb",
//         fillOpacity: 1,
//         strokeWeight: 2,
//         strokeColor: "#ffffff",
//       };
//     }
//   };

//   // Get route points for polyline (only for route mode)
//   const getRoutePoints = () => {
//     if (mode !== "route") return [];
//     return localPins
//       .filter((pin) => pin.type === "route")
//       .map((pin) => ({ lat: pin.lat, lng: pin.lng }));
//   };

//   // Polyline options for route visualization
//   const polylineOptions = {
//     strokeColor: "#2563eb",
//     strokeOpacity: 0.8,
//     strokeWeight: 3,
//     geodesic: true,
//   };

//   return (
//     <>
//       {!displayOnly && (
//         <div className="mb-2 flex justify-between items-center gap-2 flex-col sm:flex-row">
//           <Button variant="destructive" onClick={clearPins} size="sm">
//             Clear All ({localPins.length})
//           </Button>
//           {mode === "station" && (
//             <span className="text-sm text-gray-600">
//               Click anywhere to {localPins.length > 0 ? "move" : "add"} station
//               pin
//             </span>
//           )}
//           {mode === "route" && (
//             <span className="text-sm text-gray-600">
//               Click to add route points. Lines will connect in order.
//             </span>
//           )}
//         </div>
//       )}

//       <GoogleMap
//         mapContainerStyle={{ width: "100%", height: "100%" }}
//         center={center}
//         zoom={displayOnly ? 12 : 15}
//         onClick={addPin}
//         options={{
//           disableDoubleClickZoom: displayOnly,
//           gestureHandling: displayOnly ? "cooperative" : "auto",
//         }}
//       >
//         {/* Render markers */}
//         {localPins.map((p) => (
//           <Marker
//             key={p.id}
//             position={{ lat: p.lat, lng: p.lng }}
//             onClick={() => removePin(p.id)}
//             icon={getMarkerIcon(p.type)}
//             title={displayOnly ? `${p.type} pin` : `Click to remove`}
//           />
//         ))}

//         {/* Render polyline for route mode */}
//         {mode === "route" && getRoutePoints().length > 1 && (
//           <Polyline path={getRoutePoints()} options={polylineOptions} />
//         )}
//       </GoogleMap>
//     </>
//   );
// }
