export interface Recipe {
  slug: string
  title: string
  image: string
  description: string
  ingredients: string[]
  method: string[]
  tip?: string
}

export const recipes: Recipe[] = [
  {
    slug: "classic-braai-steak",
    title: "Classic Braai Steak with Garlic Butter",
    image: "/juicy-grilled-steak-with-garlic-butter-on-braai-gr.jpg",
    description:
      "Perfectly seared steak finished with a buttery garlic and herb sauce — a true South African braai classic.",
    ingredients: [
      "2 Hokaai Beef Rump Steaks",
      "2 tbsp butter",
      "2 cloves garlic (crushed)",
      "1 tbsp fresh parsley",
      "Salt and black pepper to taste",
    ],
    method: [
      "Season steaks generously with salt and pepper.",
      "Braai over hot coals for 4–5 minutes per side (medium).",
      "Melt butter in a small pan with garlic and parsley.",
      "Drizzle garlic butter over the steaks before serving.",
    ],
    tip: "Let the steaks rest for 5 minutes after cooking to allow the juices to redistribute for maximum tenderness.",
  },
  {
    slug: "honey-mustard-chicken-sosaties",
    title: "Honey & Mustard Chicken Sosaties",
    image: "/golden-brown-chicken-skewers-with-honey-mustard-gl.jpg",
    description:
      "Sweet and tangy chicken sosaties glazed with a honey-mustard sauce that caramelizes perfectly over the fire.",
    ingredients: [
      "1 pack Hokaai Chicken Sosaties – Honey & Mustard",
      "2 tbsp honey",
      "1 tbsp Dijon mustard",
      "1 tsp soy sauce",
    ],
    method: [
      "Mix honey, mustard, and soy sauce to make a glaze.",
      "Brush sosaties and braai over medium heat until golden brown.",
      "Re-brush halfway through for extra caramelization.",
    ],
    tip: "Don't overcook the chicken - it should reach an internal temperature of 75°C for perfect juiciness.",
  },
]
