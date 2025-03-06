import React from "react";
import { Box, Heading, Text, VStack, Flex, Image } from "@chakra-ui/react";
import taxi from "../assets/taxi.jpg"; // Replace with your image
import SectionTitle from "./SectionTitle";

const AboutUs = () => {
  return (
    <Box
      id="about-us"
      bg="white"
      py={16}
      position="relative"
      overflow="hidden"
    >
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

      {/* Content */}
      <VStack spacing={8} maxW="1200px" mx="auto" px={4} zIndex={2} position="relative">
        <Heading as="h2" size="2xl" color="white" textAlign="center" mb={8}>
          About Us
        </Heading>
        <Flex direction={{ base: "column", md: "row" }} align="center">
          <Box flex={1} mb={{ base: 8, md: 0 }}>
            <Image
              src={taxi} // Replace with your image
              alt="About Us"
              borderRadius="lg"
              boxShadow="lg"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            />
          </Box>
          <Box flex={1} pl={{ md: 8 }}>
            <Text fontSize="lg" color="gray.600" lineHeight="tall">
              Welcome to <strong>TAXI</strong>, your trusted partner in transportation. We are dedicated to providing safe, reliable, and affordable taxi services to our customers. Our team of professional drivers and state-of-the-art vehicles ensure that you reach your destination comfortably and on time.
            </Text>
            <Text fontSize="lg" color="gray.600" lineHeight="tall" mt={4}>
              Whether you're commuting to work, heading to the airport, or exploring the city, we've got you covered. With years of experience in the industry, we pride ourselves on delivering exceptional service and making every ride a pleasant experience.
            </Text>
          </Box>
        </Flex>
      </VStack>

      {/* Curvy Bottom Edge with Gradient (No Animation) */}
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

export default AboutUs;