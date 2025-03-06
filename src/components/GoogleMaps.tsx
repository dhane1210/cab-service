import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import { Box, Input, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";

interface GoogleMapsProps {
  onLocationChange?: (start: string, end: string, distance: string) => void;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({ onLocationChange }) => {
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [error, setError] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null); // Track API loading errors

  const handleGetDirections = () => {
    if (!start || !end) {
      setError("Start and end locations are required.");
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          setError("");

          // Safely access the distance value
          const distanceValue =
            result.routes?.[0]?.legs?.[0]?.distance?.text || "0";
          setDistance(distanceValue);

          // Pass the distance to the parent component
          if (onLocationChange) {
            onLocationChange(start, end, distanceValue);
          }
        } else {
          setError(`Error fetching directions: ${status}`);
          console.error(`Error fetching directions: ${status}`);
          if (onLocationChange) {
            onLocationChange(start, end, "0"); // Pass "0" as distance if no route is found
          }
        }
      }
    );
  };

  // Use effect to automatically fetch directions when start or end changes
  useEffect(() => {
    if (start && end) {
      handleGetDirections();
    }
  }, [start, end]);

  return (
    <Box backgroundColor="gray.100" p={4} borderRadius="md">
      {/* Input Fields */}
      <Box display="flex" gap={2} marginBottom={4}>
        <Input
          placeholder="Start Location"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          bg="white"
          border="1px solid"
          color="black"
          borderColor="blue.300"
          _placeholder={{ color: "gray.500" }}
        />
        <Input
          placeholder="End Location"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          bg="white"
          color="black"
          border="1px solid"
          borderColor="blue.300"
          _placeholder={{ color: "gray.500" }}
        />
      </Box>

      {/* Display Distance */}
      {distance && (
        <Text mb={4} fontWeight="bold" color="black">
          Distance: {distance}
        </Text>
      )}

      {/* Google Map */}
      <LoadScript
        googleMapsApiKey="AIzaSyBMnCICCvr4WMOUmt42yJ-lOVvSsQC0r-Y"
        onLoad={() => setIsMapLoaded(true)}
        onError={(error) => setLoadError("Failed to load Google Maps API")} // Handle API loading errors
        key={isMapLoaded ? "map-loaded" : "map-not-loaded"} // Force re-render on logout/login
      >
        {loadError ? (
          <Alert status="error">
            <AlertIcon />
            {loadError}
          </Alert>
        ) : isMapLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={{ lat: 6.8649, lng: 79.8997 }} // Default center (San Francisco)
            zoom={10}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <Spinner size="xl" />
          </Box>
        )}
      </LoadScript>
    </Box>
  );
};

export default GoogleMaps;