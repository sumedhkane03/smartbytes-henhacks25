import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const NUTRITIONIX_APP_ID = "dc0fb789"; // Free tier credentials
const NUTRITIONIX_API_KEY = "0a27a9677acb1c0ce093977f5bdd4a84";
const FOURSQUARE_API_KEY = "fsq36whsfdO2LDesKgMq6CkdtynVq+mQpAQRFBcTohxkoQ4=";

async function searchChainRestaurantItems(query: string) {
  try {
    const response = await axios.get(
      "https://trackapi.nutritionix.com/v2/search/instant",
      {
        headers: {
          "x-app-id": NUTRITIONIX_APP_ID,
          "x-app-key": NUTRITIONIX_API_KEY,
        },
        params: {
          query,
          branded: true,
        },
      }
    );

    return response.data.branded;
  } catch (error) {
    console.error("Error searching menu items:", error);
    throw error;
  }
}
/**
 * Fetches photos for a restaurant using its Foursquare ID
 */
async function getRestaurantPhotos(fsq_id: string) {
  try {
    const response = await axios.get(
      `https://api.foursquare.com/v3/places/${fsq_id}/photos`,
      {
        headers: {
          Authorization: FOURSQUARE_API_KEY || "",
          accept: "application/json",
        },
        params: {
          limit: 1,
          sort: "popular",
          classifications: "outdoor",
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const photo = response.data[0];
      // Construct the photo URL according to Foursquare format
      const photoUrl = `${photo.prefix}original${photo.suffix}`;
      return photoUrl;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching photos for restaurant ${fsq_id}:`, error);
    return null;
  }
}

async function searchNearbyRestaurants(
  lat: number,
  lng: number,
  radius: number = 16093,
  limit: number = 25
) {
  try {
    const response = await axios.get(
      `https://api.foursquare.com/v3/places/search`,
      {
        headers: {
          Authorization: FOURSQUARE_API_KEY || "",
        },
        params: {
          ll: `${lat},${lng}`,
          radius, // Radius in meters (16093m = 10 miles)
          categories: "13065", // Restaurant category ID
          limit, // Maximum number of results
        },
      }
    );

    // Map Foursquare response to match existing format
    const restaurants = response.data.results.map((place: any) => ({
      name: place.name,
      address: place.location.address || place.location.formatted_address,
      rating: place.rating || null,
      place_id: place.fsq_id,
      location: {
        lat: place.geocodes.main.latitude,
        lng: place.geocodes.main.longitude,
      },
    }));

    // Fetch photos for each restaurant
    const restaurantsWithPhotos = await Promise.all(
      restaurants.map(async (restaurant: any) => {
        try {
          const photoUrl = await getRestaurantPhotos(restaurant.place_id);
          return {
            ...restaurant,
            photo: photoUrl, // Add the photo URL to the restaurant object
          };
        } catch (error) {
          console.error(`Error getting photo for ${restaurant.name}:`, error);
          return restaurant; // Return restaurant without photo on error
        }
      })
    );

    return restaurantsWithPhotos;
  } catch (error) {
    console.error("Error searching nearby restaurants:", error);
    throw error;
  }
}

/**
 * Gets menu items for a specific restaurant
 */
async function getRestaurantMenuItems(restaurantName: string) {
  try {
    return await searchChainRestaurantItems(restaurantName);
  } catch (error) {
    console.error(`Error getting menu items for ${restaurantName}:`, error);
    throw error;
  }
}

/**
 * Searches for nearby restaurants and filters to only those with menu data in Nutritionix
 */
async function searchNearbyRestaurantsWithMenuData(lat: number, lng: number) {
  try {
    // Get nearby restaurants from Google Places API
    const allRestaurants = await searchNearbyRestaurants(lat, lng);

    // Check which restaurants have data in Nutritionix - process in batches of 5
    const restaurantsWithMenuData = [];

    for (let i = 0; i < allRestaurants.length; i += 5) {
      const batch = allRestaurants.slice(i, i + 5);

      const results = await Promise.all(
        batch.map(async (restaurant: { name: string }) => {
          try {
            const menuItems = await searchChainRestaurantItems(restaurant.name);
            if (menuItems && menuItems.length > 0) {
              return { ...restaurant, hasMenuData: true };
            }
            return null;
          } catch (error) {
            return null;
          }
        })
      );

      // Add valid results to our output array
      const validResults = results.filter((r) => r !== null);
      restaurantsWithMenuData.push(...validResults);

      // Once we have enough restaurants, stop processing
      if (restaurantsWithMenuData.length >= 10) {
        break;
      }
    }

    return restaurantsWithMenuData.slice(0, 10);
  } catch (error) {
    console.error("Error finding restaurants with menu data:", error);
    throw error;
  }
}

/**
 * Gets menu items for a specific restaurant sorted by calories or protein
 */
async function getRestaurantMenuItemsSorted(
  restaurantName: string,
  sortBy: "calories" | "protein" = "calories"
) {
  try {
    const menuItems = await searchChainRestaurantItems(restaurantName);

    // Sort items based on specified nutrient
    return menuItems.sort((a: any, b: any) => {
      const aValue =
        sortBy === "calories" ? a.nf_calories || 0 : a.nf_protein || 0;
      const bValue =
        sortBy === "protein" ? b.nf_calories || 0 : b.nf_protein || 0;
      return bValue - aValue; // Sort in descending order
    });
  } catch (error) {
    console.error(
      `Error getting sorted menu items for ${restaurantName}:`,
      error
    );
    throw error;
  }
}

/**
 * Gets detailed nutritional information for menu items
 */
async function getDetailedMenuItems(restaurantName: string) {
  try {
    const menuItems = await searchChainRestaurantItems(restaurantName);

    return menuItems.map((item: any) => ({
      name: item.food_name,
      brandName: item.brand_name,
      servingSize: item.serving_qty,
      servingUnit: item.serving_unit,
      nutrition: {
        calories: item.nf_calories || 0,
        totalFat: item.nf_total_fat || 0,
        saturatedFat: item.nf_saturated_fat || 0,
        cholesterol: item.nf_cholesterol || 0,
        sodium: item.nf_sodium || 0,
        totalCarbs: item.nf_total_carbohydrate || 0,
        dietaryFiber: item.nf_dietary_fiber || 0,
        sugars: item.nf_sugars || 0,
        protein: item.nf_protein || 0,
        potassium: item.nf_potassium || 0,
        calcium: item.nf_calcium_dv || 0,
        iron: item.nf_iron_dv || 0,
      },
    }));
  } catch (error) {
    console.error(
      `Error getting detailed menu items for ${restaurantName}:`,
      error
    );
    throw error;
  }
}

// Update exports
export {
  searchChainRestaurantItems,
  searchNearbyRestaurants,
  searchNearbyRestaurantsWithMenuData,
  getRestaurantMenuItems,
  getRestaurantMenuItemsSorted,
  getDetailedMenuItems,
};
