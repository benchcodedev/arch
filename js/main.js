/**
 * ARCHITERA STUDIO - Interactive Logic & Animation Flow
 * Matches reference video movements, scroll flow, service tabs, and testimonial slider.
 */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-ready");
  initHeader();
  initScrollReveals();
  initServiceTabs();
  initTestimonialsSlider();
  initProjectModals();
  initContactModal();
  initCartDrawer();
  initMobileMenu();
});

/* ==========================================================================
   1. Header Sticky & Scroll Effects
   ========================================================================== */
function initHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Smooth Anchor Navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetPos,
          behavior: "smooth"
        });
      }
    });
  });
}

/* ==========================================================================
   2. Scroll Reveal Animations (Flow & Entrance Motions)
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll, .stagger-group");
  if (!revealElements.length) return;

  const checkElements = () => {
    const triggerBottom = window.innerHeight + 150;
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= triggerBottom) {
        el.classList.add("is-revealed");
      }
    });
  };

  window.addEventListener("scroll", checkElements, { passive: true });
  window.addEventListener("resize", checkElements, { passive: true });
  // Initial check after paint
  setTimeout(checkElements, 50);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "200px 0px 200px 0px"
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   3. Services Interactive Tabs (Architecture, Interior, Renovation, Construction)
   ========================================================================== */
function initServiceTabs() {
  const serviceCols = document.querySelectorAll(".service-col");
  if (!serviceCols.length) return;

  serviceCols.forEach((col) => {
    // Desktop hover interaction
    col.addEventListener("mouseenter", () => {
      serviceCols.forEach((c) => c.classList.remove("is-active"));
      col.classList.add("is-active");
    });

    // Click / touch interaction
    col.addEventListener("click", () => {
      serviceCols.forEach((c) => c.classList.remove("is-active"));
      col.classList.add("is-active");
    });
  });
}

/* ==========================================================================
   4. Testimonials Slider (Centered Slide with Peeking Side Cards as in Video)
   ========================================================================== */
function initTestimonialsSlider() {
  const track = document.getElementById("testimonials-track");
  const slides = document.querySelectorAll(".testimonial-slide");
  const prevBtn = document.getElementById("testimonial-prev");
  const nextBtn = document.getElementById("testimonial-next");
  const dotsContainer = document.getElementById("testimonial-dots");

  if (!track || !slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  // Render dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = `testim-dot ${idx === 0 ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
      dot.addEventListener("click", () => {
        goToSlide(idx);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlider() {
    const isMobile = window.innerWidth < 768;
    const slidePercent = isMobile ? 88 : 74;
    const gapPercent = 2;
    const centerOffset = (100 - slidePercent) / 2;
    const translateX = -(currentIndex * (slidePercent + gapPercent)) + centerOffset;
    track.style.transform = `translateX(${translateX}%)`;

    slides.forEach((slide, idx) => {
      slide.classList.toggle("is-active-slide", idx === currentIndex);
    });

    // Update dots
    const dots = dotsContainer?.querySelectorAll(".testim-dot");
    if (dots) {
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateSlider();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoplay();
    });
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 3500);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Pause on hover
  const viewport = document.querySelector(".testimonials-slider-viewport");
  if (viewport) {
    viewport.addEventListener("mouseenter", stopAutoplay);
    viewport.addEventListener("mouseleave", startAutoplay);
  }

  window.addEventListener("resize", updateSlider, { passive: true });
  updateSlider();
  startAutoplay();
}

/* ==========================================================================
   5. Project Modals
   ========================================================================== */
function initProjectModals() {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("modal-project-close");
  const modalImg = document.getElementById("modal-project-img");
  const modalCategory = document.getElementById("modal-project-category");
  const modalTitle = document.getElementById("modal-project-title");
  const modalDesc = document.getElementById("modal-project-desc");

  if (!modal) return;

  const projectData = {
    "Cascade Villa": {
      category: "Architecture",
      desc: "A bespoke cantilevered luxury residence integrating seamless indoor-outdoor living, reflection pools, and panoramic natural vistas.",
      img: "assets/images/architera/project_cascade_villa.jpg"
    },
    "InHabit Spaces": {
      category: "Interior",
      desc: "Refined dining and salon living environment featuring custom brass millwork, sculptural pendant illumination, and curated Italian marble surfaces.",
      img: "assets/images/architera/project_inhabit_spaces.jpg"
    },
    "UrbanLift": {
      category: "Construction",
      desc: "High-performance facade engineering with solar-shading louvers, precision structural glazing, and thermal energy efficiency.",
      img: "assets/images/architera/project_urbanlift.jpg"
    },
    "Renew Works": {
      category: "Renovation",
      desc: "Transformative adaptive reuse celebrating brutalist architectural heritage with expansive double-height glass transitions.",
      img: "assets/images/architera/project_renew_works.jpg"
    },
    "Canvas & Co": {
      category: "Architecture",
      desc: "Modernist geometric pavilion with expansive natural timber terrace deck, floor-to-ceiling sliding glass, and minimalist white exterior.",
      img: "assets/images/architera/project_canvas_co.jpg"
    },
    "Lumière Living": {
      category: "Interior",
      desc: "Open-concept culinary kitchen and lounge with waterfall quartz island, industrial steel counter stools, and diffuse recessed ceiling illumination.",
      img: "assets/images/architera/project_lumiere_living.jpg"
    },
    "Cornerstone Campus": {
      category: "Construction",
      desc: "Civic architectural landmark combining textured terracotta facade tiles, aerodynamic sunscreen fins, and open sky terraces.",
      img: "assets/images/architera/project_cornerstone_campus.jpg"
    }
  };

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3")?.textContent.trim();
      const info = projectData[title] || {
        category: card.querySelector("span")?.textContent.trim() || "Architecture",
        desc: "Architera Studio bespoke architectural design and masterplanned execution.",
        img: card.querySelector("img")?.src || ""
      };

      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = info.category;
      if (modalDesc) modalDesc.textContent = info.desc;
      if (modalImg) modalImg.src = info.img;

      modal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    });
  });

  const closeModal = () => {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });
}

/* ==========================================================================
   6. Contact / Consultation Modal
   ========================================================================== */
function initContactModal() {
  const modal = document.getElementById("contact-modal");
  const closeBtn = document.getElementById("contact-modal-close");
  const openBtns = document.querySelectorAll(".open-contact-modal");
  const form = document.getElementById("contact-form");

  if (!modal) return;

  const openModal = () => {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  openBtns.forEach((btn) => btn.addEventListener("click", openModal));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you! Your message has been sent to Architera Studio.");
      closeModal();
      form.reset();
    });
  }
}

/* ==========================================================================
   7. Mini-Cart Drawer
   ========================================================================== */
function initCartDrawer() {
  const openBtn = document.getElementById("cart-btn");
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-drawer-overlay");
  const closeBtn = document.getElementById("cart-drawer-close");

  if (!drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.remove("translate-x-full", "invisible");
    overlay.classList.remove("opacity-0", "pointer-events-none");
    overlay.classList.add("opacity-100", "pointer-events-auto");
    document.body.classList.add("overflow-hidden");
  };

  const closeDrawer = () => {
    drawer.classList.add("translate-x-full", "invisible");
    overlay.classList.add("opacity-0", "pointer-events-none");
    overlay.classList.remove("opacity-100", "pointer-events-auto");
    document.body.classList.remove("overflow-hidden");
  };

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);
}

/* ==========================================================================
   8. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const openBtn = document.getElementById("mobile-menu-btn");
  const drawer = document.getElementById("mobile-menu-drawer");
  const closeBtn = document.getElementById("mobile-menu-close");
  const links = document.querySelectorAll(".mobile-nav-link");

  if (!drawer) return;

  const openMenu = () => {
    drawer.classList.remove("opacity-0", "pointer-events-none");
    drawer.classList.add("opacity-100", "pointer-events-auto");
    document.body.classList.add("overflow-hidden");
  };

  const closeMenu = () => {
    drawer.classList.add("opacity-0", "pointer-events-none");
    drawer.classList.remove("opacity-100", "pointer-events-auto");
    document.body.classList.remove("overflow-hidden");
  };

  if (openBtn) openBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  links.forEach((link) => link.addEventListener("click", closeMenu));
}
