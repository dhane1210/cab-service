// components/Admin/RegisteredCarsAndDrivers.tsx
import React from "react";
import { Box, VStack, Heading, Card, CardBody } from "@chakra-ui/react";
import RegisterDriverForm from "./RegisterDriverForm";
import RegisterCarForm from "./RegisterCarForm";

const RegisteredCarsAndDrivers = () => {
  return (
    <Box p={6}>
      <Heading size="lg" mb={6} color="blue.600">
        Register Cars and Drivers
      </Heading>
      <VStack spacing={6} align="stretch">
        <Card variant="outline">
          <CardBody>
            <RegisterDriverForm />
          </CardBody>
        </Card>
        <Card variant="outline">
          <CardBody>
            <RegisterCarForm />
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default RegisteredCarsAndDrivers;