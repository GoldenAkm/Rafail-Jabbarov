import { readFile } from "node:fs/promises";
import path from "node:path";
import { tracks } from "@/data/music";

// Serves the theme tracks from /audio under an extension-less URL with a
// neutral content type. Download managers (e.g. Internet Download Manager)
// hijack any request that looks like media (.mp3, audio/*), which stops
// playback; MusicToggle fetches the bytes from here and plays them from a blob.
export async function GET(_req: Request, { params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  if (theme !== "dark" && theme !== "light") {
    return new Response("Not found", { status: 404 });
  }

  const bytes = await readFile(path.join(process.cwd(), "audio", tracks[theme].file));
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/x-portfolio-track",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
