import Particles, {
  ParticlesProvider,
  useParticlesProvider,
} from "@tsparticles/react";
import {
  primaryColor,
  secondaryColorForLightTheme,
  white,
} from "src/application/shared/themes";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { loadSlim } from "@tsparticles/slim";

const ParticlesInner = () => {
  const { loaded } = useParticlesProvider();

  const {
    store: {
      state: { themeMode },
    },
  } = useApplicationContext();
  const { isMobile } = useDeviceSize();

  return (
    loaded && (
      <Particles
        id="tsparticles"
        options={{
          fullScreen: true,
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: false,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
            },
            modes: {
              push: {
                quantity: 1,
              },
              repulse: {
                distance: 100,
                duration: 0.1,
              },
            },
          },
          particles: {
            color: {
              value: themeMode === "dark" ? white : primaryColor,
            },
            links: {
              color: themeMode === "dark" ? white : secondaryColorForLightTheme,
              distance: 150,
              enable: false,
              opacity: 0.25,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 1,
              straight: false,
            },
            number: {
              density: { enable: true },
              value: isMobile ? 40 : 10,
            },
            opacity: {
              value: 0.75,
            },
            shape: {
              type: "star",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />
    )
  );
};

export const ParticlesComponent = () => (
  <ParticlesProvider init={async (engine) => loadSlim(engine)}>
    <ParticlesInner />
  </ParticlesProvider>
);
