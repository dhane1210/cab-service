import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

interface Driver {
  driverId: number;
  name: string;
  licenseNumber: string;
  phone: string;
  isAvailable: boolean;
  carModel?: string;
  carLicenseNumber?: string;
}

const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch drivers with assigned cars (for customer area)
  const fetchDriversWithAssignedCars = useCallback(async () => {
    try {
      const response = await api.get<Driver[]>("/admin/drivers-with-cars");
      const formattedDrivers = response.data.map(driver => ({
        ...driver,
        isAvailable: driver.isAvailable === true,
      }));
      setDrivers(formattedDrivers);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch drivers with assigned cars.");
      setLoading(false);
    }
  }, []);

  // Fetch available drivers without assigned cars (for admin area)
  const fetchAvailableDriversWithoutCar = useCallback(async () => {
    try {
      const response = await api.get<Driver[]>("/admin/available-drivers-withoutCar");
      const formattedDrivers = response.data.map(driver => ({
        ...driver,
        isAvailable: driver.isAvailable === true,
      }));
      setDrivers(formattedDrivers);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch available drivers without assigned cars.");
      setLoading(false);
    }
  }, []);

  // Register a new driver
  const registerDriver = useCallback(async (driver: Omit<Driver, "driverId">) => {
    try {
      await api.post("/admin/add-driver", driver);
      fetchAvailableDriversWithoutCar(); // Refresh the list for admin
    } catch (error) {
      console.error("Failed to register driver:", error);
    }
  }, [fetchAvailableDriversWithoutCar]);

  // Assign a car to a driver
  const assignCarToDriver = useCallback(async (driverId: number, carId: number) => {
    try {
      await api.post("/admin/assign-car-to-driver", null, {
        params: { driverId, carId },
      });
      fetchAvailableDriversWithoutCar(); // Refresh the list for admin
    } catch (error) {
      console.error("Failed to assign car to driver:", error);
    }
  }, [fetchAvailableDriversWithoutCar]);

  return {
    drivers,
    loading,
    error,
    fetchDriversWithAssignedCars, // For customer area
    fetchAvailableDriversWithoutCar, // For admin area
    registerDriver,
    assignCarToDriver,
  };
};

export default useDrivers;