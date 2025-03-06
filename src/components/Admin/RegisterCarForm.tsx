// components/Admin/RegisterCarForm.tsx
import React, { useState } from "react";
import { Box, FormControl, FormLabel, Input, Button, VStack, useToast } from "@chakra-ui/react";
import useCars from "../../hooks/useCars";

const RegisterCarForm = () => {
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const { registerCar } = useCars();
  const toast = useToast();

  const handleSubmit = () => {
    if (!model || !licensePlate) {
      toast({
        title: "Please fill all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    registerCar({ model, licensePlate, isAvailable: true });
    toast({
      title: "Car registered successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setModel("");
    setLicensePlate("");
  };

  return (
    <Box>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Model</FormLabel>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Enter car model"
          />
        </FormControl>
        <FormControl>
          <FormLabel>License Plate</FormLabel>
          <Input
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            placeholder="Enter license plate"
          />
        </FormControl>
        <Button mt={4} colorScheme="blue" onClick={handleSubmit} width="100%">
          Register Car
        </Button>
      </VStack>
    </Box>
  );
};

export default RegisterCarForm;