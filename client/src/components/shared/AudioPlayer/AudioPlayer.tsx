import { Box, IconButton, Typography } from "@mui/material";
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

export interface AudioPlayerProps {
  url: string;
  /** Title shown in the player (story title). */
  title?: string;
  /** Voice display name shown next to the timecode. */
  voiceLabel?: string;
  /** Optional thumbnail (story cover / first comic page). */
  coverImage?: string;
  /** @deprecated use `title` — kept for back-compat with older callers. */
  name?: string;
}

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Custom bedtime audio player (replaces the native <audio controls>).
 * Faithful to the design system's sticky reader player: deep-plum bar with a
 * gradient cover thumb, title + voice + monospaced timecode, a honey round
 * play/pause button, and a seekable honey progress track. CSS-var driven, so
 * it adapts to both light and dark themes.
 */
export const AudioPlayer = ({
  url,
  title,
  voiceLabel,
  coverImage,
  name,
}: AudioPlayerProps): JSX.Element => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // Reset transport when the source changes.
  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
  }, [url]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  };

  const heading = title || name || "Your story";
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Box
      sx={{
        borderRadius: "var(--r-xl)",
        background: "var(--plum-700)",
        color: "#fff",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--border)",
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        textAlign: "left",
      }}
    >
      <audio ref={audioRef} src={url} preload="metadata" />

      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: "12px",
            background: "linear-gradient(160deg,#FFE6A8,#C9B6E8)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {coverImage && (
            <Box
              component="img"
              src={coverImage}
              alt=""
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {heading}
          </Typography>
          <Box
            sx={{
              fontSize: 11,
              opacity: 0.7,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {voiceLabel && (
              <>
                <span>{voiceLabel}</span>
                <span>·</span>
              </>
            )}
            <Box component="span" sx={{ fontFamily: "var(--font-mono)" }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Box>
          </Box>
        </Box>

        <IconButton
          aria-label={playing ? "Pause" : "Play"}
          onClick={togglePlay}
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: "50%",
            background: "var(--honey-400)",
            color: "#fff",
            boxShadow: "var(--glow-honey)",
            "&:hover": {
              background: "var(--honey-400)",
              filter: "brightness(1.05)",
            },
          }}
        >
          {playing ? <PauseRounded /> : <PlayArrowRounded />}
        </IconButton>
      </Box>

      <Box
        onClick={handleSeek}
        sx={{
          height: 6,
          background: "rgba(255,255,255,0.18)",
          borderRadius: "3px",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            width: `${progress}%`,
            height: "100%",
            background: "var(--honey-300)",
            transition: "width 120ms linear",
          }}
        />
      </Box>
    </Box>
  );
};
