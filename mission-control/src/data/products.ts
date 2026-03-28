export interface ProductData {
  id: string;
  name: string;
  category: string;
  mainGlbUrl: string;
  price: string;
  details: string;
  dressVariations: string[];
}

export const productsData: ProductData[] = [
  {
    id: "1",
    name: "Oversized Hoodie",
    category: "Outerwear",
    mainGlbUrl: "/models/hoodie.glb",
    price: "₹3,499",
    details: "Heavyweight organic cotton with 3D puff print detailing. Designed for a street-wear silhouette.",
    dressVariations: [
      "/models/hoodie_v1.glb",
      "/models/hoodie_v2.glb",
      "/models/hoodie_v3.glb",
      "/models/hoodie_v4.glb",
      "/models/hoodie_v5.glb"
    ]
  },
  {
    id: "2",
    name: "Puff Print T-Shirt",
    category: "Tops",
    mainGlbUrl: "/models/tshirt.glb",
    price: "₹1,299",
    details: "Premium 240 GSM cotton. Features the GESTALT signature distorted typography.",
    dressVariations: [
      "/models/tshirt_v1.glb",
      "/models/tshirt_v2.glb",
      "/models/tshirt_v3.glb",
      "/models/tshirt_v4.glb",
      "/models/tshirt_v5.glb"
    ]
  },
  {
    id: "3",
    name: "Cyber Trousers",
    category: "Bottoms",
    mainGlbUrl: "/models/trouser.glb",
    price: "₹4,999",
    details: "Technical nylon blend with modular pockets and adjustable bungee hems.",
    dressVariations: [
      "/models/trouser_v1.glb",
      "/models/trouser_v2.glb",
      "/models/trouser_v3.glb",
      "/models/trouser_v4.glb",
      "/models/trouser_v5.glb"
    ]
  }
];
