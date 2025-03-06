// components/Admin/Sidebar.tsx
import React from "react";
import { Box, VStack, Button } from "@chakra-ui/react";

interface SidebarProps {
  selectedMenu: string;
  onSelectMenu: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedMenu, onSelectMenu }) => {
  return (
    <Box>
      <VStack align="start" spacing={4}>
        <Button
          w="100%"
          onClick={() => onSelectMenu("bookingRequests")}
          variant={selectedMenu === "bookingRequests" ? "solid" : "ghost"}
        >
          Booking Requests
        </Button>
        <Button
          w="100%"
          onClick={() => onSelectMenu("assignDriversAndCars")}
          variant={selectedMenu === "assignDriversAndCars" ? "solid" : "ghost"}
        >
          Assign Drivers and Cars
        </Button>
        <Button
          w="100%"
          onClick={() => onSelectMenu("billingArea")}
          variant={selectedMenu === "billingArea" ? "solid" : "ghost"}
        >
          Billing Area
        </Button>
        <Button
          w="100%"
          onClick={() => onSelectMenu("registeredCarsAndDrivers")}
          variant={selectedMenu === "registeredCarsAndDrivers" ? "solid" : "ghost"}
        >
          Registered Cars and Drivers
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;