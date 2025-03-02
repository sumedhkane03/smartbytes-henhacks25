"use client";

import React from "react";
import Image from "next/image";
import MenuItem from "@/src/components/MenuItem"; // import the new component
import "./page.css";

import burgerImage from "@/public/images/burger.png";
import chickenImage from "@/public/images/chicken.jpg";
import friesImage from "@/public/images/fries.png";

export default function ShakeShackMenu() {
  return (
    <div className="menu-container">
      <header className="menu-header">Shake Shack</header>

      <section className="recommended-section">
        <h2 className="recommended-title">Recommended for you</h2>

        {/* Menu Items */}
        <MenuItem
          name="Double SmokeShack"
          calories="1,080 cal"
          image={burgerImage}
        />

        <MenuItem
          name="Chicken Bites"
          calories="320 cal"
          image={chickenImage}
        />

        <MenuItem name="Cheese Fries" calories="840 cal" image={friesImage} />
      </section>

      {/* Sort By */}
      <div className="sort-by">
        <span>Sort by</span>
        <span className="arrow">→</span>
      </div>
    </div>
  );
}
