import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface MenuItemProps {
  name: string;
  calories: string;
  image: string | StaticImageData;
}

export default function MenuItem({ name, calories, image }: MenuItemProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="menu-item">
      {/* Heart Icon positioned top-right */}
      <div className="like-icon" onClick={() => setLiked(!liked)}>
        {liked ? (
          <FaHeart color="red" size={20} />
        ) : (
          <FaRegHeart color="gray" size={20} />
        )}
      </div>
      <div className="item-info">
        <h3 className="item-name">{name}</h3>
        <p className="item-calories">{calories}</p>
        <div className="button-row">
          <button className="buy-button">Buy</button>
          {/* <button className="like-button">I like this</button> */}
        </div>
      </div>
      <div className="item-image">
        <Image src={image} alt={name} width={130} height={130} />
      </div>
    </div>
  );
}
