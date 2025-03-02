function calculateMaintenanceCalories(
    age: number,
    height: number, // in cm
    activityLevel: 1 | 2 | 3,
    weight: number, // in kg
    sex: 'male' | 'female'
): number {
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (sex === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Apply activity multiplier
    let activityMultiplier: number;
    switch (activityLevel) {
        case 1: // Less than 30 mins/day
            activityMultiplier = 1.2;
            break;
        case 2: // 30-60 mins per day
            activityMultiplier = 1.375;
            break;
        case 3: // More than 60 mins per day
            activityMultiplier = 1.55;
            break;
        default:
            throw new Error('Invalid activity level');
    }

    // Calculate total daily maintenance calories
    const maintenanceCalories = Math.round(bmr * activityMultiplier);
    
    return maintenanceCalories;
}


function calculateTargetMacros(
    maintenanceCalories: number,
    goal: 'gain muscle' | 'lose weight' | 'balanced',
    weight: number // in kg
): { targetCalories: number; targetProtein: number } {
    let calorieAdjustment: number;
    
    // Determine calorie adjustment based on goal
    switch (goal) {
        case 'gain muscle':
            calorieAdjustment = 1.1; // Caloric surplus
            break;
        case 'lose weight':
            calorieAdjustment = 0.75; // Caloric deficit
            break;
        case 'balanced':
            calorieAdjustment = 1; // Maintenance calories
            break;
        default:
            throw new Error('Invalid goal');
    }

    // Calculate target calories
    const targetCalories = Math.round(maintenanceCalories * calorieAdjustment);

    // Calculate target protein (in grams)
    // Using standard recommendations:
    // - Muscle gain: 2.2g per kg
    // - Weight loss: 2.0g per kg
    // - Balanced: 1.8g per kg
    let proteinMultiplier: number;
    switch (goal) {
        case 'gain muscle':
            proteinMultiplier = 2.2;
            break;
        case 'lose weight':
            proteinMultiplier = 2.0;
            break;
        case 'balanced':
            proteinMultiplier = 1.8;
            break;
        default:
            throw new Error('Invalid goal');
    }

    const targetProtein = Math.round(weight * proteinMultiplier);

    return {
        targetCalories,
        targetProtein
    };
}

function calculateMealCalories(
    targetCalories: number,
    timeOfDay: string
): number {
    switch (timeOfDay.toLowerCase()) {
        case 'breakfast':
            return Math.round(targetCalories * 0.2); // 20% of daily calories
        case 'lunch':
            return Math.round(targetCalories * 0.3); // 30% of daily calories
        case 'dinner':
            return Math.round(targetCalories * 0.5); // 50% of daily calories
        default:
            throw new Error('Invalid time of day. Must be breakfast, lunch, or dinner');
    }
}

function calculateBMI(weight: number, height: number): number {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

function isDessertItem(itemName: string, restaurantName: string): boolean {
    const dessertKeywords = ['ice cream', 'icedream', 'sundae', 'cookie', 'brownie', 'cake', 'pie', 'shake', 'dessert'];
    const lowercaseItem = itemName.toLowerCase();
    
    // Restaurant-specific dessert items
    if (restaurantName.toLowerCase().includes('chick-fil-a')) {
        return lowercaseItem.includes('icedream') || 
               lowercaseItem.includes('milkshake') ||
               lowercaseItem.includes('frosted') ||
               lowercaseItem.includes('cookie');
    }
    
    if (restaurantName.toLowerCase().includes('wawa')) {
        return lowercaseItem.includes('cookie') ||
               lowercaseItem.includes('muffin') ||
               lowercaseItem.includes('donut') ||
               lowercaseItem.includes('pastry') ||
               lowercaseItem.includes('brownie');
    }
    
    // Generic dessert check
    return dessertKeywords.some(keyword => lowercaseItem.includes(keyword));
}

function shouldRecommendDesserts(age: number, bmi: number): boolean {
    // Don't recommend desserts for people over 30 or with high BMI
    if (age > 30) {
        return false;
    }
    
    // BMI categories
    // Underweight: < 18.5
    // Normal: 18.5 - 24.9
    // Overweight: 25 - 29.9
    // Obese: >= 30
    return bmi < 25; // Only recommend desserts for normal/underweight BMI
}

export {
    calculateMaintenanceCalories,
    calculateTargetMacros,
    calculateMealCalories,
    calculateBMI,
    isDessertItem,
    shouldRecommendDesserts
};