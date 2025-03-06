// components/Admin/AdminDashboard.tsx
import React, { useState } from "react";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import BookingRequests from "./BookingRequests";
// import AssignDriversAndCars from "./AssignDriversAndCars";
import BillingArea from "./BillingArea";
import RegisteredCarsAndDrivers from "./RegisteredCarsAndDrivers";
import { useAuth } from "../AuthContext";
import AssignDriversAndCars from "./AssignDriversAndCars";

const AdminDashboard = () => {
  const { user } = useAuth();
  console.log("AdminDashboard user:", user); // Log the user object

  if (!user || user.role !== "ADMIN") {
    console.log("User does not have permission to access this page"); // Log the permission check
    return "You do not have permission to access this page";
  }

  console.log("Rendering AdminDashboard"); // Log the rendering

  const [selectedMenu, setSelectedMenu] = useState("bookingRequests");

  const renderContent = () => {
    switch (selectedMenu) {
      case "bookingRequests":
        return <BookingRequests />;
      case "assignDriversAndCars":
        return <AssignDriversAndCars />;
      case "billingArea":
        return <BillingArea />;
      case "registeredCarsAndDrivers":
        return <RegisteredCarsAndDrivers />;
      default:
        return <Box>Select a menu item</Box>;
    }
  };

  return (
    <Grid
      templateColumns="250px 1fr" // Sidebar width: 250px, Content area: remaining space
      templateRows="1fr" // Single row
      minHeight="100vh" // Full viewport height
      width="100%" // Stretch to full width of the container
      overflowX="auto" // Add horizontal scroll if content overflows
    >
      {/* Sidebar */}
      <GridItem bg="gray.100" p={4}>
        <Sidebar selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />
      </GridItem>

      {/* Content Area */}
      <GridItem bg="white" p={4} overflowY="auto"> {/* Add overflowY for scrollable content */}
        {renderContent()}
      </GridItem>
    </Grid>
  );
};

export default AdminDashboard;