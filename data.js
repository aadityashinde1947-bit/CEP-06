/* Constants, mock data, helpers and the mock API. */
import {
  Leaf, Users, Megaphone, FlaskConical, ShoppingBag, Wrench, Timer, Shirt,
  Factory, Fuel, Droplets,
} from "lucide-react";

export const POINTS_PER_REPORT = 50;
export const POINTS_PER_TIP = 5;
export const STARTING_POINTS = 120; // mock seed balance so the dashboard isn't empty

/** Gamified ranks. A user's rank is the highest level whose `min` they've reached. */
export const LEVELS = [
  { name: "Ripple", min: 0 },
  { name: "Stream Scout", min: 40 },
  { name: "Water Warrior", min: 100 },
  { name: "River Guardian", min: 200 },
  { name: "Ocean Protector", min: 400 },
];

export const POLLUTION_TYPES = [
  { id: "plastic", label: "Plastic waste", icon: ShoppingBag },
  { id: "chemical", label: "Chemical runoff", icon: FlaskConical },
  { id: "sewage", label: "Sewage", icon: Droplets },
  { id: "oil", label: "Oil spill", icon: Fuel },
  { id: "industrial", label: "Industrial waste", icon: Factory },
];

/** Educational content. Each tip can be checked off once per day for +5 points. */
export const TIP_CATEGORIES = [
  {
    id: "household",
    title: "Household habits",
    subtitle: "Small choices at home add up downstream",
    tips: [
      {
        id: "chemicals",
        icon: FlaskConical,
        title: "Dispose of household chemicals properly",
        detail:
          "Take paint, solvents and strong cleaners to a hazardous-waste drop-off. Never pour them down a drain or onto the ground.",
      },
      {
        id: "plastic",
        icon: ShoppingBag,
        title: "Cut back on single-use plastic",
        detail:
          "Carry a reusable bottle, bag and cup. Discarded plastic breaks into microplastics that end up in rivers and oceans.",
      },
      {
        id: "detergent",
        icon: Leaf,
        title: "Switch to eco-friendly detergents",
        detail:
          "Choose phosphate-free, biodegradable soaps and cleaners so what goes down the drain is gentler on aquatic life.",
      },
    ],
  },
  {
    id: "water",
    title: "Conserving water",
    subtitle: "Use less, and less ends up polluted",
    tips: [
      {
        id: "showers",
        icon: Timer,
        title: "Take shorter showers",
        detail:
          "Trimming a shower by two minutes saves liters of water and eases the load on treatment plants.",
      },
      {
        id: "leaks",
        icon: Wrench,
        title: "Fix leaks quickly",
        detail:
          "A dripping tap or running toilet wastes water around the clock. Check your fixtures once a month.",
      },
      {
        id: "laundry",
        icon: Shirt,
        title: "Run full loads of laundry",
        detail:
          "Wait until the machine is full. Fewer cycles means less water, less detergent and fewer microfibers released.",
      },
    ],
  },
  {
    id: "community",
    title: "Community action",
    subtitle: "Bigger change happens together",
    tips: [
      {
        id: "cleanup",
        icon: Users,
        title: "Join a beach or river cleanup",
        detail:
          "Cleanups remove trash before it washes downstream. Go with a group, wear gloves and bring a sturdy bag.",
      },
      {
        id: "dumping",
        icon: Megaphone,
        title: "Report illegal dumping you see",
        detail:
          "Note the place and time, then tell your local authority or file a report here so it can be followed up.",
      },
      {
        id: "plant",
        icon: Leaf,
        title: "Plant native greenery near waterways",
        detail:
          "Roots hold soil in place and filter runoff before it reaches the water.",
      },
    ],
  },
];

/** Flat list of every tip with its category attached (used for counts and the home grid). */
export const ALL_TIPS = TIP_CATEGORIES.flatMap((c) =>
  c.tips.map((t) => ({ ...t, categoryId: c.id, categoryTitle: c.title }))
);

/** Tips shown on the home dashboard: two from each category. */
export const HOME_TIPS = ALL_TIPS.filter((_, i) => i % 3 !== 2);

export const SEED_REPORTS = [
  {
    id: "r_seed",
    title: "Foam and plastic by the footbridge",
    type: "plastic",
    description: "Thick foam and loose bottles gathering against the bank.",
    location: { lat: 12.9588, lng: 77.5702, label: "Near the old footbridge" },
    evidence: [],
    status: "Under review",
    createdAt: Date.now() - 3 * 3600 * 1000,
  },
];

/** Origin for the mock map. Taps are converted to coordinates around this point. */
export const MAP_ORIGIN = { lat: 12.9612, lng: 77.5634 };

/* ---------------- Helpers ---------------- */

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const todayKey = () => new Date().toDateString();
export const clamp01 = (n) => Math.min(1, Math.max(0, n));

/** Temporary ID for guests, e.g. "Guest-7K2F". */
export const makeGuestId = () =>
  "Guest-" + Math.random().toString(36).slice(2, 6).padEnd(4, "0").toUpperCase();

/** "jane.doe@mail.com" becomes "Jane Doe". */
export const prettyName = (email) =>
  email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** Returns the current rank, the next rank and progress (0 to 1) toward it. */
export function getLevelInfo(points) {
  let index = 0;
  LEVELS.forEach((level, i) => {
    if (points >= level.min) index = i;
  });
  const current = LEVELS[index];
  const next = LEVELS[index + 1] || null;
  const progress = next ? (points - current.min) / (next.min - current.min) : 1;
  return { index, current, next, progress, toNext: next ? next.min - points : 0 };
}

export function timeAgo(ts) {
  const minutes = Math.round((Date.now() - ts) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} days ago`;
}

/**
 * Mock backend. Each method simulates network latency and returns
 * the shape a real API would. Replace the bodies with fetch() calls.
 */
export const mockApi = {
  async authenticate({ mode, name, email }) {
    await wait(700);
    return {
      type: "member",
      id: "u_" + Math.random().toString(36).slice(2, 8),
      name: mode === "signup" ? name.trim() : prettyName(email),
      email,
    };
  },
  async socialSignIn(provider) {
    await wait(600);
    return {
      type: "member",
      id: "u_" + Math.random().toString(36).slice(2, 8),
      name: `${provider} user`,
    };
  },
  async submitReport(payload) {
    await wait(900);
    return {
      ...payload,
      id: "r_" + Date.now(),
      status: "Received",
      createdAt: Date.now(),
    };
  },
};
