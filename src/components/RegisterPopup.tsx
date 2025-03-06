import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "./AuthContext";

interface RegisterPopupProps {
  isOpen: boolean; // Controls whether the modal is open
  onClose: () => void; // Function to close the modal
}

const RegisterPopup: React.FC<RegisterPopupProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    address: "",
    phone: "",
    nic: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Register the user
      await register(
        formData.username,
        formData.password,
        formData.address,
        formData.phone,
        formData.nic
      );

      toast({
        title: "Registration Successful",
        description: `Welcome, ${formData.username}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose(); // Close the modal after successful registration
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast({
        title: "Registration Failed",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Address</FormLabel>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Phone</FormLabel>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>NIC</FormLabel>
            <Input
              name="nic"
              value={formData.nic}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Register
          </Button>
          <Button onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegisterPopup;