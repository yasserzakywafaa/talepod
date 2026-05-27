import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Box, ButtonBase, IconButton } from "@mui/material";
import {
  CloseRounded,
  GridViewOutlined,
  ViewCarouselOutlined,
} from "@mui/icons-material";
import { FC, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Story } from "src/components/StoryCreator/store/state";
import type { Swiper as SwiperClass } from "swiper";
import characterKitten from "src/assets/images/landing_pages/dreamy_kitten.webp";
import characterLion from "src/assets/images/landing_pages/lion_cub.webp";
import characterMonkey from "src/assets/images/landing_pages/monkey_holding_banana.webp";
import characterOwl from "src/assets/images/landing_pages/wise_owl.webp";
import mascotFox from "src/assets/images/dreaming_fox_with_a_pillow.webp";
import mascotSleepingBunny from "src/assets/images/sleeping_bunny_with_a_moon.webp";

/**
 * Paged comic-book reader (ebook style): swipeable full-bleed scenes with a
 * reliable caption card and a thumbnail grid to jump pages.
 * Until real illustrations are generated, scenes use the brand's watercolor
 * gradient + a placeholder mascot keyed off the page index.
 */
const PLACEHOLDER_ART = [
  mascotSleepingBunny,
  characterKitten,
  characterOwl,
  mascotFox,
  characterLion,
  characterMonkey,
];

const SCENE_GRADIENT =
  "linear-gradient(170deg, oklch(0.36 0.10 280) 0%, oklch(0.55 0.13 30) 100%)";
const STARS =
  "radial-gradient(circle at 18% 22%, rgba(255,213,107,0.85) 0 3px, transparent 4px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.7) 0 2.5px, transparent 4px), radial-gradient(circle at 65% 70%, rgba(255,213,107,0.7) 0 2px, transparent 3px), radial-gradient(circle at 35% 85%, rgba(255,255,255,0.6) 0 1.5px, transparent 3px)";

const artFor = (index: number, imageUrl?: string) =>
  imageUrl || PLACEHOLDER_ART[index % PLACEHOLDER_ART.length];

export interface ComicReaderProps {
  story: Story;
}

const ComicReader: FC<ComicReaderProps> = ({ story }) => {
  const pages = story.pages ?? [];
  const total = pages.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  if (!total) return null;

  if (showGrid) {
    return (
      <Box sx={{ maxWidth: 720, margin: "8px auto 0" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: 13,
              color: "var(--fg-2)",
            }}
          >
            <ViewCarouselOutlined
              sx={{ fontSize: 16, color: "var(--honey-400)" }}
            />
            Comic · {total} pages · tap a page to jump
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setShowGrid(false)}
            sx={{ color: "var(--fg)" }}
          >
            <CloseRounded />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          {pages.map((p, i) => {
            const current = i === activeIndex;
            const hasGeneratedArt = !!p.imageUrl;
            return (
              <ButtonBase
                key={i}
                onClick={() => {
                  setActiveIndex(i);
                  setShowGrid(false);
                  swiper?.slideTo(i);
                }}
                sx={{
                  display: "block",
                  width: "100%",
                  padding: 0,
                  background: "var(--surface)",
                  borderRadius: "var(--r-lg)",
                  overflow: "hidden",
                  textAlign: "left",
                  border: current
                    ? "2px solid var(--honey-400)"
                    : "1px solid var(--border)",
                  boxShadow: current ? "var(--glow-honey)" : "var(--shadow-xs)",
                }}
              >
                <Box
                  sx={{
                    aspectRatio: "4/5",
                    background: SCENE_GRADIENT,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Box
                    component="img"
                    src={artFor(i, p.imageUrl)}
                    alt=""
                    sx={
                      hasGeneratedArt
                        ? {
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }
                        : { width: "78%", marginBottom: "-2px" }
                    }
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: "6px",
                      left: "6px",
                      background: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "999px",
                    }}
                  >
                    {i + 1}
                  </Box>
                </Box>
                <Box
                  className="tp-clamp-2"
                  sx={{
                    padding: "8px 10px",
                    fontSize: 11,
                    lineHeight: 1.3,
                    color: "var(--fg-2)",
                    fontWeight: 500,
                  }}
                >
                  {p.caption}
                </Box>
              </ButtonBase>
            );
          })}
        </Box>
      </Box>
    );
  }

  return (
    <Box className="comic-reader">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={18}
        slidesPerView={1}
        initialSlide={activeIndex}
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
      >
        {pages.map((page, index) => {
          const hasGeneratedArt = !!page.imageUrl;
          return (
            <SwiperSlide key={page.index ?? index}>
              <Box
                sx={{
                  position: "relative",
                  aspectRatio: "4/3",
                  borderRadius: "var(--r-xl)",
                  overflow: "hidden",
                  background: SCENE_GRADIENT,
                  boxShadow: "var(--shadow-lg)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: hasGeneratedArt ? "none" : STARS,
                  }}
                />
                <Box
                  component="img"
                  src={artFor(index, page.imageUrl)}
                  alt=""
                  sx={
                    hasGeneratedArt
                      ? {
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }
                      : {
                          width: "48%",
                          marginBottom: "-2px",
                          position: "relative",
                          filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.4))",
                        }
                  }
                />

                <IconButton
                  aria-label="All pages"
                  onClick={() => setShowGrid(true)}
                  sx={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(0,0,0,0.35)",
                    color: "#fff",
                    zIndex: 3,
                    "&:hover": { background: "rgba(0,0,0,0.5)" },
                  }}
                >
                  <GridViewOutlined sx={{ fontSize: 18, color: "#fff" }} />
                </IconButton>
              </Box>

              {/* Caption card keeps the story readable even if generated image text is imperfect. */}
              <Box
                sx={{
                  marginTop: "14px",
                  background: "var(--surface)",
                  borderRadius: "var(--r-lg)",
                  padding: "14px 18px",
                  border: "1px solid var(--border)",
                }}
              >
                <Box
                  sx={{
                    fontFamily: "var(--font-accent)",
                    fontSize: 18,
                    color: "var(--honey-300)",
                    marginBottom: "4px",
                  }}
                >
                  Page {index + 1} of {total}
                </Box>
                <Box
                  dir="auto"
                  sx={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: "var(--fg)",
                    fontWeight: 400,
                  }}
                >
                  {page.caption}
                </Box>
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};

export default ComicReader;
