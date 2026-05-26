import { FC, useState } from "react";

import { Icon, IconBtn } from "src/components/shared/v2";
import { Story } from "src/components/StoryCreator/store/state";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import characterKitten from "src/assets/images/v2/character_kitten.webp";
import characterLion from "src/assets/images/v2/character_lion.webp";
import characterMonkey from "src/assets/images/v2/character_monkey.webp";
import characterOwl from "src/assets/images/v2/character_owl.webp";
import mascotFox from "src/assets/images/v2/mascot_fox.webp";
import mascotSleepingBunny from "src/assets/images/v2/mascot_sleeping_bunny.webp";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
      <div style={{ maxWidth: 720, margin: "8px auto 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--fg-2)",
            }}
          >
            <Icon name="view_carousel" size={16} color="var(--honey-400)" />
            Comic · {total} pages · tap a page to jump
          </div>
          <IconBtn name="close" size={38} onClick={() => setShowGrid(false)} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          {pages.map((p, i) => {
            const current = i === activeIndex;
            const hasGeneratedArt = !!p.imageUrl;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveIndex(i);
                  setShowGrid(false);
                  swiper?.slideTo(i);
                }}
                style={{
                  padding: 0,
                  cursor: "pointer",
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
                <div
                  style={{
                    aspectRatio: "4/5",
                    background: SCENE_GRADIENT,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <img
                    src={artFor(i, p.imageUrl)}
                    alt=""
                    style={
                      hasGeneratedArt
                        ? {
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }
                        : { width: "78%", marginBottom: -2 }
                    }
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 6,
                      left: 6,
                      background: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 999,
                    }}
                  >
                    {i + 1}
                  </div>
                </div>
                <div
                  style={{
                    padding: "8px 10px",
                    fontSize: 11,
                    lineHeight: 1.3,
                    color: "var(--fg-2)",
                    fontWeight: 500,
                  }}
                  className="tp-clamp-2"
                >
                  {p.caption}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="comic-reader">
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
              <div
                style={{
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
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: hasGeneratedArt ? "none" : STARS,
                  }}
                />
                <img
                  src={artFor(index, page.imageUrl)}
                  alt=""
                  style={
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
                          marginBottom: -2,
                          position: "relative",
                          filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.4))",
                        }
                  }
                />

                <button
                  type="button"
                  aria-label="All pages"
                  onClick={() => setShowGrid(true)}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(0,0,0,0.35)",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 3,
                  }}
                >
                  <Icon name="grid_view" size={18} color="#fff" />
                </button>
              </div>

              {/* Caption card keeps the story readable even if generated image text is imperfect. */}
              <div
                style={{
                  marginTop: 14,
                  background: "var(--surface)",
                  borderRadius: "var(--r-lg)",
                  padding: "14px 18px",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: 18,
                    color: "var(--honey-300)",
                    marginBottom: 4,
                  }}
                >
                  Page {index + 1} of {total}
                </div>
                <div
                  dir="auto"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: "var(--fg)",
                    fontWeight: 400,
                  }}
                >
                  {page.caption}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ComicReader;
