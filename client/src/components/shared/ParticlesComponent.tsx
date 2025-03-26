import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  primaryColor,
  secondaryColorForLightTheme,
  white,
} from "src/application/shared/themes";
import { useEffect, useState } from "react";

import { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

export const ParticlesComponent = () => {
  const [init, setInit] = useState(false);

  const {
    store: {
      state: { themeMode },
    },
  } = useApplicationContext();
  const { isMobile } = useDeviceSize();

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  //   const particlesLoaded = async (container: Container): Promise<void> => {
  //     console.log("container:>>>", container);
  //   };

  return (
    init && (
      <Particles
        id="tsparticles"
        // particlesLoaded={particlesLoaded}
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
              value: primaryColor,
            },
            links: {
              color: themeMode === "dark" ? white : secondaryColorForLightTheme,
              distance: 150,
              enable: true,
              opacity: 0.25,
              width: 1,
            },
            move: {
              direction: "right",
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
              value: isMobile ? 100 : 40,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
              // type: "image",
              // options: {
              //   image: {
              //     src: logo,
              //     // width: 300,
              //     // height: 300,
              //   },
              // },
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
    )
  );
};
