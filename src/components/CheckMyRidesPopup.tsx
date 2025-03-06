import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
  useToast,
} from "@chakra-ui/react";
import { FaDownload, FaTrash } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import useBilling from "../hooks/useBilling"; // Import the useBilling hook

interface Booking {
  bookingId: number;
  startLocation: string;
  endLocation: string;
  distance: number;
  fare: number;
  status: string;
}

interface CheckMyRidesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onDelete: (bookingId: number) => void;
  onDownloadBill: (bookingId: number) => Promise<void>;
}

const CheckMyRidesPopup: React.FC<CheckMyRidesPopupProps> = ({
  isOpen,
  onClose,
  bookings,
  onDelete,
  onDownloadBill,
}) => {
  const toast = useToast();
  const { fetchBillByBookingId, loading, error } = useBilling();

  const handleDownloadBill = async (bookingId: number) => {
    try {
      // Fetch the bill details for the booking
      const bill = await fetchBillByBookingId(bookingId);

      // Generate and download the PDF
      const doc = new jsPDF();

      // Add a header with a logo and title
      doc.setFontSize(20);
      doc.setTextColor(40, 53, 147); // Dark blue color
      doc.text("Cab Booking Invoice", 15, 20);

      // Add a horizontal line
      doc.setLineWidth(0.5);
      doc.setDrawColor(40, 53, 147); // Dark blue color
      doc.line(15, 25, 195, 25);

      // Add booking details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black color
      doc.text(`Booking ID: ${bookingId}`, 15, 35);
      doc.text(`Start Location: ${bookings.find(b => b.bookingId === bookingId)?.startLocation || "Not set"}`, 15, 45);
      doc.text(`End Location: ${bookings.find(b => b.bookingId === bookingId)?.endLocation || "Not set"}`, 15, 55);
      doc.text(`Distance: ${bookings.find(b => b.bookingId === bookingId)?.distance || "Not calculated"} km`, 15, 65);

      // Add pricing details in a table
      autoTable(doc, {
        startY: 75,
        head: [["Description", "Amount (Rs.)"]],
        body: [
          ["Base Fare", bill.baseFare.toFixed(2)],
          ["Discount", bill.discount.toFixed(2)],
          ["Taxes", bill.taxes.toFixed(2)],
          ["Total Amount", bill.totalAmount.toFixed(2)],
        ],
        theme: "striped", // Stylish table theme
        headStyles: { fillColor: [40, 53, 147] }, // Dark blue header
      });

      // Add a footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Thank you for choosing our service!", 15, doc.internal.pageSize.height - 20);
      doc.text("Contact us: support@cabservice.com | +94 123 456 789", 15, doc.internal.pageSize.height - 15);

      // Save the PDF
      doc.save(`booking-invoice-${bookingId}.pdf`);

      toast({
        title: "Invoice Downloaded",
        description: `Invoice for booking #${bookingId} has been downloaded.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download the invoice. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg="rgba(255, 255, 255, 0.1)" // Semi-transparent white
        style={{
          backdropFilter: "blur(2px)", // Blurry background
        }}
      />
      <ModalContent
        bg="whiteAlpha.900" // Slightly transparent background
        boxShadow="xl"
        borderRadius="lg"
        p={4} // Padding around the content
        maxW={{ base: "95%", md: "800px" }} // Responsive width
        w="100%"
      >
        <ModalHeader
          bgGradient="linear(to-r, teal.500, blue.500)"
          color="white"
          fontSize={{ base: "lg", md: "2xl" }} // Responsive font size
          textAlign="center"
        >
          My Bookings
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <Box overflowX="auto"> {/* Scrollable table for mobile view */}
            <Table variant="striped" size={{ base: "sm", md: "md" }} colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Booking ID</Th>
                  <Th>Start Location</Th>
                  <Th>End Location</Th>
                  <Th>Distance (km)</Th>
                  <Th>Fare (Rs)</Th>
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
                    <Td>{booking.distance}</Td>
                    <Td>{booking.fare}</Td>
                    <Td>{booking.status}</Td>
                    <Td>
                      <IconButton
                        aria-label="Download Bill"
                        icon={<FaDownload />}
                        onClick={() => handleDownloadBill(booking.bookingId)}
                        colorScheme="blue"
                        size="sm"
                        mr={2}
                        isLoading={loading}
                      />
                      <IconButton
                        aria-label="Delete Booking"
                        icon={<FaTrash />}
                        onClick={() => onDelete(booking.bookingId)}
                        colorScheme="red"
                        size="sm"
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose} size={{ base: "sm", md: "lg" }} borderRadius="full">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CheckMyRidesPopup;