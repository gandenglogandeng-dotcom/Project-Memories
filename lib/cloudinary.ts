/**
 * Upload file ke Cloudinary lewat "unsigned upload preset" — aman dipanggil
 * langsung dari browser karena tidak membutuhkan API secret di client.
 *
 * Setup di Cloudinary Dashboard:
 * 1. Settings → Upload → Add upload preset
 * 2. Signing Mode: Unsigned
 * 3. Folder: logandeng-memories (opsional, biar rapi)
 * 4. Copy nama preset ke NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 */
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  resource_type: "image" | "video";
}

export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    throw new Error(
      "Cloudinary belum dikonfigurasi. Isi NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME & NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET di .env.local"
    );
  }

  const resourceType = file.type.startsWith("video") ? "video" : "image";
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", "logandeng-memories");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("Upload ke Cloudinary gagal: " + xhr.responseText));
      }
    };
    xhr.onerror = () => reject(new Error("Terjadi kesalahan jaringan saat upload."));
    xhr.send(formData);
  });
}

/** Ambil video ID dari berbagai bentuk URL YouTube (unlisted link). */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
