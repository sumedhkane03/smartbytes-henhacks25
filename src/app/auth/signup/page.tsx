import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Link as ChakraLink,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/firebase';
import Link from 'next/link';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setIsLoading(true);
    const { user, error } = await signUp(email, password);

    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } else {
      router.push('/onboarding');
    }

    setIsLoading(false);
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Stack spacing={8}>
        <Stack align="center">
          <Heading>Create Your SmartBytes Account</Heading>
          <Text>Start your journey to healthier dining choices</Text>
        </Stack>
        <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
          <Stack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl id="name" isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormControl>
            <Button 
              type="submit"
              colorScheme="green" 
              size="lg" 
              fontSize="md"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </Stack>
        </Box>
        <Text align="center">
          Already have an account?{' '}
          <Link href="/auth/login" passHref>
            <ChakraLink color="blue.500">Login</ChakraLink>
          </Link>
        </Text>
      </Stack>
    </Container>
  );
}