// hooks/useBookings.ts
import { useState, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../components/AuthContext";
import { AxiosError } from "axios";

interface Booking {
  bookingId: number;
  startLocation: string;
  endLocation: string;
  distance: number;
  fare: number;
  status: string;
}

const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  // Fetch bookings for a specific customer (existing function)
  const fetchBookings = useCallback(async () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    const userData = localStorage.getItem("user"); // Retrieve user data from localStorage

    if (!userData || !token) {
      console.error("User is not authenticated or missing required details.");
      return;
    }

    const parsedUser = JSON.parse(userData);

    try {
      const response = await api.get(`/customer/view-bookings/${parsedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error response:", error.response?.data);
        console.error("Status code:", error.response?.status);
      } else {
        console.error("Error:", error);
      }
    }
  }, []); // Memoize fetchBookings

  // Fetch all bookings (new function for admin)
  const fetchAllBookings = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      const response = await api.get("/admin/all-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error response:", error.response?.data);
        console.error("Status code:", error.response?.status);
      } else {
        console.error("Error:", error);
      }
    }
  }, []); // Memoize fetchAllBookings

  // Accept a booking (new function for admin)
  const acceptBooking = useCallback(async (bookingId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      await api.put(`/admin/accept-booking/${bookingId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the bookings list after accepting
      fetchAllBookings();
    } catch (error) {
      console.error("Failed to accept booking:", error);
    }
  }, [fetchAllBookings]); // Memoize acceptBooking

  // Delete a booking (existing function)
  const handleDelete = useCallback(async (bookingId: number) => {
    try {
      await api.delete(`/customer/delete-booking/${bookingId}`);
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.bookingId !== bookingId));
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  }, []); // Memoize handleDelete

  // Download bill (existing function)
  const handleDownloadBill = useCallback(async (bookingId: number) => {
    try {
      const response = await api.get(`/customer/view-bill/${bookingId}`, {
        responseType: "blob", // Ensure the response is treated as a binary file
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bill-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download bill:", error);
    }
  }, []); // Memoize handleDownloadBill

  return {
    bookings,
    fetchBookings, // For customers
    fetchAllBookings, // For admins
    acceptBooking, // For admins
    handleDelete, // For customers and admins
    handleDownloadBill, // For customers and admins
  };
};

export default useBookings;