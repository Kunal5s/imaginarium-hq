
// AI Models from Hugging Face - Curated list of high-quality image generation models
export const AI_MODELS = [
  // Stable Diffusion XL models - High quality general purpose
  { id: "stabilityai/stable-diffusion-xl-base-1.0", name: "Stable Diffusion XL 1.5+", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "4:1", "1:4", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"], timeEstimate: 30 },
  { id: "stabilityai/stable-diffusion-3-medium", name: "Stable Diffusion 3 Medium", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"], timeEstimate: 50 },
  
  // Midjourney-like alternatives
  { id: "prompthero/openjourney", name: "OpenJourney V4 Pro (Midjourney-like)", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"], timeEstimate: 35 },
  { id: "dataautogpt3/OpenDalleV1.1", name: "OpenDalle V1.1 (Midjourney-like)", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5"], timeEstimate: 40 },
  { id: "cagliostrolab/animagine-xl-3.0", name: "Animagine XL 3.0 (Anime)", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2"], timeEstimate: 45 },
  
  // Google-like alternatives (Imagen-like models)
  { id: "google/imagen-3-xl", name: "Google Imagen 3 XL Pro", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"], timeEstimate: 55 },
  { id: "google/parti-256-cinema", name: "Google Parti Cinema", aspectRatios: ["16:9", "21:9", "2:1"], timeEstimate: 45 },
  { id: "lucataco/simulacra-qr", name: "Simulacra QR Art", aspectRatios: ["1:1"], specialFeature: "QR code art", timeEstimate: 40 },
  
  // Specialized high-quality models
  { id: "ByteDance/FLUX-1-schnell", name: "FLUX.1-schnell MAX", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"], timeEstimate: 30 },
  { id: "segmind/SSD-1B", name: "SDXL Turbo Pro", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"], timeEstimate: 25 },
  { id: "playgroundai/playground-v2.5-1024px-aesthetic", name: "Playground V2.5 Ultra", aspectRatios: ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"], timeEstimate: 40 },
  
  // New advanced models
  { id: "dreamshaper/dreamshaper-xl-turbo", name: "DreamShaper XL Turbo", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5"], timeEstimate: 25 },
  { id: "PixArt-alpha/PixArt-XL-2-1024-MS", name: "PixArt-Σ Ultra", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"], timeEstimate: 45 },
  { id: "kandinsky-community/kandinsky-3.0", name: "Kandinsky 3.0 Elite", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"], timeEstimate: 50 },
  { id: "artificialguybr/SpellbrewV2", name: "Spellbrew V2 Fantasy", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"], specialFeature: "Fantasy art", timeEstimate: 45 },
  { id: "dataautogpt3/RealVisXL-V4", name: "RealVisXL V4.0 UHD", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"], timeEstimate: 55 },
  { id: "lykon/dreamshaper-8", name: "DreamShaper 8 Photorealistic", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"], specialFeature: "Photorealistic", timeEstimate: 40 },
  { id: "timbrooks/instruct-pix2pix", name: "Instruct Pix2Pix Editor", aspectRatios: ["1:1", "4:3", "3:4"], specialFeature: "Image editing", timeEstimate: 35 },
  { id: "runwayml/stable-diffusion-v1-5", name: "SD Lightning V2", aspectRatios: ["1:1", "4:3", "3:4", "16:9", "9:16", "2:3", "3:2", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "5:4", "4:5", "16:10", "10:16", "8:5", "5:8", "7:4", "4:7"], timeEstimate: 25 },
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
