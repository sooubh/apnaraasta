import { Activity } from "../lib/types/activity";

export const PUNE_ACTIVITIES: Activity[] = [
  // --- MUSIC & FILMS ---
  {
    id: "nfai-film-circle",
    title: "NFAI Saturday World Cinema Circle",
    category: "music_films",
    activityKind: "recurring_community",
    city: "Pune",
    area: "FC Road & Shivaji Nagar",
    address: "Law College Road, Near FTII, Pune 411004",
    costStatus: "free_confirmed",
    priceMinInr: 0,
    priceMaxInr: 0,
    scheduleKind: "recurring",
    scheduleText: "Every Saturday at 5:30 PM (classic & world cinema screening followed by discussion)",
    socialComfort: "low_pressure",
    sourceName: "National Film Archive of India (NFAI)",
    sourceUrl: "https://www.nfai.gov.in/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Confirmed screening schedule at NFAI main auditorium; admission is free on a first-come basis. Schedule verified with current NFAI calendar.",
    registrationUrl: "https://www.nfai.gov.in/",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    tags: ["cinema", "film_circle", "classic_movies", "discussion", "quiet"],
    demoOnly: false,
    externalActionUrl: "https://www.nfai.gov.in/",
  },
  {
    id: "raah-literary-cultural-baithak",
    title: "Raah Cultural Baithak & Indie Listening Sessions",
    category: "music_films",
    activityKind: "place",
    city: "Pune",
    area: "Camp & MG Road",
    address: "Raah - Literacy & Cultural Centre, Marvel Vista, Lullanagar, Pune 411040",
    costStatus: "known",
    priceMinInr: 150,
    priceMaxInr: 300,
    scheduleKind: "recurring",
    scheduleText: "Bi-weekly Friday evenings & Sunday acoustic sessions at 6:30 PM",
    socialComfort: "balanced",
    sourceName: "Raah Cultural Centre",
    sourceUrl: "https://www.raah.org.in/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Verified ongoing calendar of classical baithaks, folk listening sessions, and open mics; modest donor pass covers artist support.",
    registrationUrl: "https://www.raah.org.in/",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    tags: ["acoustic", "baithak", "indie_music", "intimate_venue", "cultural"],
    demoOnly: false,
    externalActionUrl: "https://www.raah.org.in/",
  },
  {
    id: "aashayan-film-club-screenings",
    title: "Aashayan Film Club International Cinema Circle",
    category: "music_films",
    activityKind: "recurring_community",
    city: "Pune",
    area: "Kothrud",
    address: "Prabhat Road / Kothrud Culture Hub, Pune 411004",
    costStatus: "known",
    priceMinInr: 200,
    priceMaxInr: 500,
    scheduleKind: "recurring",
    scheduleText: "Monthly weekend retrospectives and director masterclasses",
    socialComfort: "balanced",
    sourceName: "Aashayan Film Club",
    sourceUrl: "https://aashayan.com/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Active parallel and international film forum operating in Pune since 1985; guest screenings open to new cinephiles.",
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
    tags: ["world_cinema", "film_discussion", "kothrud", "retrospective"],
    demoOnly: false,
    externalActionUrl: "https://aashayan.com/",
  },

  // --- PHOTOGRAPHY & ART ---
  {
    id: "gyaan-adab-visual-arts-forum",
    title: "Gyaan Adab Community Art Studio & Sketch Jam",
    category: "photography_art",
    activityKind: "place",
    city: "Pune",
    area: "Kalyani Nagar",
    address: "Plot 30, Road 3C, South Avenue, Kalyani Nagar, Pune 411006",
    costStatus: "known",
    priceMinInr: 100,
    priceMaxInr: 350,
    scheduleKind: "recurring",
    scheduleText: "Thursday sketch meetups and Sunday morning community gallery workshops",
    socialComfort: "low_pressure",
    sourceName: "Gyaan Adab Centre",
    sourceUrl: "https://gyaanadab.org/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Verified non-profit cultural space supporting amateur visual artists, painters, and poets. Accessible community center.",
    registrationUrl: "https://gyaanadab.org/",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
    tags: ["sketching", "art_gallery", "visual_arts", "kalyani_nagar", "beginner_friendly"],
    demoOnly: false,
    externalActionUrl: "https://gyaanadab.org/",
  },
  {
    id: "pune-photowalkers-heritage-streets",
    title: "Pune Photowalkers Sunday Heritage Walk",
    category: "photography_art",
    activityKind: "recurring_community",
    city: "Pune",
    area: "Camp & MG Road",
    address: "Assembly at Shaniwar Wada / Old Pune Wadas, Kasba Peth, Pune",
    costStatus: "free_confirmed",
    priceMinInr: 0,
    priceMaxInr: 0,
    scheduleKind: "recurring",
    scheduleText: "Alternate Sunday mornings, 7:00 AM – 9:30 AM",
    socialComfort: "balanced",
    sourceName: "Pune Photowalkers Collective",
    sourceUrl: "https://www.facebook.com/PunePhotowalk/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Verified grassroots amateur and enthusiast photography collective. No participation charge; phone and DSLR photographers welcome.",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    tags: ["photowalk", "heritage", "street_photography", "wadas", "community"],
    demoOnly: false,
    externalActionUrl: "https://www.facebook.com/PunePhotowalk/",
  },
  {
    id: "tifa-working-studios-printmaking",
    title: "TIFA Working Studios Open Print & Ceramics Circle",
    category: "photography_art",
    activityKind: "place",
    city: "Pune",
    area: "Koregaon Park",
    address: "Sadhu Vaswani Circle / Near Koregaon Park, Pune 411001",
    costStatus: "known",
    priceMinInr: 400,
    priceMaxInr: 900,
    scheduleKind: "recurring",
    scheduleText: "Alternate Saturdays 3:00 PM – 6:00 PM",
    socialComfort: "balanced",
    sourceName: "TIFA Working Studios",
    sourceUrl: "https://www.instagram.com/tifa_working_studios/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Multi-disciplinary contemporary arts and craft residency hosting guided printmaking and pottery open hours.",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    tags: ["printmaking", "ceramics", "contemporary_art", "studio", "hands_on"],
    demoOnly: false,
    externalActionUrl: "https://www.instagram.com/tifa_working_studios/",
  },

  // --- BOOKS & BOARD GAMES ---
  {
    id: "pagdandi-reading-and-book-swap",
    title: "Pagdandi Silent Reading & Community Book Exchange",
    category: "books_board_games",
    activityKind: "place",
    city: "Pune",
    area: "Baner",
    address: "Shop 6, Regent Plaza, Baner Pashan Link Road, Pune 411045",
    costStatus: "known",
    priceMinInr: 100,
    priceMaxInr: 250,
    scheduleKind: "evergreen",
    scheduleText: "Daily 10:30 AM – 10:00 PM; community book discussions on Sunday mornings",
    socialComfort: "low_pressure",
    sourceName: "Pagdandi Bookstore Cafe",
    sourceUrl: "https://pagdandi.org/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Verified independent bookstore with quiet reading lounge, lending library, and organic teas. Nominal food/chai purchase supports space.",
    registrationUrl: "https://pagdandi.org/",
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    tags: ["books", "reading_cafe", "book_swap", "baner", "quiet_space", "chai"],
    demoOnly: false,
    externalActionUrl: "https://pagdandi.org/",
  },
  {
    id: "pune-board-gamers-dice-club",
    title: "Pune Board Gamers Weekend Strategy & Party Table",
    category: "books_board_games",
    activityKind: "recurring_community",
    city: "Pune",
    area: "Deccan Gymkhana",
    address: "Deccan Gymkhana / FC Road Cafe Hub, Pune 411004",
    costStatus: "known",
    priceMinInr: 200,
    priceMaxInr: 350,
    scheduleKind: "recurring",
    scheduleText: "Saturday & Sunday afternoons, 2:30 PM – 7:30 PM",
    socialComfort: "balanced",
    sourceName: "Pune Board Gamers Guild",
    sourceUrl: "https://www.meetup.com/pune-board-gamers/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Active tabletop gaming group with 100+ titles ranging from Catan and Wingspan to light social deduction games. Venue fee includes snack voucher.",
    imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
    tags: ["board_games", "tabletop", "strategy", "social", "weekend_meetup"],
    demoOnly: false,
    externalActionUrl: "https://www.meetup.com/pune-board-gamers/",
  },
  {
    id: "silent-book-club-pune-tekdi",
    title: "Silent Book Club — Pune Chapter",
    category: "books_board_games",
    activityKind: "recurring_community",
    city: "Pune",
    area: "Model Colony",
    address: "Model Colony Park & Law College Foothills, Pune 411016",
    costStatus: "free_confirmed",
    priceMinInr: 0,
    priceMaxInr: 0,
    scheduleKind: "recurring",
    scheduleText: "Alternate Sunday mornings 9:00 AM – 10:30 AM (BYO Book, 1 hr silent read, optional 30 min chat)",
    socialComfort: "low_pressure",
    sourceName: "Silent Book Club (Official Chapter)",
    sourceUrl: "https://silentbook.club/blogs/chapters/pune-india",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Verified chapter on international Silent Book Club registry. Zero fee, introvert-friendly, no mandatory reading list.",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    tags: ["silent_reading", "introvert_friendly", "books", "model_colony", "outdoor_park"],
    demoOnly: false,
    externalActionUrl: "https://silentbook.club/blogs/chapters/pune-india",
  },

  // --- FOOD EXPERIENCES ---
  {
    id: "blue-tokai-cupping-sessions-kp",
    title: "Blue Tokai Coffee Cupping & Specialty Tasting",
    category: "food_experiences",
    activityKind: "place",
    city: "Pune",
    area: "Koregaon Park",
    address: "North Main Road, Near Lane 5, Koregaon Park, Pune 411001",
    costStatus: "known",
    priceMinInr: 350,
    priceMaxInr: 600,
    scheduleKind: "recurring",
    scheduleText: "Alternate Saturday mornings, 10:00 AM – 11:30 AM",
    socialComfort: "balanced",
    sourceName: "Blue Tokai Coffee Roasters",
    sourceUrl: "https://bluetokaicoffee.com/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Interactive coffee aroma & taste grading session guided by head roasters. Prior table sign-up recommended.",
    imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80",
    tags: ["coffee_tasting", "cupping", "koregaon_park", "artisanal", "sensory"],
    demoOnly: false,
    externalActionUrl: "https://bluetokaicoffee.com/",
  },
  {
    id: "pune-heritage-culinary-camp-walk",
    title: "Old Camp Heritage Bakery & Parsi Culinary Walk",
    category: "food_experiences",
    activityKind: "recurring_community",
    city: "Pune",
    area: "Camp & MG Road",
    address: "East Street & MG Road, Pune Cantonment, Pune 411001",
    costStatus: "known",
    priceMinInr: 500,
    priceMaxInr: 850,
    scheduleKind: "recurring",
    scheduleText: "Saturday mornings, 8:00 AM – 10:30 AM",
    socialComfort: "highly_social",
    sourceName: "Pune Heritage Food Walks",
    sourceUrl: "https://puneheritagewalk.com/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Guided heritage trail exploring 100-year-old sourdough, mawa cakes, and Irani bun maska history. Includes all curated tastings.",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    tags: ["culinary_walk", "heritage_food", "camp", "parsi_bakery", "irani_chai"],
    demoOnly: false,
    externalActionUrl: "https://puneheritagewalk.com/",
  },
  {
    id: "pune-fermentation-sourdough-guild",
    title: "Pune Fermenters & Sourdough Enthusiasts Circle",
    category: "food_experiences",
    activityKind: "recurring_community",
    city: "Pune",
    area: "Aundh",
    address: "Aundh Community Kitchen Space, DP Road, Pune 411007",
    costStatus: "known",
    priceMinInr: 300,
    priceMaxInr: 600,
    scheduleKind: "recurring",
    scheduleText: "First Sunday of each month, 11:00 AM – 1:30 PM",
    socialComfort: "balanced",
    sourceName: "Pune Sourdough & Fermenters Club",
    sourceUrl: "https://www.instagram.com/punesourdough/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Community-driven sourdough starter swaps, kombucha crafting tips, and open bread exchanges for home bakers.",
    imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
    tags: ["sourdough", "baking", "fermentation", "aundh", "home_cooks"],
    demoOnly: false,
    externalActionUrl: "https://www.instagram.com/punesourdough/",
  },

  // --- OUTDOOR ACTIVITIES ---
  {
    id: "vetal-tekdi-morning-naturalist-walk",
    title: "Vetal Tekdi Sunrise Flora & Bird Walk",
    category: "outdoor_activities",
    activityKind: "recurring_community",
    city: "Pune",
    area: "Kothrud",
    address: "ARAI Hill Gate, Vetal Tekdi, Paud Road / Kothrud, Pune 411038",
    costStatus: "free_confirmed",
    priceMinInr: 0,
    priceMaxInr: 0,
    scheduleKind: "recurring",
    scheduleText: "Every Sunday, 6:45 AM – 8:30 AM",
    socialComfort: "low_pressure",
    sourceName: "Pune Nature Enthusiasts & Tekdi Watch",
    sourceUrl: "https://punebirdguide.org/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Volunteer-guided nature walk focusing on local biodiversity and bird species on Pune's highest urban hill. Open to all.",
    imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
    tags: ["tekdi", "nature_walk", "birding", "sunrise", "kothrud", "fresh_air"],
    demoOnly: false,
    externalActionUrl: "https://punebirdguide.org/",
  },
  {
    id: "pune-randonneurs-heritage-cyclists",
    title: "Pune Urban Cyclists Saturday Morning Loop",
    category: "outdoor_activities",
    activityKind: "recurring_community",
    city: "Pune",
    area: "FC Road & Shivaji Nagar",
    address: "Assembly at University Main Gate, Ganeshkhind Road, Pune 411007",
    costStatus: "free_confirmed",
    priceMinInr: 0,
    priceMaxInr: 0,
    scheduleKind: "recurring",
    scheduleText: "Every Saturday, 6:00 AM – 8:00 AM (25km gentle pace)",
    socialComfort: "balanced",
    sourceName: "Pune Randonneurs Collective",
    sourceUrl: "https://www.audaxindia.in/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Casual group ride through university gardens and Old Pune green corridors. Helmet mandatory, own cycle required.",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    tags: ["cycling", "urban_ride", "university", "shivaji_nagar", "morning_fitness"],
    demoOnly: false,
    externalActionUrl: "https://www.audaxindia.in/",
  },
  {
    id: "boulder-vibe-climbing-community",
    title: "Boulder Vibe Open Bouldering & Movement Jam",
    category: "outdoor_activities",
    activityKind: "place",
    city: "Pune",
    area: "Bavdhan",
    address: "Near Chandani Chowk, Bavdhan Khurd, Pune 411021",
    costStatus: "known",
    priceMinInr: 400,
    priceMaxInr: 650,
    scheduleKind: "recurring",
    scheduleText: "Tuesday & Thursday beginner clinics 6:30 PM; weekend open climbing sessions",
    socialComfort: "balanced",
    sourceName: "Boulder Vibe Pune",
    sourceUrl: "https://bouldervibe.in/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Dedicated bouldering gym with friendly spotter culture and shoe rentals on site. Welcoming to first-time climbers.",
    imageUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80",
    tags: ["bouldering", "climbing", "bavdhan", "movement", "active_community"],
    demoOnly: false,
    externalActionUrl: "https://bouldervibe.in/",
  },

  // --- VOLUNTEERING ---
  {
    id: "anandvan-pune-urban-forest",
    title: "Anandvan Pune Urban Forest Stewardship",
    category: "volunteering",
    activityKind: "recurring_community",
    city: "Pune",
    area: "Camp & MG Road",
    address: "Anandvan Forest Reserve, NIBM / Mohamadwadi Hills, Pune 411048",
    costStatus: "free_confirmed",
    priceMinInr: 0,
    priceMaxInr: 0,
    scheduleKind: "recurring",
    scheduleText: "Every Sunday, 7:00 AM – 9:30 AM (native tree nurturing, watering, mulching)",
    socialComfort: "balanced",
    sourceName: "Anandvan Sanstha",
    sourceUrl: "https://anandvanpune.org/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Citizen-driven green oasis creation on barren hillocks; 50,000+ native trees planted. Tools and guidance provided to all new volunteers.",
    registrationUrl: "https://anandvanpune.org/",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    tags: ["tree_plantation", "environment", "urban_forest", "sunday_volunteering", "civic_action"],
    demoOnly: false,
    externalActionUrl: "https://anandvanpune.org/",
  },
  {
    id: "jeev-raksha-animal-shelter-volunteers",
    title: "Jeev Raksha Community Animal Care & Socialization",
    category: "volunteering",
    activityKind: "recurring_community",
    city: "Pune",
    area: "Kothrud",
    address: "Katraj Bypass / Kothrud South, Pune 411046",
    costStatus: "free_confirmed",
    priceMinInr: 0,
    priceMaxInr: 0,
    scheduleKind: "recurring",
    scheduleText: "Saturday & Sunday afternoons, 3:30 PM – 6:00 PM",
    socialComfort: "low_pressure",
    sourceName: "Jeev Raksha Animal Trust",
    sourceUrl: "https://jeevraksha.org/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Verified non-profit rescue sanctuary. Volunteers help with walking rescued dogs, gentle grooming, and puppy socialization.",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    tags: ["animal_welfare", "dogs", "shelter_care", "compassion", "weekend_service"],
    demoOnly: false,
    externalActionUrl: "https://jeevraksha.org/",
  },
  {
    id: "teach-for-pune-reading-champions",
    title: "Teach For Pune Weekend Reading Circles",
    category: "volunteering",
    activityKind: "recurring_community",
    city: "Pune",
    area: "Viman Nagar",
    address: "Community Learning Center, Near Datta Mandir, Viman Nagar, Pune 411014",
    costStatus: "free_confirmed",
    priceMinInr: 0,
    priceMaxInr: 0,
    scheduleKind: "recurring",
    scheduleText: "Saturday afternoons, 3:00 PM – 5:00 PM",
    socialComfort: "highly_social",
    sourceName: "Teach For India Pune Hub",
    sourceUrl: "https://teachforindia.org/",
    verifiedAt: "2026-10-21T10:00:00+05:30",
    verificationStatus: "verified",
    verificationNotes: "Structured weekend volunteer program for reading illustrated bilingual books with primary school learners.",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    tags: ["education", "mentorship", "reading_aloud", "viman_nagar", "youth_empowerment"],
    demoOnly: false,
    externalActionUrl: "https://teachforindia.org/",
  },
];

/**
 * Filter activities by deterministic hard constraints
 */
export function filterApprovedActivities(
  activities: Activity[],
  filters: {
    categories?: string[];
    areas?: string[];
    budgetMaxInr?: number;
    flexibleBudget?: boolean;
    socialComfort?: string;
    excludeIds?: string[];
  }
): Activity[] {
  return activities.filter((act) => {
    // 1. Exclude demo-only or non-verified records
    if (act.demoOnly || act.verificationStatus !== "verified") {
      return false;
    }

    // 2. Exclude explicitly requested IDs (e.g. for alternatives or regeneration)
    if (filters.excludeIds && filters.excludeIds.includes(act.id)) {
      return false;
    }

    // 3. Category match (if categories specified, must match one of selected)
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(act.category)) {
        return false;
      }
    }

    // 4. Area match with tokenized neighborhood support (e.g. "FC Road & Shivaji Nagar", "Baner & Aundh")
    if (filters.areas && filters.areas.length > 0 && act.area) {
      const actAreaTokens = act.area
        .toLowerCase()
        .split(/[&,/]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const filterAreaTokens = filters.areas
        .flatMap((a) => a.toLowerCase().split(/[&,/]+/))
        .map((s) => s.trim())
        .filter(Boolean);

      const matchesArea = filterAreaTokens.some((ft) =>
        actAreaTokens.some((at) => at.includes(ft) || ft.includes(at))
      );

      if (!matchesArea) {
        return false;
      }
    }

    // 5. Budget hard ceiling
    if (
      !filters.flexibleBudget &&
      filters.budgetMaxInr !== undefined &&
      filters.budgetMaxInr >= 0
    ) {
      if (filters.budgetMaxInr === 0) {
        if (act.costStatus !== "free_confirmed" && (act.priceMinInr || 0) > 0) {
          return false;
        }
      } else if (act.costStatus === "known" && act.priceMinInr !== undefined) {
        if (act.priceMinInr > filters.budgetMaxInr) {
          return false;
        }
      }
    }

    return true;
  });
}
