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

// Testimonials Social Media Sharing (Facebook, LinkedIn, WhatsApp & Copy Link)
(function initTestimonialsSharing() {
  const shareFb = document.getElementById("shareFacebookBtn");
  const shareLi = document.getElementById("shareLinkedinBtn");
  const shareWa = document.getElementById("shareWhatsappBtn");
  const shareCopy = document.getElementById("shareCopyBtn");
  const shareCopyText = document.getElementById("shareCopyText");
  let copyTimer = null;

  function getShareDetails() {
    const isEn = (localStorage.getItem("husni_lang") || "id") === "en";
    const shareUrl = window.location.origin + window.location.pathname + "#testimoni";
    
    const defaultText = isEn
      ? "Highly recommended heavy equipment & excavator rental service in Balangan and Tabalong (South Kalimantan) — proven field results and reliable operators."
      : "Rekomendasi rental excavator terpercaya di Balangan & Tabalong, Kalimantan Selatan. Unit prima, operator handal, siap kerja untuk borongan, harian, dan bulanan.";

    return { isEn, shareUrl, defaultText };
  }

  function updateMainShareLinks() {
    const { isEn, shareUrl, defaultText } = getShareDetails();

    if (shareFb) {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(defaultText)}`;
      shareFb.href = fbUrl;
    }

    if (shareLi) {
      const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      shareLi.href = liUrl;
    }

    if (shareWa) {
      const waText = encodeURIComponent(`${defaultText}\n\nInfo selengkapnya: ${shareUrl}`);
      shareWa.href = `https://api.whatsapp.com/send?text=${waText}`;
    }
  }

  // Copy link handler
  if (shareCopy) {
    shareCopy.addEventListener("click", () => {
      const { isEn, shareUrl } = getShareDetails();
      const currentLang = isEn ? "en" : "id";
      const t = typeof translations !== "undefined" && translations[currentLang] ? translations[currentLang].testimoni : null;
      const copiedText = t && t.shareCopied ? t.shareCopied : (isEn ? "✓ Link Copied!" : "✓ Tautan Disalin!");
      const defaultBtnText = t && t.shareCopy ? t.shareCopy : (isEn ? "Copy Link" : "Salin Tautan");

      const doCopySuccess = () => {
        shareCopy.classList.add("is-copied");
        if (shareCopyText) shareCopyText.textContent = copiedText;
        if (copyTimer) clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
          shareCopy.classList.remove("is-copied");
          if (shareCopyText) shareCopyText.textContent = defaultBtnText;
        }, 2200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(doCopySuccess).catch(() => {
          fallbackCopy(shareUrl, doCopySuccess);
        });
      } else {
        fallbackCopy(shareUrl, doCopySuccess);
      }
    });
  }

  function fallbackCopy(text, callback) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      if (typeof callback === "function") callback();
    } catch (e) {
      console.warn("Copy to clipboard fallback failed:", e);
    }
    document.body.removeChild(textarea);
  }

  // Card-level share buttons
  document.querySelectorAll(".btn-card-share").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const platform = btn.getAttribute("data-platform");
      const card = btn.closest(".testimonial-card");
      if (!card) return;

      const bodyEl = card.querySelector(".testimonial-body");
      const authorEl = card.querySelector(".author-info strong");
      const roleEl = card.querySelector(".author-info span");
      const quoteText = bodyEl ? bodyEl.textContent.trim().replace(/^["']|["']$/g, "") : "";
      const author = authorEl ? authorEl.textContent.trim() : "";
      const role = roleEl ? roleEl.textContent.trim() : "";

      const shareUrl = window.location.origin + window.location.pathname + "#testimoni";
      const customShareText = `"${quoteText}" — ${author} (${role}) | HUSNI RENTAL EXCAVATOR Balangan`;

      let targetUrl = "";
      if (platform === "facebook") {
        targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(customShareText)}`;
      } else if (platform === "linkedin") {
        targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      } else if (platform === "whatsapp") {
        targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(customShareText + "\n\n" + shareUrl)}`;
      }

      if (targetUrl) {
        window.open(targetUrl, "_blank", "noopener,noreferrer,width=620,height=580");
      }
    });
  });

  // Expose link updater for language changes
  window.updateTestimonialsShareLinks = updateMainShareLinks;

  // Initialize links
  updateMainShareLinks();
})();

// FAQ Accordion Interaction
(function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const summary = item.querySelector(".faq-question");
    if (!summary) return;

    summary.addEventListener("click", () => {
      // Optional smooth auto-scroll into view if opening near viewport bottom
      setTimeout(() => {
        if (item.open) {
          const rect = item.getBoundingClientRect();
          if (rect.bottom > window.innerHeight) {
            window.scrollBy({
              top: rect.bottom - window.innerHeight + 30,
              behavior: "smooth"
            });
          }
        }
      }, 50);
    });
  });
})();

// Galeri Alat & Proyek (Filter & Lightbox Modal)
(function initGallery() {
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");
  const galleryCards = document.querySelectorAll(".gallery-card");
  const modal = document.getElementById("galleryModal");
  const modalImg = document.getElementById("modalImg");
  const modalCaption = document.getElementById("modalCaption");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalBackdrop = document.getElementById("modalBackdrop");

  // Filter functionality
  if (filterBtns.length && galleryCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        // Update active button state
        filterBtns.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        // Filter cards
        galleryCards.forEach((card) => {
          const cat = card.getAttribute("data-category");
          if (filter === "all" || cat === filter) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }

  // Lightbox Modal
  if (modal && modalImg && modalCaption) {
    const openModal = (src, caption) => {
      modalImg.src = src;
      modalCaption.textContent = caption || "";
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      modalImg.src = "";
      document.body.style.overflow = "";
    };

    // Attach click to all gallery image wraps
    document.querySelectorAll(".gallery-img-wrap").forEach((wrap) => {
      wrap.addEventListener("click", () => {
        const src = wrap.getAttribute("data-src");
        const caption = wrap.getAttribute("data-caption");
        if (src) openModal(src, caption);
      });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

    // ESC key closes modal
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal();
      }
    });
  }
})();

// Internationalization (i18n) Engine
(function initI18n() {
  const langButtons = document.querySelectorAll(".lang-btn");
  if (!langButtons.length || typeof translations === "undefined") return;

  let currentLang = localStorage.getItem("husni_lang") || "id";
  if (!translations[currentLang]) currentLang = "id";

  function getNested(obj, path) {
    return path.split(".").reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
  }

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem("husni_lang", lang);
    document.documentElement.lang = lang;

    const t = translations[lang];

    // Update document title and meta descriptions
    if (t.site) {
      document.title = t.site.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", t.site.desc);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", t.site.title);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", t.site.desc);
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) twitterTitle.setAttribute("content", t.site.title);
      const twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) twitterDesc.setAttribute("content", t.site.desc);
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) ogLocale.setAttribute("content", lang === "en" ? "en_US" : "id_ID");
    }

    // Dynamic canonical and OG URL resolution
    try {
      const currentOriginUrl = window.location.origin + window.location.pathname;
      const canEl = document.getElementById("canonicalUrl");
      if (canEl) canEl.setAttribute("href", currentOriginUrl);
      const ogUrlEl = document.getElementById("ogUrl");
      if (ogUrlEl) ogUrlEl.setAttribute("content", currentOriginUrl);
    } catch (e) {}

    // Update text elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = getNested(t, key);
      if (val !== undefined) {
        if (el.getAttribute("data-i18n-html") === "true") {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update attribute translations
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const mappings = el.getAttribute("data-i18n-attr").split(";");
      mappings.forEach((mapping) => {
        const [attr, key] = mapping.split(":").map((s) => s.trim());
        if (attr && key) {
          const val = getNested(t, key);
          if (val !== undefined) {
            el.setAttribute(attr, val);
          }
        }
      });
    });

    // Update WhatsApp links (exclude custom estimator quote button and specialized ticker action links)
    if (t.waPreset) {
      const encodedMsg = encodeURIComponent(t.waPreset);
      document.querySelectorAll('a[href*="wa.me/6281250434900"]:not(#estimatorWaBtn):not(.ticker-action)').forEach((a) => {
        a.setAttribute("href", `https://wa.me/6281250434900?text=${encodedMsg}`);
      });
    }

    // Update specialized ticker WhatsApp actions
    if (t.ticker) {
      if (t.ticker.waUnit) {
        const uMsg = encodeURIComponent(t.ticker.waUnit);
        document.querySelectorAll('.ticker-action[data-action="unit"]').forEach(a => a.setAttribute("href", `https://wa.me/6281250434900?text=${uMsg}`));
      }
      if (t.ticker.waSurvey) {
        const sMsg = encodeURIComponent(t.ticker.waSurvey);
        document.querySelectorAll('.ticker-action[data-action="survey"]').forEach(a => a.setAttribute("href", `https://wa.me/6281250434900?text=${sMsg}`));
      }
      if (t.ticker.waDirect) {
        const dMsg = encodeURIComponent(t.ticker.waDirect);
        document.querySelectorAll('.ticker-action[data-action="direct"]').forEach(a => a.setAttribute("href", `https://wa.me/6281250434900?text=${dMsg}`));
      }
    }

    // Update language buttons active state
    langButtons.forEach((btn) => {
      const btnLang = btn.getAttribute("data-lang");
      const isActive = btnLang === lang;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    // Refresh estimator calculations and units in chosen language
    if (typeof window.recalculateEstimator === "function") {
      window.recalculateEstimator();
    }
    if (typeof window.renderRecentEstimates === "function") {
      window.renderRecentEstimates();
    }
    if (typeof window.updateTestimonialsShareLinks === "function") {
      window.updateTestimonialsShareLinks();
    }
  }

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const chosenLang = btn.getAttribute("data-lang");
      if (chosenLang && chosenLang !== currentLang) {
        setLanguage(chosenLang);
      }
    });
  });

  // Apply on initial load
  setLanguage(currentLang);
})();

// Project Estimator & Simulator Module
(function initProjectEstimator() {
  const form = document.getElementById("estimatorForm");
  if (!form) return;

  const projectTypeSelect = document.getElementById("estProjectType");
  const scopeRange = document.getElementById("estScopeRange");
  const scopeLabel = document.getElementById("estScopeLabel");
  const scopeValueBadge = document.getElementById("estScopeValueBadge");
  const minHint = document.getElementById("estRangeMinHint");
  const midHint = document.getElementById("estRangeMidHint");
  const maxHint = document.getElementById("estRangeMaxHint");
  const locationSelect = document.getElementById("estLocation");

  const resDaysValue = document.getElementById("resDaysValue");
  const resHoursValue = document.getElementById("resHoursValue");
  const resSystemBadge = document.getElementById("resSystemBadge");
  const resSystemExplain = document.getElementById("resSystemExplain");
  const resUnitType = document.getElementById("resUnitType");
  const resMobilityNote = document.getElementById("resMobilityNote");
  const resProjectTip = document.getElementById("resProjectTip");
  const estimatorWaBtn = document.getElementById("estimatorWaBtn");

  // Configuration metrics per project category
  const configMap = {
    clearing: {
      unitId: "Hektar",
      unitEn: "Hectares",
      labelId: "Perkiraan Luas Lahan (Hektar)",
      labelEn: "Estimated Land Area (Hectares)",
      min: 0.5,
      max: 10,
      step: 0.5,
      defaultVal: 2.0,
      minHint: "0.5 Ha",
      midHint: "5.0 Ha",
      maxHint: "10.0+ Ha",
      unitType: "Excavator Standard 200 (Heavy Duty Bucket)",
      unitTypeEn: "Standard 200 Excavator (Heavy Duty Bucket)",
      tipId: "Pastikan batas patok lahan sudah jelas dan rute armada tronton tidak terhambat jembatan kayu berbobot terbatas.",
      tipEn: "Ensure boundary markers are established and transport access is cleared of weight-restricted bridges."
    },
    pond: {
      unitId: "m³",
      unitEn: "m³",
      labelId: "Volume / Ukuran Kolam (m³)",
      labelEn: "Pond Excavation Volume (m³)",
      min: 100,
      max: 3000,
      step: 100,
      defaultVal: 600,
      minHint: "100 m³",
      midHint: "1.500 m³",
      maxHint: "3.000+ m³",
      unitType: "Excavator Standard 200 / Long Arm",
      unitTypeEn: "Standard 200 / Long Arm Excavator",
      tipId: "Tentukan area pembuangan/tanggul tanah kerukan di sekitar bibir kolam agar tidak perlu dua kali kerja pemindahan.",
      tipEn: "Designate soil deposit embankments around pond edges beforehand to prevent double-handling of excavated earth."
    },
    earthwork: {
      unitId: "m²",
      unitEn: "m²",
      labelId: "Luas Area Pematangan / Leveling (m²)",
      labelEn: "Site Leveling / Cut & Fill Area (m²)",
      min: 200,
      max: 5000,
      step: 200,
      defaultVal: 1200,
      minHint: "200 m²",
      midHint: "2.500 m²",
      maxHint: "5.000+ m²",
      unitType: "Excavator Standard 200 + Dozer Blade Track",
      unitTypeEn: "Standard 200 Excavator with Leveling Track",
      tipId: "Survei kontur elevasi tanah terlebih dahulu guna memperkirakan rasio timbunan vs galian agar hemat biaya dump truck.",
      tipEn: "Survey contour elevations in advance to balance cut-and-fill ratios, minimizing external dump truck haulage."
    },
    drainage: {
      unitId: "Meter",
      unitEn: "Meters",
      labelId: "Panjang Jalur Parit / Drainase (Meter)",
      labelEn: "Trench / Canal Route Length (Meters)",
      min: 50,
      max: 2000,
      step: 50,
      defaultVal: 400,
      minHint: "50 m",
      midHint: "1.000 m",
      maxHint: "2.000+ m",
      unitType: "Excavator Standard / Narrow Trench Bucket",
      unitTypeEn: "Standard Excavator / Narrow Trench Bucket",
      tipId: "Pekerjaan parit keliling kebun lebih cepat dan rapi bila arah aliran buangan air sudah direncanakan dengan elevasi gravitasi.",
      tipEn: "Perimeter ditching proceeds faster when downstream discharge gravity points are pre-mapped."
    },
    oilpalm: {
      unitId: "Hektar",
      unitEn: "Hectares",
      labelId: "Luas Lahan Blok Sawit (Hektar)",
      labelEn: "Oil Palm Block Area (Hectares)",
      min: 1,
      max: 25,
      step: 1,
      defaultVal: 3,
      minHint: "1 Ha",
      midHint: "12 Ha",
      maxHint: "25+ Ha",
      unitType: "Excavator High Ground Clearance 200",
      unitTypeEn: "High Ground Clearance 200 Excavator",
      tipId: "Untuk pembukaan blok perkebunan sawit, sistem borongan atau bulanan memberikan penghematan biaya operasional hingga 25%.",
      tipEn: "For plantation block development, lump-sum or monthly contracts reduce operating costs by up to 25%."
    },
    general: {
      unitId: "Jam Kerja",
      unitEn: "Operating Hours",
      labelId: "Estimasi Kebutuhan Jam Operasional",
      labelEn: "Target Operating Hours Needed",
      min: 8,
      max: 160,
      step: 8,
      defaultVal: 24,
      minHint: "8 Jam (1 Shift)",
      midHint: "80 Jam",
      maxHint: "160+ Jam",
      unitType: "Excavator Serbaguna / Kelas 200",
      unitTypeEn: "All-Purpose Class 200 Excavator",
      tipId: "Penggunaan paket All-In membebaskan Anda dari kerumitan pengadaan BBM solar eceran dan logistik jerigen di lokasi.",
      tipEn: "Selecting the All-In package spares you from diesel fuel procurement, jerrycan logistics, and field refueling risks."
    }
  };

  function updateSliderConfig() {
    const type = projectTypeSelect.value;
    const conf = configMap[type] || configMap.clearing;
    const isEn = (localStorage.getItem("husni_lang") || "id") === "en";

    scopeRange.min = conf.min;
    scopeRange.max = conf.max;
    scopeRange.step = conf.step;

    const currentVal = parseFloat(scopeRange.value);
    if (isNaN(currentVal) || currentVal < conf.min || currentVal > conf.max) {
      scopeRange.value = conf.defaultVal;
    }

    scopeLabel.textContent = isEn ? conf.labelEn : conf.labelId;
    minHint.textContent = conf.minHint;
    midHint.textContent = conf.midHint;
    maxHint.textContent = conf.maxHint;
  }

  function calculate() {
    const isEn = (localStorage.getItem("husni_lang") || "id") === "en";
    const type = projectTypeSelect.value;
    const conf = configMap[type] || configMap.clearing;
    const val = parseFloat(scopeRange.value);

    // Update value badge
    const unitText = isEn ? conf.unitEn : conf.unitId;
    scopeValueBadge.textContent = `${val} ${unitText}`;

    // Terrain modifier
    const terrainEl = document.querySelector('input[name="estTerrain"]:checked');
    const terrain = terrainEl ? terrainEl.value : "medium";
    let terrainMult = 1.0;
    if (terrain === "light") terrainMult = 0.8;
    else if (terrain === "heavy") terrainMult = 1.35;

    // Package modifier
    const pkgEl = document.querySelector('input[name="estPackage"]:checked');
    const pkg = pkgEl ? pkgEl.value : "allin";

    // Location
    const loc = locationSelect.value;

    // Calculate approximate work days
    let baseDaysMin = 1;
    let baseDaysMax = 1;

    switch (type) {
      case "clearing":
        baseDaysMin = Math.max(1, Math.round(val * 1.8 * terrainMult));
        baseDaysMax = Math.max(baseDaysMin + 1, Math.round(val * 2.5 * terrainMult));
        break;
      case "pond":
        baseDaysMin = Math.max(1, Math.round((val / 300) * terrainMult));
        baseDaysMax = Math.max(baseDaysMin + 1, Math.round((val / 200) * terrainMult));
        break;
      case "earthwork":
        baseDaysMin = Math.max(1, Math.round((val / 400) * terrainMult));
        baseDaysMax = Math.max(baseDaysMin + 1, Math.round((val / 280) * terrainMult));
        break;
      case "drainage":
        baseDaysMin = Math.max(1, Math.round((val / 120) * terrainMult));
        baseDaysMax = Math.max(baseDaysMin + 1, Math.round((val / 80) * terrainMult));
        break;
      case "oilpalm":
        baseDaysMin = Math.max(1, Math.round(val * 1.4 * terrainMult));
        baseDaysMax = Math.max(baseDaysMin + 1, Math.round(val * 2.2 * terrainMult));
        break;
      case "general":
        baseDaysMin = Math.max(1, Math.floor(val / 8));
        baseDaysMax = Math.max(baseDaysMin, Math.ceil((val * terrainMult) / 8));
        break;
    }

    // Days display
    if (baseDaysMin === baseDaysMax) {
      resDaysValue.textContent = `${baseDaysMin}`;
    } else {
      resDaysValue.textContent = `${baseDaysMin} - ${baseDaysMax}`;
    }

    const hoursMin = baseDaysMin * 8;
    const hoursMax = baseDaysMax * 8;
    resHoursValue.textContent = isEn
      ? `± ${hoursMin} - ${hoursMax} Operating Hours`
      : `± ${hoursMin} - ${hoursMax} Jam Operasional`;

    // Recommend system based on duration
    const avgDays = (baseDaysMin + baseDaysMax) / 2;
    let systemBadgeText = "";
    let systemExplainText = "";

    if (avgDays <= 3) {
      systemBadgeText = isEn ? "Daily Rental (Shift)" : "Rental Harian (Shift)";
      systemExplainText = isEn
        ? "Daily shift rental offers optimum flexibility for quick operations with transparent per-shift accounting."
        : "Sistem harian (shift) sangat fleksibel untuk pekerjaan cepat, dihitung transparan per 8 jam operasional.";
    } else if (avgDays <= 20) {
      systemBadgeText = isEn ? "Lump-Sum Contract (Recommended)" : "Rental Borongan (Rekomendasi)";
      systemExplainText = isEn
        ? "Lump-sum contracting is highly recommended to lock deliverables and total budget with zero overtime surprises."
        : "Sistem borongan sangat disarankan agar total biaya pasti disepakati di muka tanpa risiko biaya jam tambahan.";
    } else {
      systemBadgeText = isEn ? "Monthly Rental (Max Savings)" : "Rental Bulanan (Paling Hemat)";
      systemExplainText = isEn
        ? "Monthly lease structure provides dedicated unit availability at the lowest daily operating cost."
        : "Sistem sewa bulanan memberikan tarif harian paling hemat dengan unit excavator siaga penuh di lokasi Anda.";
    }

    resSystemBadge.textContent = systemBadgeText;
    resSystemExplain.textContent = systemExplainText;

    // Recommended unit and tips
    resUnitType.textContent = isEn ? conf.unitTypeEn : conf.unitType;
    resProjectTip.textContent = isEn ? conf.tipEn : conf.tipId;

    resMobilityNote.textContent = isEn
      ? `Dedicated Self-Loader Truck to ${loc}`
      : `Armada Tronton Self-Loader ke ${loc}`;

    // Customized WhatsApp quote inquiry URL
    const typeLabel = projectTypeSelect.options[projectTypeSelect.selectedIndex].text;
    const terrainLabel = isEn
      ? (terrain === "light" ? "Light" : terrain === "heavy" ? "Heavy" : "Moderate")
      : (terrain === "light" ? "Ringan" : terrain === "heavy" ? "Berat" : "Sedang");

    const pkgLabel = pkg === "allin"
      ? (isEn ? "All-In (Unit + Operator + Fuel)" : "All-In (Unit + Operator + Solar)")
      : (isEn ? "Dry (Unit + Operator)" : "Non-BBM (Unit + Operator)");

    let waMessage = "";
    if (isEn) {
      waMessage = `Hello Husni Rental Excavator, I simulated a quote for my project on your website:
• Project: ${typeLabel}
• Estimated Scale: ${val} ${unitText}
• Terrain Condition: ${terrainLabel}
• Package: ${pkgLabel}
• Location: ${loc}
• Estimated Duration: ${resDaysValue.textContent} Days (${hoursMin}-${hoursMax} Hours)
• Recommended System: ${systemBadgeText}

Could you provide the official final quotation and equipment availability schedule? Thank you.`;
    } else {
      waMessage = `Halo Husni Rental Excavator, saya telah menghitung estimasi kebutuhan proyek via website:
• Jenis Proyek: ${typeLabel}
• Estimasi Skala: ${val} ${unitText}
• Kondisi Medan: ${terrainLabel}
• Pilihan Paket: ${pkgLabel}
• Titik Lokasi: ${loc}
• Perkiraan Durasi: ${resDaysValue.textContent} Hari Kerja (${hoursMin}-${hoursMax} Jam)
• Sistem Disarankan: ${systemBadgeText}

Mohon informasi penawaran harga final dan jadwal unit yang tersedia. Terima kasih.`;
    }

    estimatorWaBtn.href = `https://wa.me/6281250434900?text=${encodeURIComponent(waMessage)}`;
  }

  // --- LocalStorage Recent Estimates Feature ---
  const RECENT_STORAGE_KEY = "husni_recent_estimates";
  const saveEstimateBtn = document.getElementById("saveEstimateBtn");
  const saveEstimateBtnText = document.getElementById("saveEstimateBtnText");
  const recentEstimatesList = document.getElementById("recentEstimatesList");
  const recentCountBadge = document.getElementById("recentCountBadge");
  const clearRecentBtn = document.getElementById("clearRecentBtn");
  const recentToast = document.getElementById("recentToast");
  const recentToastText = document.getElementById("recentToastText");
  let recentToastTimer = null;

  const projectIcons = {
    clearing: "🌲",
    pond: "🐟",
    earthwork: "🚜",
    drainage: "💧",
    oilpalm: "🌴",
    general: "🏗️"
  };

  function getRecentEstimates() {
    try {
      const raw = localStorage.getItem(RECENT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Failed to load recent estimates from localStorage:", e);
      return [];
    }
  }

  function saveCurrentEstimate(feedback = true) {
    const isEn = (localStorage.getItem("husni_lang") || "id") === "en";
    const type = projectTypeSelect.value;
    const conf = configMap[type] || configMap.clearing;
    const val = parseFloat(scopeRange.value);
    const unitText = isEn ? conf.unitEn : conf.unitId;

    const terrainEl = document.querySelector('input[name="estTerrain"]:checked');
    const terrain = terrainEl ? terrainEl.value : "medium";

    const pkgEl = document.querySelector('input[name="estPackage"]:checked');
    const pkg = pkgEl ? pkgEl.value : "allin";

    const loc = locationSelect.value;
    const days = resDaysValue.textContent;
    const hours = resHoursValue.textContent;
    const recSystem = resSystemBadge.textContent;
    const recUnit = resUnitType.textContent;

    const record = {
      id: "est_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      projectType: type,
      scope: val,
      unit: unitText,
      terrain: terrain,
      pkg: pkg,
      location: loc,
      days: days,
      hours: hours,
      recSystem: recSystem,
      recUnit: recUnit,
      timestamp: Date.now()
    };

    let list = getRecentEstimates();
    // Avoid exact duplicate at the top
    list = list.filter((item) => {
      return !(
        item.projectType === record.projectType &&
        item.scope === record.scope &&
        item.terrain === record.terrain &&
        item.pkg === record.pkg &&
        item.location === record.location
      );
    });

    list.unshift(record);
    if (list.length > 6) {
      list = list.slice(0, 6);
    }

    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to save estimate to localStorage:", e);
    }

    if (feedback && saveEstimateBtn) {
      const currentLang = localStorage.getItem("husni_lang") || "id";
      const t = typeof translations !== "undefined" && translations[currentLang] ? translations[currentLang].estimator : null;
      const successText = t && t.btnSaveSimulationSuccess ? t.btnSaveSimulationSuccess : "✓ Tersimpan di Riwayat!";
      
      saveEstimateBtn.classList.add("is-saved");
      if (saveEstimateBtnText) saveEstimateBtnText.textContent = successText;

      setTimeout(() => {
        saveEstimateBtn.classList.remove("is-saved");
        const defaultText = t && t.btnSaveSimulation ? t.btnSaveSimulation : "Simpan Hasil Simulasi";
        if (saveEstimateBtnText) saveEstimateBtnText.textContent = defaultText;
      }, 2500);
    }

    renderRecentEstimates();
  }

  function loadEstimate(item) {
    if (!item) return;

    projectTypeSelect.value = item.projectType;
    updateSliderConfig();
    scopeRange.value = item.scope;

    const terrainRadio = document.querySelector(`input[name="estTerrain"][value="${item.terrain}"]`);
    if (terrainRadio) terrainRadio.checked = true;

    const pkgRadio = document.querySelector(`input[name="estPackage"][value="${item.pkg}"]`);
    if (pkgRadio) pkgRadio.checked = true;

    if (item.location) {
      locationSelect.value = item.location;
    }

    calculate();

    // Show confirmation toast
    if (recentToast) {
      const currentLang = localStorage.getItem("husni_lang") || "id";
      const t = typeof translations !== "undefined" && translations[currentLang] ? translations[currentLang].estimator : null;
      if (recentToastText && t && t.recentBadgeRestored) {
        recentToastText.textContent = t.recentBadgeRestored;
      }
      recentToast.style.display = "flex";
      if (recentToastTimer) clearTimeout(recentToastTimer);
      recentToastTimer = setTimeout(() => {
        recentToast.style.display = "none";
      }, 3500);
    }

    // Highlight card
    document.querySelectorAll(".recent-item-card").forEach((card) => {
      card.classList.toggle("is-active", card.getAttribute("data-id") === item.id);
    });

    // Smooth scroll to estimator form on smaller screens
    if (window.innerWidth <= 850) {
      const formEl = document.getElementById("estimator");
      if (formEl) formEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function deleteEstimate(id) {
    let list = getRecentEstimates().filter((item) => item.id !== id);
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to delete estimate from localStorage:", e);
    }
    renderRecentEstimates();
  }

  function clearAllEstimates() {
    const isEn = (localStorage.getItem("husni_lang") || "id") === "en";
    const currentLang = isEn ? "en" : "id";
    const t = typeof translations !== "undefined" && translations[currentLang] ? translations[currentLang].estimator : null;
    const confirmMsg = t && t.recentClearConfirm
      ? t.recentClearConfirm
      : (isEn ? "Clear all saved simulations stored on this device?" : "Hapus semua riwayat estimasi yang tersimpan di perangkat ini?");

    if (window.confirm(confirmMsg)) {
      try {
        localStorage.removeItem(RECENT_STORAGE_KEY);
      } catch (e) {
        console.warn("Failed to clear estimates from localStorage:", e);
      }
      renderRecentEstimates();
    }
  }

  function formatTime(timestamp, isEn) {
    const now = Date.now();
    const diffMin = Math.round((now - timestamp) / (1000 * 60));
    if (diffMin < 2) return isEn ? "Just now" : "Baru saja";
    if (diffMin < 60) return isEn ? `${diffMin}m ago` : `${diffMin} mnt lalu`;

    const d = new Date(timestamp);
    return d.toLocaleDateString(isEn ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function renderRecentEstimates() {
    if (!recentEstimatesList) return;

    const list = getRecentEstimates();
    const isEn = (localStorage.getItem("husni_lang") || "id") === "en";
    const currentLang = isEn ? "en" : "id";
    const t = typeof translations !== "undefined" && translations[currentLang] ? translations[currentLang].estimator : {};

    // Update count badge & clear button
    if (recentCountBadge) {
      recentCountBadge.textContent = `${list.length}`;
      recentCountBadge.style.display = list.length > 0 ? "inline-block" : "none";
    }
    if (clearRecentBtn) {
      clearRecentBtn.style.display = list.length > 0 ? "inline-block" : "none";
      if (t.recentClearAll) clearRecentBtn.textContent = t.recentClearAll;
    }

    if (list.length === 0) {
      recentEstimatesList.innerHTML = `
        <div class="recent-empty-state" style="grid-column: 1 / -1;">
          <div class="recent-empty-icon">📋</div>
          <h4>${t.recentEmptyTitle || "Belum Ada Simulasi Tersimpan"}</h4>
          <p>${t.recentEmptyDesc || "Sesuaikan skala dan jenis proyek di kalkulator atas, lalu klik 'Simpan Hasil Simulasi' untuk menyimpannya di sini."}</p>
        </div>
      `;
      return;
    }

    const typeNames = {
      clearing: isEn ? "Land Clearing" : "Land Clearing / Pembersihan",
      pond: isEn ? "Pond Excavation" : "Galian Kolam / Embung",
      earthwork: isEn ? "Cut & Fill Earthwork" : "Pematangan Lahan / Cut & Fill",
      drainage: isEn ? "Drainage Canal" : "Saluran Parit & Drainase",
      oilpalm: isEn ? "Oil Palm Plantation" : "Perkebunan Sawit",
      general: isEn ? "Civil / Foundation" : "Galian Sipil / Fondasi"
    };

    const terrainNames = {
      light: isEn ? "Light Terrain" : "Medan Ringan",
      medium: isEn ? "Moderate Terrain" : "Medan Sedang",
      heavy: isEn ? "Heavy / Marsh" : "Medan Berat / Rawa"
    };

    const pkgNames = {
      allin: isEn ? "Package: All-In" : "Paket All-In",
      dry: isEn ? "Package: Dry" : "Paket Non-BBM"
    };

    const loadBtnLabel = t.recentLoadBtn || (isEn ? "Load to Calculator" : "Muat ke Kalkulator");
    const delTitle = t.recentDeleteTitle || (isEn ? "Delete simulation" : "Hapus simulasi");
    const unitDaysText = t.unitDays || (isEn ? "Working Days" : "Hari Kerja");

    recentEstimatesList.innerHTML = list
      .map((item) => {
        const icon = projectIcons[item.projectType] || "🚜";
        const title = typeNames[item.projectType] || item.projectType;
        const conf = configMap[item.projectType] || configMap.clearing;
        const currentUnit = isEn ? conf.unitEn : conf.unitId;
        const timeStr = formatTime(item.timestamp, isEn);
        const terrainStr = terrainNames[item.terrain] || item.terrain;
        const pkgStr = pkgNames[item.pkg] || item.pkg;

        return `
          <div class="recent-item-card" data-id="${item.id}">
            <div>
              <div class="recent-item-header">
                <div class="recent-item-title-wrap">
                  <div class="recent-item-name" title="${title}">${icon} ${title}</div>
                  <span class="recent-item-time">${timeStr}</span>
                </div>
                <button class="btn-del-recent" type="button" data-del-id="${item.id}" title="${delTitle}" aria-label="${delTitle}">×</button>
              </div>

              <div class="recent-tags-row">
                <span class="recent-tag tag-scope">📐 ${item.scope} ${currentUnit}</span>
                <span class="recent-tag">⛰️ ${terrainStr}</span>
                <span class="recent-tag">⛽ ${pkgStr}</span>
                <span class="recent-tag">📍 ${item.location}</span>
              </div>

              <div class="recent-item-metrics">
                <div class="recent-metric-days">
                  ${item.days} ${unitDaysText}
                  <small>${item.hours}</small>
                </div>
                <span class="recent-metric-system">${item.recSystem}</span>
              </div>
            </div>

            <button class="btn-load-estimate" type="button" data-load-id="${item.id}">
              <span>↺</span>
              <span>${loadBtnLabel}</span>
            </button>
          </div>
        `;
      })
      .join("");

    // Attach listeners to cards
    recentEstimatesList.querySelectorAll("[data-load-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-load-id");
        const found = list.find((it) => it.id === id);
        if (found) loadEstimate(found);
      });
    });

    recentEstimatesList.querySelectorAll("[data-del-id]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-del-id");
        if (id) deleteEstimate(id);
      });
    });
  }

  // Bind Save button
  if (saveEstimateBtn) {
    saveEstimateBtn.addEventListener("click", () => {
      saveCurrentEstimate(true);
    });
  }

  // Auto-save when user clicks to request quote via WhatsApp
  if (estimatorWaBtn) {
    estimatorWaBtn.addEventListener("click", () => {
      saveCurrentEstimate(false);
    });
  }

  // Bind Clear All button
  if (clearRecentBtn) {
    clearRecentBtn.addEventListener("click", clearAllEstimates);
  }

  // Expose render function for language switch
  window.renderRecentEstimates = renderRecentEstimates;

  // Event listeners
  projectTypeSelect.addEventListener("change", () => {
    updateSliderConfig();
    calculate();
  });

  scopeRange.addEventListener("input", calculate);

  document.querySelectorAll('input[name="estTerrain"]').forEach((r) => {
    r.addEventListener("change", calculate);
  });

  document.querySelectorAll('input[name="estPackage"]').forEach((r) => {
    r.addEventListener("change", calculate);
  });

  locationSelect.addEventListener("change", calculate);

  // Expose recalculate function for language switcher
  window.recalculateEstimator = function () {
    updateSliderConfig();
    calculate();
  };

  // Initial calculation & render recent estimates
  updateSliderConfig();
  calculate();
  renderRecentEstimates();
})();

// News Ticker Controller (Pause/Resume & Accessible Interaction)
(function initNewsTicker() {
  const tickerTrack = document.getElementById("tickerTrack");
  const pauseBtn = document.getElementById("tickerPauseBtn");
  const pauseIcon = pauseBtn ? pauseBtn.querySelector(".ticker-pause-icon") : null;
  if (!tickerTrack || !pauseBtn) return;

  let isPaused = false;

  const updatePauseState = () => {
    tickerTrack.classList.toggle("is-paused", isPaused);
    if (pauseIcon) {
      pauseIcon.textContent = isPaused ? "▶" : "⏸";
    }
    const currentLang = localStorage.getItem("husni_lang") || "id";
    const t = typeof translations !== "undefined" && translations[currentLang] ? translations[currentLang].ticker : null;
    const label = isPaused
      ? (t && t.playAria ? t.playAria : "Lanjutkan pergerakan informasi")
      : (t && t.pauseAria ? t.pauseAria : "Jeda pergerakan informasi");
    pauseBtn.setAttribute("aria-label", label);
    pauseBtn.setAttribute("title", label);
  };

  pauseBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    updatePauseState();
  });
})();