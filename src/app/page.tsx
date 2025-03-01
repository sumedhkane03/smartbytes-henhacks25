import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import './start.css';

export default function Home() {
  return (
    <div className='start'>
    <Container maxW="container.xl" py={10} className="row">
      <Stack spacing={8} align="center" textAlign="center">
        <Heading as="h1" size="2xl" className='welcome'>
          Welcome to SmartBytes
        </Heading>
        <Text fontSize="xl" className='blurb'>
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
    </div>
  );
}