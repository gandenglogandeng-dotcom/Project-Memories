export type MemoryCategory =
  | "Posko"
  | "On Duty"
  | "Dump"
  | "Meja Makan"
  | "Holiday"
  | "Masterpiece";

export type MediaType = "image" | "video";

export interface Memory {
  id: string;
  title: string;
  description: string;
  mediaType: MediaType;
  /** URL thumbnail (Cloudinary transform, atau thumbnail YouTube) */
  thumbnailUrl: string;
  /** URL asli high-res (Cloudinary) atau YouTube embed id untuk video */
  fullUrl: string;
  youtubeId?: string;
  category: MemoryCategory;
  /** ISO date string, tanggal kegiatan berlangsung */
  date: string;
  location: string;
  people: string[];
  /** Rasio lebar/tinggi thumbnail, dipakai untuk layout masonry stabil */
  aspectRatio: number;
  featured?: boolean;
}

export interface GuestMessage {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface VaultStats {
  totalMoments: number;
  totalDays: number;
  totalStories: number;
}
