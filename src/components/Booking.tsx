import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DownloadPDF from "./DownloadPDF"; // Import the DownloadPDF component
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { useAuth } from "./AuthContext"; // Import useAuth
import LoginPopup from "./LoginPopup"; // Import LoginPopup

interface BookingProps {
  selectedDriver: number | null;
  startLocation: string | null;
  endLocation: string | null;
  distance: number | null;
  status: "Pending" | "Confirmed";
  baseFare: number;
  discount: number;
  taxes: number;
  waitingTime: number;
  onBook: () => Promise<void>; // Update onBook to return a Promise
}

const Booking: React.FC<BookingProps> = ({
  selectedDriver,
  startLocation,
  endLocation,
  distance,
  status,
  baseFare,
  discount,
  taxes,
  waitingTime,
  onBook,
}) => {
  const totalAmount = baseFare - discount + taxes;
  const { isOpen, onOpen, onClose } = useDisclosure(); // For the confirmation popup
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure(); // For the login popup
  const toast = useToast(); // For displaying toast messages
  const { user } = useAuth(); // Get the current user from AuthContext

  // Calculate discount percentage safely
  const discountPercentage = baseFare !== 0 ? (discount / baseFare) * 100 : 0;

  // Handle booking confirmation and download bill
  const handleConfirmAndDownload = async () => {
    try {
      await onBook(); // Post the booking request

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
      doc.text(`Selected Driver: ${selectedDriver !== null ? `Driver #${selectedDriver}` : "None"}`, 15, 35);
      doc.text(`Start Location: ${startLocation || "Not set"}`, 15, 45);
      doc.text(`End Location: ${endLocation || "Not set"}`, 15, 55);
      doc.text(`Distance: ${distance ? `${distance} km` : "Not calculated"}`, 15, 65);

      // Add pricing details in a table
      autoTable(doc, {
        startY: 75,
        head: [["Description", "Amount (Rs.)"]],
        body: [
          ["Base Fare", baseFare.toFixed(2)],
          ["Discount", discount.toFixed(2)],
          ["Taxes", taxes.toFixed(2)],
          ["Total Amount", totalAmount.toFixed(2)],
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
      doc.save("booking-invoice.pdf");

      toast({
        title: "Booking Successful",
        description: "Your booking has been confirmed and the invoice has been downloaded.",
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
    } finally {
      onClose(); // Close the popup
    }
  };

  // Handle booking button click
  const handleBookingClick = () => {
    if (!user) {
      // If the user is not logged in, show the login popup
      onLoginOpen();
      toast({
        title: "Login Required",
        description: "You must be logged in to book a cab.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // If the user is logged in, open the booking confirmation popup
      onOpen();
    }
  };

  return (
    <Box maxW="600px" mx="auto" p="6" borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
      {/* Today's Discount Banner */}
      <Alert status="info" mb="4" borderRadius="md">
        <AlertIcon />
        Today's Discount: Rs. {discount.toFixed(2)} ({discountPercentage.toFixed(2)}%)
      </Alert>

      <HStack justifyContent="space-between" mb="4">
        <Text fontSize="xl" fontWeight="bold" color="teal.600">
          Booking Details
        </Text>
        <Badge colorScheme={status === "Confirmed" ? "green" : "yellow"} fontSize="md">
          {status}
        </Badge>
      </HStack>

      <VStack spacing={3} align="stretch">
        <Text fontSize="md">
          <b>Selected Driver:</b> {selectedDriver !== null ? `Driver #${selectedDriver}` : "None"}
        </Text>
        <Text fontSize="md">
          <b>Start Location:</b> {startLocation || "Not set"}
        </Text>
        <Text fontSize="md">
          <b>End Location:</b> {endLocation || "Not set"}
        </Text>
        <Text fontSize="md">
          <b>Distance:</b> {distance ? `${distance} km` : "Not calculated"}
        </Text>
      </VStack>

      <Divider my="4" />

      <Box>
        <Text>
          <b>Base Fare:</b> Rs. {baseFare.toFixed(2)}
        </Text>
        <Text>
          <b>Discount:</b> Rs. {discount.toFixed(2)}
        </Text>
        <Text>
          <b>Taxes:</b> Rs. {taxes.toFixed(2)}
        </Text>
        <Text>
          <b>Total Amount:</b> Rs. {totalAmount.toFixed(2)}
        </Text>
        <Button colorScheme="teal" mt={4} onClick={handleBookingClick}>
          Request Booking
        </Button>
      </Box>

      {/* Confirmation Popup */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Booking</ModalHeader>
          <ModalBody>
            <Text>
              <b>Selected Driver:</b> {selectedDriver !== null ? `Driver #${selectedDriver}` : "None"}
            </Text>
            <Text>
              <b>Start Location:</b> {startLocation || "Not set"}
            </Text>
            <Text>
              <b>End Location:</b> {endLocation || "Not set"}
            </Text>
            <Text>
              <b>Distance:</b> {distance ? `${distance} km` : "Not calculated"}
            </Text>
            <Text>
              <b>Total Amount:</b> Rs. {totalAmount.toFixed(2)}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleConfirmAndDownload}>
              Make Booking
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Login Popup */}
      <LoginPopup isOpen={isLoginOpen} onClose={onLoginClose} onOpenRegister={function (): void {
        throw new Error("Function not implemented.");
      } } />
    </Box>
  );
};

export default Booking;





// now validations are not correct i want if user not loggedin when press request book btn check login if not pop up login must appeare 

// import React, { useState } from "react";
// import {
//   Box,
//   Text,
//   VStack,
//   HStack,
//   Button,
//   Badge,
//   Divider,
//   Alert,
//   AlertIcon,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   useDisclosure,
//   useToast,
// } from "@chakra-ui/react";
// import DownloadPDF from "./DownloadPDF"; // Import the DownloadPDF component
// import autoTable from "jspdf-autotable";
// import jsPDF from "jspdf";

// interface BookingProps {
//   selectedDriver: number | null;
//   startLocation: string | null;
//   endLocation: string | null;
//   distance: number | null;
//   status: "Pending" | "Confirmed";
//   baseFare: number;
//   discount: number;
//   taxes: number;
//   waitingTime: number;
//   onBook: () => Promise<void>; // Update onBook to return a Promise
// }

// const Booking: React.FC<BookingProps> = ({
//   selectedDriver,
//   startLocation,
//   endLocation,
//   distance,
//   status,
//   baseFare,
//   discount,
//   taxes,
//   waitingTime,
//   onBook,
// }) => {
//   const totalAmount = baseFare - discount + taxes;
//   const { isOpen, onOpen, onClose } = useDisclosure(); // For the confirmation popup
//   const toast = useToast(); // For displaying toast messages

//   // Calculate discount percentage safely
//   const discountPercentage = baseFare !== 0 ? (discount / baseFare) * 100 : 0;

//   // Handle booking confirmation and download bill
//   const handleConfirmAndDownload = async () => {
//     try {
//       await onBook(); // Post the booking request

//       // Generate and download the PDF
//       const doc = new jsPDF();

//       // Add a header with a logo and title
//       doc.setFontSize(20);
//       doc.setTextColor(40, 53, 147); // Dark blue color
//       doc.text("Cab Booking Invoice", 15, 20);

//       // Add a horizontal line
//       doc.setLineWidth(0.5);
//       doc.setDrawColor(40, 53, 147); // Dark blue color
//       doc.line(15, 25, 195, 25);

//       // Add booking details
//       doc.setFontSize(12);
//       doc.setTextColor(0, 0, 0); // Black color
//       doc.text(`Selected Driver: ${selectedDriver !== null ? `Driver #${selectedDriver}` : "None"}`, 15, 35);
//       doc.text(`Start Location: ${startLocation || "Not set"}`, 15, 45);
//       doc.text(`End Location: ${endLocation || "Not set"}`, 15, 55);
//       doc.text(`Distance: ${distance ? `${distance} km` : "Not calculated"}`, 15, 65);

//       // Add pricing details in a table
//       autoTable(doc, {
//         startY: 75,
//         head: [["Description", "Amount (Rs.)"]],
//         body: [
//           ["Base Fare", baseFare.toFixed(2)],
//           ["Discount", discount.toFixed(2)],
//           ["Taxes", taxes.toFixed(2)],
//           ["Total Amount", totalAmount.toFixed(2)],
//         ],
//         theme: "striped", // Stylish table theme
//         headStyles: { fillColor: [40, 53, 147] }, // Dark blue header
//       });

//       // Add a footer
//       doc.setFontSize(10);
//       doc.setTextColor(100);
//       doc.text("Thank you for choosing our service!", 15, doc.internal.pageSize.height - 20);
//       doc.text("Contact us: support@cabservice.com | +94 123 456 789", 15, doc.internal.pageSize.height - 15);

//       // Save the PDF
//       doc.save("booking-invoice.pdf");

//       toast({
//         title: "Booking Successful",
//         description: "Your booking has been confirmed and the invoice has been downloaded.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (error) {
//       toast({
//         title: "Booking Failed",
//         description: "Something went wrong. Please try again.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       onClose(); // Close the popup
//     }
//   };

//   return (
//     <Box maxW="600px" mx="auto" p="6" borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
//       {/* Today's Discount Banner */}
//       <Alert status="info" mb="4" borderRadius="md">
//         <AlertIcon />
//         Today's Discount: Rs. {discount.toFixed(2)} ({discountPercentage.toFixed(2)}%)
//       </Alert>

//       <HStack justifyContent="space-between" mb="4">
//         <Text fontSize="xl" fontWeight="bold" color="teal.600">
//           Booking Details
//         </Text>
//         <Badge colorScheme={status === "Confirmed" ? "green" : "yellow"} fontSize="md">
//           {status}
//         </Badge>
//       </HStack>

//       <VStack spacing={3} align="stretch">
//         <Text fontSize="md">
//           <b>Selected Driver:</b> {selectedDriver !== null ? `Driver #${selectedDriver}` : "None"}
//         </Text>
//         <Text fontSize="md">
//           <b>Start Location:</b> {startLocation || "Not set"}
//         </Text>
//         <Text fontSize="md">
//           <b>End Location:</b> {endLocation || "Not set"}
//         </Text>
//         <Text fontSize="md">
//           <b>Distance:</b> {distance ? `${distance} km` : "Not calculated"}
//         </Text>
//       </VStack>

//       <Divider my="4" />

//       <Box>
//         <Text>
//           <b>Base Fare:</b> Rs. {baseFare.toFixed(2)}
//         </Text>
//         <Text>
//           <b>Discount:</b> Rs. {discount.toFixed(2)}
//         </Text>
//         <Text>
//           <b>Taxes:</b> Rs. {taxes.toFixed(2)}
//         </Text>
//         <Text>
//           <b>Total Amount:</b> Rs. {totalAmount.toFixed(2)}
//         </Text>
//         <Button colorScheme="teal" mt={4} onClick={onOpen}>
//           Request Booking
//         </Button>
//       </Box>

//       {/* Confirmation Popup */}
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Confirm Booking</ModalHeader>
//           <ModalBody>
//             <Text>
//               <b>Selected Driver:</b> {selectedDriver !== null ? `Driver #${selectedDriver}` : "None"}
//             </Text>
//             <Text>
//               <b>Start Location:</b> {startLocation || "Not set"}
//             </Text>
//             <Text>
//               <b>End Location:</b> {endLocation || "Not set"}
//             </Text>
//             <Text>
//               <b>Distance:</b> {distance ? `${distance} km` : "Not calculated"}
//             </Text>
//             <Text>
//               <b>Total Amount:</b> Rs. {totalAmount.toFixed(2)}
//             </Text>
//           </ModalBody>
//           <ModalFooter>
//             <Button colorScheme="teal" mr={3} onClick={handleConfirmAndDownload}>
//               Make Booking
//             </Button>
//             <Button variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// export default Booking;