import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextureLoader } from "three";
import gsap from "gsap";
import vertexShader from "../shaders/vertexShader.glsl";
import fragmentShader from "../shaders/fragmentShader.glsl";

const DynamicImage = ({
  imageObject,
  isTransparent,
  imageIndex,
  selectedImage,
  setSelectedImage,
  camera,
  setIsCameraLocked,
}) => {
  const texture = useLoader(TextureLoader, imageObject.image);
  const [dimensions, setDimensions] = useState({ width: 3, height: 3 });

  useEffect(() => {
    const img = new Image();
    img.src = imageObject.image;
    img.onload = () => {
      setDimensions({ width: (img.width * 3) / img.height, height: 3 });
    };
  }, [imageObject.image]);

  const mesh = useRef();
  const uniforms = useRef({
    uTexture: { value: texture },
    uDelta: { value: { x: 0, y: 0 } },
    uOpacity: { value: 1 },
  });

  useEffect(() => {
    const target = mesh.current.material.uniforms.uOpacity;
    gsap.to(target, {
      value: isTransparent ? 0 : 1,
      duration: 0.5,
      delay: 0.03 * imageIndex,
      ease: "power2.out",
    });
  }, [isTransparent, imageIndex]);

  const delta = { x: 0, y: 0 };

  useFrame(() => {
    if (camera) {
      const cam = camera.current;
      if (!cam) return;

      const cameraX = cam.position.x;
      const cameraY = cam.position.y;

      delta.x += (-1 * (imageObject.position[0] - cameraX) - delta.x) * 0.1;
      delta.y += (-1 * (imageObject.position[1] - cameraY) - delta.y) * 0.1;
      uniforms.current.uDelta.value = { x: delta.x, y: delta.y };
    } else {
      delta.x += (0 - delta.x) * 0.1;
      delta.y += (0 - delta.y) * 0.1;
      uniforms.current.uDelta.value = { x: delta.x, y: delta.y };
    }
  });

  const isClickable =
    !selectedImage || selectedImage.index === imageIndex;

  return (
    <mesh
      ref={mesh}
      position={imageObject.position ?? [0, 0, 0]}
      scale={imageObject.scale ?? 1}

      onPointerDown={(e) => {
        if (!isClickable) return;
        e.stopPropagation();

        setIsCameraLocked(true);
        setSelectedImage({
          index: imageIndex,
          position: imageObject.position,
        });
      }}

      onPointerEnter={() => {
        if (isClickable) document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <planeGeometry args={[dimensions.width, dimensions.height, 10, 10]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
};

DynamicImage.propTypes = {
  imageObject: PropTypes.object,
  isTransparent: PropTypes.bool,
  imageIndex: PropTypes.number,
  selectedImage: PropTypes.object,
  setSelectedImage: PropTypes.func,
  camera: PropTypes.object,
  setIsCameraLocked: PropTypes.func,
};

export default DynamicImage;
