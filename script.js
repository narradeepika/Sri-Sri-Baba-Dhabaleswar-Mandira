/* ==================================================
   DHABALESWARA MANDIRA
   Theme switching, mobile menu and interactions
================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  /* -----------------------------------------------
     1. LIGHT / DARK THEME
  ----------------------------------------------- */

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function getSavedTheme() {
    try {
      const savedTheme = localStorage.getItem("dhabaleswara-theme");

      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
    } catch (error) {
      // Continue with the default theme if storage is unavailable.
    }

    return "light";
  }

  function applyTheme(theme) {
    const selectedTheme = theme === "dark" ? "dark" : "light";

    root.setAttribute("data-theme", selectedTheme);

    if (themeIcon) {
      themeIcon.setAttribute(
        "icon",
        selectedTheme === "dark"
          ? "lucide:sun"
          : "lucide:moon"
      );
    }

    if (themeToggle) {
      const nextTheme =
        selectedTheme === "dark" ? "light" : "dark";

      themeToggle.setAttribute(
        "aria-label",
        `Switch to ${nextTheme} theme`
      );

      themeToggle.setAttribute(
        "title",
        `Switch to ${nextTheme} theme`
      );
    }

    if (themeMeta) {
      themeMeta.setAttribute(
        "content",
        selectedTheme === "dark" ? "#17120e" : "#fffaf1"
      );
    }

    try {
      localStorage.setItem("dhabaleswara-theme", selectedTheme);
    } catch (error) {
      // The theme still changes even if it cannot be saved.
    }
  }

  applyTheme(getSavedTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme");

      applyTheme(
        currentTheme === "dark" ? "light" : "dark"
      );
    });
  }

  /* -----------------------------------------------
     2. MOBILE NAVIGATION
  ----------------------------------------------- */

  const menuToggle = document.getElementById("menuToggle");
  const menuIcon = document.getElementById("menuIcon");
  const mobileNav = document.getElementById("mobileNav");

  function closeMobileMenu() {
    if (!menuToggle || !mobileNav) {
      return;
    }

    mobileNav.hidden = true;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    if (menuIcon) {
      menuIcon.setAttribute("icon", "lucide:menu");
    }
  }

  function openMobileMenu() {
    if (!menuToggle || !mobileNav) {
      return;
    }

    mobileNav.hidden = false;

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    if (menuIcon) {
      menuIcon.setAttribute("icon", "lucide:x");
    }
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu =
        mobileNav.contains(event.target) ||
        menuToggle.contains(event.target);

      if (!clickedInsideMenu) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) {
        closeMobileMenu();
      }
    });
  }

  /* -----------------------------------------------
     3. ACTIVE NAVIGATION LINK
  ----------------------------------------------- */

  const navLinks = document.querySelectorAll(
    ".desktop-nav .nav-link"
  );

  const navigationSections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const currentSectionId = entry.target.id;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${currentSectionId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    navigationSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* -----------------------------------------------
     4. SCROLL REVEAL ANIMATIONS
  ----------------------------------------------- */

  const revealElements = document.querySelectorAll(
    [
      ".about-content",
      ".about-visual",
      ".origin-content",
      ".origin-image",
      ".architecture-content",
      ".architecture-image",
      ".attraction-card",
      ".rituals-heading",
      ".rituals-table-wrap",
      ".festival-card",
      ".festival-intro-image",
      ".festival-intro-content",
      ".service-card",
      ".video-card",
      ".gallery-item",
      ".administration-inner",
      ".contact-content",
      ".contact-form-card"
    ].join(",")
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    revealElements.forEach((element, index) => {
      element.classList.add("js-reveal");

      if (
        element.classList.contains("attraction-card") ||
        element.classList.contains("festival-card") ||
        element.classList.contains("service-card") ||
        element.classList.contains("video-card") ||
        element.classList.contains("gallery-item")
      ) {
        element.style.transitionDelay =
          `${(index % 3) * 70}ms`;
      }
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* -----------------------------------------------
     5. CONTACT FORM VALIDATION
  ----------------------------------------------- */

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);

      const name = String(
        formData.get("name") || ""
      ).trim();

      const email = String(
        formData.get("email") || ""
      ).trim();

      const subject = String(
        formData.get("subject") || ""
      ).trim();

      const message = String(
        formData.get("message") || ""
      ).trim();

      if (!name || !email || !subject || !message) {
        formMessage.textContent =
          "Please complete all required fields.";

        return;
      }

     
      formMessage.textContent =
        "Your details are valid, but this demo form is not connected to an email service. Please connect a backend to submit enquiries.";

      formMessage.setAttribute("role", "status");
    });
  }

  /* -----------------------------------------------
     6. CURRENT FOOTER YEAR
  ----------------------------------------------- */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------
     7. BACK-TO-TOP SMOOTH SCROLL
  ----------------------------------------------- */

  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  });

  /* -----------------------------------------------
     8. PREVENT EMPTY HASH NAVIGATION
  ----------------------------------------------- */

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
});


/* ========================================
   SUPPORT SECTION - JAVASCRIPT
======================================== */

document.addEventListener("DOMContentLoaded", function () {
  const supportSection = document.querySelector("#support");

  if (!supportSection) {
    return;
  }

  const supportCards = supportSection.querySelectorAll(".support-card");

  // Display cards immediately when animations are disabled
  // or IntersectionObserver is not supported.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    reduceMotion ||
    !("IntersectionObserver" in window)
  ) {
    supportCards.forEach(function (card) {
      card.classList.add("revealed");
    });

    return;
  }

  // Prepare cards for the reveal animation.
  supportCards.forEach(function (card) {
    card.classList.add("reveal-pending");
  });

  const supportObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          entry.target.classList.add("revealed");

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  supportCards.forEach(function (card) {
    supportObserver.observe(card);
  });
});

/* ==========================================
   DHABALESWAR MANDIRA — HELPDESK POPUP
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Get HTML elements
    const openButton = document.getElementById("openHelpdesk");
    const modal = document.getElementById("helpdeskModal");
    const overlay = document.getElementById("helpdeskOverlay");
    const closeButton = document.getElementById("closeHelpdesk");
    const doneButton = document.getElementById("helpdeskDone");
    const enquiryLink = document.getElementById("helpdeskEnquiryLink");

    if (!openButton || !modal || !overlay) {
        console.warn("Helpdesk popup elements were not found.");
        return;
    }

    const modalContent = modal.querySelector(".helpdesk-modal-content");

    let previousFocus = null;

    // Open Helpdesk Popup
    function openHelpdesk() {
        previousFocus = document.activeElement;

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("helpdesk-modal-open");

        // Focus the popup
        if (modalContent) {
            modalContent.focus();
        }
    }

    // Close Helpdesk Popup
    function closeHelpdesk() {
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("helpdesk-modal-open");

        // Return focus to the button that opened the popup
        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    // Open popup when clicking Visit Helpdesk
    openButton.addEventListener("click", openHelpdesk);

    // Close popup using the X icon
    if (closeButton) {
        closeButton.addEventListener("click", closeHelpdesk);
    }

    // Close popup using the footer button
    if (doneButton) {
        doneButton.addEventListener("click", closeHelpdesk);
    }

    // Close popup when clicking the dark background
    overlay.addEventListener("click", closeHelpdesk);

    // Close popup by pressing Escape
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeHelpdesk();
        }
    });

    // Send an Enquiry: close popup and scroll to Contact section
    if (enquiryLink) {
        enquiryLink.addEventListener("click", function (event) {
            const contactSection = document.getElementById("contact");

            if (contactSection) {
                event.preventDefault();

                closeHelpdesk();

                setTimeout(function () {
                    contactSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }, 100);
            }
        });
    }

});