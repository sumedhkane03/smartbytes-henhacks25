import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <Stack spacing={8} align="center" textAlign="center">
        <Heading as="h1" size="2xl">
          Welcome to SmartBytes
        </Heading>
        <Text fontSize="xl">
          Your AI-powered restaurant menu analyzer for healthier dining choices
        </Text>
        <Box>
          <Stack direction={['column', 'row']} spacing={4}>
            <Link href="/auth/login" passHref>
              <Button colorScheme="blue" size="lg">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup" passHref>
              <Button colorScheme="green" size="lg">
                Sign Up
              </Button>
            </Link>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}