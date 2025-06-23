/**
 * Image styles data structure for IdentityCrisis Pro
 * Based on the image-styles-spec.md document
 */

// All 30 image styles with their complete specifications
export const IMAGE_STYLES = {
  // Professional Covers
  "linkedin-elite": {
    id: "linkedin-elite",
    name: "LinkedIn Elite",
    category: "Professional",
    description: "Clean studio portrait perfect for professional networking",
    promptTemplate: "{person_description}, professional headshot, studio lighting, neutral gray background, business attire, confident slight smile, looking directly at camera",
    promptSuffix: "corporate portrait photography, Peter Hurley style, professional headshot, clean and modern, high-end business portrait",
    negativePrompt: "casual clothing, messy hair, harsh shadows, busy background, unprofessional, silly expression",
    parameters: {
      aspectRatio: "1:1",
      quality: "high",
      styleStrength: 0.7,
      cfgScale: 8.0,
      steps: 35
    },
    postProcessing: {
      filters: ["subtle_sharpen", "skin_smooth_light"],
      adjustments: {
        brightness: 5,
        contrast: 5,
        saturation: -10
      }
    }
  },
  "corporate-boardroom": {
    id: "corporate-boardroom",
    name: "Corporate Boardroom",
    category: "Professional",
    description: "Executive presence with power pose and city backdrop",
    promptTemplate: "{person_description}, executive portrait, standing in modern office, floor-to-ceiling windows, city skyline background, expensive suit, power pose, arms crossed or hands on hips",
    promptSuffix: "Fortune 500 CEO portrait, Annie Leibovitz style, dramatic corporate photography, glass and steel architecture",
    negativePrompt: "casual wear, slouching, messy appearance, cheap clothing, suburban background",
    parameters: {
      aspectRatio: "4:5",
      quality: "ultra",
      styleStrength: 0.8,
      cfgScale: 9.0,
      steps: 40
    },
    postProcessing: {
      filters: ["contrast_boost", "subtle_vignette"],
      adjustments: {
        brightness: 0,
        contrast: 15,
        saturation: 5
      }
    }
  },
  "startup-founder": {
    id: "startup-founder",
    name: "Startup Founder",
    category: "Professional",
    description: "Casual professional in modern workspace",
    promptTemplate: "{person_description}, relaxed professional portrait, modern co-working space, casual business attire, authentic smile, laptop or whiteboard visible in background",
    promptSuffix: "tech entrepreneur photography, startup culture, modern workspace, approachable leader, Silicon Valley style",
    negativePrompt: "formal suit, stiff pose, traditional office, corporate environment",
    parameters: {
      aspectRatio: "1:1",
      quality: "high",
      styleStrength: 0.6,
      cfgScale: 7.5,
      steps: 30
    },
    postProcessing: {
      filters: ["warm_tone", "slight_blur_background"],
      adjustments: {
        brightness: 10,
        contrast: 5,
        saturation: 15
      }
    }
  },
  "academic-authority": {
    id: "academic-authority",
    name: "Academic Authority",
    category: "Professional",
    description: "Intellectual presence in scholarly setting",
    promptTemplate: "{person_description}, scholarly portrait, library or university office background, bookshelves, intellectual appearance, thoughtful expression, possibly wearing glasses",
    promptSuffix: "professor portrait, academic photography, Ivy League aesthetic, distinguished scholar, warm library lighting",
    negativePrompt: "casual setting, party atmosphere, sports wear, nightclub, beach",
    parameters: {
      aspectRatio: "4:5",
      quality: "high",
      styleStrength: 0.75,
      cfgScale: 8.5,
      steps: 35
    },
    postProcessing: {
      filters: ["warm_vintage", "slight_grain"],
      adjustments: {
        brightness: -5,
        contrast: 10,
        saturation: -15
      }
    }
  },

  // Artistic Operatives
  "street-candid": {
    id: "street-candid",
    name: "Street Candid",
    category: "Artistic",
    description: "Natural documentary-style urban portrait",
    promptTemplate: "{person_description}, candid street photography, urban environment, natural moment, documentary style, city street background, casual clothing",
    promptSuffix: "Henri Cartier-Bresson style, decisive moment, street photography, natural light, authentic expression, 35mm film aesthetic",
    negativePrompt: "posed, studio, formal, artificial lighting, staged",
    parameters: {
      aspectRatio: "3:2",
      quality: "high",
      styleStrength: 0.9,
      cfgScale: 6.5,
      steps: 30
    },
    postProcessing: {
      filters: ["film_grain", "slight_desaturate"],
      adjustments: {
        brightness: -5,
        contrast: 20,
        saturation: -20
      }
    }
  },
  "golden-hour": {
    id: "golden-hour",
    name: "Golden Hour Glow",
    category: "Artistic",
    description: "Warm sunset lighting with dreamy atmosphere",
    promptTemplate: "{person_description}, golden hour portrait, warm sunset lighting, backlit, lens flare, dreamy atmosphere, outdoor setting",
    promptSuffix: "magic hour photography, sun-kissed, warm orange and pink tones, bokeh background, ethereal glow, cinematic lighting",
    negativePrompt: "harsh midday sun, cold lighting, indoor, artificial light, night time",
    parameters: {
      aspectRatio: "4:5",
      quality: "ultra",
      styleStrength: 0.85,
      cfgScale: 7.0,
      steps: 35
    },
    postProcessing: {
      filters: ["golden_hour_filter", "soft_glow"],
      adjustments: {
        brightness: 15,
        contrast: -5,
        saturation: 25,
        warmth: 30
      }
    }
  },
  "film-noir": {
    id: "film-noir",
    name: "Film Noir Shadow",
    category: "Artistic",
    description: "High contrast black and white with dramatic shadows",
    promptTemplate: "{person_description}, film noir portrait, dramatic shadows, venetian blind shadows across face, black and white, mysterious expression, 1940s style",
    promptSuffix: "classic film noir cinematography, chiaroscuro lighting, high contrast monochrome, detective story aesthetic, moody atmosphere",
    negativePrompt: "color, bright lighting, cheerful, modern clothing, smiling",
    parameters: {
      aspectRatio: "4:5",
      quality: "high",
      styleStrength: 0.95,
      cfgScale: 9.0,
      steps: 40
    },
    postProcessing: {
      filters: ["black_white_high_contrast", "noir_grain"],
      adjustments: {
        brightness: -10,
        contrast: 40,
        saturation: -100
      }
    }
  },
  "neon-underground": {
    id: "neon-underground",
    name: "Neon Underground",
    category: "Artistic",
    description: "Cyberpunk aesthetic with neon reflections",
    promptTemplate: "{person_description}, cyberpunk portrait, neon lights, pink and blue lighting, rain-slicked streets, urban night scene, futuristic clothing",
    promptSuffix: "Blade Runner aesthetic, neon-lit cityscape, reflective surfaces, atmospheric fog, synthwave vibes, cinematic cyberpunk",
    negativePrompt: "daylight, natural lighting, rural, vintage, black and white",
    parameters: {
      aspectRatio: "16:9",
      quality: "ultra",
      styleStrength: 0.9,
      cfgScale: 8.0,
      steps: 40
    },
    postProcessing: {
      filters: ["neon_glow", "chromatic_aberration"],
      adjustments: {
        brightness: -15,
        contrast: 30,
        saturation: 40,
        vibrance: 50
      }
    }
  },
  "dark-academia": {
    id: "dark-academia",
    name: "Dark Academia",
    category: "Artistic",
    description: "Moody scholarly aesthetic with vintage feel",
    promptTemplate: "{person_description}, dark academia portrait, old library, dim candlelight, vintage clothing, books and manuscripts, contemplative expression",
    promptSuffix: "Gothic university aesthetic, Renaissance painting lighting, mysterious scholar, oil painting quality, chiaroscuro technique",
    negativePrompt: "bright modern lighting, contemporary clothing, cheerful, neon, minimalist",
    parameters: {
      aspectRatio: "4:5",
      quality: "ultra",
      styleStrength: 0.85,
      cfgScale: 8.5,
      steps: 45
    },
    postProcessing: {
      filters: ["vintage_fade", "dark_vignette"],
      adjustments: {
        brightness: -20,
        contrast: 15,
        saturation: -30,
        sepia: 20
      }
    }
  },
  "arctic-light": {
    id: "arctic-light",
    name: "Arctic Light",
    category: "Artistic",
    description: "Cool minimalist Scandinavian aesthetic",
    promptTemplate: "{person_description}, minimalist portrait, cool blue tones, soft diffused light, winter atmosphere, simple clean background, serene expression",
    promptSuffix: "Scandinavian photography style, hygge aesthetic, soft natural light, minimalist composition, cool color palette",
    negativePrompt: "warm colors, busy background, tropical, cluttered, harsh shadows",
    parameters: {
      aspectRatio: "1:1",
      quality: "high",
      styleStrength: 0.7,
      cfgScale: 7.0,
      steps: 30
    },
    postProcessing: {
      filters: ["cool_tone", "soft_light"],
      adjustments: {
        brightness: 20,
        contrast: -10,
        saturation: -25,
        temperature: -30
      }
    }
  },

  // Illustrated Identities
  "pixar-perfect": {
    id: "pixar-perfect",
    name: "Pixar Perfect",
    category: "Illustrated",
    description: "3D animated style with expressive features",
    promptTemplate: "{person_description}, 3D Pixar animation style portrait, expressive cartoon features, vibrant colors, smooth rendering, friendly appearance",
    promptSuffix: "Pixar character design, high quality 3D render, subsurface scattering, animated movie quality, wholesome aesthetic",
    negativePrompt: "realistic, photographic, anime, 2D, sketch, dark, horror",
    parameters: {
      aspectRatio: "1:1",
      quality: "ultra",
      styleStrength: 1.0,
      cfgScale: 10.0,
      steps: 50
    },
    postProcessing: {
      filters: ["cartoon_smooth", "vibrance_boost"],
      adjustments: {
        brightness: 10,
        contrast: 5,
        saturation: 30
      }
    }
  },
  "anime-protagonist": {
    id: "anime-protagonist",
    name: "Anime Protagonist",
    category: "Illustrated",
    description: "Japanese animation style with dynamic features",
    promptTemplate: "{person_description}, anime style portrait, large expressive eyes, dynamic hair, manga aesthetic, clean lines, cel-shaded",
    promptSuffix: "high quality anime art, Studio Ghibli influence, manga illustration, Japanese animation, detailed character design",
    negativePrompt: "realistic, photographic, western cartoon, 3D render, sketchy",
    parameters: {
      aspectRatio: "3:4",
      quality: "high",
      styleStrength: 1.0,
      cfgScale: 9.0,
      steps: 35
    },
    postProcessing: {
      filters: ["anime_filter", "line_enhance"],
      adjustments: {
        brightness: 5,
        contrast: 15,
        saturation: 20
      }
    }
  },
  "comic-book-hero": {
    id: "comic-book-hero",
    name: "Comic Book Hero",
    category: "Illustrated",
    description: "Bold comic book style with Ben Day dots",
    promptTemplate: "{person_description}, comic book art style, bold outlines, Ben Day dots, superhero lighting, dynamic pose, action comic aesthetic",
    promptSuffix: "Marvel/DC comic art style, Jim Lee influence, dramatic superhero portrait, halftone pattern, pop art elements",
    negativePrompt: "realistic, soft, watercolor, sketch, photographic",
    parameters: {
      aspectRatio: "3:4",
      quality: "high",
      styleStrength: 0.95,
      cfgScale: 8.5,
      steps: 30
    },
    postProcessing: {
      filters: ["comic_book_effect", "halftone_dots"],
      adjustments: {
        brightness: 5,
        contrast: 35,
        saturation: 40
      }
    }
  },
  "watercolor-wanderer": {
    id: "watercolor-wanderer",
    name: "Watercolor Wanderer",
    category: "Illustrated",
    description: "Soft painted style with artistic bleed",
    promptTemplate: "{person_description}, watercolor painting style, soft edges, paint bleeds, pastel colors, artistic portrait, white paper texture visible",
    promptSuffix: "traditional watercolor technique, wet-on-wet painting, artistic interpretation, gallery quality, impressionistic style",
    negativePrompt: "sharp edges, digital, photographic, hard lines, neon colors",
    parameters: {
      aspectRatio: "4:5",
      quality: "high",
      styleStrength: 0.9,
      cfgScale: 6.5,
      steps: 35
    },
    postProcessing: {
      filters: ["watercolor_texture", "paper_grain"],
      adjustments: {
        brightness: 15,
        contrast: -15,
        saturation: -10
      }
    }
  },
  "vector-minimalist": {
    id: "vector-minimalist",
    name: "Vector Minimalist",
    category: "Illustrated",
    description: "Flat design with geometric shapes",
    promptTemplate: "{person_description}, vector art portrait, flat design, geometric shapes, limited color palette, minimalist style, clean lines",
    promptSuffix: "Adobe Illustrator style, flat design trend, material design influence, simplified features, modern graphic design",
    negativePrompt: "realistic, textured, gradient heavy, photographic, sketchy",
    parameters: {
      aspectRatio: "1:1",
      quality: "standard",
      styleStrength: 1.0,
      cfgScale: 8.0,
      steps: 25
    },
    postProcessing: {
      filters: ["vector_clean", "color_reduce"],
      adjustments: {
        brightness: 10,
        contrast: 20,
        saturation: 10
      }
    }
  },
  "studio-ghibli": {
    id: "studio-ghibli",
    name: "Studio Ghibli Dream",
    category: "Illustrated",
    description: "Soft whimsical animation style",
    promptTemplate: "{person_description}, Studio Ghibli art style, soft colors, whimsical atmosphere, hand-drawn animation quality, gentle expression, nature elements",
    promptSuffix: "Hayao Miyazaki style, Japanese animation art, dreamy quality, traditional animation, pastoral setting",
    negativePrompt: "harsh, dark, cyberpunk, realistic, computer graphics",
    parameters: {
      aspectRatio: "16:9",
      quality: "ultra",
      styleStrength: 0.95,
      cfgScale: 7.5,
      steps: 40
    },
    postProcessing: {
      filters: ["soft_pastel", "dream_blur"],
      adjustments: {
        brightness: 20,
        contrast: -5,
        saturation: 15
      }
    }
  },

  // Specialty Operations
  "retro-spy": {
    id: "retro-spy",
    name: "Retro Spy",
    category: "Specialty",
    description: "1960s James Bond aesthetic",
    promptTemplate: "{person_description}, 1960s spy portrait, vintage James Bond style, film grain, sophisticated pose, cocktail party or casino background",
    promptSuffix: "Sean Connery era Bond aesthetic, vintage spy movie, 60s fashion, film photography, sophisticated secret agent",
    negativePrompt: "modern, digital, casual, contemporary fashion",
    parameters: {
      aspectRatio: "3:2",
      quality: "high",
      styleStrength: 0.85,
      cfgScale: 8.0,
      steps: 35
    },
    postProcessing: {
      filters: ["vintage_film", "grain_heavy"],
      adjustments: {
        brightness: -5,
        contrast: 15,
        saturation: -20,
        vintage: 40
      }
    }
  },
  "hacker-haven": {
    id: "hacker-haven",
    name: "Hacker Haven",
    category: "Specialty",
    description: "Anonymous hacker aesthetic",
    promptTemplate: "{person_description}, hacker portrait, hoodie, multiple monitors glowing, dark room, code on screens, mysterious silhouette",
    promptSuffix: "Mr. Robot aesthetic, cybersecurity vibes, anonymous hacker, Matrix-style code, underground tech scene",
    negativePrompt: "bright lighting, formal wear, outdoors, cheerful, colorful",
    parameters: {
      aspectRatio: "16:9",
      quality: "high",
      styleStrength: 0.9,
      cfgScale: 7.5,
      steps: 30
    },
    postProcessing: {
      filters: ["dark_mode", "digital_glow"],
      adjustments: {
        brightness: -30,
        contrast: 25,
        saturation: -40,
        green_tint: 20
      }
    }
  },
  "travel-blogger": {
    id: "travel-blogger",
    name: "Travel Blogger",
    category: "Specialty",
    description: "Adventurous spirit with exotic backdrop",
    promptTemplate: "{person_description}, travel blogger portrait, exotic location background, adventurous outfit, golden hour light, authentic smile, wanderlust vibes",
    promptSuffix: "National Geographic style, travel photography, authentic moments, diverse locations, Instagram-worthy shot",
    negativePrompt: "studio, office, formal, indoor artificial lighting",
    parameters: {
      aspectRatio: "4:5",
      quality: "high",
      styleStrength: 0.7,
      cfgScale: 7.0,
      steps: 30
    },
    postProcessing: {
      filters: ["travel_vibrant", "slight_hdr"],
      adjustments: {
        brightness: 15,
        contrast: 10,
        saturation: 25,
        vibrance: 30
      }
    }
  },
  "fitness-influencer": {
    id: "fitness-influencer",
    name: "Fitness Influencer",
    category: "Specialty",
    description: "Athletic and motivational energy",
    promptTemplate: "{person_description}, fitness portrait, gym or outdoor workout setting, athletic wear, energetic pose, healthy glow, motivational expression",
    promptSuffix: "fitness photography, athletic portrait, Instagram fitness style, dynamic energy, health and wellness aesthetic",
    negativePrompt: "lazy, slouching, junk food, unhealthy, tired",
    parameters: {
      aspectRatio: "4:5",
      quality: "high",
      styleStrength: 0.75,
      cfgScale: 7.5,
      steps: 30
    },
    postProcessing: {
      filters: ["clarity_boost", "warm_glow"],
      adjustments: {
        brightness: 10,
        contrast: 20,
        saturation: 15,
        clarity: 30
      }
    }
  },
  "coffee-shop-creative": {
    id: "coffee-shop-creative",
    name: "Coffee Shop Creative",
    category: "Specialty",
    description: "Hipster aesthetic in cozy café",
    promptTemplate: "{person_description}, coffee shop portrait, cozy café setting, laptop visible, hipster aesthetic, warm ambient lighting, creative professional vibe",
    promptSuffix: "lifestyle photography, digital nomad aesthetic, artisanal coffee culture, creative workspace, urban professional",
    negativePrompt: "corporate office, formal suit, harsh lighting, sterile environment",
    parameters: {
      aspectRatio: "3:2",
      quality: "high",
      styleStrength: 0.7,
      cfgScale: 7.0,
      steps: 30
    },
    postProcessing: {
      filters: ["warm_cafe", "soft_focus_background"],
      adjustments: {
        brightness: 5,
        contrast: 5,
        saturation: 10,
        warmth: 25
      }
    }
  },

  // Time Period Covers
  "80s-synthwave": {
    id: "80s-synthwave",
    name: "80s Synthwave",
    category: "Time Period",
    description: "Retro 80s with neon grid aesthetic",
    promptTemplate: "{person_description}, 1980s portrait, synthwave aesthetic, neon grid background, Miami Vice colors, big hair, retro sunglasses",
    promptSuffix: "vaporwave style, retrowave aesthetic, 80s nostalgia, neon pink and blue, vintage arcade vibes",
    negativePrompt: "modern, minimalist, muted colors, contemporary fashion",
    parameters: {
      aspectRatio: "4:3",
      quality: "high",
      styleStrength: 0.95,
      cfgScale: 8.5,
      steps: 35
    },
    postProcessing: {
      filters: ["synthwave_filter", "scan_lines"],
      adjustments: {
        brightness: 10,
        contrast: 30,
        saturation: 50,
        magenta: 30,
        cyan: 20
      }
    }
  },
  "90s-grunge": {
    id: "90s-grunge",
    name: "90s Grunge",
    category: "Time Period",
    description: "Alternative style with Seattle vibes",
    promptTemplate: "{person_description}, 1990s grunge portrait, flannel shirt, alternative style, moody lighting, Seattle coffee shop vibe, vintage film look",
    promptSuffix: "Kurt Cobain era aesthetic, alternative rock style, Pacific Northwest vibes, authentic 90s fashion, film photography",
    negativePrompt: "polished, glamorous, bright colors, modern digital",
    parameters: {
      aspectRatio: "4:5",
      quality: "high",
      styleStrength: 0.85,
      cfgScale: 7.0,
      steps: 30
    },
    postProcessing: {
      filters: ["grunge_texture", "faded_film"],
      adjustments: {
        brightness: -10,
        contrast: 5,
        saturation: -30,
        grain: 40
      }
    }
  },
  "y2k-techno": {
    id: "y2k-techno",
    name: "Y2K Techno",
    category: "Time Period",
    description: "Futuristic millennium aesthetic",
    promptTemplate: "{person_description}, Y2K aesthetic portrait, metallic clothing, holographic effects, futuristic optimism, tech-inspired fashion, millennium style",
    promptSuffix: "early 2000s futurism, Matrix-inspired, metallic textures, CD-ROM art aesthetic, cyber fashion",
    negativePrompt: "vintage, rustic, natural, minimalist, muted",
    parameters: {
      aspectRatio: "1:1",
      quality: "high",
      styleStrength: 0.9,
      cfgScale: 8.0,
      steps: 35
    },
    postProcessing: {
      filters: ["holographic", "digital_artifact"],
      adjustments: {
        brightness: 15,
        contrast: 25,
        saturation: 20,
        metallic: 40
      }
    }
  },
  "vintage-polaroid": {
    id: "vintage-polaroid",
    name: "Vintage Polaroid",
    category: "Time Period",
    description: "Instant photo aesthetic with nostalgic feel",
    promptTemplate: "{person_description}, polaroid photo style, instant camera aesthetic, slightly faded, white border frame, nostalgic mood, casual moment",
    promptSuffix: "authentic polaroid look, instant film characteristics, 1970s-80s snapshot, candid moment, analog photography",
    negativePrompt: "digital, sharp, high definition, modern, perfect quality",
    parameters: {
      aspectRatio: "1:1",
      quality: "standard",
      styleStrength: 0.8,
      cfgScale: 6.5,
      steps: 25
    },
    postProcessing: {
      filters: ["polaroid_frame", "fade_vintage"],
      adjustments: {
        brightness: 5,
        contrast: -10,
        saturation: -15,
        fade: 30
      }
    }
  },

  // Cultural Fusion
  "kpop-idol": {
    id: "kpop-idol",
    name: "K-Pop Idol",
    category: "Cultural",
    description: "Korean beauty aesthetic with soft filters",
    promptTemplate: "{person_description}, K-pop idol portrait, Korean beauty standards, soft beauty filter, pastel background, perfect skin, trendy Korean fashion",
    promptSuffix: "Seoul fashion, K-beauty aesthetic, idol photography, soft glow effect, Korean entertainment industry style",
    negativePrompt: "harsh lighting, unfiltered, grungy, western style",
    parameters: {
      aspectRatio: "3:4",
      quality: "ultra",
      styleStrength: 0.85,
      cfgScale: 7.5,
      steps: 40
    },
    postProcessing: {
      filters: ["beauty_filter_strong", "soft_pastel"],
      adjustments: {
        brightness: 20,
        contrast: -5,
        saturation: 10,
        skin_smooth: 80
      }
    }
  },
  "bollywood-star": {
    id: "bollywood-star",
    name: "Bollywood Star",
    category: "Cultural",
    description: "Vibrant colors with dramatic Indian cinema style",
    promptTemplate: "{person_description}, Bollywood star portrait, vibrant colors, dramatic lighting, ornate background, glamorous styling, Indian cinema aesthetic",
    promptSuffix: "Mumbai film industry style, colorful and dramatic, traditional meets modern, cinematic glamour, festival vibes",
    negativePrompt: "muted colors, minimalist, understated, monochrome",
    parameters: {
      aspectRatio: "4:5",
      quality: "ultra",
      styleStrength: 0.9,
      cfgScale: 8.5,
      steps: 40
    },
    postProcessing: {
      filters: ["vibrant_bollywood", "glamour_glow"],
      adjustments: {
        brightness: 10,
        contrast: 20,
        saturation: 40,
        vibrance: 50
      }
    }
  },
  "nordic-noir": {
    id: "nordic-noir",
    name: "Nordic Noir",
    category: "Cultural",
    description: "Minimalist Scandinavian with serious tone",
    promptTemplate: "{person_description}, Nordic noir portrait, minimalist Scandinavian style, muted colors, serious expression, clean modern background, winter mood",
    promptSuffix: "Scandinavian crime drama aesthetic, cold atmospheric, minimalist composition, Swedish/Danish style, brooding atmosphere",
    negativePrompt: "vibrant, tropical, busy, cheerful, warm tones",
    parameters: {
      aspectRatio: "2:3",
      quality: "high",
      styleStrength: 0.8,
      cfgScale: 7.5,
      steps: 35
    },
    postProcessing: {
      filters: ["desaturate_nordic", "cool_grade"],
      adjustments: {
        brightness: -5,
        contrast: 10,
        saturation: -40,
        temperature: -25
      }
    }
  },
  "mediterranean-maven": {
    id: "mediterranean-maven",
    name: "Mediterranean Maven",
    category: "Cultural",
    description: "Sun-kissed coastal elegance",
    promptTemplate: "{person_description}, Mediterranean portrait, coastal background, sun-kissed skin, relaxed elegance, white and blue color palette, Greek or Italian riviera setting",
    promptSuffix: "Santorini aesthetic, coastal lifestyle, European summer, effortless elegance, golden Mediterranean light",
    negativePrompt: "cold, winter, urban, industrial, dark mood",
    parameters: {
      aspectRatio: "4:5",
      quality: "high",
      styleStrength: 0.75,
      cfgScale: 7.0,
      steps: 30
    },
    postProcessing: {
      filters: ["mediterranean_warmth", "sun_kissed"],
      adjustments: {
        brightness: 20,
        contrast: 5,
        saturation: 20,
        warmth: 35
      }
    }
  },
  "tokyo-night": {
    id: "tokyo-night",
    name: "Tokyo Night",
    category: "Cultural",
    description: "Urban Japanese street style",
    promptTemplate: "{person_description}, Tokyo street portrait, neon signage reflections, Japanese urban fashion, night scene, Shibuya or Shinjuku vibes",
    promptSuffix: "Japanese street photography, Tokyo fashion, urban night aesthetic, neon-lit streets, contemporary Japan style",
    negativePrompt: "rural, daytime, traditional, western suburbs",
    parameters: {
      aspectRatio: "3:2",
      quality: "ultra",
      styleStrength: 0.85,
      cfgScale: 8.0,
      steps: 35
    },
    postProcessing: {
      filters: ["tokyo_neon", "urban_contrast"],
      adjustments: {
        brightness: -10,
        contrast: 25,
        saturation: 30,
        vibrance: 40
      }
    }
  }
};

// Category structure for organizing styles
export const STYLE_CATEGORIES = {
  "Professional": ["linkedin-elite", "corporate-boardroom", "startup-founder", "academic-authority"],
  "Artistic": ["street-candid", "golden-hour", "film-noir", "neon-underground", "dark-academia", "arctic-light"],
  "Illustrated": ["pixar-perfect", "anime-protagonist", "comic-book-hero", "watercolor-wanderer", "vector-minimalist", "studio-ghibli"],
  "Specialty": ["retro-spy", "hacker-haven", "travel-blogger", "fitness-influencer", "coffee-shop-creative"],
  "Time Period": ["80s-synthwave", "90s-grunge", "y2k-techno", "vintage-polaroid"],
  "Cultural": ["kpop-idol", "bollywood-star", "nordic-noir", "mediterranean-maven", "tokyo-night"]
};

// Get all style IDs in a flat array
export const getAllStyleIds = () => {
  return Object.keys(IMAGE_STYLES);
};

// Get styles by category
export const getStylesByCategory = (category) => {
  return STYLE_CATEGORIES[category]?.map(id => IMAGE_STYLES[id]) || [];
};

// Get a random style from enabled styles
export const getRandomStyle = (enabledStyles = null) => {
  const availableStyles = enabledStyles || getAllStyleIds();
  const randomId = availableStyles[Math.floor(Math.random() * availableStyles.length)];
  return IMAGE_STYLES[randomId];
};

// Construct prompt with style
export const constructPromptWithStyle = (style, personDescription) => {
  const basePrompt = style.promptTemplate.replace('{person_description}', personDescription);
  return `${basePrompt}, ${style.promptSuffix}`;
};

// Get default enabled styles (all styles enabled by default)
export const getDefaultEnabledStyles = () => {
  return getAllStyleIds().reduce((acc, styleId) => {
    acc[styleId] = true;
    return acc;
  }, {});
};
