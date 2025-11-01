import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import PropTypes from "prop-types";
import { useMemo, useRef, useEffect, useState } from "react";
import creativeImages from "../content/CreativeImages";
import useMouse from "../hooks/useMouse";
import DynamicImage from "./DynamicImage";
import gsap from "gsap";

const Scene = ({ selectedImage, setSelectedImage }) => {
  const cameraRef = useRef();
  const mouse = useMouse();
  const [isCameraLocked, setIsCameraLocked] = useState(false);

  const { minX, maxX, minY, maxY } = useMemo(() => {
    const xs = creativeImages.map((i) => i.position[0]);
    const ys = creativeImages.map((i) => i.position[1]);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }, []);

  const spacingX = maxX - minX + 6;
  const spacingY = maxY - minY + 6;
  const zoomZ = 7;

  const repeatedImages = useMemo(() => {
    const clones = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        creativeImages.forEach((img, index) => {
          clones.push({
            ...img,
            position: [
              img.position[0] + i * spacingX,
              img.position[1] + j * spacingY,
              img.position[2],
            ],
            id: `${index}-${i}-${j}`,
            originalIndex: index,
          });
        });
      }
    }
    return clones;
  }, [spacingX, spacingY]);

  useEffect(() => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    if (selectedImage) {
      setIsCameraLocked(true);
      gsap.to(cam.position, {
        x: selectedImage.position[0],
        y: selectedImage.position[1],
        z: zoomZ,
        duration: 1.2,
        ease: "power2.inOut",
      });
    } else {
      setIsCameraLocked(false);
      gsap.to(cam.position, {
        x: 0,
        y: 0,
        z: 10,
        duration: 1.2,
        ease: "power2.inOut",
      });
    }
  }, [selectedImage]);

  useFrame(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    if (!selectedImage && !isCameraLocked) {
      const speedFactor = 0.06;
      cam.position.x += mouse.x.get() * speedFactor;
      cam.position.y += mouse.y.get() * speedFactor;
    }
    if (cam.position.x > maxX + spacingX / 2) cam.position.x -= spacingX;
    if (cam.position.x < minX - spacingX / 2) cam.position.x += spacingX;
    if (cam.position.y > maxY + spacingY / 2) cam.position.y -= spacingY;
    if (cam.position.y < minY - spacingY / 2) cam.position.y += spacingY;
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={3} />
      <group>
        {repeatedImages.map((image) => (
          <DynamicImage
            key={image.id}
            camera={
              selectedImage?.index === image.originalIndex ? cameraRef : null
            }
            imageObject={image}
            isTransparent={
              selectedImage && selectedImage.index !== image.originalIndex
            }
            imageIndex={image.originalIndex}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            setIsCameraLocked={setIsCameraLocked}
          />
        ))}
      </group>
    </>
  );
};

Scene.propTypes = {
  selectedImage: PropTypes.object,
  setSelectedImage: PropTypes.func,
};

export default Scene;
