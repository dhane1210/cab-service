// components/Admin/AssignDriversAndCars.tsx
import React from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Radio,
  RadioGroup,
  Button,
  useToast,
  Text,
  Card,
  CardBody,
  CardHeader,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons"; // For untick functionality
import useCars from "../../hooks/useCars";
import useDrivers from "../../hooks/useDrivers";

const AssignDriversAndCars = () => {
  const { cars, loading: carsLoading, error: carsError, fetchAvailableCars } = useCars();
  const { drivers, loading: driversLoading, error: driversError, fetchAvailableDriversWithoutCar, assignCarToDriver } = useDrivers();
  const [selectedDriverId, setSelectedDriverId] = React.useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = React.useState<string | null>(null);
  const toast = useToast();

  React.useEffect(() => {
    fetchAvailableCars();
    fetchAvailableDriversWithoutCar();
  }, [fetchAvailableCars, fetchAvailableDriversWithoutCar]);

  const handleAssignCar = async () => {
    if (selectedDriverId && selectedCarId) {
      try {
        await assignCarToDriver(Number(selectedDriverId), Number(selectedCarId));
        toast({
          title: "Car assigned successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Refresh the lists
        fetchAvailableCars();
        fetchAvailableDriversWithoutCar();
        // Reset selections
        setSelectedDriverId(null);
        setSelectedCarId(null);
      } catch (error) {
        toast({
          title: "Failed to assign car.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Please select both a driver and a car.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUntick = (type: "car" | "driver") => {
    if (type === "car") {
      setSelectedCarId(null);
    } else {
      setSelectedDriverId(null);
    }
  };

  if (carsLoading || driversLoading) return <Box>Loading...</Box>;
  if (carsError || driversError) return <Box>Error: {carsError || driversError}</Box>;

  return (
    <Box p={6}>
      <Heading size="lg" mb={6} color="blue.600">
        Assign Drivers and Cars
      </Heading>
      <HStack spacing={8} align="start">
        {/* Cars Column */}
        <Box flex={1} borderWidth="1px" borderRadius="lg" p={4} bg="gray.50">
          <Heading size="md" mb={4} color="blue.500">
            Available Cars
          </Heading>
          <RadioGroup value={selectedCarId || ""} onChange={setSelectedCarId}>
            <VStack align="start" spacing={4}>
              {cars.map(car => (
                <Card key={car.carId} width="100%" variant="outline">
                  <CardHeader>
                    <Flex justify="space-between" align="center">
                      <Radio value={car.carId.toString()} size="lg" colorScheme="blue">
                        <VStack align="start" spacing={1} ml={2}>
                          <Text fontWeight="bold">Model: {car.model}</Text>
                          <Text>License Plate: {car.licensePlate}</Text>
                        </VStack>
                      </Radio>
                      {selectedCarId === car.carId.toString() && (
                        <IconButton
                          aria-label="Untick"
                          icon={<CloseIcon />}
                          size="sm"
                          onClick={() => handleUntick("car")}
                        />
                      )}
                    </Flex>
                  </CardHeader>
                </Card>
              ))}
            </VStack>
          </RadioGroup>
        </Box>

        {/* Drivers Column */}
        <Box flex={1} borderWidth="1px" borderRadius="lg" p={4} bg="gray.50">
          <Heading size="md" mb={4} color="blue.500">
            Available Drivers
          </Heading>
          <RadioGroup value={selectedDriverId || ""} onChange={setSelectedDriverId}>
            <VStack align="start" spacing={4}>
              {drivers.map(driver => (
                <Card key={driver.driverId} width="100%" variant="outline">
                  <CardHeader>
                    <Flex justify="space-between" align="center">
                      <Radio value={driver.driverId.toString()} size="lg" colorScheme="blue">
                        <VStack align="start" spacing={1} ml={2}>
                          <Text fontWeight="bold">Name: {driver.name}</Text>
                          <Text>License Number: {driver.licenseNumber}</Text>
                        </VStack>
                      </Radio>
                      {selectedDriverId === driver.driverId.toString() && (
                        <IconButton
                          aria-label="Untick"
                          icon={<CloseIcon />}
                          size="sm"
                          onClick={() => handleUntick("driver")}
                        />
                      )}
                    </Flex>
                  </CardHeader>
                </Card>
              ))}
            </VStack>
          </RadioGroup>
        </Box>
      </HStack>

      {/* Assign Button */}
      <Flex justify="center" mt={8}>
        <Button
          size="lg"
          colorScheme="blue"
          onClick={handleAssignCar}
          isDisabled={!selectedDriverId || !selectedCarId}
        >
          Assign Car to Driver
        </Button>
      </Flex>
    </Box>
  );
};

export default AssignDriversAndCars;