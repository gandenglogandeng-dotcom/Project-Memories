import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import MessageWall from "@/components/MessageWall";
import { CATEGORIES, VAULT_STATS } from "@/data/mock-memories";
import { supabase } from "@/lib/supabaseClient";
import { Memory, GuestMessage } from "@/lib/types";

export const revalidate = 60; // ISR: refresh data tiap 60 detik

export default async function HomePage() {
  const { data: memoriesData } = await supabase
    .from("memories")
    .select("*")
    .order("date", { ascending: false });

  const { data: messagesData } = await supabase
    .from("guest_messages")
    .select("*")
    .order("created_at", { ascending: false });

  // Mapping dari nama kolom Supabase (snake_case) ke tipe Memory (camelCase)
  const memories: Memory[] = (memoriesData ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    mediaType: row.media_type,
    thumbnailUrl: row.thumbnail_url,
    fullUrl: row.full_url,
    youtubeId: row.youtube_id ?? undefined,
    category: row.category,
    date: row.date,
    location: row.location ?? "",
    people: row.people ?? [],
    aspectRatio: row.aspect_ratio ?? 1,
    featured: row.featured ?? false,
  }));

  const messages: GuestMessage[] = (messagesData ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    message: row.message,
    createdAt: row.created_at,
  }));

    const stats = {
    totalMoments: memories.length || VAULT_STATS.totalMoments,
    totalDays: 43, // fix permanen, tidak dihitung otomatis dari data
    totalStories: messages.length,
  };

  const spotlight = memories.filter((m) => m.featured).length
    ? memories.filter((m) => m.featured)
    : memories;

  return (
    <>
      <Hero stats={stats} spotlight={spotlight.length ? spotlight : []} />
      <Gallery memories={memories} categories={CATEGORIES} />
      <MessageWall initialMessages={messages} />
    </>
  );
}

