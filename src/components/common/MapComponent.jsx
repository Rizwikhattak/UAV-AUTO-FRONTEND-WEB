"use client";

import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 33.65022809080255, // Default center latitude (e.g., Shamsabad)
  lng: 73.07989059512518, // Default center longitude
};

export function MapComponent() {
  const dispatch = useDispatch();
  const [marker, setMarker] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  // Load the Google Maps JavaScript API with Places library
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      //eslint-disable-next-line no-undef
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Handle map clicks to add a marker and perform reverse geocoding
  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const location = { lat, lng };
    setMarker(location);
    toast.success("Location selected", {
      description: `lat: ${lat} long:${lng}`,
    });
    // Create a new geocoder instance
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          const address = results[0].formatted_address;
          toast.success("Location selected", {
            description: `Address: ${address}`,
          });
          // Optionally, dispatch this location to your Redux store:
          // dispatch(setLocation({ lat, lng, address }));
        } else {
          toast.error("No address found for this location.");
        }
      } else {
        toast.error("Geocoder failed due to: " + status);
      }
    });
  }, []);

  // Save autocomplete instance
  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  // When a place is selected from the search results
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address;
        setMarker({ lat, lng });
        toast.success("Location selected", {
          description: `Address: ${address}`,
        });
        // Optionally, dispatch the location info to Redux:
        // dispatch(setLocation({ lat, lng, address }));
      } else {
        toast.error("No details available for input: " + place.name);
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      {/* Search Box using Autocomplete */}
      <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Search for a location"
          style={{
            boxSizing: "border-box",
            border: "1px solid transparent",
            width: "100%",
            height: "40px",
            padding: "0 12px",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        />
      </Autocomplete>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker ? marker : defaultCenter}
        zoom={marker ? 14 : 10}
        onClick={onMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
}
