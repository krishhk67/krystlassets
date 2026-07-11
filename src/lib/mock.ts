import lightleaks from "@/assets/pack-lightleaks.jpg";
import glitch from "@/assets/pack-glitch.jpg";
import sfx from "@/assets/pack-sfx.jpg";
import luts from "@/assets/pack-luts.jpg";

export type Tint = "cyan" | "magenta" | "amber";

export type Asset = {
  id: string;
  slug: string;
  tc: string;
  kind: string;
  title: string;
  creator: string;
  handle: string;
  price: number; // 0 = free
  originalPrice?: number;
  rating: number;
  reviews: number;
  downloads: string;
  size: string;
  software: string[];
  updated: string;
  version: string;
  img: string;
  tint: Tint;
  category: string;
  tags: string[];
  featured?: boolean;
  staffPick?: boolean;
  bestSeller?: boolean;
  new?: boolean;
  flashDeal?: boolean;
};

export const IMG = { lightleaks, glitch, sfx, luts };

export const assets: Asset[] = [
  { id: "a01", slug: "anamorphic-light-leaks-vol-2", tc: "00:04:12:03", kind: "OVERLAYS", title: "Anamorphic Light Leaks — Vol.02", creator: "Krystl", handle: "krystl", price: 28, rating: 4.9, reviews: 412, downloads: "12.4k", size: "3.8 GB", software: ["Premiere","Resolve","AE"], updated: "2d ago", version: "2.1.0", img: lightleaks, tint: "cyan", category: "Overlays", tags: ["light leaks","anamorphic","4k"], featured: true, bestSeller: true },
  { id: "a02", slug: "rgb-split-datamosh-kit", tc: "00:02:47:18", kind: "TRANSITIONS", title: "RGB Split & Datamosh Kit", creator: "Nine Volt", handle: "ninevolt", price: 34, originalPrice: 48, rating: 4.8, reviews: 287, downloads: "9.1k", size: "1.2 GB", software: ["AE","Premiere"], updated: "5d ago", version: "1.4.2", img: glitch, tint: "magenta", category: "Transitions", tags: ["glitch","datamosh","rgb"], flashDeal: true, staffPick: true },
  { id: "a03", slug: "whooshes-risers-impacts", tc: "00:11:03:00", kind: "SFX", title: "Whooshes, Risers, Impacts", creator: "Room 8", handle: "room8", price: 22, rating: 4.9, reviews: 691, downloads: "22.7k", size: "640 MB", software: ["Any DAW"], updated: "1w ago", version: "3.0.0", img: sfx, tint: "amber", category: "SFX", tags: ["whoosh","riser","impact"], bestSeller: true },
  { id: "a04", slug: "filmic-teal-sodium-luts", tc: "00:00:24:00", kind: "LUTS", title: "Filmic Teal / Sodium Pack", creator: "Halide Co.", handle: "halide", price: 18, rating: 4.7, reviews: 512, downloads: "18.3k", size: "42 MB", software: ["Resolve","Premiere","FCP"], updated: "3d ago", version: "2.0.1", img: luts, tint: "magenta", category: "LUTs", tags: ["cinematic","teal","sodium"], featured: true },
  { id: "a05", slug: "broadcast-titles-lower-thirds", tc: "00:07:19:12", kind: "MOTION", title: "Broadcast Titles / Lower Thirds", creator: "Sable Studio", handle: "sable", price: 0, rating: 4.8, reviews: 843, downloads: "31.0k", size: "220 MB", software: ["AE","MOGRT"], updated: "yesterday", version: "1.2.0", img: glitch, tint: "cyan", category: "Motion Graphics", tags: ["titles","broadcast","free"], new: true },
  { id: "a06", slug: "kodak-portra-emulation", tc: "00:03:02:07", kind: "PRESETS", title: "Kodak Portra Emulation", creator: "Umbra", handle: "umbra", price: 14, rating: 4.9, reviews: 320, downloads: "7.6k", size: "18 MB", software: ["Photoshop","Lightroom"], updated: "6d ago", version: "1.1.0", img: luts, tint: "amber", category: "Presets", tags: ["kodak","portra","film"], staffPick: true },
  { id: "a07", slug: "volumetric-studio-rig", tc: "00:05:44:22", kind: "3D", title: "Volumetric Studio Rig", creator: "Foglamp", handle: "foglamp", price: 48, rating: 5.0, reviews: 92, downloads: "2.4k", size: "6.1 GB", software: ["Blender","C4D"], updated: "4d ago", version: "0.9.4", img: lightleaks, tint: "cyan", category: "3D Assets", tags: ["blender","volumetric","hdri"], new: true },
  { id: "a08", slug: "cutout-streetwear-archive", tc: "00:00:12:08", kind: "PNG", title: "Cutout — Streetwear Archive", creator: "Paperlane", handle: "paperlane", price: 9, rating: 4.6, reviews: 178, downloads: "5.2k", size: "310 MB", software: ["Photoshop","Figma"], updated: "8h ago", version: "1.0.3", img: sfx, tint: "magenta", category: "PNG", tags: ["cutout","streetwear","fashion"] },
  { id: "a09", slug: "grain-4k-super8", tc: "00:01:14:11", kind: "OVERLAYS", title: "Grain 4K — Super 8 Emulation", creator: "Krystl", handle: "krystl", price: 16, rating: 4.9, reviews: 402, downloads: "14.2k", size: "2.1 GB", software: ["Premiere","Resolve","AE","FCP"], updated: "1d ago", version: "2.4.0", img: lightleaks, tint: "amber", category: "Overlays", tags: ["grain","super8","film"], featured: true },
  { id: "a10", slug: "hdri-studio-vol1", tc: "00:00:04:00", kind: "3D", title: "HDRI Studio Vol.01", creator: "Foglamp", handle: "foglamp", price: 24, rating: 4.7, reviews: 66, downloads: "3.1k", size: "4.4 GB", software: ["Blender","C4D","Houdini"], updated: "9d ago", version: "1.0.0", img: lightleaks, tint: "cyan", category: "3D Assets", tags: ["hdri","studio","8k"] },
  { id: "a11", slug: "mogrt-news-package", tc: "00:09:22:15", kind: "MOTION", title: "MOGRT News Package", creator: "Sable Studio", handle: "sable", price: 42, rating: 4.6, reviews: 138, downloads: "4.8k", size: "480 MB", software: ["Premiere","AE"], updated: "12d ago", version: "1.5.0", img: glitch, tint: "amber", category: "Motion Graphics", tags: ["mogrt","broadcast","news"] },
  { id: "a12", slug: "impact-sfx-mini", tc: "00:00:32:00", kind: "SFX", title: "Impact SFX — Mini Pack", creator: "Room 8", handle: "room8", price: 0, rating: 4.8, reviews: 220, downloads: "16.4k", size: "80 MB", software: ["Any DAW"], updated: "3h ago", version: "1.0.0", img: sfx, tint: "cyan", category: "SFX", tags: ["free","impact","sample"], new: true },
];

export const bySlug = (slug: string) => assets.find(a => a.slug === slug);
export const byId = (id: string) => assets.find(a => a.id === id);
export const byCreator = (handle: string) => assets.filter(a => a.handle === handle);

export type Creator = {
  handle: string;
  name: string;
  bio: string;
  followers: string;
  following: string;
  sales: string;
  totalSales: number;
  published: number;
  rating: number;
  verified: boolean;
  joined: string;
  responseTime: string;
  tint: Tint;
  website: string;
  location: string;
  achievements: string[];
};

export const creators: Creator[] = [
  { handle: "krystl", name: "Krystl", bio: "Editor turned toolmaker. Anamorphic optics, film grain, and useful noise.", followers: "48.2k", following: "182", sales: "$182k", totalSales: 12440, published: 24, rating: 4.9, verified: true, joined: "Mar 2023", responseTime: "under 2h", tint: "magenta", website: "krystl.studio", location: "Lisbon, PT", achievements: ["Top Seller 2025","Verified","Editor's Choice"] },
  { handle: "ninevolt", name: "Nine Volt", bio: "Datamosh, RGB splits, and honest glitches for people who read waveforms.", followers: "22.7k", following: "94", sales: "$96k", totalSales: 6420, published: 18, rating: 4.8, verified: true, joined: "Jan 2024", responseTime: "under 6h", tint: "cyan", website: "ninevolt.tv", location: "Berlin, DE", achievements: ["Verified","Rising Star"] },
  { handle: "halide", name: "Halide Co.", bio: "Color scientists. LUTs that behave the same on every scope.", followers: "18.4k", following: "40", sales: "$74k", totalSales: 4920, published: 12, rating: 4.7, verified: true, joined: "Nov 2023", responseTime: "under 12h", tint: "amber", website: "halide.co", location: "Los Angeles, US", achievements: ["Verified"] },
  { handle: "foglamp", name: "Foglamp", bio: "Volumetric rigs, atmospheres, and studio HDRIs for Blender and C4D.", followers: "9.1k", following: "22", sales: "$38k", totalSales: 1580, published: 8, rating: 5.0, verified: false, joined: "May 2024", responseTime: "under 24h", tint: "cyan", website: "foglamp.xyz", location: "Reykjavik, IS", achievements: ["Rising Star"] },
  { handle: "room8", name: "Room 8", bio: "Sound designers. Whooshes, risers, impacts and the low end you needed.", followers: "31.5k", following: "58", sales: "$120k", totalSales: 22700, published: 14, rating: 4.9, verified: true, joined: "Aug 2023", responseTime: "under 4h", tint: "amber", website: "room8.audio", location: "Melbourne, AU", achievements: ["Top Seller 2025","Verified"] },
  { handle: "sable", name: "Sable Studio", bio: "Broadcast motion graphics. Lower thirds, news, sport, replays.", followers: "14.2k", following: "77", sales: "$54k", totalSales: 4120, published: 22, rating: 4.7, verified: true, joined: "Feb 2024", responseTime: "under 8h", tint: "cyan", website: "sable.studio", location: "Toronto, CA", achievements: ["Verified"] },
  { handle: "umbra", name: "Umbra", bio: "Film emulation presets for stills and stills that want to be film.", followers: "11.9k", following: "36", sales: "$28k", totalSales: 2110, published: 9, rating: 4.9, verified: false, joined: "Jun 2024", responseTime: "under 12h", tint: "magenta", website: "umbra.photo", location: "Prague, CZ", achievements: [] },
  { handle: "paperlane", name: "Paperlane", bio: "PNG cutouts, textures, brushes — the small stuff that ships work.", followers: "6.8k", following: "12", sales: "$14k", totalSales: 980, published: 15, rating: 4.6, verified: false, joined: "Sep 2024", responseTime: "under 24h", tint: "magenta", website: "paperlane.co", location: "Osaka, JP", achievements: [] },
];

export const creatorByHandle = (h: string) => creators.find(c => c.handle === h);

export const categories = [
  { slug: "after-effects", label: "After Effects", n: 1240 },
  { slug: "premiere-pro", label: "Premiere Pro", n: 980 },
  { slug: "davinci-resolve", label: "DaVinci Resolve", n: 742 },
  { slug: "final-cut", label: "Final Cut", n: 318 },
  { slug: "photoshop", label: "Photoshop", n: 1620 },
  { slug: "lightroom", label: "Lightroom", n: 540 },
  { slug: "blender", label: "Blender", n: 418 },
  { slug: "luts", label: "LUTs", n: 612 },
  { slug: "presets", label: "Presets", n: 829 },
  { slug: "overlays", label: "Overlays", n: 1103 },
  { slug: "sfx", label: "SFX", n: 2410 },
  { slug: "png", label: "PNG", n: 3820 },
  { slug: "motion-graphics", label: "Motion Graphics", n: 560 },
  { slug: "3d", label: "3D Assets", n: 302 },
  { slug: "fonts", label: "Fonts", n: 214 },
  { slug: "textures", label: "Textures", n: 402 },
];

export type Review = { id: string; author: string; handle: string; rating: number; date: string; body: string };
export const sampleReviews: Review[] = [
  { id: "r1", author: "Ivan", handle: "ivan_edits", rating: 5, date: "3d ago", body: "The grain sits perfectly under 4K footage. Zero clipping, no seams on loop." },
  { id: "r2", author: "Naomi", handle: "naomi.cuts", rating: 5, date: "1w ago", body: "Dropped straight into Resolve. Scopes stayed clean. My colorist owes you a beer." },
  { id: "r3", author: "Diego", handle: "d.morena", rating: 4, date: "2w ago", body: "Wish there were 2K variants too, but the 4K is beautiful. Love the sodium tone." },
  { id: "r4", author: "Priya", handle: "priya.mp4", rating: 5, date: "3w ago", body: "Bought it for a Nike edit. Client approved on the first send. That's the review." },
];

export const notifications = [
  { id: "n1", tint: "amber" as Tint, title: "Purchase successful", body: "Anamorphic Light Leaks — Vol.02 is in your library.", time: "2m ago", unread: true },
  { id: "n2", tint: "cyan" as Tint, title: "New follower", body: "@d.morena started following you.", time: "1h ago", unread: true },
  { id: "n3", tint: "magenta" as Tint, title: "New sale", body: "$28.00 · RGB Split & Datamosh Kit", time: "3h ago", unread: false },
  { id: "n4", tint: "amber" as Tint, title: "Asset approved", body: "Grain 4K — Super 8 v2.4.0 is now live.", time: "yesterday", unread: false },
  { id: "n5", tint: "cyan" as Tint, title: "New review", body: "5.0 ★ — “dropped straight into Resolve.”", time: "yesterday", unread: false },
  { id: "n6", tint: "magenta" as Tint, title: "Withdrawal approved", body: "$4,182.00 → Wise · arriving Friday.", time: "2d ago", unread: false },
];

export type CartLine = { id: string; qty: number };

export const stats = [
  { k: "14,382", v: "Assets" },
  { k: "3,914",  v: "Creators" },
  { k: "2.4M",   v: "Downloads" },
  { k: "104",    v: "Countries" },
];
