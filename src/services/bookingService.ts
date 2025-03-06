import api from "./api";

interface BookingRequest {
  driverId: number;
  customerId: number;
  startLocation: string;
  endLocation: string;
  distance: number;
  fare: number;
}

/**
 * Calculate the fare based on distance (1 km = 100 Rs).
 * @param distance - Distance in kilometers.
 * @returns Calculated fare.
 */
export const calculateFare = (distance: number): number => {
  const baseFare = 100; // 1 km = 100 Rs
  return distance * baseFare;
};

/**
 * Send a booking request to the backend.
 * @param bookingData - Booking details.
 * @returns Response from the backend.
 */
export const createBooking = async (bookingData: BookingRequest) => {
  try {
    const response = await api.post("/customer/add-booking", bookingData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create booking");
  }
};