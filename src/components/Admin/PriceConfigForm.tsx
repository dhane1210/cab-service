import React, { useState, useEffect } from "react";
import { Box, Text, Input, Button, VStack, HStack, useToast } from "@chakra-ui/react";
import api from "../../services/api";

const PriceConfigForm: React.FC = () => {
    const [baseFare, setBaseFare] = useState<number>(0);
    const [waitingTimeCharge, setWaitingTimeCharge] = useState<number>(0);
    const [taxRate, setTaxRate] = useState<number>(0);
    const [discountRate, setDiscountRate] = useState<number>(0);
    const toast = useToast();

    useEffect(() => {
        const fetchPriceConfig = async () => {
            try {
                const response = await api.get("/admin/price-config");
                const config = response.data;
                setBaseFare(config.baseFare);
                setWaitingTimeCharge(config.waitingTimeCharge);
                setTaxRate(config.taxRate);
                setDiscountRate(config.discountRate);
            } catch (error) {
                toast({
                    title: "Failed to fetch price configuration.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

        fetchPriceConfig();
    }, [toast]);

    const handleUpdatePriceConfig = async () => {
        try {
            const priceConfig = {
                baseFare,
                waitingTimeCharge,
                taxRate,
                discountRate,
            };
            await api.put("/admin/price-config", priceConfig);
            toast({
                title: "Price configuration updated successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Failed to update price configuration.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
            <VStack align="start" spacing={3}>
                <Text fontWeight="bold">Default Price Configuration</Text>

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
                        <Text>Tax Rate (%)</Text>
                        <Input
                            type="number"
                            value={taxRate}
                            onChange={(e) => setTaxRate(Number(e.target.value))}
                        />
                    </Box>
                    <Box>
                        <Text>Discount Rate (%)</Text>
                        <Input
                            type="number"
                            value={discountRate}
                            onChange={(e) => setDiscountRate(Number(e.target.value))}
                        />
                    </Box>
                </HStack>

                <Button colorScheme="blue" onClick={handleUpdatePriceConfig}>
                    Update Price Configuration
                </Button>
            </VStack>
        </Box>
    );
};

export default PriceConfigForm;