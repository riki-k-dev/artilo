import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import ArtistDetails from "./components/ArtistDetails";
import Scene from "./components/Scene";
import creativeImages from "./content/CreativeImages";
import CustomLoader from "./components/CustomLoader";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageObject, setSelectedImageObject] = useState(null);

  useEffect(() => {
    if (selectedImage && selectedImage.index !== -1) {
      setSelectedImageObject(creativeImages[selectedImage.index]);
    } else {
      setSelectedImageObject(null);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (
      selectedImage &&
      selectedImage.index !== -1 &&
      creativeImages[selectedImage.index].gallery
    ) {
      document.body.style.overflowY = "auto";
    } else {
      document.body.style.overflowY = "hidden";
    }
  }, [selectedImage]);

  return (
    <>
      <CustomLoader />
      <div className="h-screen w-screen relative bg-gray-100 max-[520px]:hidden">
        <Canvas>
          <Suspense fallback={null}>
            <Scene
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
          </Suspense>
        </Canvas>

        <Loader
          containerStyles={{
            backgroundColor: "#f3f4f6",
            color: "#191919",
          }}
          barStyles={{
            background: "#191919",
            height: "2px",
            color: "#191919",
          }}
        />

        <ArtistDetails
          artistDetails={selectedImageObject}
          imageIndex={selectedImage?.index ?? -1}
          setSelectedImageIndex={() => setSelectedImage(null)}
        />
      </div>

      <div className="fixed top-0 left-0 h-screen w-screen items-center justify-center hidden p-9 max-[520px]:flex bg-gray-100">
        <p className="text-sm uppercase text-neutral-900 text-center">
          Sorry, this site is not available on smaller screens. Please use a desktop!
        </p>
      </div>
    </>
  );
}

export default App;
