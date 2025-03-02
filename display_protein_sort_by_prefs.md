# Display Menu Items with Nutrition Info and Custom Sorting

## Task Description
Create a function or module that can:
1. Display menu items with their calories and protein content
2. Sort these items based on user preferences (e.g., lowest calories, highest protein, protein-to-calorie ratio)

## Requirements
- Parse menu items with their nutritional information
- Display each item with at least calories and protein count
- Implement sorting functionality based on different criteria:
    - Sort by lowest to highest calories
    - Sort by highest to lowest protein
    - Sort by protein-to-calorie ratio (for those optimizing protein intake)
    - Any other relevant nutrition metrics

## Function Signature Example
```python
def display_menu_sorted_by_preference(menu_items, sort_preference='calories_asc'):
        """
        Display menu items sorted according to user preference
        
        Parameters:
                menu_items: List of dictionaries containing menu items with nutrition info
                sort_preference: String indicating sort preference 
                                                 ('calories_asc', 'calories_desc', 'protein_desc', 'protein_ratio_desc', etc.)
        
        Returns:
                Sorted list of menu items
        """
        # Implementation here
```

## Sample Data Structure
```python
menu_items = [
        {"name": "Chicken Salad", "calories": 350, "protein": 25, "other_nutrition": {...}},
        {"name": "Veggie Burger", "calories": 480, "protein": 15, "other_nutrition": {...}},
        # More items...
]
```

## Considerations
- Handle cases where nutrition information might be missing
- Provide clear user interface for selecting sort preferences
- Consider implementing filters (e.g., vegetarian, under 500 calories)
- Allow for easy extension to sort by other nutrition metrics