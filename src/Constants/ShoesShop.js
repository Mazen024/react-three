const PATH_TO_SHOESSHOP_MODEL =
  "../../Assets/3D_Models/ShoesShop/Shop/Shop_Shoes.gltf";

import { getShopAssets } from "../Service/shopService";
import React, { useEffect, useRef, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import PropTypes from "prop-types";
import * as THREE from "three";

// Function to fetch shop constants - returns a promise with the data
export const getShopConstants = async (shopId) => {
  try {
    // Call the API to get shop assets
    const response = await getShopAssets(shopId);

    if (!response.success) {
      throw new Error("Failed to fetch shop assets");
    }

    const coords = response.data.coordinates || {
      x_pos: 0,
      y_pos: 0,
      z_pos: 0,
      x_rot: 0,
      y_rot: 0,
      z_rot: 0,
      x_scale: 1,
      y_scale: 1,
      z_scale: 1,
    };

    const urls = response.data.urls || {};

    return {
      MODEL_URL: urls.gltfUrl || "",
      SHOP_POSITION: [coords.x_pos, coords.y_pos, coords.z_pos],
      SHOP_ROTATION: [coords.x_rot, coords.y_rot, coords.z_rot],
      SHOP_SCALE: [coords.x_scale, coords.y_scale, coords.z_scale],
      // Pass additional URLs that might be needed
      BIN_URL: urls.binUrl || "",
      TEXTURE_URL: urls.textureUrl || "",
      ICON_URL: urls.iconUrl || "",
    };
  } catch (error) {
    console.error("Error fetching shop constants:", error);
    throw error;
  }
};

const SHOES_CONFIGURATIONS = [
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes1/ShoesOne.gltf",
    position: [1.5, 1.08, 2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes2/ShoesTWO.gltf",
    position: [1.55, 1.66, 2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes3/ShoesTHREE.gltf",
    position: [2.648, 1.65, 2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes4/ShoesFour.gltf",
    position: [2.648, 1.1, 2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  // GG
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes9/scene.gltf",
    position: [0.39, 0.575, 2.35],
    rotation: [0, 0, 0],
    scale: [0.15, 0.15, 0.1],
  },
  // nb
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesA/scene.gltf",
    position: [1.55, 0.575, 2.3],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.0009111, 0.00091115, 0.00091115],
  },
  // nike white
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes7/scene.gltf",
    position: [2.65, 0.676, 2.2],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.015, 0.015, 0.015],
  },
  {
    //nike blue
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesB/scene.gltf",
    position: [-3, 0.72, 1],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    // nike gray
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesC/scene.gltf",
    position: [0.39, 1.23, 2.35],
    rotation: [0, Math.PI / -2, 0],
    scale: [0.3, 0.23, 0.23],
  },
  {
    // nike gray 2
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesD/scene.gltf",
    position: [0.39, 1.69, 2.35],
    rotation: [0, Math.PI, 0],
    scale: [1, 1, 1],
  },
  {
    // nike gray 2
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesE/scene.gltf",
    position: [-0.72, 1.68, 2.35],
    rotation: [0, Math.PI, 0],
    scale: [1.5, 1.5, 1.5],
  },
  {
    // Dior
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesH/scene.gltf",
    position: [-0.72, 1.13, 2.35],
    rotation: [0, 0, 0],
    scale: [0.35, 0.35, 0.35],
  },
  {
    // nb gray
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesI/scene.gltf",
    position: [-0.72, 0.72, 2.35],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.076, 0.076, 0.076],
  },
  {
    // white & blue
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesK/scene.gltf",
    position: [-1.8, 0.569, 2.35],
    rotation: [0, Math.PI, 0],
    scale: [0.5, 0.5, 0.5],
  },
  {
    // nike white
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes1/ShoesOne.gltf",
    position: [-1.9, 1.08, 2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    //nike black
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes2/ShoesTWO.gltf",
    position: [-1.9, 1.66, 2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    // nike blue
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes3/ShoesTHREE.gltf",
    position: [-3, 1.65, 2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    // nike gray
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes4/ShoesFour.gltf",
    position: [-3, 1.1, 2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  // nb
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesA/scene.gltf",
    position: [-3, 0.575, 2.3],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.0009111, 0.00091115, 0.00091115],
  },
  //////
  {
    // nike gray
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesC/scene.gltf",
    position: [0.39, 1.23, -2.35],
    rotation: [0, Math.PI / -2, 0],
    scale: [0.3, 0.23, 0.23],
  },
  {
    // nike gray 2
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesD/scene.gltf",
    position: [0.39, 1.69, -2.35],
    rotation: [0, Math.PI, 0],
    scale: [1, 1, 1],
  },
  {
    // nike gray 2
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesE/scene.gltf",
    position: [-0.72, 1.68, -2.35],
    rotation: [0, Math.PI, 0],
    scale: [1.5, 1.5, 1.5],
  },
  {
    // Dior
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesH/scene.gltf",
    position: [-0.72, 1.13, -2.35],
    rotation: [0, 0, 0],
    scale: [0.35, 0.35, 0.35],
  },
  {
    // nb gray
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesI/scene.gltf",
    position: [-0.72, 0.72, -2.35],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.076, 0.076, 0.076],
  },
  {
    // white & blue
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesK/scene.gltf",
    position: [-1.8, 0.569, -2.35],
    rotation: [0, Math.PI, 0],
    scale: [0.5, 0.5, 0.5],
  },
  {
    // nike white
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes1/ShoesOne.gltf",
    position: [-1.9, 1.08, -2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    //nike black
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes2/ShoesTWO.gltf",
    position: [-1.9, 1.66, -2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    // nike blue
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes3/ShoesTHREE.gltf",
    position: [-3, 1.65, -2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    // nike gray
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes4/ShoesFour.gltf",
    position: [-3, 1.1, -2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  // nb
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesA/scene.gltf",
    position: [-3, 0.575, -2.3],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.0009111, 0.00091115, 0.00091115],
  },
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes1/ShoesOne.gltf",
    position: [1.5, 1.08, -2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes2/ShoesTWO.gltf",
    position: [1.55, 1.66, -2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes3/ShoesTHREE.gltf",
    position: [2.648, 1.65, -2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes4/ShoesFour.gltf",
    position: [2.648, 1.1, -2.3],
    rotation: [0, Math.PI, 0],
    scale: [0.08, 0.08, 0.08],
  },
  // GG
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes9/scene.gltf",
    position: [0.39, 0.575, -2.35],
    rotation: [0, 0, 0],
    scale: [0.15, 0.15, 0.1],
  },
  // nb
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/ShoesA/scene.gltf",
    position: [1.55, 0.575, -2.3],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.0009111, 0.00091115, 0.00091115],
  },
  // nike white
  {
    path: "../../Assets/3D_Models/ShoesShop/DynamicObjects/Shoes7/scene.gltf",
    position: [2.65, 0.676, -2.4],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.015, 0.015, 0.015],
  },
];

const SHOESSHOP_SHOP_POSITION = [0, 0, 0];
const SHOESSHOP_SHOP_ROTATION = [0, 0, 0];
const SHOESSHOP_SHOP_SCALE = [0.075, 0.075, 0.075];

const AMBIENT_LIGHT_INTENSITY = 1.5;
const FLOOR_SIZE = [50, 50];
const FLOOR_COLOR = "#ffffff";

export {
  PATH_TO_SHOESSHOP_MODEL,
  SHOES_CONFIGURATIONS,
  SHOESSHOP_SHOP_POSITION,
  SHOESSHOP_SHOP_ROTATION,
  SHOESSHOP_SHOP_SCALE,
  AMBIENT_LIGHT_INTENSITY,
  FLOOR_SIZE,
  FLOOR_COLOR,
};
