import { useEffect, useState } from "react";
import api from "../services/api";

interface Booking {
  bookingId: number;
  assignedDriver: {
    driverId: number;
  };
  status: string;
}

const useDriverAvailability = (driverId: number) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get<Booking[]>("/admin/all-bookings");
        const activeBookings = response.data.filter(
          (booking) => booking.status === "Accepted" || booking.status === "Pending"
        );

        // Check if the driver is assigned to any active booking
        const isAssigned = activeBookings.some(
          (booking) => booking.assignedDriver.driverId === driverId
        );

        setIsAvailable(!isAssigned); // Update availability
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchBookings();
  }, [driverId]);

  return isAvailable;
};

export default useDriverAvailability;