import React, { useState, useRef, useEffect } from "react";

export default function LazyImage({
  src,
  alt,
  className,
  color,
  scrollContainerRef,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Check if image is cached
    const image = new Image();
    image.src = src;

    image.onload = () => {
      // Image is cached, load immediately
      setIsLoaded(true);
    };

    image.onerror = () => {
      // Image is not cached, proceed with lazy loading
      if (scrollContainerRef?.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setIsLoaded(true);
                observer.unobserve(entry.target);
              }
            });
          },
          {
            root: scrollContainerRef.current,
            threshold: 0.1,
          }
        );

        if (imgRef.current) {
          observer.observe(imgRef.current);
        }

        return () => {
          observer.disconnect();
        };
      }
    };
  }, [src, scrollContainerRef]);

  return (
    <>
      <img
        ref={imgRef}
        src={isLoaded ? src : ""}
        alt={alt}
        className={`${className} ${!isLoaded ? "opacity-0" : ""}`}
        loading="lazy"
      />
      <div
        className="absolute left-0 top-0 w-full h-full -z-10 tablet:rounded-lg shimmer"
        style={{ backgroundColor: color }}
      ></div>
    </>
  );
}
