"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MenuItem from "@/src/components/MenuItem";
import { displayMenuSortedByPreference, getUserSortPreference } from "@/src/functions/menu_items";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./page.css";
import BottomNav from "@/src/components/BottomNav";

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

export default function RestaurantMenu() {
  const searchParams = useSearchParams();
  const restaurantName = searchParams.get("name") || "";
  const restaurantId = searchParams.get("id") || "";

  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortPreference, setSortPreference] = useState<string>(""); // Will display to the user what sort is being used

  useEffect(() => {
    async function fetchMenuItems() {
      if (!restaurantName) {
        setError("Restaurant name is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get user's sort preference to display in the UI
        const userPref = await getUserSortPreference();
        const auth = getAuth();
        const user = auth.currentUser;
        let sortLabel = "";
        
        if (user?.email) {
          const db = getFirestore();
          const userRef = doc(db, 'users', user.email);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Set sort label based on user's fitness goal
            switch(userData.fitnessGoal) {
              case 'build-muscle':
                sortLabel = "Best for Muscle Gain (High Protein & Calories)";
                break;
              case 'lose-weight':
                sortLabel = "Best for Weight Loss (Lowest Calories)";
                break;
              case 'maintain':
                sortLabel = "Best for Maintenance (Highest Protein)";
                break;
              default:
                sortLabel = "Recommended Items";
            }
          }
        } else {
          sortLabel = "Recommended Items";
        }
        
        setSortPreference(sortLabel);
        
        // Get automatically sorted menu items based on user preferences
        const sortedItems = await displayMenuSortedByPreference(restaurantName);
        setMenuItems(sortedItems);
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
  const getItemImage = (itemName: string, restaurant: string) => {
    const formattedRestaurant = restaurant; // Normalize name
    const formattedItem = itemName; // Normalize item name

    if (
      formattedRestaurant === "Chick-fil-A" ||
      formattedRestaurant === "Wawa"
    ) {
      return `/images/${formattedRestaurant}/${formattedItem}.png`; // Uses restaurant-specific image
    }

    // Default fallback logic
    if (
      formattedItem.includes("burger") ||
      formattedItem.includes("sandwich")
    ) {
      return burgerImage;
    } else if (
      formattedItem.includes("chicken") ||
      formattedItem.includes("nugget")
    ) {
      return chickenImage;
    } else if (
      formattedItem.includes("fries") ||
      formattedItem.includes("potato")
    ) {
      return friesImage;
    }

    return burgerImage; // Default fallback image
  };

  return (
    <div className="menu-container">
      <header className="menu-header">
        {decodeURIComponent(restaurantName)}
      </header>

      <section className="recommended-section">
        <h2 className="recommended-title">Menu Items</h2>

        {loading ? (
          <div className="loading">Loading menu items...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : menuItems.length === 0 ? (
          <div className="no-items">
            No menu items found for this restaurant.
          </div>
        ) : (
          menuItems.map((item, index) => (
            <MenuItem
              key={index}
              name={item.name}
              calories={`${Math.round(item.nutrition.calories)} cal`}
              protein={Math.round(item.nutrition.protein)}
              image={getItemImage(item.name, restaurantName)}
            />
          ))
        )}
      </section>

      {/* Sort By Info */}
      {!loading && !error && menuItems.length > 0 && (
        <div className="sort-by">
          <span>Sorted by: {sortPreference}</span>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
