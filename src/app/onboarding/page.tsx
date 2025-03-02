"use client";

import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import BottomNav from "@/src/components/BottomNav";
import "./page.css";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Stack,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Image from "next/image";

export default function OnboardingPage() {
  interface FormData {
    gender: string;
    height: string;
    weight: string;
    fitnessGoal: string;
    activityLevel: string;
  }

  const [formData, setFormData] = useState<FormData>({
    gender: "male",
    height: "",
    weight: "",
    fitnessGoal: "",
    activityLevel: "",
  });

  const [genderIndex, setGenderIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenderChange = (index: number) => {
    const gender = index === 0 ? "male" : "female";
    setGenderIndex(index);
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user?.email) {
        throw new Error("No authenticated user found");
      }
      const db = getFirestore();
      await setDoc(doc(db, "users", user.email), {
        ...formData,
        email: user.email,
        updatedAt: new Date().toISOString(),
      });
      toast({
        title: "Profile Updated",
        description: "Your preferences have been saved successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <button className="back-button" onClick={handleBackClick}>
          <FaArrowLeft /> Back
        </button>
        <h1>Profile</h1>
      </div>

      <div className="profile-container">
        <div className="profile-icon">
          <Image
            src="/images/henhacks-logo.png"
            alt="Henhacks Logo"
            width={120}
            height={120}
          />
        </div>
        <h2>Welcome!</h2>
      </div>

      <Container maxW="container.md" py={5}>
        <Stack spacing={8}>
          <Stack align="center" textAlign="center">
            <Heading>Tell Us About Your Goals</Heading>
            <Text>Help us personalize your SmartBytes experience</Text>
          </Stack>
          <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
            <Stack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Biological Sex</FormLabel>
                <Tabs
                  variant="soft-rounded"
                  index={genderIndex}
                  onChange={handleGenderChange}
                >
                  <TabList>
                    <Tab _selected={{ bg: "#A4C3B2", color: "white" }}>
                      Male
                    </Tab>
                    <Tab _selected={{ bg: "#A4C3B2", color: "white" }}>
                      Female
                    </Tab>
                  </TabList>
                </Tabs>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Height (in)</FormLabel>
                <NumberInput
                  value={formData.height}
                  onChange={(value) => handleInputChange("height", value)}
                >
                  <NumberInputField placeholder="Enter height in inches" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Weight (lbs)</FormLabel>
                <NumberInput
                  min={30}
                  max={300}
                  value={formData.weight}
                  onChange={(value) => handleInputChange("weight", value)}
                >
                  <NumberInputField placeholder="Enter weight in pounds" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>What's your primary fitness goal?</FormLabel>
                <Select
                  placeholder="Select goal"
                  value={formData.fitnessGoal}
                  onChange={(e) =>
                    handleInputChange("fitnessGoal", e.target.value)
                  }
                >
                  <option value="lose-weight">Lose Weight</option>
                  <option value="build-muscle">Build Muscle</option>
                  <option value="maintain">Maintain Weight</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Activity Level</FormLabel>
                <Select
                  placeholder="Select activity level"
                  value={formData.activityLevel}
                  onChange={(e) =>
                    handleInputChange("activityLevel", e.target.value)
                  }
                >
                  <option value="1">1 - Low Activity</option>
                  <option value="2">2 - Moderate Activity</option>
                  <option value="3">3 - High Activity</option>
                </Select>
              </FormControl>
              <Button
                bg="#6B8F80"
                color="white"
                size="lg"
                w="100%"
                onClick={handleSubmit}
                isLoading={isLoading}
                _hover={{ bg: "#5a7a6d" }}
              >
                Continue to Dashboard
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>

      <BottomNav />
    </div>
  );
}
