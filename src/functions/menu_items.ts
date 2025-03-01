import axios from 'axios';


const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID // Free tier credentials
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

async function searchChainRestaurantItems(query: string) {
  try {
    const response = await axios.get('https://trackapi.nutritionix.com/v2/search/instant', {
      headers: {
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY
      },
      params: {
        query,
        branded: true
      }
    });
    
    return response.data.branded;
  } catch (error) {
    console.error('Error searching menu items:', error);
    throw error;
  }
}

async function searchNearbyRestaurants(lat: number, lng: number) {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius: '5000', // 5000 meters = ~3.1 miles
        type: 'restaurant',
        key: process.env.GOOGLE_MAPS_API_KEY,
      }
    });
    
    // Return only the top 10 restaurants
    const restaurants = response.data.results
      .slice(0, 10)
      .map((place: { name: any; vicinity: any; rating: any; place_id: any; geometry: { location: any; }; }) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        place_id: place.place_id,
        location: place.geometry.location
      }));
    
    return restaurants;
  } catch (error) {
    console.error('Error searching nearby restaurants:', error);
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
        batch.map(async (restaurant: { name: string; }) => {
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
      const validResults = results.filter(r => r !== null);
      restaurantsWithMenuData.push(...validResults);
      
      // Once we have enough restaurants, stop processing
      if (restaurantsWithMenuData.length >= 10) {
        break;
      }
    }
    
    return restaurantsWithMenuData.slice(0, 10);
  } catch (error) {
    console.error('Error finding restaurants with menu data:', error);
    throw error;
  }
}

// Export the functions
export {
  searchChainRestaurantItems,
  searchNearbyRestaurants,
  searchNearbyRestaurantsWithMenuData,
  getRestaurantMenuItems
};