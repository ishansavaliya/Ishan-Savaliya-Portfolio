export interface Track {
  id: string;
  title: string;
  artist: string;
  /** Path under /public/music/. Drop your .mp3 files there and update src. */
  src: string;
  /** CSS gradient used as album art (swap for a real cover image path). */
  cover: string;
  duration?: number;
}

/**
 * Music library. The default entries point at royalty-free sample tracks so the
 * player works out of the box. To use your own songs:
 *   1. Put .mp3 files in /public/music/
 *   2. Update each `src` to "/music/your-file.mp3" and edit title/artist.
 */
export const TRACKS: Track[] = [
  {
    id: "t1",
    title: "Midnight Drive",
    artist: "Royalty-Free",
    src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749e4c1.mp3?filename=lofi-study-112191.mp3",
    cover: "linear-gradient(135deg,#ff5f6d,#ffc371)",
  },
  {
    id: "t2",
    title: "Ambient Dreams",
    artist: "Royalty-Free",
    src: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_00fa5593f3.mp3?filename=ambient-piano-amp-strings-10711.mp3",
    cover: "linear-gradient(135deg,#667eea,#764ba2)",
  },
  {
    id: "t3",
    title: "Chill Beats",
    artist: "Royalty-Free",
    src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=chill-lofi-ambient-110241.mp3",
    cover: "linear-gradient(135deg,#11998e,#38ef7d)",
  },
  {
    id: "t4",
    title: "Focus Flow",
    artist: "Royalty-Free",
    src: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3?filename=relaxing-145038.mp3",
    cover: "linear-gradient(135deg,#fc5c7d,#6a82fb)",
  },
  {
    id: "t5",
    title: "Sunset Lounge",
    artist: "Royalty-Free",
    src: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=lofi-chill-medium-version-159456.mp3",
    cover: "linear-gradient(135deg,#f7971e,#ffd200)",
  },
];
