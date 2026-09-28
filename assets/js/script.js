// Mobile Menu Navigation
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("#mainNav");
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
}
document.querySelectorAll("#mainNav a").forEach((a) =>
  a.addEventListener("click", () => nav.classList.remove("open"))
);

// Dynamic Copyright Year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Testimonials Slider Component
(function initTestimonialsSlider() {
  const sliderEl = document.getElementById("testimonialSlider");
  const track = document.getElementById("sliderTrack");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  const dotsContainer = document.getElementById("sliderDots");
  const counterEl = document.getElementById("sliderCounter");

  if (!sliderEl || !track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = Array.from(track.children);
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoPlayTimer = null;
  let touchStartX = 0;
  let touchMoveX = 0;
  let isTouching = false;

  function getCardsPerView() {
    const width = window.innerWidth;
    if (width <= 560) return 1;
    if (width <= 850) return 2;
    return 3;
  }

  function getMaxIndex() {
    const cardsPerView = getCardsPerView();
    return Math.max(0, totalSlides - cardsPerView);
  }

  function renderDots() {
    dotsContainer.innerHTML = "";
    const maxIdx = getMaxIndex();
    const dotsCount = maxIdx + 1;

    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement("button");
      dot.className = "slider-dot" + (i === currentIndex ? " active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Menuju slide testimoni ${i + 1}`);
      dot.setAttribute("aria-selected", i === currentIndex ? "true" : "false");
      dot.addEventListener("click", () => {
        goToSlide(i);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateSliderPosition() {
    const cardsPerView = getCardsPerView();
    const maxIdx = getMaxIndex();

    if (currentIndex > maxIdx) {
      currentIndex = maxIdx;
    }

    const gap = 20; // 20px gap matching CSS
    const containerWidth = sliderEl.clientWidth;
    const cardWidth = (containerWidth - gap * (cardsPerView - 1)) / cardsPerView;
    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    const dots = dotsContainer.querySelectorAll(".slider-dot");
    dots.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // Update counter
    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1} / ${maxIdx + 1}`;
    }

    // Update aria state on slides
    slides.forEach((slide, idx) => {
      const isVisible = idx >= currentIndex && idx < currentIndex + cardsPerView;
      slide.setAttribute("aria-hidden", isVisible ? "false" : "true");
    });
  }

  function goToSlide(index) {
    const maxIdx = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, maxIdx));
    updateSliderPosition();
  }

  function nextSlide() {
    const maxIdx = getMaxIndex();
    if (currentIndex < maxIdx) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(0);
    }
  }

  function prevSlide() {
    const maxIdx = getMaxIndex();
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else {
      goToSlide(maxIdx);
    }
  }

  prevBtn.addEventListener("click", () => {
    prevSlide();
    restartAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    restartAutoplay();
  });

  // Keyboard navigation when focusing the slider
  sliderEl.setAttribute("tabindex", "0");
  sliderEl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
      restartAutoplay();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
      restartAutoplay();
    }
  });

  // Touch swipe support for mobile
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchMoveX = touchStartX;
    isTouching = true;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener("touchmove", (e) => {
    if (!isTouching) return;
    touchMoveX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", () => {
    if (!isTouching) return;
    isTouching = false;
    const diff = touchStartX - touchMoveX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    restartAutoplay();
  });

  // Autoplay functionality (pauses on user interaction)
  function startAutoplay() {
    stopAutoplay();
    autoPlayTimer = setInterval(() => {
      nextSlide();
    }, 5500);
  }

  function stopAutoplay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  sliderEl.addEventListener("mouseenter", stopAutoplay);
  sliderEl.addEventListener("mouseleave", startAutoplay);
  sliderEl.addEventListener("focusin", stopAutoplay);
  sliderEl.addEventListener("focusout", startAutoplay);

  // Resize listener with debounce
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderDots();
      updateSliderPosition();
    }, 120);
  });

  // Initial setup
  renderDots();
  updateSliderPosition();
  startAutoplay();
})();