import { useState, useCallback } from "react";
import api from "../services/api";

interface Bill {
  bookingId: number;
  baseFare: number;
  waitingTimeCharge: number;
  taxes: number;
  discount: number;
  totalAmount: number;
}

const useBilling = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateBill = useCallback(async (bill: Bill) => {
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/admin/bill/update/${bill.bookingId}`, bill, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError("Failed to update bill.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBillByBookingId = useCallback(async (bookingId: number) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Get the JWT token from local storage
      const response = await api.get(`/admin/bill/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request
        },
      });
      return response.data;
    } catch (error) {
      setError("Failed to fetch bill.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateBill,
    fetchBillByBookingId,
    loading,
    error,
  };
};

export default useBilling;