/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Foto contoh (mock data) — boleh dihapus setelah data asli dari Cloudinary dipakai
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Ganti dengan hostname bucket Cloudflare R2 / custom domain kamu
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
