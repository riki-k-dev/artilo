import { useEffect, useState } from "react";
import gsap from "gsap";

const CustomLoader = () => {
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    gsap.set(".artilo-text", {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "center center",
      top: "50%",
      left: "54.5%",
    });

    const timeout = setTimeout(() => {
      gsap.set(".artilo-text", { filter: "brightness(10)" });

      gsap.to(".artilo-text", {
        scale: 0.5,
        y: "-47vh",
        duration: 1.4,
        ease: "power3.inOut",
        onComplete: () => {
          setHasMoved(true);
        },
      });

      gsap.to(".loader-bg", {
        opacity: 0,
        duration: 1,
        delay: 0.6,
        onComplete: () => {
          const bg = document.querySelector(".loader-bg");
          if (bg) bg.style.display = "none";
        },
      });
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-100 z-[9998] loader-bg" />

      {/* Artilo Text */}
      <h1
        className="artilo-text text-6xl font-bold text-neutral-900 fixed"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          transformOrigin: "center center",
          animation: hasMoved
            ? "none"
            : "pulseBrightness 2s ease-in-out infinite",
          zIndex: 10000,
          pointerEvents: "none",
          textAlign: "center",
          mixBlendMode: "difference",
          filter: "brightness(10)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        Artilo
      </h1>
    </>
  );
};

export default CustomLoader;
