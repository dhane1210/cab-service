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
  Text,
  Link,
} from "@chakra-ui/react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

interface LoginPopupProps {
  isOpen: boolean; // Controls whether the modal is open
  onClose: () => void; // Function to close the modal
  onOpenRegister: () => void; // Function to open the RegisterPopup
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose, onOpenRegister }) => {
  const toast = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      await login(credentials.username, credentials.password);
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect to admin dashboard if the user is an admin
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      onClose(); // Close the modal after successful login
    } catch {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              value={credentials.username}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
            />
          </FormControl>

          <Text mt={4} textAlign="center">
            Not signed up yet?{" "}
            <Link color="teal.500" onClick={onOpenRegister}>
              Sign up here!
            </Link>
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" onClick={handleLogin}>
            Login
          </Button>
          <Button onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginPopup;