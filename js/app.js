(function () {
  "use strict";

  var taglines = [
    "Your Journey Starts Here",
    "Lakbay Lokal, Explore Global",
    "Connecting You to the World",
  ];

  var searchHints = {
    flights: "Find routes and fares tailored to your dates.",
    hotels: "Browse stays by city, budget, and travel style.",
    tours: "Curated land tours — local & international packages.",
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var taglineEl = document.getElementById("tagline-rotate");
  var ti = 0;
  function rotateTagline() {
    if (!taglineEl) return;
    taglineEl.style.opacity = "0";
    setTimeout(function () {
      ti = (ti + 1) % taglines.length;
      taglineEl.textContent = taglines[ti];
      taglineEl.style.opacity = "1";
    }, 280);
  }
  if (taglineEl && !reduceMotion) {
    setInterval(rotateTagline, 4500);
  }

  var tabs = document.querySelectorAll(".search-tab");
  var hintEl = document.getElementById("search-hint");
  var searchInput = document.getElementById("search-query");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      var key = tab.getAttribute("data-tab");
      if (hintEl && searchHints[key]) hintEl.textContent = searchHints[key];
      if (searchInput) {
        var placeholders = {
          flights: "City or airport — where to?",
          hotels: "Destination or hotel name",
          tours: "Tour theme or country",
        };
        searchInput.placeholder = placeholders[key] || searchInput.placeholder;
      }
    });
  });

  var quickForm = document.getElementById("quick-search-form");
  if (quickForm) {
    quickForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (hintEl) {
        hintEl.textContent =
          "Thanks! For a tailored quote, use the contact form in Customer Hub below.";
        hintEl.style.color = "var(--green-600)";
      }
      var hub = document.getElementById("customer-hub");
      if (hub) hub.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var navLinks = siteNav ? siteNav.querySelectorAll('a[href^="#"]') : [];

  function closeNav() {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", open ? "false" : "true");
      siteNav.classList.toggle("is-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav();
      });
    });
  }

  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (!header) return;
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("is-scrolled", y > 24);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revObs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      revObs.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll('.nav-list a[href^="#"]');

  function setActiveNav() {
    var headerOffset =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) ||
      72;
    var scrollPos = window.scrollY + headerOffset + 40;
    var activeId = "home";
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var h = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + h) {
        activeId = sec.id || activeId;
      }
    });
    navAnchors.forEach(function (a) {
      var href = a.getAttribute("href");
      var id = href && href.slice(1);
      if (id === activeId) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  var contactForm = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("cf-name");
      var email = document.getElementById("cf-email");
      var msg = document.getElementById("cf-msg");
      if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.className = "form-status is-error";
        return;
      }
      formStatus.textContent = "Thank you — we’ll get back to you shortly.";
      formStatus.className = "form-status is-success";
      contactForm.reset();
      setTimeout(function () {
        formStatus.textContent = "";
        formStatus.className = "form-status";
      }, 6000);
    });
  }

  var slides = document.querySelectorAll(".testimonial");
  var dots = document.querySelectorAll(".t-dot");
  var slideIndex = 0;
  var testimonialTimer;

  function showSlide(i) {
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach(function (s, j) {
      s.classList.toggle("is-active", j === slideIndex);
    });
    dots.forEach(function (d, j) {
      d.classList.toggle("is-active", j === slideIndex);
      d.setAttribute("aria-selected", j === slideIndex ? "true" : "false");
    });
  }

  function nextSlide() {
    showSlide(slideIndex + 1);
  }

  if (slides.length && dots.length) {
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
        if (testimonialTimer) {
          clearInterval(testimonialTimer);
          testimonialTimer = setInterval(nextSlide, 6500);
        }
      });
    });
    if (!reduceMotion) {
      testimonialTimer = setInterval(nextSlide, 6500);
    }
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) closeNav();
  });
})();
