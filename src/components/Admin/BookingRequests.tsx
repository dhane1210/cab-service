// components/Admin/BookingRequests.tsx
import React, { useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  useToast,
} from "@chakra-ui/react";
import useBookings from "../../hooks/useBookings";

const BookingRequests = () => {
  const { bookings, fetchAllBookings, acceptBooking, handleDelete } = useBookings();
  const toast = useToast();

  useEffect(() => {
    fetchAllBookings(); // Fetch all bookings for admin
  }, [fetchAllBookings]);

  const handleAccept = async (bookingId: number) => {
    try {
      await acceptBooking(bookingId);
      toast({
        title: "Booking accepted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to accept booking.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      await handleDelete(bookingId);
      toast({
        title: "Booking deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete booking.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Card variant="outline" width="100%">
      <CardHeader>
        <Heading size="lg" color="blue.600">
          Booking Requests
        </Heading>
      </CardHeader>
      <CardBody>
        <Box borderRadius="md" overflowX="auto">
          <Table variant="simple" width="100%">
            <Thead>
              <Tr>
                <Th>Booking ID</Th>
                <Th>Start Location</Th>
                <Th>End Location</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bookings.map((booking) => (
                <Tr key={booking.bookingId}>
                  <Td>{booking.bookingId}</Td>
                  <Td>{booking.startLocation}</Td>
                  <Td>{booking.endLocation}</Td>
                  <Td>{booking.status}</Td>
                  <Td>
                    <Button
                      colorScheme="green"
                      onClick={() => handleAccept(booking.bookingId)}
                      isDisabled={booking.status === "Accepted"} // Disable if already accepted
                      size="sm"
                    >
                      Accept
                    </Button>
                    <Button
                      colorScheme="red"
                      ml={2}
                      onClick={() => handleDeleteBooking(booking.bookingId)}
                      size="sm"
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  );
};

export default BookingRequests;