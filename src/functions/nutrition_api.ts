import axios from 'axios';

// Use a valid API key format for API Ninjas
const API_NINJAS_KEY = process.env.API_NINJAS_KEY || 'asEMGkqvhvAzj0/qcLoVZg==RO39NiRxjmfd5foR';

export interface NutritionData {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

export async function getNutritionData(foodName: string): Promise<NutritionData | null> {
  try {
    // Validate input to prevent empty queries
    if (!foodName || foodName.trim() === '') {
      console.error('Empty food name provided to nutrition API');
      return null;
    }
    
    // Check if API key is available
    if (!API_NINJAS_KEY) {
      console.error('API Ninjas key is not configured');
      return null;
    }
    
    // Sanitize the query to avoid special characters that might cause issues
    const sanitizedQuery = foodName.trim();
    
    const response = await axios.get('https://api.api-ninjas.com/v1/nutrition', {
      params: { query: sanitizedQuery },
      headers: { 'X-Api-Key': API_NINJAS_KEY }
    });

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    // More detailed error logging
    if (axios.isAxiosError(error)) {
      console.error(`Nutrition API error (${error.response?.status}): ${error.message}`);
      if (error.response?.status === 400) {
        console.error('Bad request - check API key format and query parameters');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        console.error('Authentication error - invalid API key');
      }
    } else {
      console.error('Error fetching nutrition data:', error);
    }
    return null;
  }
}