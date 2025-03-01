"use client";

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
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Onboarding() {
  interface FormData {
    gender: string;
    height: string;
    weight: string;
    fitnessGoal: string;
    dietaryRestriction: string;
    macroPreference: string;
    restrictions: string[];
    budgetPerMeal: string;
  }

  const [formData, setFormData] = useState<FormData>({
    gender: "",
    height: "",
    weight: "",
    fitnessGoal: "",
    dietaryRestriction: "",
    macroPreference: "",
    restrictions: [],
    budgetPerMeal: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    setFormData((prev) => {
      const currentRestrictions = prev.restrictions as string[];
      return {
        ...prev,
        restrictions: isChecked
          ? [...currentRestrictions, value]
          : currentRestrictions.filter((r) => r !== value),
      };
    });
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

  return (
    <Container maxW='container.md' py={10}>
      <Stack spacing={8}>
        <Stack align='center' textAlign='center'>
          <Heading>Tell Us About Your Goals</Heading>
          <Text>Help us personalize your SmartBytes experience</Text>
        </Stack>

        <Box p={8} borderWidth={1} borderRadius={8} boxShadow='lg'>
          <Stack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Gender</FormLabel>
              <Select
                placeholder='Select gender'
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Height (in)</FormLabel>
              <NumberInput
                value={formData.height}
                onChange={(value) => handleInputChange("height", value)}>
                <NumberInputField placeholder='Enter height in inches' />
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
                onChange={(value) => handleInputChange("weight", value)}>
                <NumberInputField placeholder='Enter weight in pounds' />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>What's your primary fitness goal?</FormLabel>
              <Select
                placeholder='Select goal'
                value={formData.fitnessGoal}
                onChange={(e) =>
                  handleInputChange("fitnessGoal", e.target.value)
                }>
                <option value='lose-weight'>Lose Weight</option>
                <option value='build-muscle'>Build Muscle</option>
                <option value='maintain'>Maintain Weight</option>
                <option value='gain-weight'>Gain Weight</option>
                <option value='tone-up'>Tone Up</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Dietary Restriction</FormLabel>
              <Select
                placeholder='Select restriction'
                value={formData.dietaryRestriction}
                onChange={(e) =>
                  handleInputChange("dietaryRestriction", e.target.value)
                }>
                <option value='none'>None</option>
                <option value='standard'>Standard</option>
                <option value='vegetarian'>Vegetarian</option>
                <option value='pescatarian'>Pescatarian</option>
                <option value='keto'>Keto</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Preferred Macronutrient Focus</FormLabel>
              <Select
                placeholder='Select preference'
                value={formData.macroPreference}
                onChange={(e) =>
                  handleInputChange("macroPreference", e.target.value)
                }>
                <option value='high-protein'>High Protein</option>
                <option value='low-carb'>Low Carb</option>
                <option value='low-fat'>Low Fat</option>
                <option value='balanced'>Balanced</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Dietary Restrictions</FormLabel>
              <Stack spacing={2}>
                <Checkbox
                  value='dairy-free'
                  isChecked={formData.restrictions.includes("dairy-free")}
                  onChange={(e) =>
                    handleCheckboxChange("dairy-free", e.target.checked)
                  }>
                  Dairy-free
                </Checkbox>
                <Checkbox
                  value='gluten-free'
                  isChecked={formData.restrictions.includes("gluten-free")}
                  onChange={(e) =>
                    handleCheckboxChange("gluten-free", e.target.checked)
                  }>
                  Gluten-free
                </Checkbox>
                <Checkbox
                  value='nut-free'
                  isChecked={formData.restrictions.includes("nut-free")}
                  onChange={(e) =>
                    handleCheckboxChange("nut-free", e.target.checked)
                  }>
                  Nut-free
                </Checkbox>
                <Checkbox
                  value='vegan'
                  isChecked={formData.restrictions.includes("vegan")}
                  onChange={(e) =>
                    handleCheckboxChange("vegan", e.target.checked)
                  }>
                  Vegan
                </Checkbox>
                <Checkbox
                  value='no-chicken'
                  isChecked={formData.restrictions.includes("no-chicken")}
                  onChange={(e) =>
                    handleCheckboxChange("no-chicken", e.target.checked)
                  }>
                  No Chicken
                </Checkbox>
                <Checkbox
                  value='no-pork'
                  isChecked={formData.restrictions.includes("no-pork")}
                  onChange={(e) =>
                    handleCheckboxChange("no-pork", e.target.checked)
                  }>
                  No Pork
                </Checkbox>
                <Checkbox
                  value='no-beef'
                  isChecked={formData.restrictions.includes("no-beef")}
                  onChange={(e) =>
                    handleCheckboxChange("no-beef", e.target.checked)
                  }>
                  No Beef
                </Checkbox>
              </Stack>
            </FormControl>

            <FormControl>
              <FormLabel>Budget per Meal (Optional)</FormLabel>
              <NumberInput
                max={200}
                min={0}
                value={formData.budgetPerMeal}
                onChange={(value) => handleInputChange("budgetPerMeal", value)}>
                <NumberInputField placeholder='Enter amount in USD' />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <Button
              colorScheme='blue'
              size='lg'
              w='100%'
              onClick={handleSubmit}
              isLoading={isLoading}>
              Continue to Dashboard
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
