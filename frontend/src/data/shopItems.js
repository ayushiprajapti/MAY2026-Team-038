import heritageHandbag from "../assets/shop/heritage-handbag.jpg";
import roundSlingBag from "../assets/shop/round-sling-bag.jpg";
import silkDupatta from "../assets/shop/silk-dupatta.jpg";
import handmadeFloorCarpet from "../assets/shop/handmade-floor-carpet.png";
import brassGanesha from "../assets/shop/brass-ganesha.jpg";
import brassCart from "../assets/shop/brass-cart.jpg";
import coasterSet from "../assets/shop/coaster-set.jpg";
import handcraftedNotebook from "../assets/shop/handcrafted-notebook.jpg";
import puneHeritageMap from "../assets/shop/pune-heritage-map.png";
import puneQueenBook from "../assets/shop/pune-queen-deccan.jpg";

const shopItems = [
  {
    id: 1,
    name: "Heritage Handbag",
    category: "Bags",
    price: 700,
    rating: 4.9,
    reviews: 128,
    image: heritageHandbag,
    gallery: [heritageHandbag],
    shortDescription:
      "Elegant handcrafted heritage handbag inspired by traditional Maharashtrian textiles.",
    description:
      "This handcrafted handbag combines heritage-inspired patterns with modern utility. Carefully stitched using premium fabric, it reflects the craftsmanship promoted by the Warsaa Heritage Shop.",
    story:
      "Inspired by traditional Maharashtrian textile art and handcrafted by local artisans to preserve regional craftsmanship.",
    material: "Handwoven Fabric",
    origin: "Pune, Maharashtra",
    dimensions: "32 × 28 cm",
    care: "Spot clean with a soft damp cloth.",
    stock: true,
  },

  {
    id: 2,
    name: "Round Sling Bag",
    category: "Bags",
    price: 450,
    rating: 4.8,
    reviews: 96,
    image: roundSlingBag,
    gallery: [roundSlingBag],
    shortDescription:
      "Compact heritage sling bag perfect for everyday use.",
    description:
      "Designed using heritage-inspired motifs and handcrafted fabric, this sling bag is lightweight and stylish.",
    story:
      "Celebrates India's traditional handcraft while offering a modern design for daily wear.",
    material: "Cotton Fabric",
    origin: "Pune",
    dimensions: "24 cm Diameter",
    care: "Dry clean recommended.",
    stock: true,
  },

  {
    id: 3,
    name: "Silk Heritage Dupatta",
    category: "Clothing",
    price: 1500,
    rating: 4.9,
    reviews: 84,
    image: silkDupatta,
    gallery: [silkDupatta],
    shortDescription:
      "Beautiful silk dupatta inspired by Maharashtrian heritage.",
    description:
      "A premium silk dupatta featuring elegant woven borders suitable for festive and traditional occasions.",
    story:
      "Crafted to preserve regional weaving traditions while supporting artisan communities.",
    material: "Silk",
    origin: "Maharashtra",
    dimensions: "2.4 metres",
    care: "Dry clean only.",
    stock: true,
  },

  {
    id: 4,
    name: "Handwoven Floor Rug",
    category: "Home Linen",
    price: 3000,
    rating: 4.8,
    reviews: 52,
    image: handmadeFloorCarpet,
    gallery: [handmadeFloorCarpet],
    shortDescription:
      "Traditional handwoven floor rug for elegant interiors.",
    description:
      "A handcrafted floor rug woven using traditional techniques that add warmth and heritage charm to any space.",
    story:
      "Inspired by handmade home linen showcased by the Warsaa Heritage collection.",
    material: "Cotton",
    origin: "Maharashtra",
    dimensions: "5 × 3 ft",
    care: "Vacuum gently. Dry clean when required.",
    stock: true,
  },

  {
    id: 5,
    name: "Brass Ganesha Idol",
    category: "Metalware",
    price: 900,
    rating: 5.0,
    reviews: 214,
    image: brassGanesha,
    gallery: [brassGanesha],
    shortDescription:
      "Traditional handcrafted brass Ganesha idol.",
    description:
      "Finely detailed brass idol suitable for home décor, gifting and festive occasions.",
    story:
      "Represents India's rich brass casting tradition preserved by skilled artisans.",
    material: "Brass",
    origin: "India",
    dimensions: "6 inches",
    care: "Polish occasionally using brass cleaner.",
    stock: true,
  },

  {
    id: 6,
    name: "Brass Heritage Cart",
    category: "Metalware",
    price: 1500,
    rating: 4.9,
    reviews: 75,
    image: brassCart,
    gallery: [brassCart],
    shortDescription:
      "Decorative handcrafted brass bullock cart.",
    description:
      "An elegant handcrafted brass miniature inspired by traditional Indian transport and village heritage.",
    story:
      "A collectible piece celebrating India's rural heritage and metal craftsmanship.",
    material: "Brass",
    origin: "India",
    dimensions: "8 inches",
    care: "Clean using a soft dry cloth.",
    stock: true,
  },

  {
    id: 7,
    name: "Wooden Heritage Coaster Set",
    category: "Home Accessories",
    price: 600,
    rating: 4.8,
    reviews: 61,
    image: coasterSet,
    gallery: [coasterSet],
    shortDescription:
      "Laser engraved wooden coaster collection.",
    description:
      "Premium handcrafted wooden coasters featuring heritage-inspired engravings.",
    story:
      "Designed to showcase iconic Indian heritage through functional home décor.",
    material: "Wood",
    origin: "Pune",
    dimensions: "Set of 6",
    care: "Wipe with dry cloth.",
    stock: true,
  },

  {
    id: 8,
    name: "Handcrafted Heritage Notebook",
    category: "Stationery",
    price: 400,
    rating: 4.8,
    reviews: 49,
    image: handcraftedNotebook,
    gallery: [handcraftedNotebook],
    shortDescription:
      "Beautiful handmade notebook with traditional cover design.",
    description:
      "A handcrafted notebook made using quality paper and a heritage-inspired printed cover.",
    story:
      "Encourages traditional handmade stationery while supporting local artisans.",
    material: "Handmade Paper",
    origin: "Pune",
    dimensions: "A5",
    care: "Keep dry.",
    stock: true,
  },

  {
    id: 9,
    name: "Pune Heritage Map",
    category: "Publications",
    price: 100,
    rating: 4.7,
    reviews: 38,
    image: puneHeritageMap,
    gallery: [puneHeritageMap],
    shortDescription:
      "Illustrated heritage map of Pune city.",
    description:
      "Explore the historic monuments, forts, temples and heritage landmarks of Pune through this beautifully designed map.",
    story:
      "Created to promote heritage tourism and awareness of Pune's cultural legacy.",
    material: "Premium Print",
    origin: "INTACH Pune Chapter",
    dimensions: "A2 Foldable",
    care: "Store flat.",
    stock: true,
  },

  {
    id: 10,
    name: "Pune: Queen of the Deccan",
    category: "Publications",
    price: 3500,
    rating: 5.0,
    reviews: 33,
    image: puneQueenBook,
    gallery: [puneQueenBook],
    shortDescription:
      "Premium coffee-table book celebrating Pune's heritage.",
    description:
      "An extensively illustrated publication documenting Pune's history, architecture and cultural heritage.",
    story:
      "Published to preserve and promote the architectural and cultural legacy of Pune for future generations.",
    material: "Hardbound Book",
    origin: "INTACH Pune Chapter",
    dimensions: "Hardcover",
    care: "Store in a dry place.",
    stock: true,
  },
];

export default shopItems;