import React from "react";
import { Box, Heading, Text, VStack, Flex, Card, CardHeader, CardBody, CardFooter, Image, Stack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import cityRide from "../assets/city.jpg"; // Replace with your image
import SectionTitle from "./SectionTitle";
import airportTransfer from "../assets/airport-transfer.jpg"; // Replace with your image
import longDistance from "../assets/long-distance.jpg"; // Replace with your image
import corporateRide from "../assets/corporate-ride.jpg"; // Replace with your image
import eventTransport from "../assets/event-transport.jpg"; // Replace with your image



const services = [
  {
    title: "City Rides",
    description: "Quick and reliable rides within the city.",
    image: cityRide,
  },
  {
    title: "Airport Transfers",
    description: "On-time pickups and drop-offs to and from the airport.",
    image: airportTransfer,
  },
  {
    title: "Long-Distance Travel",
    description: "Comfortable rides for out-of-town trips.",
    image: longDistance,
  },
  {
    title: "Corporate Rides",
    description: "Special services for business professionals.",
    image: corporateRide,
  },
  {
    title: "Event Transportation",
    description: "Group rides for events and special occasions.",
    image: eventTransport,
  },
];

const OurServices = () => {
  return (
    <Box
      id="our-services"
      bg="white"
      py={16}
      position="relative"
      overflow="hidden"
    >
      {/* Curvy Top Edge with Gradient */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="120px"
        bgGradient="linear(to-r, teal.500, teal.700)"
        clipPath="polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)"
        zIndex={1}

      />
{/* <SectionTitle title="Our Services" /> */}
      {/* Content */}
      <VStack spacing={8} maxW="1200px" mx="auto" px={4} zIndex={2} position="relative">
        <Heading as="h2" size="2xl" color="white" textAlign="center" mb={8}>
          Our Services
        </Heading>

        {/* Services Grid */}
        <Flex
          direction={{ base: "column", md: "row" }}
          wrap="wrap"
          justify="center"
          gap={8}
        >
          {services.map((service, index) => (
            <Card
              key={index}
              maxW={{ base: "100%", md: "300px" }}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            >
              <CardHeader p={0}>
                <Image
                  src={service.image}
                  alt={service.title}
                  objectFit="cover"
                  height="200px"
                  width="100%"
                />
              </CardHeader>
              <CardBody>
                <Heading size="md" color="teal.600" mb={2}>
                  {service.title}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {service.description}
                </Text>
              </CardBody>
            </Card>
          ))}
        </Flex>
      </VStack>

      {/* Curvy Bottom Edge with Gradient */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="120px"
        bgGradient="linear(to-r, teal.500, teal.700)"
        clipPath="polygon(0 20%, 50% 0, 100% 20%, 100% 100%, 0 100%)"
        zIndex={1}

      />
    </Box>
  );
};

export default OurServices;