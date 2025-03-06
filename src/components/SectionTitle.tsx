import { Box, Heading } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
// Keyframes for a subtle wave animation
const waveAnimation = keyframes`
  0% { transform: translateX(0); }
  50% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
`;

interface SectionTitleProps {
  title: string;
}

const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <Box
      position="relative"
      textAlign="center"
      mb={8}
      overflow="hidden"
      py={8}
    >
      {/* Curvy Top Edge with Gradient */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="120px"
        bgGradient="linear(to-r, teal.500, teal.700)"
        clipPath="polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)"
        zIndex={1}
        animation={`${waveAnimation} 6s infinite linear`}
      />

      {/* Title */}
      <Heading
        as="h2"
        size="2xl"
        color="teal.600"
        position="relative"
        zIndex={2}
      >
        {title}
      </Heading>

      {/* Curvy Bottom Edge with Gradient */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="120px"
        bgGradient="linear(to-r, teal.500, teal.700)"
        clipPath="polygon(0 20%, 50% 0, 100% 20%, 100% 100%, 0 100%)"
        zIndex={1}
        animation={`${waveAnimation} 6s infinite linear`}
      />
    </Box>
  );
};

export default SectionTitle;