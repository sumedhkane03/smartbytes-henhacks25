// filepath: /Users/sumedh/Desktop/smartbytes-henhacks25/src/components/SortedMenuDisplay.tsx
import React, { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import { displayMenuSortedByPreference, SortOption } from "../functions/menu_items";
import foodImage from "../../public/images/foodImage.png"; // Default image

// Define component props
interface SortedMenuDisplayProps {
  restaurantName: string;
  initialSortPreference?: SortOption;
}

// Define the menu item interface for type safety
interface MenuItemType {
  name: string;
  restaurant: string;
  calories: number;
  protein: number;
  proteinRatio: number;
  proteinConfidence: "high" | "medium" | "low";
  servingSize: string;
  photo: string | null;
}

export default function SortedMenuDisplay({
  restaurantName,
  initialSortPreference = "calories_asc",
}: SortedMenuDisplayProps) {
  // State for menu items and current sort preference
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [sortPreference, setSortPreference] = useState<SortOption>(initialSortPreference);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [maxCalories, setMaxCalories] = useState<number | undefined>(undefined);
  const [minProtein, setMinProtein] = useState<number | undefined>(undefined);
  const [vegetarian, setVegetarian] = useState<boolean>(false);
  
  // Load menu items when component mounts or dependencies change
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Apply filters if set
        const filters = {
          ...(maxCalories ? { maxCalories } : {}),
          ...(minProtein ? { minProtein } : {}),
          ...(vegetarian ? { vegetarian } : {}),
        };
        
        // Fetch sorted menu items
        const items = await displayMenuSortedByPreference(
          restaurantName,
          sortPreference,
          Object.keys(filters).length > 0 ? filters : undefined
        );
        
        setMenuItems(items);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setError("Failed to load menu items. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, [restaurantName, sortPreference, maxCalories, minProtein, vegetarian]);
  
  // Sort options for the dropdown
  const sortOptions = [
    { label: "Lowest Calories", value: "calories_asc" },
    { label: "Highest Calories", value: "calories_desc" },
    { label: "Lowest Protein", value: "protein_asc" },
    { label: "Highest Protein", value: "protein_desc" },
    { label: "Lowest Protein-to-Calorie Ratio", value: "protein_ratio_asc" },
    { label: "Highest Protein-to-Calorie Ratio", value: "protein_ratio_desc" },
  ];
  
  // Handle sort preference change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortPreference(e.target.value as SortOption);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setMaxCalories(undefined);
    setMinProtein(undefined);
    setVegetarian(false);
  };

  return (
    <div className="sorted-menu-container">
      <h2>{restaurantName} Menu</h2>
      
      {/* Sorting and filtering options */}
      <div className="menu-controls">
        <div className="sort-section">
          <label htmlFor="sort-preference">Sort by:</label>
          <select
            id="sort-preference"
            value={sortPreference}
            onChange={handleSortChange}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-section">
          <h3>Filters</h3>
          
          <div className="filter-item">
            <label htmlFor="max-calories">Max Calories:</label>
            <input
              type="number"
              id="max-calories"
              value={maxCalories || ""}
              onChange={(e) => setMaxCalories(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="No limit"
            />
          </div>
          
          <div className="filter-item">
            <label htmlFor="min-protein">Min Protein (g):</label>
            <input
              type="number"
              id="min-protein"
              value={minProtein || ""}
              onChange={(e) => setMinProtein(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="No minimum"
            />
          </div>
          
          <div className="filter-item">
            <label>
              <input
                type="checkbox"
                checked={vegetarian}
                onChange={(e) => setVegetarian(e.target.checked)}
              />
              Vegetarian
            </label>
          </div>
          
          <button onClick={resetFilters} className="reset-filters">
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && <div className="loading">Loading menu items...</div>}
      
      {/* Error state */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Menu items display */}
      {!loading && !error && (
        <div className="menu-items-grid">
          {menuItems.length > 0 ? (
            menuItems.map((item, index) => (
              <MenuItem
                key={`${item.name}-${index}`}
                name={item.name}
                calories={item.calories}
                protein={item.protein}
                proteinRatio={item.proteinRatio}
                proteinConfidence={item.proteinConfidence}
                image={item.photo || foodImage}
              />
            ))
          ) : (
            <div className="no-items">No menu items found matching your criteria.</div>
          )}
        </div>
      )}
      
      {/* Legend for protein confidence indicators */}
      <div className="confidence-legend">
        <h4>Protein Confidence Indicators</h4>
        <div className="legend-item">
          <span className="indicator" style={{ backgroundColor: "green" }}></span>
          <span>High confidence - Directly from API</span>
        </div>
        <div className="legend-item">
          <span className="indicator" style={{ backgroundColor: "orange" }}></span>
          <span>Medium confidence - Calculated from macros</span>
        </div>
        <div className="legend-item">
          <span className="indicator" style={{ backgroundColor: "red" }}></span>
          <span>Low confidence - Estimated from food type</span>
        </div>
      </div>
    </div>
  );
}