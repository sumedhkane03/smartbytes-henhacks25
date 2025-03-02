import React from "react";
import type { StaticImageData } from "next/image";
import "./card.css";

interface CardProps {
  backgroundImage: string | StaticImageData;
  logoImage: string | StaticImageData;
  text: string;
}

export default function Card({ backgroundImage, logoImage, text }: CardProps) {
  const bgImage =
    typeof backgroundImage === "string" ? backgroundImage : backgroundImage.src;
  const logoImg = typeof logoImage === "string" ? logoImage : logoImage.src;

  return (
    <div className="card" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="card-overlay">
        <img src={logoImg} alt="logo" className="card-logo" />
        <div className="card-text">{text}</div>
      </div>
    </div>
  );
}
