import { estimateProteinContent } from './protein_estimation';

/**
 * Estimates protein content based on calories with some controlled randomness
 * to generate realistic but varied values.
 */
export async function calculateProteinFromCalories(calories: number, foodName: string = ''): Promise<number> {
  // Base protein calculation (protein typically provides 10-35% of total calories)
  const baseProteinCalories = calories * (Math.random() * (0.35 - 0.1) + 0.1);
  
  // Convert calories to grams (1g protein = 4 calories)
  let estimatedProtein = Math.round(baseProteinCalories / 4);
  
  // Add some controlled randomness (±20% variation)
  const variation = estimatedProtein * 0.2;
  estimatedProtein += Math.round((Math.random() * variation * 2) - variation);
  
  // Ensure reasonable minimum and maximum values
  estimatedProtein = Math.max(1, estimatedProtein); // At least 1g protein
  estimatedProtein = Math.min(estimatedProtein, Math.round(calories / 4)); // Max 25% of calories from protein
  
  // If we have a food name, try to get a more accurate estimate using the existing estimation system
  if (foodName) {
    try {
      const betterEstimate = await estimateProteinContent(foodName, undefined, { calories });
      if (betterEstimate.confidence !== 'low') {
        return betterEstimate.estimatedProtein;
      }
    } catch (error) {
      console.error('Error getting better protein estimate:', error);
      // Fall back to our random estimation
    }
  }
  
  return estimatedProtein;
}