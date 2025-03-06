import React, { useState, useEffect } from "react";
import {
  Grid,
  GridItem,
  Box,
  Heading,
  Button,
  useToast,
} from "@chakra-ui/react";
import Booking from "./Booking";
import GoogleMaps from "./GoogleMaps";
import DriverList from "./DriverList";
import { useAuth } from "./AuthContext"; // Import useAuth to get the logged-in customer
import { calculateFare, createBooking } from "../services/bookingService"; // Import booking functions
import api from "../services/api"; // Import API service

interface PriceConfig {
  baseFare: number; // Base fare per km
  discountRate: number; // Discount rate in percentage
  taxRate: number; // Tax rate in percentage
  waitingTimeCharge: number; // Charge per minute of waiting time
}

function BookingGrid() {
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [startLocation, setStartLocation] = useState<string | null>(null);
  const [endLocation, setEndLocation] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [priceConfig, setPriceConfig] = useState<PriceConfig | null>(null); // State to store price config
  const { user } = useAuth(); // Get the logged-in customer from AuthContext
  const toast = useToast();

  // Fetch price config when the component mounts
  useEffect(() => {
    const fetchPriceConfig = async () => {
      try {
        const response = await api.get("/admin/price-config");
        setPriceConfig(response.data);
      } catch (error) {
        toast({
          title: "Failed to fetch price configuration",
          description: "Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchPriceConfig();
  }, [toast]);

  const handleBooking = async () => {
    if (!selectedDriver || !startLocation || !endLocation || !distance || !user || !priceConfig) {
      toast({
        title: "Error",
        description: "Please fill all the fields and select a driver.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Calculate fare using price config values
      const baseFare = distance * priceConfig.baseFare;
      const discount = baseFare * (priceConfig.discountRate / 100);
      const taxes = baseFare * (priceConfig.taxRate / 100);
      const totalAmount = baseFare - discount + taxes;

      const bookingData = {
        driverId: selectedDriver,
        customerId: user.id,
        startLocation,
        endLocation,
        distance,
        fare: totalAmount, // Use the calculated total amount as fare
      };

      const response = await createBooking(bookingData); // Send booking request
      toast({
        title: "Booking Successful",
        description: `Booking created successfully. Response: ${JSON.stringify(response)}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Calculate fare, discount, taxes, and total amount dynamically
  const baseFare = distance && priceConfig ? distance * priceConfig.baseFare : 0;
  const discount = baseFare * (priceConfig?.discountRate || 0) / 100;
  const taxes = baseFare * (priceConfig?.taxRate || 0) / 100;
  const totalAmount = baseFare - discount + taxes;

  return (
    <Grid
      templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 2fr" }}
      gap={4}
      padding={5}
      background="rgba(255, 255, 255, 0)"
      marginTop={24}
    >
      <GridItem>
        <Box
          borderRadius="md"
          boxShadow="lg"
          padding={4}
          bgGradient="linear(to-t, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.6))"
        >
          <Heading as="h3" size="lg" mb="5" textAlign="center" color="teal.700">
            Booking Summary
          </Heading>
          <Booking
            selectedDriver={selectedDriver}
            startLocation={startLocation}
            endLocation={endLocation}
            distance={distance}
            baseFare={baseFare} // Pass calculated base fare
            discount={discount} // Pass calculated discount
            taxes={taxes} // Pass calculated taxes
            waitingTime={0} // Pass waiting time (if applicable)
            status={"Pending"}
            onBook={handleBooking} // Pass the booking handler
          />
        </Box>
      </GridItem>

      <GridItem>
        <Box
          mx="auto"
          p="5"
          bgGradient="linear(to-t, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.6))"
          borderRadius="lg"
        >
          <Heading as="h3" size="lg" mb="5" textAlign="center" color="teal.700">
            Select the Vehicle
          </Heading>
          <DriverList onDriverSelect={setSelectedDriver} />
        </Box>
      </GridItem>

      <GridItem>
        <Box
          borderRadius="md"
          boxShadow="lg"
          padding={4}
          bgGradient="linear(to-t, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.6))"
        >
          <Heading as="h3" size="lg" mb="5" textAlign="center" color="teal.700">
            Select the Destination
          </Heading>
          <GoogleMaps
            onLocationChange={(start, end, dist) => {
              setStartLocation(start);
              setEndLocation(end);
              setDistance(parseFloat(dist)); // Convert distance to a number
            }}
          />
        </Box>
      </GridItem>
    </Grid>
  );
}

export default BookingGrid;