"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Card from "../../components/card";
import { searchNearbyRestaurants } from "@/src/functions/menu_items";
import "./page.css";

// We'll continue to use the default images for now
import mcdBanner from "@/public/images/mcdonalds-banner.jpeg";
import mcdLogo from "@/public/images/mcdonalds-logo.png";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Default location (fallback)
  const defaultLat = 38.984783;
  const defaultLng = -77.113892;

  useEffect(() => {
    async function fetchNearbyRestaurants() {
      try {
        setLoading(true);
        const searchRadius = 16093; // 10 miles in meters
        const resultLimit = 15;
        let restaurantsData;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              restaurantsData = await searchNearbyRestaurants(
                // defaultLat,
                // defaultLng,
                latitude,
                longitude,
                searchRadius,
                resultLimit
              );
              setRestaurants(restaurantsData);
              setLoading(false);
            },
            async (error) => {
              console.error("Geolocation error:", error);
              restaurantsData = await searchNearbyRestaurants(
                defaultLat,
                defaultLng,
                searchRadius,
                resultLimit
              );
              setRestaurants(restaurantsData);
              setLoading(false);
            }
          );
        } else {
          restaurantsData = await searchNearbyRestaurants(
            defaultLat,
            defaultLng,
            searchRadius,
            resultLimit
          );
          setRestaurants(restaurantsData);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setError("Failed to load restaurants. Please try again later.");
        setLoading(false);
      }
    }
    fetchNearbyRestaurants();
  }, []);

  interface Restaurant {
    place_id: string;
    name: string;
    address?: string;
    logo?: string;
  }

  const handleCardClick = (restaurant: Restaurant) => {
    const encodedName = encodeURIComponent(restaurant.name);
    const encodedId = encodeURIComponent(restaurant.place_id);
    router.push(`/menu?name=${encodedName}&id=${encodedId}`);
  };

  // Filter restaurants by search query
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.address &&
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="page-container">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <Input
            variant="unstyled"
            placeholder="Enter a restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid #ddd",
        }}
      >
        <button
          style={{
            width: "150px",
            padding: "12px",
            textAlign: "center",
            fontWeight: activeTab === "list" ? "bold" : "normal",
            borderBottom: activeTab === "list" ? "3px solid black" : "none",
            background: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("list")}
        >
          List
        </button>
        <button
          style={{
            width: "150px",
            padding: "12px",
            textAlign: "center",
            fontWeight: activeTab === "map" ? "bold" : "normal",
            borderBottom: activeTab === "map" ? "3px solid black" : "none",
            background: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("map")}
        >
          Map
        </button>
      </div>

      {/* Scrollable Card Container */}
      <div className="cards-container">
        {loading ? (
          <div className="loading-container">Loading nearby restaurants...</div>
        ) : error ? (
          <div className="error-container">{error}</div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="no-results">
            No restaurants found. Try a different search.
          </div>
        ) : (
          // Create a card for each restaurant returned (limit is set by API)
          filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.place_id}
              onClick={() => handleCardClick(restaurant)}
              className="card-link"
            >
              <Card
                backgroundImage={
                  restaurant.photo
                    ? restaurant.photo
                    : "https://placehold.co/600x150"
                }
                logoImage={"https://placehold.co/64"}
                text={restaurant.name}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
