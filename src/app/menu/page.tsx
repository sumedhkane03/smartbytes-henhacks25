"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MenuItem from "@/src/components/MenuItem";
import { getDetailedMenuItems } from "@/src/functions/menu_items";
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

        // Filter out items with "sauce" in their name
        const filteredItems: MenuItemType[] = items.filter(
          (item: MenuItemType) => !item.name.toLowerCase().includes("sauce")
        );

        setMenuItems(filteredItems);
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
      return `/images/${formattedRestaurant}/${formattedItem}.png`; // ✅ Uses restaurant-specific image
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
          menuItems
            .slice(0, 10)
            .map((item, index) => (
              <MenuItem
                key={index}
                name={item.name}
                calories={`${Math.round(item.nutrition.calories)} cal`}
                image={getItemImage(item.name, restaurantName)}
              />
            ))
        )}
      </section>

      {/* Sort By */}
      <div className="sort-by">
        <span>Sort by</span>
        <span className="arrow">→</span>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
