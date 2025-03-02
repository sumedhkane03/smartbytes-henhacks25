"use client";
import React, { useState } from "react";
import Image from "next/image";
import burgerImage from "/images/burger.png";

const restaurants = [
  {
    id: 1,
    name: "Noodles & Company",
    rating: 4.5,
    distance: "1.2 mi",
    image: "/images/noodles.png", // Make sure these images exist in /public/images/
  },
  {
    id: 2,
    name: "McDonald's",
    rating: 4.8,
    distance: "0.8 mi",
    image: "/images/McD.png",
  },
  {
    id: 3,
    name: "Pizza Hut",
    rating: 4.2,
    distance: "1.5 mi",
    image: "/images/pizza.png",
  },
  {
    id: 4,
    name: "Burger Joint",
    rating: 4.0,
    distance: "2.0 mi",
    image: "/images/burger.png",
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh", 
      backgroundColor: "#fff", 
      maxWidth: "100%",  
      width: "100%", 
      margin: "auto", 
      padding: "0",
    }}>
      
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "16px 20px", 
        borderBottom: "1px solid #ddd", 
        backgroundColor: "#f8f8f8" 
      }}>
        <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>Search</h1>
        <button style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>⚙️</button>
      </div>

      {/* Search Bar */}
      <div style={{ padding: "16px 20px" }}>
        <input
          type="text"
          placeholder="Search restaurants, cuisines, dishes..."
          style={{ 
            width: "100%", 
            padding: "12px", 
            borderRadius: "8px", 
            border: "1px solid #ccc", 
            fontSize: "16px" 
          }}
        />
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid #ddd" }}>
        <button
          style={{
            flex: 1,
            padding: "12px",
            textAlign: "center",
            fontWeight: activeTab === "list" ? "bold" : "normal",
            borderBottom: activeTab === "list" ? "3px solid black" : "none",
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer"
          }}
          onClick={() => setActiveTab("list")}
        >
          List View
        </button>
        <button
          style={{
            flex: 1,
            padding: "12px",
            textAlign: "center",
            fontWeight: activeTab === "map" ? "bold" : "normal",
            borderBottom: activeTab === "map" ? "3px solid black" : "none",
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer"
          }}
          onClick={() => setActiveTab("map")}
        >
          Map View
        </button>
      </div>

      {/* Restaurant List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        {restaurants.map((restaurant) => (
          <div 
            key={restaurant.id} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              padding: "16px", 
              borderRadius: "12px", 
              border: "1px solid #ddd", 
              marginBottom: "16px", 
              backgroundColor: "#fff", 
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", 
              transition: "transform 0.2s", 
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Image src={restaurant.image} alt={restaurant.name} width={60} height={60} style={{ borderRadius: "8px" }} />
              <div style={{ marginLeft: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{restaurant.name}</h2>
                <p style={{ fontSize: "14px", color: "#666" }}>⭐ {restaurant.rating} • {restaurant.distance}</p>
              </div>
            </div>
            <button style={{ 
              backgroundColor: "#6B8F80", 
              padding: "10px 20px", 
              borderRadius: "8px", 
              border: "none", 
              fontSize: "14px", 
              color: "#fff", 
              cursor: "pointer",
              transition: "0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#085E3E"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0B6E4F"}
            >
              Order
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-around", 
        padding: "16px", 
        borderTop: "1px solid #ddd", 
        backgroundColor: "#fff"
      }}>
        <button style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "16px", cursor: "pointer", color: "black", fontWeight: "bold" }}>
          🔍<span style={{ fontSize: "14px" }}>Explore</span>
        </button>
        <button style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "16px", cursor: "pointer", color: "#666" }}>
          👤<span style={{ fontSize: "14px" }}>Account</span>
        </button>
        <button style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "16px", cursor: "pointer", color: "#666" }}>
          ➕<span style={{ fontSize: "14px" }}>More</span>
        </button>
      </div>
    </div>
  );
}
