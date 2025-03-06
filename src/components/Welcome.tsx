import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";

// Import only 5 images
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import img5 from "../assets/5.jpg";

const Welcome = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of imported images (only 5 images)
  const images = [img1, img2, img3, img4, img5];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Box
      position="relative"
      height="100vh" // Full viewport height
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      color="white"
      textAlign="center"
    >
      {/* Background Images with Slide Effect */}
      {images.map((image, index) => (
        <Box
          key={index}
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgImage={`url(${image})`}
          bgPosition="center"
          bgSize="cover"
          bgRepeat="no-repeat"
          opacity={index === currentImageIndex ? 1 : 0} // Show only the current image
          transition="opacity 1.5s ease-in-out" // Smooth transition
          zIndex={1}
        />
      ))}

      {/* Overlay for better text visibility */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.5)" // Semi-transparent black overlay
        zIndex={2}
      />

      {/* Content */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        zIndex={3}
        transition="opacity 1s ease-in-out"
      >
        <Heading as="h1" size="2xl" mb={4} fontWeight="bold">
          Welcome to Mega City Cab
        </Heading>
        <Text fontSize="xl" mb={8}>
          Your reliable partner for safe and comfortable rides in Colombo City.
        </Text>
        <Button
          colorScheme="teal"
          size="lg"
          onClick={() => {
            // Scroll to the booking section
            const bookingSection = document.getElementById("booking-section");
            if (bookingSection) {
              bookingSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Book Your Ride Now
        </Button>
      </Flex>

      {/* Curvy Bottom Edge with Gradient */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="90px"
        bgGradient="linear(to-r, teal.500, teal.700)"
        clipPath="polygon(0 20%, 50% 0, 100% 20%, 100% 100%, 0 100%)"
        zIndex={2}
      />
    </Box>
  );
};

export default Welcome;