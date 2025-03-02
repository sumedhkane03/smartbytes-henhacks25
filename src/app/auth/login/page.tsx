"use client";
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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/src/lib/firebase";
import Link from "next/link";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { user, error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (user?.email) {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.email);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } catch (err) {
        console.error('Error checking user data:', err);
        router.push('/onboarding');
      }
    }

    setIsLoading(false);
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Stack spacing={8}>
        <Stack align="center">
          <Heading>Login to SmartBytes</Heading>
          <Text>Your personal AI-powered menu analyzer</Text>
        </Stack>
        <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
          <Stack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              fontSize="md"
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </Stack>
        </Box>
        <Text align="center">
          Don't have an account?{" "}
          <Link href="/auth/signup" passHref legacyBehavior>
            <ChakraLink color="blue.500">Sign up</ChakraLink>
          </Link>
        </Text>
      </Stack>
    </Container>
  );
}
