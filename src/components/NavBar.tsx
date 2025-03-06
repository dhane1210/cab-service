import React, { useState, useEffect } from "react";
import {
  Box,
  HStack,
  IconButton,
  Image,
  Text,
  Spacer,
  Button,
  Badge,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import logo from "../assets/logo.png";
import RegisterPopup from "./RegisterPopup";
import LoginPopup from "./LoginPopup";
import { useAuth } from "../components/AuthContext";
import useBookings from "../hooks/useBookings";
import CheckMyRidesPopup from "./CheckMyRidesPopup";

const NavBar = () => {
  const { user, logout } = useAuth();
  const { bookings, fetchBookings, handleDelete, handleDownloadBill } = useBookings();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { isOpen: isRegisterOpen, onOpen: onRegisterOpen, onClose: onRegisterClose } = useDisclosure();
  const newBookingsCount = bookings.length;

  const isMobileView = useBreakpointValue({ base: true, md: false });

  // State to track scroll position
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to scroll to the About Us section
  const scrollToAboutUs = () => {
    const aboutUsSection = document.getElementById("about-us");
    if (aboutUsSection) {
      aboutUsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      position="fixed" // Fix the navbar at the top
      top={0}
      left={0}
      right={0}
      zIndex={1000} // Ensure the navbar is above other content
      bg={isScrolled ? "teal.600" : "rgba(255, 255, 255, 0.2)"} // Use solid color or transparent
      bgGradient={isScrolled ? "linear(to-r, teal.600, teal.900)" : undefined} // Apply gradient when scrolled
      transition="background 0.5s ease, background-image 0.5s ease" // Smooth transition for background change
      px={4}
      py={3}
      boxShadow={isScrolled ? "lg" : "none"} // Add shadow when scrolled
    >
      <HStack justifyContent="space-between" alignItems="center">
        {/* Logo & Brand Name */}
        <HStack spacing={2}>
          <Image src={logo} boxSize="80px" />
          <Text fontSize="2xl" fontWeight="bold" color={isScrolled ? "white" : "teal.300"}>
            MEGA CITY CAB
          </Text>
        </HStack>

        <Spacer />

        {isMobileView ? (
          <>
            <IconButton
              aria-label="Menu"
              icon={<FiMenu />}
              variant="outline"
              colorScheme={isScrolled ? "teal" : "gray"}
              onClick={onDrawerOpen}
            />
            <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody>
                  <VStack align="flex-start" spacing={4} mt={6}>
                    <Button
                      variant="ghost"
                      colorScheme="teal"
                      onClick={() => {
                        scrollToAboutUs();
                        onDrawerClose();
                      }}
                    >
                      About Us
                    </Button>
                    <Button
                      variant="ghost"
                      colorScheme="teal"
                      onClick={() => {
                        onOpen();
                        fetchBookings();
                        onDrawerClose();
                      }}
                    >
                      Check My Rides
                    </Button>
                    <CheckMyRidesPopup
                      isOpen={isOpen}
                      onClose={onClose}
                      bookings={bookings}
                      onDelete={handleDelete}
                      onDownloadBill={handleDownloadBill}
                    />
                    {user ? (
                      <Button
                        colorScheme="red"
                        variant="solid"
                        onClick={() => {
                          logout();
                          onDrawerClose();
                        }}
                      >
                        Logout
                      </Button>
                    ) : (
                      <>
                        <Button colorScheme="teal" onClick={onLoginOpen}>
                          Login
                        </Button>
                        <Button colorScheme="blue" onClick={onRegisterOpen}>
                          Register
                        </Button>
                      </>
                    )}
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <HStack spacing={6}>
            <Button
              variant="ghost"
              color={isScrolled ? "white" : "teal.200"}
              onClick={scrollToAboutUs} // Scroll to About Us section
            >
              About Us
            </Button>
            <Button
              variant="ghost"
              color={isScrolled ? "white" : "teal.200"}
              onClick={() => {
                onOpen();
                fetchBookings();
              }}
              position="relative"
            >
              Check My Rides
              {newBookingsCount > 0 && (
                <Badge
                  colorScheme="red"
                  position="absolute"
                  top="-5px"
                  right="-10px"
                  borderRadius="full"
                  fontSize="0.8em"
                  px={2}
                >
                  {newBookingsCount}
                </Badge>
              )}
            </Button>
            <CheckMyRidesPopup
              isOpen={isOpen}
              onClose={onClose}
              bookings={bookings}
              onDelete={handleDelete}
              onDownloadBill={handleDownloadBill}
            />
            {user ? (
              <Button colorScheme="red" variant="solid" onClick={logout}>
                Logout
              </Button>
            ) : (
              <>
                <Button colorScheme="teal" onClick={onLoginOpen}>
                  Login
                </Button>
                <Button colorScheme="blue" onClick={onRegisterOpen}>
                  Register
                </Button>
              </>
            )}
          </HStack>
        )}
      </HStack>

      {/* Login Popup */}
      <LoginPopup
        isOpen={isLoginOpen}
        onClose={onLoginClose}
        onOpenRegister={onRegisterOpen} // Pass the onOpenRegister function
      />

      {/* Register Popup */}
      <RegisterPopup isOpen={isRegisterOpen} onClose={onRegisterClose} />
    </Box>
  );
};

export default NavBar;