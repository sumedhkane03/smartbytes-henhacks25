import axios from 'axios';
import { getNutritionData } from './nutrition_api';

// Define food category types for better protein estimation
interface FoodCategory {
  name: string;
  keywords: string[];
  proteinEstimate: number; // protein percentage per 100g
  confidence: "high" | "medium" | "low";
}

// Define common food categories with their approximate protein contents
const foodCategories: FoodCategory[] = [
  {
    name: 'Meat',
    keywords: ['chicken', 'beef', 'steak', 'pork', 'turkey', 'lamb', 'veal', 'meat'],
    proteinEstimate: 25, // ~25g protein per 100g
    confidence: "high"
  },
  {
    name: 'Fish',
    keywords: ['fish', 'tuna', 'salmon', 'tilapia', 'cod', 'halibut', 'seafood', 'shrimp'],
    proteinEstimate: 20, // ~20g protein per 100g
    confidence: "high"
  },
  {
    name: 'Dairy',
    keywords: ['milk', 'cheese', 'yogurt', 'greek yogurt', 'dairy', 'cottage cheese'],
    proteinEstimate: 10, // ~10g protein per 100g (varies widely)
    confidence: "medium"
  },
  {
    name: 'Legumes',
    keywords: ['beans', 'lentils', 'chickpeas', 'tofu', 'soy', 'tempeh', 'legume'],
    proteinEstimate: 9, // ~9g protein per 100g
    confidence: "medium"
  },
  {
    name: 'Eggs',
    keywords: ['egg', 'eggs', 'omelette', 'frittata'],
    proteinEstimate: 13, // ~13g protein per 100g
    confidence: "high"
  },
  {
    name: 'Protein Supplements',
    keywords: ['protein', 'whey', 'protein shake', 'protein powder', 'protein bar'],
    proteinEstimate: 70, // High protein content
    confidence: "medium"
  },
  {
    name: 'Grains',
    keywords: ['bread', 'rice', 'pasta', 'cereal', 'oats', 'quinoa', 'grain'],
    proteinEstimate: 4, // ~4g protein per 100g
    confidence: "medium"
  },
  {
    name: 'Vegetables',
    keywords: ['vegetable', 'salad', 'broccoli', 'spinach', 'kale'],
    proteinEstimate: 2, // ~2g protein per 100g
    confidence: "medium"
  },
  {
    name: 'Nuts',
    keywords: ['nuts', 'almonds', 'peanuts', 'walnuts', 'cashews'],
    proteinEstimate: 20, // ~20g protein per 100g
    confidence: "medium"
  },
  {
    name: 'Fast Food',
    keywords: ['burger', 'fries', 'pizza', 'fast food', 'sandwich'],
    proteinEstimate: 15, // ~15g protein per 100g (rough estimate)
    confidence: "low"
  }
];

interface ProteinEstimation {
  estimatedProtein: number;
  confidence: "high" | "medium" | "low";
}

/**
 * Identifies the food category based on the food name and description
 * 
 * @param foodName The name of the food item
 * @param description Optional description of the food item
 * @returns The matching food category or undefined if no match is found
 */
function identifyFoodCategory(foodName: string, description?: string): FoodCategory | undefined {
  const searchText = (foodName + ' ' + (description || '')).toLowerCase();
  
  // First, try to find a strong match (multiple keywords or exact match)
  for (const category of foodCategories) {
    let matchCount = 0;
    for (const keyword of category.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    
    // If we have multiple keyword matches, this is likely the correct category
    if (matchCount >= 2) {
      return category;
    }
  }
  
  // If no strong match, look for any single keyword match
  for (const category of foodCategories) {
    for (const keyword of category.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  // No match found
  return undefined;
}

/**
 * Estimates protein content based on food category recognition
 * 
 * @param foodName The name of the food item
 * @param description Optional description of the food item
 * @returns Estimated protein content and confidence level
 */
function estimateProteinByFoodCategory(foodName: string, description?: string): ProteinEstimation {
  // Try to identify the food category
  const category = identifyFoodCategory(foodName, description);
  
  if (category) {
    // Assume a standard portion size of about 100g
    return {
      estimatedProtein: category.proteinEstimate,
      confidence: category.confidence
    };
  }
  
  // Default estimation if no category is identified
  return {
    estimatedProtein: 5, // Conservative default protein estimate
    confidence: "low"
  };
}

/**
 * Gets protein content for a food item using the API Ninjas nutrition endpoint
 * 
 * This function sends the food name to the API Ninjas nutrition endpoint and
 * returns the protein content along with a confidence level based on the match quality
 */
export async function estimateProteinContent(foodName: string, description?: string, nutritionData?: {
  calories?: number;
  totalFat?: number;
  totalCarbs?: number;
}): Promise<ProteinEstimation> {
  try {
    // If we already have nutrition data, use the fallback calculation
    if (nutritionData?.calories) {
      return estimateProteinContentFromMacros(foodName, description, nutritionData);
    }
    
    try {
      // Use the getNutritionData function which already handles the API key properly
      const nutritionInfo = await getNutritionData(foodName);
      
      if (nutritionInfo) {
        // Check if protein_g is a valid number and not a premium-only message
        const proteinValue = typeof nutritionInfo.protein_g === 'number' ? nutritionInfo.protein_g : null;
        if (proteinValue !== null) {
          return {
            estimatedProtein: proteinValue,
            confidence: "high" // Direct API data is considered high confidence
          };
        }
        // If protein_g is not available (premium-only), continue to fallback methods
        console.log("Protein data is premium-only - using fallback estimation");
      }
      // If nutritionInfo is null but no error was thrown, continue to fallback methods
      console.log("No nutrition data found for", foodName, "- using fallback estimation");
    } catch (apiError) {
      console.error("API error in nutrition data fetch:", apiError);
      // Continue to fallback methods
    }
    
    // If no data found or API error, fall back to estimation from macros if available
    if (nutritionData?.calories) {
      return estimateProteinContentFromMacros(foodName, description, nutritionData);
    }
    
    // Fall back to food category recognition
    return estimateProteinByFoodCategory(foodName, description);
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    // Fall back to estimation from macros if available
    if (nutritionData?.calories) {
      return estimateProteinContentFromMacros(foodName, description, nutritionData);
    }
    
    // Try food category recognition as a last resort
    return estimateProteinByFoodCategory(foodName, description);
  }
}

/**
 * Estimates protein content based on macronutrient data using nutritional science principles.
 * 
 * This function uses the following approach:
 * 1. If calories are available, protein is estimated as 15% of total calories (divided by 4)
 *    since protein contains 4 calories per gram and typically doesn't exceed 15% of total calories
 * 2. If fat and carbs are available but protein is missing, protein is estimated using the
 *    remaining calories after accounting for fat (9 cal/g) and carbs (4 cal/g)
 * 3. Confidence level is determined by the estimation method used
 */
export async function estimateProteinContentFromMacros(foodName: string, description?: string, nutritionData?: {
  calories?: number;
  totalFat?: number;
  totalCarbs?: number;
}): Promise<ProteinEstimation> {
  try {
    // Extract nutrition data from description if provided in a structured format
    const calories = nutritionData?.calories || 0;
    const totalFat = nutritionData?.totalFat || 0;
    const totalCarbs = nutritionData?.totalCarbs || 0;
    
    let estimatedProtein = 0;
    let confidence: "high" | "medium" | "low" = "low";
    
    // Primary Method: Calculate protein from remaining calories after accounting for fats and carbs
    if (calories > 0) {
      // Calculate calories from known macros
      const fatCalories = totalFat * 9; // Fat provides 9 calories per gram
      const carbCalories = totalCarbs * 4; // Carbs provide 4 calories per gram
      
      // Calculate remaining calories that could be from protein
      const remainingCalories = calories - fatCalories - carbCalories;
      
      if (remainingCalories > 0) {
        // Convert remaining calories to protein grams (4 calories per gram of protein)
        estimatedProtein = Math.round(remainingCalories / 4);
        
        // Set confidence based on data quality
        confidence = totalFat > 0 && totalCarbs > 0 ? "high" : "medium";
        
        // Apply reasonable limits based on total calories
        const maxProtein = Math.round(calories * 0.4 / 4); // Max 40% of calories from protein
        estimatedProtein = Math.min(estimatedProtein, maxProtein);
      }
    }
    
    // Ensure we don't return negative values
    estimatedProtein = Math.max(0, estimatedProtein);
    
    // If the caloric differential method produced zero or very low protein,
    // try the food category estimation as a fallback
    if (estimatedProtein <= 1) {
      const categoryEstimation = estimateProteinByFoodCategory(foodName, description);
      
      // Only use category estimation if it has a medium or high confidence
      if (categoryEstimation.confidence !== "low") {
        return categoryEstimation;
      }
    }
    
    // Final check: For very low calorie items with zero protein, ensure a minimum protein value based on food type
    if (estimatedProtein === 0) {
      const categoryCheck = identifyFoodCategory(foodName, description);
      if (categoryCheck) {
        // Use a conservative estimate
        estimatedProtein = Math.max(1, Math.round(categoryCheck.proteinEstimate * 0.3));
        confidence = "low";
      }
    }
    
    return {
      estimatedProtein,
      confidence
    };
  } catch (error) {
    console.error("Error estimating protein content:", error);
    // Try food category recognition as a last resort
    return estimateProteinByFoodCategory(foodName, description);
  }
}

// Export the food category functions for possible reuse
export {
  identifyFoodCategory,
  estimateProteinByFoodCategory,
  type FoodCategory
};

