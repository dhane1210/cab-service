import React, { useEffect, useState } from "react";
import { Box, Spinner, Heading, Text, VStack } from "@chakra-ui/react";
import useDrivers from "../hooks/useDrivers";
import DriverCard from "./DriverCard";

interface Driver {
  driverId: number;
  name: string;
  licenseNumber: string;
  phone: string;
  isAvailable: boolean;
  carModel?: string;
  carLicenseNumber?: string;
}

interface DriverListProps {
  onDriverSelect?: (driverId: number | null) => void;
}

const DriverList: React.FC<DriverListProps> = ({ onDriverSelect }) => {
  const { drivers, loading, error, fetchDriversWithAssignedCars } = useDrivers();
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);

  useEffect(() => {
    fetchDriversWithAssignedCars();
  }, [fetchDriversWithAssignedCars]);

  const handleSelectDriver = (driverId: number) => {
    const newSelection = driverId === selectedDriver ? null : driverId;
    setSelectedDriver(newSelection);

    if (onDriverSelect) {
      onDriverSelect(newSelection);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
        <Spinner size="xl" />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt="5">
        <Text fontSize="lg" color="red.500">{error}</Text>
      </Box>
    );

  return (
    <Box maxH="400px" overflowY="auto" sx={{ /* scrollbar styles */ }}>
      <VStack spacing={4} align="stretch">
        {drivers.map((driver) => (
          <DriverCard
            key={driver.driverId}
            driver={driver}
            isSelected={selectedDriver === driver.driverId}
            onSelect={handleSelectDriver}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default DriverList;