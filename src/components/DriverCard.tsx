import React from "react";
import { Box, HStack, Text, Badge } from "@chakra-ui/react";
import useDriverAvailability from "../hooks/useDriverAvailability"; // Import the custom hook

interface Driver {
  driverId: number;
  name: string;
  licenseNumber: string;
  phone: string;
  isAvailable: boolean;
  carModel?: string;
  carLicenseNumber?: string;
}

interface DriverCardProps {
  driver: Driver;
  isSelected: boolean;
  onSelect: (driverId: number) => void;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver, isSelected, onSelect }) => {
  // Use the custom hook to check driver availability
  const isAvailable = useDriverAvailability(driver.driverId);

  // Handle click event
  const handleClick = () => {
    if (isAvailable) {
      onSelect(driver.driverId); // Allow selection only if the driver is available
    }
  };

  return (
    <Box
      p="4"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="sm"
      bg={isSelected ? "gray.300" : isAvailable ? "gray.100" : "gray.200"} // Gray out if unavailable
      opacity={isAvailable ? 1 : 0.6} // Reduce opacity for unavailable drivers
      _hover={isAvailable && !isSelected ? { bg: "gray.200" } : undefined} // Disable hover for unavailable drivers
      onClick={handleClick}
      cursor={isAvailable ? (isSelected ? "not-allowed" : "pointer") : "not-allowed"} // Disable cursor for unavailable drivers
    >
      <HStack justifyContent="space-between">
        <Text fontWeight="bold" color="gray.600">{driver.name}</Text>
        <Badge colorScheme={isAvailable ? "green" : "red"}>
          {isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </HStack>
      <Text mt="2" fontSize="sm" color="gray.600">License: {driver.licenseNumber}</Text>
      <Text fontSize="sm" color="gray.600">Phone: {driver.phone}</Text>
      <Text fontSize="sm" color="gray.600" fontWeight="bold">Car Model: {driver.carModel || "N/A"}</Text>
      <Text fontSize="sm" color="gray.600">Car License: {driver.carLicenseNumber || "N/A"}</Text>
    </Box>
  );
};

export default DriverCard;