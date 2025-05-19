import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight, FaCircle } from "react-icons/fa";
import styles from "./Slider.module.css";

Slider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  intervalTime: PropTypes.number,
  autoPlay: PropTypes.bool,
  showDots: PropTypes.bool,
  showArrows: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  aspectRatio: PropTypes.string,
  breakpoints: PropTypes.object,
};

export default function Slider({
  images = [],
  intervalTime = 5000,
  autoPlay = true,
  showDots = true,
  showArrows = true,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const sliderRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!autoPlay || images.length <= 1 || isPaused) return;

    const interval = setInterval(nextSlide, intervalTime);
    return () => clearInterval(interval);
  }, [autoPlay, images.length, intervalTime, isPaused, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
  };

  if (images.length === 0) {
    return (
      <div className={styles.emptySlider}>
        <p>No images to display</p>
      </div>
    );
  }

  return (
    <div
      ref={sliderRef}
      className={styles.sliderContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.slider}>
        {images.map((src, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentSlide ? styles.active : ""
            }`}
            aria-hidden={index !== currentSlide}
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className={styles.slideImg}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {showArrows && images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prev}`}
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <FaChevronLeft />
            </button>
            <button
              className={`${styles.navButton} ${styles.next}`}
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {showDots && images.length > 1 && (
          <div className={styles.dotsContainer} role="tablist">
            {images.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${
                  index === currentSlide ? styles.activeDot : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={index === currentSlide}
                role="tab"
              >
                <FaCircle />
              </button>
            ))}
          </div>
        )}

        <div className={styles.slideCounter}>
          {currentSlide + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
