import { useEffect, useRef } from "react";
import gsap from "gsap";
import PropTypes from "prop-types";

const ArtistDetails = ({
  artistDetails,
  imageIndex,
  setSelectedImageIndex,
}) => {
  const numberRef = useRef(null);
  const nameRef = useRef(null);
  const descRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!numberRef.current || !nameRef.current) return;
    const ctx = gsap.context(() => {
      if (imageIndex !== -1 && artistDetails) {
        gsap.to(numberRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: 0.3,
          ease: "power2.out",
        });
        gsap.to(nameRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to([numberRef.current, nameRef.current], {
          opacity: 0,
          x: -50,
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    });
    return () => ctx.revert();
  }, [imageIndex, artistDetails]);

  useEffect(() => {
    if (!closeRef.current) return;
    const ctx = gsap.context(() => {
      if (imageIndex !== -1 && artistDetails) {
        gsap.to(closeRef.current, {
          opacity: 1,
          duration: 0.5,
          delay: 0.4,
          ease: "power2.out",
        });
      } else {
        gsap.to(closeRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    });
    return () => ctx.revert();
  }, [imageIndex, artistDetails]);

  if (!artistDetails) return null;

  return (
    <>
      <div className="absolute top-[13%] left-[13%] flex flex-col gap-1 text-neutral-900 pointer-events-none">
        <p
          ref={numberRef}
          className="text-3xl font-bold tracking-wide opacity-0 translate-x-[-50px]"
        >
          No.{artistDetails.number}
        </p>
        <h2 ref={nameRef} className="text-3xl opacity-0 translate-x-[-70px]">
          {artistDetails.name}
        </h2>
      </div>

      {artistDetails.description && (
        <div className="absolute bottom-[13%] right-[13%] text-neutral-900 pointer-events-none">
          <p
            ref={descRef}
            className="text-sm text-right text-balance w-56 max-lg:hidden"
          >
            {artistDetails.description}
          </p>
        </div>
      )}

      <button
        onClick={() => setSelectedImageIndex(-1)}
        className="absolute top-[13%] right-[13%]"
      >
        <img
          ref={closeRef}
          src="/icons/close.svg"
          alt="Close"
          className="w-10 cursor-pointer opacity-0 transition-opacity duration-300"
        />
      </button>
    </>
  );
};

ArtistDetails.propTypes = {
  artistDetails: PropTypes.object,
  imageIndex: PropTypes.number,
  setSelectedImageIndex: PropTypes.func,
};

export default ArtistDetails;
