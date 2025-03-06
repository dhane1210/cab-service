// components/Admin/BillingArea.tsx
import React, { useEffect } from "react";
import { Box, Heading, VStack } from "@chakra-ui/react";
import useBookings from "../../hooks/useBookings";
import BillingCustomer from "./BillingCustomer";
import PriceConfigForm from "../Admin/PriceConfigForm";
const BillingArea = () => {
  const { bookings, fetchAllBookings } = useBookings();

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Billing Area
      </Heading>
      <PriceConfigForm />
      <VStack spacing={4} align="stretch">
        {bookings.map((booking) => (
          <BillingCustomer
            key={booking.bookingId}
            bookingId={booking.bookingId}
            customerName="Customer Name" // Replace with actual customer name from API
            distance={booking.distance}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default BillingArea;