"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MenuItem from "@/src/components/MenuItem";
import { getDetailedMenuItems } from "@/src/functions/menu_items";
import { calculateMealCalories, calculateTargetMacros } from "@/src/functions/calories";
import "./page.css";

// Default images for fallback
import burgerImage from "@/public/images/burger.png";
import chickenImage from "@/public/images/chicken.jpg";
import friesImage from "@/public/images/fries.png";

interface MenuItemType {
  name: string;
  brandName: string;
  servingSize: number;
  servingUnit: string;
  nutrition: {
    calories: number;
    totalFat: number;
    saturatedFat: number;
    cholesterol: number;
    sodium: number;
    totalCarbs: number;
    dietaryFiber: number;
    sugars: number;
    protein: number;
    potassium: number;
    calcium: number;
    iron: number;
  };
}

type SortOption = "default" | "calories-low-high" | "calories-high-low" | "protein-high" | "meal-appropriate";
type MealTime = "breakfast" | "lunch" | "dinner";
type FitnessGoal = "lose weight" | "gain muscle" | "balanced";

export default function RestaurantMenu() {
  const searchParams = useSearchParams();
  const restaurantName = searchParams.get("name") || "";
  const restaurantId = searchParams.get("id") || "";
  
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [mealTime, setMealTime] = useState<MealTime>("lunch");
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>("balanced");

  // Mock user data (in a real app, this would come from user profile)
  const userProfile = {
    targetCalories: 2000, // Default value
    weight: 70, // kg
  };

  useEffect(() => {
    async function fetchMenuItems() {
      if (!restaurantName) {
        setError("Restaurant name is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const items = await getDetailedMenuItems(restaurantName);
        setMenuItems(items);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setError("Failed to load menu items. Please try again later.");
        setLoading(false);
      }
    }

    fetchMenuItems();
  }, [restaurantName]);

  // Function to get appropriate image based on item name (simple matching)
  const getItemImage = (itemName: string) => {
    const lowerName = itemName.toLowerCase();
    if (lowerName.includes("burger") || lowerName.includes("sandwich")) {
      return burgerImage;
    } else if (lowerName.includes("chicken") || lowerName.includes("nugget")) {
      return chickenImage;
    } else if (lowerName.includes("fries") || lowerName.includes("potato")) {
      return friesImage;
    }
    // Default image
    return burgerImage;
  };

  // Sort menu items based on selected option
  const getSortedMenuItems = () => {
    if (!menuItems.length) return [];
    
    let sortedItems = [...menuItems];
    
    switch (sortOption) {
      case "calories-low-high":
        return sortedItems.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
      
      case "calories-high-low":
        return sortedItems.sort((a, b) => b.nutrition.calories - a.nutrition.calories);
      
      case "protein-high":
        return sortedItems.sort((a, b) => b.nutrition.protein - a.nutrition.protein);
      
      case "meal-appropriate":
        // Calculate target calories for the current meal time
        const { targetCalories } = calculateTargetMacros(
          userProfile.targetCalories,
          fitnessGoal,
          userProfile.weight
        );
        
        const mealTargetCalories = calculateMealCalories(targetCalories, mealTime);
        
        // Sort by how close items are to the target meal calories
        return sortedItems.sort((a, b) => {
          const aDiff = Math.abs(a.nutrition.calories - mealTargetCalories);
          const bDiff = Math.abs(b.nutrition.calories - mealTargetCalories);
          return aDiff - bDiff;
        });
      
      default:
        return sortedItems;
    }
  };

  // Handle sort option change
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  // Handle meal time change
  const handleMealTimeChange = (time: MealTime) => {
    setMealTime(time);
    // If meal-appropriate sorting is selected, this will trigger a re-sort
    if (sortOption === "meal-appropriate") {
      setSortOption("meal-appropriate");
    }
  };

  // Handle fitness goal change
  const handleGoalChange = (goal: FitnessGoal) => {
    setFitnessGoal(goal);
    // If meal-appropriate sorting is selected, this will trigger a re-sort
    if (sortOption === "meal-appropriate") {
      setSortOption("meal-appropriate");
    }
  };

  const sortedItems = getSortedMenuItems();

  return (
    <div className="menu-container">
      <header className="menu-header">{decodeURIComponent(restaurantName)}</header>

      {/* Sort options */}
      <div className="sort-options">
        <div className="meal-time-selector">
          <span>Meal: </span>
          <select 
            value={mealTime} 
            onChange={(e) => handleMealTimeChange(e.target.value as MealTime)}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>

        <div className="goal-selector">
          <span>Goal: </span>
          <select 
            value={fitnessGoal} 
            onChange={(e) => handleGoalChange(e.target.value as FitnessGoal)}
          >
            <option value="lose weight">Lose Weight</option>
            <option value="gain muscle">Gain Muscle</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>

        <div className="sort-by" onClick={() => {
          // Cycle through sort options
          const options: SortOption[] = ["default", "calories-low-high", "calories-high-low", "protein-high", "meal-appropriate"];
          const currentIndex = options.indexOf(sortOption);
          const nextIndex = (currentIndex + 1) % options.length;
          handleSortChange(options[nextIndex]);
        }}>
          <span>Sort by: {sortOption.replace(/-/g, ' ')}</span>
          <span className="arrow">→</span>
        </div>
      </div>

      <section className="recommended-section">
        <h2 className="recommended-title">Menu Items</h2>

        {loading ? (
          <div className="loading">Loading menu items...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : sortedItems.length === 0 ? (
          <div className="no-items">No menu items found for this restaurant.</div>
        ) : (
          sortedItems.slice(0, 10).map((item, index) => (
            <MenuItem
              key={index}
              name={item.name}
              calories={`${Math.round(item.nutrition.calories)} cal`}
              image={getItemImage(item.name)}
            />
          ))
        )}
      </section>
    </div>
  );
}
