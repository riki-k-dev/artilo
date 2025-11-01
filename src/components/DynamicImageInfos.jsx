import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const DynamicImageInfos = ({ twitter, position, imageScale, isVisible }) => {
  const textRef = useRef(null);
  const [opacity, setOpacity] = useState(isVisible ? 1 : 0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    gsap.to(
      { value: opacity },
      {
        value: isVisible ? 1 : 0,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: function () {
          setOpacity(this.targets()[0].value);
        },
      }
    );
  }, [isVisible]);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.material.opacity = opacity;
      textRef.current.needsUpdate = true;
    }
  });

  return (
    <Text
      ref={textRef}
      color={isHovered ? "#191919" : "#424242"}
      fontSize={0.2}
      position={[
        position[0] + 0.5 * imageScale,
        position[1] - 1.7 * imageScale,
        position[2],
      ]}
      fillOpacity={opacity}
      onPointerDown={() => {
        isVisible ? window.open(`https://x.com/${twitter}`, "_blank") : null;
      }}
      onPointerEnter={() => {
        document.body.style.cursor = "pointer";
        setIsHovered(true);
      }}
      onPointerLeave={() => {
        document.body.style.cursor = "auto";
        setIsHovered(false);
      }}
    >
      @{twitter}
    </Text>
  );
};

DynamicImageInfos.propTypes = {
  twitter: PropTypes.string,
  position: PropTypes.array,
  imageScale: PropTypes.number,
  isVisible: PropTypes.bool,
};

export default DynamicImageInfos;
