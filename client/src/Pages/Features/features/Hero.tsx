import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CreateStoryFormMini from "src/components/StoryCreator/features/CreateStoryFormMini";
import { CheckCircleOutlined, PlayArrowRounded } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import bunny from "../../../assets/images/sleeping_bunny_with_a_moon.webp";
import penguin from "../../../assets/images/cute_penguin_with_a_fish.webp";

// Decorative twinkling-stars layer (faithful to design MHero).
const STAR_FIELD =
  "radial-gradient(circle at 8% 18%, rgba(255,213,107,0.6) 0 1.6px, transparent 2.2px)," +
  "radial-gradient(circle at 88% 12%, rgba(255,255,255,0.6) 0 1.2px, transparent 2px)," +
  "radial-gradient(circle at 62% 60%, rgba(255,213,107,0.45) 0 1px, transparent 1.5px)," +
  "radial-gradient(circle at 22% 78%, rgba(255,255,255,0.45) 0 1px, transparent 2px)," +
  "radial-gradient(circle at 50% 30%, rgba(255,213,107,0.35) 0 1px, transparent 1.5px)," +
  "radial-gradient(circle at 78% 70%, rgba(255,255,255,0.4) 0 0.8px, transparent 1.5px)";

const TRUST = ["No card required", "11 languages", "Kid-safe"];

const Hero = () => {
  return (
    <Box id="hero" sx={{ mt: { xs: 1, sm: 3 }, mb: { xs: 3, sm: 6 } }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: { xs: "var(--r-xl)", sm: "var(--r-2xl)" },
          background: "var(--bg-twilight)",
          color: "#fff",
          px: { xs: 3, sm: 5, md: 6 },
          py: { xs: 5, sm: 7, md: 9 },
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* stars */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: STAR_FIELD,
          }}
        />

        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 5, md: 7 },
          }}
        >
          {/* ── Left: copy ───────────────────────────────────── */}
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", md: 620 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Chip variant="badge" label="New · Now in comic format" />

            <Typography
              component="h1"
              sx={{
                fontFamily: "var(--font-display)",
                fontSize: { xs: "2.5rem", sm: "3.25rem", md: "4rem" },
                lineHeight: 1.04,
                m: "16px 0 18px",
                color: "#fff",
              }}
            >
              Bedtime stories,
              <br />
              <Box
                component="span"
                sx={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--honey-300), #FCBFC2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                made just for them.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontFamily: "var(--font-body)",
                fontSize: { xs: 16, sm: 18 },
                lineHeight: 1.55,
                opacity: 0.85,
                mb: 3.5,
                maxWidth: 520,
                mx: { xs: "auto", md: 0 },
              }}
            >
              TalePod turns your child's name, age and interests into a magical
              story, narrated by warm AI voices and now illustrated with soft
              watercolour art. Ready in under a minute.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mb: 2.5,
                flexWrap: "wrap",
              }}
            >
              <CreateStoryFormMini />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2.25,
                opacity: 0.75,
                fontSize: 12,
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              {TRUST.map((t) => (
                <Box
                  key={t}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                  }}
                >
                  <CheckCircleOutlined
                    sx={{ fontSize: 14, color: "var(--honey-300)" }}
                  />
                  {t}
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── Right: phone-preview cluster (desktop/tablet) ── */}
          <Box
            sx={{
              position: "relative",
              flex: "0 0 auto",
              width: { sm: 360, md: 380 },
              height: { sm: 460, md: 480 },
              display: { xs: "none", sm: "block" },
            }}
          >
            {/* Main story card */}
            <Box
              sx={{
                position: "absolute",
                top: 30,
                left: 0,
                width: { sm: 300, md: 340 },
                height: { sm: 380, md: 420 },
                background: "linear-gradient(170deg,#FFE6A8,#C9B6E8,#7c6baf)",
                borderRadius: "36px",
                p: "6px",
                boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
                transform: "rotate(-3deg)",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "30px",
                  background: "var(--bg-twilight)",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  p: "30px 20px",
                  color: "#fff",
                }}
              >
                <Box
                  sx={{
                    fontFamily: "var(--font-accent)",
                    fontSize: 18,
                    color: "var(--honey-300)",
                  }}
                >
                  For Lila · age 5
                </Box>
                <Box
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontSize: 26,
                    lineHeight: 1.1,
                    m: "4px 0 10px",
                  }}
                >
                  When the Moon Forgot to Glow
                </Box>
                <Box sx={{ flex: 1, position: "relative" }}>
                  <Box
                    component="img"
                    src={bunny}
                    alt=""
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "75%",
                      filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.3))",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: "999px",
                    p: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--honey-400)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <PlayArrowRounded sx={{ fontSize: 16, color: "#fff" }} />
                  </Box>
                  <Box sx={{ fontSize: 11 }}>
                    <Box sx={{ fontWeight: 600 }}>Fairy Tale voice</Box>
                    <Box sx={{ opacity: 0.7 }}>2:42 / 8:00</Box>
                  </Box>
                  <Box sx={{ ml: "auto", fontSize: 18 }}>✨</Box>
                </Box>
              </Box>
            </Box>

            {/* Floating mini-card */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: { sm: -10, md: -20 },
                width: 200,
                background: "var(--surface)",
                color: "var(--fg)",
                borderRadius: "var(--r-lg)",
                p: 1.75,
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                border: "1px solid var(--border)",
                transform: "rotate(4deg)",
              }}
            >
              <Box
                sx={{
                  aspectRatio: "5 / 4",
                  borderRadius: "12px",
                  background: "linear-gradient(160deg,#A8DADC,#B8E0E2)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  mb: 1,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={penguin}
                  alt=""
                  sx={{ width: "70%", mb: "-2px" }}
                />
              </Box>
              <Box
                sx={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  lineHeight: 1.2,
                  color: "var(--fg)",
                }}
              >
                Pip the Penguin's First Snowflake
              </Box>
              <Box sx={{ fontSize: 10, color: "var(--fg-3)", mt: 0.4 }}>
                For Lila · 6 min
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
