import React, { useState, useRef, useEffect } from "react";

export default function LazyImage({
  src,
  alt,
  className,
  color,
  checkCache,
  scrollContainerRef,
  srcSet,
  sizes,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const options = {
      root: scrollContainerRef.current,
      threshold: 0.01,
      rootMargin: "197px 148px",
    };

    if (checkCache) {
      // Check cache only if articleIdx is less than or equal to 4
      const image = new Image();
      image.src = src;

      image.onload = () => {
        setIsLoaded(true);
      };

      image.onerror = () => {
        // Image is not cached, proceed with lazy loading
        if (scrollContainerRef?.current) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setIsLoaded(true);
                observer.unobserve(entry.target);
              }
            });
          }, options);

          if (imgRef.current) {
            observer.observe(imgRef.current);
          }

          return () => {
            observer.disconnect();
          };
        }
      };
    } else {
      if (scrollContainerRef?.current) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsLoaded(true);
              observer.unobserve(entry.target);
            }
          });
        }, options);

        if (imgRef.current) {
          observer.observe(imgRef.current);
        }

        return () => {
          observer.disconnect();
        };
      }
    }
  }, [checkCache, src, scrollContainerRef]);

  return (
    <>
      <img
        ref={imgRef}
        src={isLoaded ? src : null}
        srcSet={isLoaded ? srcSet : null}
        sizes={sizes}
        alt={alt}
        className={`${className} ${!isLoaded ? "opacity-0" : ""}`}
        loading="eager"
      />
      <div
        className="absolute left-0 top-0 w-full h-full -z-10 tablet:rounded-lg shimmer"
        style={{ backgroundColor: color }}
      ></div>
    </>
  );
}
