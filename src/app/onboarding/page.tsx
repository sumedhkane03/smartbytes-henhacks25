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
  NumberDecrementStepper
} from '@chakra-ui/react';

export default function Onboarding() {
  return (
    <Container maxW="container.md" py={10}>
      <Stack spacing={8}>
        <Stack align="center" textAlign="center">
          <Heading>Tell Us About Your Goals</Heading>
          <Text>Help us personalize your SmartBytes experience</Text>
        </Stack>

        <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
          <Stack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Gender</FormLabel>
              <Select placeholder="Select gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Height (cm)</FormLabel>
              <NumberInput min={100} max={250}>
                <NumberInputField placeholder="Enter height in centimeters" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Weight (kg)</FormLabel>
              <NumberInput min={30} max={300}>
                <NumberInputField placeholder="Enter weight in kilograms" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>What's your primary dietary goal?</FormLabel>
              <Select placeholder="Select goal">
                <option value="lose-weight">Lose Weight</option>
                <option value="build-muscle">Build Muscle</option>
                <option value="maintain">Maintain Weight</option>
                <option value="keto">Follow Keto Diet</option>
                <option value="vegetarian">Vegetarian</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Preferred Macronutrient Focus</FormLabel>
              <Select placeholder="Select preference">
                <option value="high-protein">High Protein</option>
                <option value="low-carb">Low Carb</option>
                <option value="low-fat">Low Fat</option>
                <option value="balanced">Balanced</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Dietary Restrictions</FormLabel>
              <Stack spacing={2}>
                <Checkbox value="dairy-free">Dairy-free</Checkbox>
                <Checkbox value="gluten-free">Gluten-free</Checkbox>
                <Checkbox value="nut-free">Nut-free</Checkbox>
                <Checkbox value="vegan">Vegan</Checkbox>
              </Stack>
            </FormControl>

            <FormControl>
              <FormLabel>Budget per Meal (Optional)</FormLabel>
              <NumberInput max={200} min={0}>
                <NumberInputField placeholder="Enter amount in USD" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <Button colorScheme="blue" size="lg" w="100%">
              Continue to Dashboard
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}