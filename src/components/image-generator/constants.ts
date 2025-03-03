
// AI Models from Hugging Face
export const AI_MODELS = [
  { id: "stabilityai/stable-diffusion-xl-base-1.0", name: "Stable Diffusion XL 1.5+", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "4:1", "1:4", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "runwayml/stable-diffusion-v1-5", name: "SD Lightning V2", aspectRatios: ["1:1", "4:3", "3:4", "16:9", "9:16", "2:3", "3:2", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "5:4", "4:5", "16:10", "10:16", "8:5", "5:8", "7:4", "4:7"] },
  { id: "prompthero/openjourney", name: "OpenJourney V4 Pro", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "dreamshaper/dreamshaper-xl", name: "DreamShaper XL Pro", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "segmind/SSD-1B", name: "SDXL Turbo Pro", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "stabilityai/sdxl-turbo", name: "SDXL Turbo", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "dataautogpt3/RealVisXL-V4", name: "RealVisXL V4.0 UHD", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "deepfloyd/IF-I-XL-v1.0", name: "DeepFloyd IF Ultra", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16"] },
  { id: "lllyasviel/sd-controlnet-depth", name: "ControlNet + SDXL", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "playgroundai/playground-v2.5-1024px-aesthetic", name: "Playground V2.5 Ultra", aspectRatios: ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "stabilityai/stable-diffusion-3-medium", name: "Stable Diffusion 3 Medium", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "ByteDance/FLUX-1-schnell", name: "FLUX.1-schnell MAX", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "PixArt-alpha/PixArt-XL-2-1024-MS", name: "PixArt-Σ Ultra", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
];

// Art Style Categories and Styles
export const ART_STYLE_CATEGORIES = [
  {
    name: "Cinematic & Realism",
    styles: [
      "Hyper-Realistic", "Photorealism", "8K Ultra-Realistic", "Hollywood Cinematic",
      "IMAX Film Style", "Movie Poster Art", "Noir Film Aesthetic", "Classic Black & White",
      "Vintage Film Look", "HDR Cinematic"
    ]
  },
  {
    name: "Traditional & Fine Art",
    styles: [
      "Renaissance Oil Painting", "Baroque Masterpiece", "Impressionist Brush Strokes",
      "Watercolor Fantasy", "Detailed Ink Sketch", "Charcoal Drawing", "Pastel Soft Art",
      "Surrealism Dreamlike", "Ukiyo-e Japanese Print", "Fine Art Portrait"
    ]
  },
  {
    name: "Sci-Fi & Fantasy",
    styles: [
      "Sci-Fi Concept Art", "Futuristic Cyberpunk", "Fantasy Epic Painting", "Alien Worlds",
      "Mythological Beasts", "Dark Fantasy Realism", "Dystopian Ruins", "AI Surrealism",
      "Space Odyssey", "Steampunk Illustrations"
    ]
  },
  {
    name: "Digital & Modern",
    styles: [
      "Modern Digital Art", "Abstract Geometric", "3D Isometric", "Low Poly 3D",
      "Holographic Glitch", "Neon Cyber Aesthetic", "Light Painting", "Vaporwave Dreamscape",
      "Metaverse Augmented Reality", "Pixel Art Retro"
    ]
  },
  {
    name: "Gaming & Anime",
    styles: [
      "Advanced Anime", "Anime Cyberpunk", "Dark Manga Noir", "Chibi Kawaii",
      "Cel-Shaded Cartoon", "Video Game Concept", "Fantasy RPG Art", "Game UI Design",
      "Esports Logo Style", "Comic Book Heroic"
    ]
  },
  {
    name: "Nature & Landscape",
    styles: [
      "Mystical Forest Painting", "Underwater Fantasy World", "Majestic Mountain Realism",
      "Cosmic Nebula Art", "Fantasy Waterfalls", "Dreamy Sunset Illustration",
      "Arctic Ice Wilderness", "Alien Planet Terrain", "Desert Mirage Aesthetic",
      "Bioluminescent Jungle"
    ]
  },
  {
    name: "Experimental & Conceptual",
    styles: [
      "AI Dreamscape", "Fractal Art", "Cubism Chaos", "Expressionist Vision",
      "Surreal Collage", "Kaleidoscope Patterns", "Smoke & Ink Fluidity",
      "Optical Illusion Effects", "Datamosh Glitch Aesthetic", "Psychedelic Visionary"
    ]
  },
  {
    name: "Mythical & Ancient",
    styles: [
      "Egyptian Hieroglyphic Art", "Aztec Mythology", "Ancient Greek Fresco",
      "Tribal Symbolism", "Medieval Tapestry", "Samurai Warrior Paintings",
      "Norse Mythology Visuals", "Gothic Architecture Illustrations", "Roman Mosaic Artwork",
      "Celtic Folklore"
    ]
  },
  {
    name: "Futuristic & AI-Generated",
    styles: [
      "AI Hyper-Evolved Creativity", "Quantum Art", "Neural Network Patterns",
      "AI Digital Dystopia", "Techno-Organic Fusion", "Post-Human Concept",
      "Digital Consciousness", "Virtual Reality Art", "AI Universe Generator",
      "Nano-Tech Artworks"
    ]
  }
];
