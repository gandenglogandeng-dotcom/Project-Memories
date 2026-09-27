import { Memory, GuestMessage, VaultStats } from "@/lib/types";

export const CATEGORIES: Memory["category"][] = [
  "Posko",
  "Mengajar",
  "Sosialisasi",
  "Dusun A",
  "Dusun B",
  "Keseruan",
];

export const VAULT_STATS: VaultStats = {
  totalMoments: 1284,
  totalDays: 42,
  totalStories: 63,
};

// Data contoh — ganti dengan fetch dari Supabase di app/page.tsx
export const MOCK_MEMORIES: Memory[] = [
  {
    id: "1",
    title: "Upacara Pelepasan di Balai Desa",
    description:
      "Hari pertama menginjakkan kaki di Logandeng, disambut hangat oleh perangkat desa dan warga.",
    mediaType: "image",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
    fullUrl:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=90",
    category: "Posko",
    date: "2026-07-01",
    location: "Balai Desa Logandeng",
    people: ["Tim KKN", "Perangkat Desa"],
    aspectRatio: 1.5,
    featured: true,
  },
  {
    id: "2",
    title: "Belajar Membaca Bersama Adik-Adik",
    description: "Kelas sore di posko, penuh tawa dan semangat belajar.",
    mediaType: "image",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    fullUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=90",
    category: "Mengajar",
    date: "2026-07-05",
    location: "Posko Utama",
    people: ["Sinta", "Adik-adik Dusun A"],
    aspectRatio: 0.8,
  },
  {
    id: "3",
    title: "Sosialisasi Pengelolaan Sampah",
    description: "Diskusi bersama ibu-ibu PKK tentang pemilahan sampah rumah tangga.",
    mediaType: "video",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    fullUrl: "",
    youtubeId: "dQw4w9WgXcQ",
    category: "Sosialisasi",
    date: "2026-07-08",
    location: "Balai Dusun B",
    people: ["Tim KKN", "Ibu PKK"],
    aspectRatio: 1.78,
  },
  {
    id: "4",
    title: "Panen Singkong di Ladang Pak Wito",
    description: "Ikut membantu panen sambil belajar cerita tanah karst Gunungkidul.",
    mediaType: "image",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
    fullUrl:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=90",
    category: "Dusun A",
    date: "2026-07-11",
    location: "Ladang Dusun A",
    people: ["Pak Wito"],
    aspectRatio: 1.2,
  },
  {
    id: "5",
    title: "Sunset di Tebing Karst",
    description: "Menutup hari panjang dengan pemandangan senja Gunungkidul yang tak tertandingi.",
    mediaType: "image",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    fullUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=90",
    category: "Keseruan",
    date: "2026-07-14",
    location: "Bukit Dusun B",
    people: ["Tim KKN"],
    aspectRatio: 0.7,
    featured: true,
  },
  {
    id: "6",
    title: "Gotong Royong Bersih Dusun",
    description: "Kerja bakti membersihkan saluran air bersama karang taruna.",
    mediaType: "image",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1591824438708-ff173f0d1e42?w=800&q=80",
    fullUrl:
      "https://images.unsplash.com/photo-1591824438708-ff173f0d1e42?w=1600&q=90",
    category: "Dusun B",
    date: "2026-07-18",
    location: "Dusun B",
    people: ["Karang Taruna"],
    aspectRatio: 1.0,
  },
];

export const MOCK_MESSAGES: GuestMessage[] = [
  {
    id: "m1",
    name: "Bu Sri (Kader PKK)",
    message:
      "Terima kasih adik-adik sudah mau berbagi ilmu dan waktu untuk Logandeng. Semoga selalu diingat ya!",
    createdAt: "2026-08-01",
  },
  {
    id: "m2",
    name: "Pak Dukuh Dusun A",
    message: "Kegiatan kalian sangat membantu warga. Ditunggu kunjungan berikutnya!",
    createdAt: "2026-08-02",
  },
];
