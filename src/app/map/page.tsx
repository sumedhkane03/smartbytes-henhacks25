"use client";

import React, { useState } from "react";
import { Input } from "@chakra-ui/input";
import { useRouter } from "next/navigation";
import Card from "../../components/card"; // adjust path if necessary
import "./page.css";

export default function SimpleSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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

      {/* Toggle Container */}
      <div className="toggle-container">
        <button
          className="toggle-button active"
          onClick={() => router.push("/dashboard")}
        >
          List View
        </button>
        <button className="toggle-button" onClick={() => router.push("/map")}>
          Map View
        </button>
      </div>
    </div>
  );
}
