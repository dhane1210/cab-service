// components/Admin/RegisterDriverForm.tsx
import React, { useState } from "react";
import { Box, FormControl, FormLabel, Input, Button, VStack, useToast } from "@chakra-ui/react";
import useDrivers from "../../hooks/useDrivers";

const RegisterDriverForm = () => {
  const [name, setName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [phone, setPhone] = useState("");
  const { registerDriver } = useDrivers();
  const toast = useToast();

  const handleSubmit = () => {
    if (!name || !licenseNumber || !phone) {
      toast({
        title: "Please fill all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    registerDriver({ name, licenseNumber, phone, isAvailable: true });
    toast({
      title: "Driver registered successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setName("");
    setLicenseNumber("");
    setPhone("");
  };

  return (
    <Box>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter driver's name"
          />
        </FormControl>
        <FormControl>
          <FormLabel>License Number</FormLabel>
          <Input
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="Enter license number"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Phone</FormLabel>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </FormControl>
        <Button mt={4} colorScheme="blue" onClick={handleSubmit} width="100%">
          Register Driver
        </Button>
      </VStack>
    </Box>
  );
};

export default RegisterDriverForm;