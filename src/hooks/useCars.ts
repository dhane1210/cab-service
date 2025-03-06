import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

interface Car {
  carId: number;
  model: string;
  licensePlate: string;
  isAvailable: boolean;
}

const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available cars
  const fetchAvailableCars = useCallback(async () => {
    try {
      const response = await api.get<Car[]>("/admin/available-cars");
      const formattedCars = response.data.map(car => ({
        ...car,
        isAvailable: car.isAvailable === true,
      }));
      setCars(formattedCars);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch available cars.");
      setLoading(false);
    }
  }, []);

  // Register a new car
  const registerCar = useCallback(async (car: Omit<Car, "carId">) => {
    try {
      await api.post("/admin/add-car", car);
      fetchAvailableCars(); // Refresh the list after registering a new car
    } catch (error) {
      console.error("Failed to register car:", error);
    }
  }, [fetchAvailableCars]);

  // Fetch available cars on component mount
  useEffect(() => {
    fetchAvailableCars();
  }, [fetchAvailableCars]);

  return { cars, loading, error, fetchAvailableCars, registerCar };
};

export default useCars;