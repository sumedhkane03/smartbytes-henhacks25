import React, { useState } from "react";
import MenuItem from "./MenuItem";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
}

interface FoodItemListProps {
  items: FoodItem[];
  onBuy?: (item: FoodItem) => void;
}

export const FoodItemList: React.FC<FoodItemListProps> = ({ items, onBuy }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <div className='space-y-4'>
      {items.map((item) => (
        <FoodItemCard
          key={item.id}
          name={item.name}
          calories={item.calories}
          protein={item.protein}
          isFavorite={favorites.has(item.id)}
          onFavorite={() => toggleFavorite(item.id)}
          onBuy={() => onBuy?.(item)}
        />
      ))}

      <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
        <h3 className='font-medium text-lg mb-2'>
          Protein Confidence Indicators
        </h3>
        <p className='text-gray-700'>High confidence - Directly from API</p>
        <p className='text-gray-700'>
          Medium confidence - Calculated from macros
        </p>
        <p className='text-gray-700'>
          Low confidence - Estimated from food type
        </p>
      </div>
    </div>
  );
};
