import React, { useState, useEffect } from "react";
import { Box, Text, Input, Button, VStack, HStack, useToast } from "@chakra-ui/react";
import useBilling from "../../hooks/useBilling";

interface BillingCustomerProps {
  bookingId: number;
  customerName: string;
  distance: number;
}

const BillingCustomer: React.FC<BillingCustomerProps> = ({ bookingId, customerName, distance }) => {
  const [baseFare, setBaseFare] = useState<number>(0);
  const [waitingTimeCharge, setWaitingTimeCharge] = useState<number>(0);
  const [taxes, setTaxes] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { updateBill, fetchBillByBookingId, loading, error } = useBilling();
  const toast = useToast();

  // Fetch bill details when the component mounts
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const bill = await fetchBillByBookingId(bookingId);
        if (bill) {
          setBaseFare(bill.baseFare);
          setWaitingTimeCharge(bill.waitingTimeCharge);
          setTaxes(bill.taxes);
          setDiscount(bill.discount);
          setTotalAmount(bill.totalAmount);
        }
      } catch (error) {
        toast({
          title: "Failed to fetch bill details.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchBill();
  }, [bookingId, fetchBillByBookingId, toast]);

  // Calculate total amount whenever billing details change
  useEffect(() => {
    const total = baseFare + waitingTimeCharge + taxes - discount;
    setTotalAmount(total);
  }, [baseFare, waitingTimeCharge, taxes, discount]);

  const handleUpdateBill = async () => {
    try {
      const bill = {
        bookingId,
        baseFare,
        waitingTimeCharge,
        taxes,
        discount,
        totalAmount,
      };
      await updateBill(bill);
      toast({
        title: "Bill updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to update bill.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
      <VStack align="start" spacing={3}>
        <Text fontWeight="bold">Booking ID: {bookingId}</Text>
        <Text>Customer Name: {customerName}</Text>
        <Text>Distance: {distance} km</Text>

        <HStack spacing={4}>
          <Box>
            <Text>Base Fare</Text>
            <Input
              type="number"
              value={baseFare}
              onChange={(e) => setBaseFare(Number(e.target.value))}
            />
          </Box>
          <Box>
            <Text>Waiting Time Charge</Text>
            <Input
              type="number"
              value={waitingTimeCharge}
              onChange={(e) => setWaitingTimeCharge(Number(e.target.value))}
            />
          </Box>
          <Box>
            <Text>Taxes</Text>
            <Input
              type="number"
              value={taxes}
              onChange={(e) => setTaxes(Number(e.target.value))}
            />
          </Box>
          <Box>
            <Text>Discount</Text>
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </Box>
        </HStack>

        <Text fontWeight="bold">Total Amount: ${totalAmount.toFixed(2)}</Text>

        <Button
          colorScheme="blue"
          onClick={handleUpdateBill}
          isLoading={loading}
          isDisabled={loading}
        >
          Update Bill
        </Button>

        {error && <Text color="red.500">{error}</Text>}
      </VStack>
    </Box>
  );
};

export default BillingCustomer;