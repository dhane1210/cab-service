import React from 'react';
import { Box, Text, Link, Stack } from '@chakra-ui/react';

function Footer() {
  return (
    <Box
      bgGradient="linear(to-r, teal.500, teal.700)"
      color="white"
      py={6}
      px={4}
      textAlign="center"
    >
      <Stack spacing={4} align="center">
        <Text fontSize="sm">© 2025 CabService. All rights reserved.</Text>
        <Stack direction="row" spacing={6}>
          <Link href="#" color="white" _hover={{ textDecoration: 'underline' }}>
            Privacy Policy
          </Link>
          <Link href="#" color="white" _hover={{ textDecoration: 'underline' }}>
            Terms of Service
          </Link>
          <Link href="#" color="white" _hover={{ textDecoration: 'underline' }}>
            Contact Us
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Footer;
