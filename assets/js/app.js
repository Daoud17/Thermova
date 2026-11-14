
/* =========================================
   THERMOVA LEBANON
   MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       MOBILE NAVIGATION
    ===================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".site-nav");
    const siteHeader = document.querySelector(".site-header");

    if (menuToggle && siteNav && siteHeader) {

        function setMenuState(isOpen) {
            menuToggle.classList.toggle("active", isOpen);
            siteNav.classList.toggle("open", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );
        }

        menuToggle.addEventListener("click", () => {
            const isOpen = siteNav.classList.contains("open");
            setMenuState(!isOpen);
        });

        siteNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                setMenuState(false);
            });
        });

        document.addEventListener("click", event => {
            if (!siteHeader.contains(event.target)) {
                setMenuState(false);
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                const wasOpen = siteNav.classList.contains("open");

                setMenuState(false);

                if (wasOpen) {
                    menuToggle.focus();
                }
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 850) {
                setMenuState(false);
            }
        });
    }

    /* =====================================
       LUCIDE ICONS
    ===================================== */

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    /* =====================================
       HERO SLIDER - AUTOMATIC EVERY 3 SEC
    ===================================== */

    const slider = document.querySelector("#heroSlider");

    if (slider) {

        const slides = Array.from(
            slider.querySelectorAll(".hero-slide")
        );

        const dots = Array.from(
            slider.querySelectorAll(".hero-dot")
        );

        const prevButton = slider.querySelector(".hero-prev");
        const nextButton = slider.querySelector(".hero-next");

        if (slides.length > 0) {

            let currentSlide = 0;
            let autoplayTimer = null;

            let touchStartX = 0;
            let touchStartY = 0;

            let pointerStartX = null;
            let isPointerDragging = false;

            const autoplayDelay = 3000;

            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );

            /* =================================
               DISPLAY ACTIVE SLIDE
            ================================= */

            function showSlide(index) {

                currentSlide =
                    (index + slides.length) % slides.length;

                slides.forEach((slide, i) => {

                    const active = i === currentSlide;

                    slide.classList.toggle("active", active);

                    slide.setAttribute(
                        "aria-hidden",
                        String(!active)
                    );

                    slide.inert = !active;

                });

                dots.forEach((dot, i) => {

                    const active = i === currentSlide;

                    dot.classList.toggle("active", active);

                    dot.setAttribute(
                        "aria-pressed",
                        String(active)
                    );

                });
            }

            /* =================================
               STOP AUTOPLAY
            ================================= */

            function stopAutoplay() {

                if (autoplayTimer !== null) {

                    clearInterval(autoplayTimer);

                    autoplayTimer = null;

                }
            }

            /* =================================
               START AUTOPLAY
               EVERY 3000 MILLISECONDS
            ================================= */

            function startAutoplay() {

                stopAutoplay();

                if (
                    slides.length < 2 ||
                    document.hidden ||
                    reduceMotion.matches
                ) {
                    return;
                }

                autoplayTimer = setInterval(() => {

                    showSlide(currentSlide + 1);

                }, autoplayDelay);
            }

            /* =================================
               MANUAL NAVIGATION
            ================================= */

            function goToSlide(index) {

                showSlide(index);

                // Restart the 3-second countdown
                startAutoplay();
            }

            /* =================================
               DOT NAVIGATION
            ================================= */

            dots.forEach((dot, index) => {

                dot.addEventListener("click", () => {

                    goToSlide(index);

                });

            });

            /* =================================
               PREVIOUS BUTTON
            ================================= */

            if (prevButton) {

                prevButton.addEventListener("click", () => {

                    goToSlide(currentSlide - 1);

                });

            }

            /* =================================
               NEXT BUTTON
            ================================= */

            if (nextButton) {

                nextButton.addEventListener("click", () => {

                    goToSlide(currentSlide + 1);

                });

            }

            /* =================================
               KEYBOARD NAVIGATION
            ================================= */

            slider.addEventListener("keydown", event => {

                if (event.key === "ArrowRight") {

                    event.preventDefault();

                    goToSlide(currentSlide + 1);

                }

                if (event.key === "ArrowLeft") {

                    event.preventDefault();

                    goToSlide(currentSlide - 1);

                }

            });

            /* =================================
               MOBILE TOUCH SWIPE
            ================================= */

            slider.addEventListener(
                "touchstart",
                event => {

                    touchStartX =
                        event.changedTouches[0].screenX;

                    touchStartY =
                        event.changedTouches[0].screenY;

                },
                { passive: true }
            );

            slider.addEventListener(
                "touchend",
                event => {

                    const deltaX =
                        event.changedTouches[0].screenX -
                        touchStartX;

                    const deltaY =
                        event.changedTouches[0].screenY -
                        touchStartY;

                    if (
                        Math.abs(deltaX) > 50 &&
                        Math.abs(deltaX) > Math.abs(deltaY)
                    ) {

                        goToSlide(
                            currentSlide +
                            (deltaX < 0 ? 1 : -1)
                        );

                    }

                },
                { passive: true }
            );

            /* =================================
               DESKTOP MOUSE DRAG SWIPE
            ================================= */

            slider.addEventListener("pointerdown", event => {

                if (
                    event.pointerType !== "mouse" ||
                    event.target.closest("a, button")
                ) {
                    return;
                }

                pointerStartX = event.clientX;

                isPointerDragging = true;

            });

            slider.addEventListener("pointerup", event => {

                if (
                    !isPointerDragging ||
                    pointerStartX === null
                ) {
                    return;
                }

                const deltaX =
                    event.clientX - pointerStartX;

                if (Math.abs(deltaX) > 60) {

                    goToSlide(
                        currentSlide +
                        (deltaX < 0 ? 1 : -1)
                    );

                }

                isPointerDragging = false;
                pointerStartX = null;

            });

            slider.addEventListener("pointercancel", () => {

                isPointerDragging = false;
                pointerStartX = null;

            });

            /* =================================
               PAGE VISIBILITY
            ================================= */

            document.addEventListener(
                "visibilitychange",
                () => {

                    if (document.hidden) {

                        stopAutoplay();

                    } else {

                        startAutoplay();

                    }

                }
            );

            /* =================================
               REDUCED MOTION
            ================================= */

            if (reduceMotion.addEventListener) {

                reduceMotion.addEventListener(
                    "change",
                    startAutoplay
                );

            }

            /* =================================
               INITIALIZE HERO SLIDER
            ================================= */

            const initialSlide = slides.findIndex(
                slide => slide.classList.contains("active")
            );

            showSlide(initialSlide >= 0 ? initialSlide : 0);

            startAutoplay();

        }
    }

    /* =====================================
       WHO WE ARE - SCROLL REVEAL
    ===================================== */

    const revealElements = document.querySelectorAll(
        ".home-about .reveal-up"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        revealElements.length &&
        !reducedMotion &&
        "IntersectionObserver" in window
    ) {

        document.documentElement.classList.add("js-reveal");

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -25px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    /* =====================================
       COMFORT SOLUTIONS - SCROLL REVEAL
    ===================================== */

    const comfortSection = document.querySelector(
        ".comfort-solutions"
    );

    if (comfortSection) {

        const comfortElements = comfortSection.querySelectorAll(
            ".comfort-solutions-heading, .comfort-solution-card"
        );

        if (
            !reducedMotion &&
            "IntersectionObserver" in window
        ) {

            comfortSection.classList.add("is-animated");

            const observer = new IntersectionObserver(
                (entries, currentObserver) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("is-visible");

                            currentObserver.unobserve(entry.target);

                        }

                    });

                },
                {
                    threshold: 0.08,
                    rootMargin: "0px 0px -20px 0px"
                }
            );

            comfortElements.forEach((element, index) => {

                element.style.transitionDelay =
                    `${Math.min(index * 100, 300)}ms`;

                observer.observe(element);

            });

        }
    }

    /* =====================================
       THERMOVA - ANIMATED STATISTICS
    ===================================== */

    const statsSection = document.querySelector(
        ".thermova-stats"
    );

    if (statsSection) {

        const statsElements = statsSection.querySelectorAll(
            ".stats-heading, .stat-item, .stats-bottom"
        );

        const counters = statsSection.querySelectorAll(
            ".stat-number"
        );

        /* =================================
           COUNTER ANIMATION
        ================================= */

        function animateCounter(counter) {

            if (counter.dataset.animated === "true") {
                return;
            }

            counter.dataset.animated = "true";

            const target = Number(counter.dataset.target);

            if (!Number.isFinite(target)) return;

            const duration = 1800;
            const startTime = performance.now();

            function updateCounter(currentTime) {

                const elapsed = currentTime - startTime;

                const progress = Math.min(
                    elapsed / duration,
                    1
                );

                const eased =
                    1 - Math.pow(1 - progress, 3);

                const currentValue = Math.round(
                    target * eased
                );

                counter.textContent =
                    currentValue.toLocaleString("en-US");

                if (progress < 1) {

                    requestAnimationFrame(updateCounter);

                } else {

                    counter.textContent =
                        target.toLocaleString("en-US");

                }
            }

            counter.textContent = "0";

            requestAnimationFrame(updateCounter);
        }

        /* =================================
           STATISTICS OBSERVER
        ================================= */

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {

            counters.forEach(counter => {

                const target = Number(counter.dataset.target);

                if (Number.isFinite(target)) {
                    counter.textContent =
                        target.toLocaleString("en-US");
                }

            });

        } else {

            statsSection.classList.add("is-animated");

            const observer = new IntersectionObserver(
                (entries, currentObserver) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) return;

                        entry.target.classList.add("is-visible");

                        const counter = entry.target.matches(
                            ".stat-number"
                        )
                            ? entry.target
                            : entry.target.querySelector(
                                ".stat-number"
                            );

                        if (counter) {
                            animateCounter(counter);
                        }

                        currentObserver.unobserve(entry.target);

                    });

                },
                {
                    threshold: 0.1,
                    rootMargin: "0px 0px -20px 0px"
                }
            );

            statsElements.forEach((element, index) => {

                element.style.transitionDelay =
                    `${Math.min(index * 90, 360)}ms`;

                observer.observe(element);

            });

            // Ensure counters outside observed items
            // are also animated when visible.
            counters.forEach(counter => {

                if (!counter.closest(".stat-item")) {
                    observer.observe(counter);
                }

            });
        }
    }

    /* =====================================
       TESTIMONIALS - SCROLL REVEAL
    ===================================== */

    const testimonialsSection = document.querySelector(
        ".thermova-testimonials"
    );

    if (testimonialsSection) {

        const elements = testimonialsSection.querySelectorAll(
            ".testimonials-heading, .testimonial-card, .testimonials-bottom"
        );

        if (
            !reducedMotion &&
            "IntersectionObserver" in window
        ) {

            testimonialsSection.classList.add("is-animated");

            const observer = new IntersectionObserver(
                (entries, currentObserver) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) return;

                        entry.target.classList.add("is-visible");

                        currentObserver.unobserve(entry.target);

                    });

                },
                {
                    threshold: 0.1,
                    rootMargin: "0px 0px -20px 0px"
                }
            );

            elements.forEach((element, index) => {

                element.style.transitionDelay =
                    `${Math.min(index * 100, 400)}ms`;

                observer.observe(element);

            });
        }
    }

    /* =====================================
       CONTACT CTA - SCROLL REVEAL
    ===================================== */

    const contactSection = document.querySelector(
        ".thermova-contact-cta"
    );

    if (contactSection) {

        const contactGrid = contactSection.querySelector(
            ".contact-cta-grid"
        );

        if (
            contactGrid &&
            !reducedMotion &&
            "IntersectionObserver" in window
        ) {

            contactSection.classList.add("is-animated");

            const observer = new IntersectionObserver(
                (entries, currentObserver) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("is-visible");

                            currentObserver.unobserve(entry.target);

                        }

                    });

                },
                {
                    threshold: 0.1
                }
            );

            observer.observe(contactGrid);
        }
    }

});




/* =========================================
   THERMOVA - CONTACT INFORMATION REVEAL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector(
        ".thermova-contact-info"
    );

    if (!section) return;

    const elements = section.querySelectorAll(
        ".contact-info-heading, .contact-info-card"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    section.classList.add("is-animated");

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);

            });

        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -20px 0px"
        }
    );

    elements.forEach((element, index) => {

        element.style.transitionDelay =
            `${Math.min(index * 100, 300)}ms`;

        observer.observe(element);

    });

});




/* =========================================
   THERMOVA - CONTACT FORM
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector(
        ".thermova-contact-form"
    );

    if (!section) return;

    const form = document.getElementById(
        "thermovaInquiryForm"
    );

    const successMessage = document.getElementById(
        "contactFormSuccess"
    );

    const phoneInput = document.getElementById(
        "contactPhone"
    );

    /* =====================================
       LEBANESE PHONE NUMBER VALIDATION
    ===================================== */

    function normalizePhone(value) {

        let digits = value.replace(/\D/g, "");

        // Country code is already displayed as +961.
        // Accept pasted international numbers too.

        if (digits.startsWith("00961")) {
            digits = digits.slice(5);
        } else if (digits.startsWith("961")) {
            digits = digits.slice(3);
        }

        return digits;
    }

    function validateLebanesePhone(value) {

        const digits = normalizePhone(value);

        // Mobile: 03 + 6 digits
        // Mobile: 70/71/76/78/79/81 + 6 digits
        // Landline: 01 + 6 digits
        // Other landlines: 0 + area code + local digits

        const mobilePattern =
            /^(?:03\d{6}|(?:70|71|76|78|79|81)\d{6})$/;

        const landlinePattern =
            /^(?:0?[1-9]\d{6})$/;

        return (
            mobilePattern.test(digits) ||
            landlinePattern.test(digits)
        );
    }

    /* =====================================
       PHONE INPUT LIMIT
    ===================================== */

    if (phoneInput) {

        phoneInput.addEventListener("input", () => {

            let digits = normalizePhone(phoneInput.value);

            // National number: maximum 8 digits
            // (2-digit prefix + 6 digits)
            digits = digits.slice(0, 8);

            phoneInput.value = digits;

            phoneInput.setCustomValidity("");

        });

        phoneInput.addEventListener("blur", () => {

            if (
                phoneInput.value.trim() !== "" &&
                !validateLebanesePhone(phoneInput.value)
            ) {

                phoneInput.setCustomValidity(
                    "Please enter a valid Lebanese phone number."
                );

            } else {

                phoneInput.setCustomValidity("");

            }

        });

    }

    /* =====================================
       FORM SUBMISSION
    ===================================== */

    if (form && successMessage && phoneInput) {

        form.addEventListener("submit", event => {

            event.preventDefault();

            successMessage.hidden = true;

            // Check required fields
            if (!form.reportValidity()) {
                return;
            }

            // Validate phone number
            if (!validateLebanesePhone(phoneInput.value)) {

                phoneInput.setCustomValidity(
                    "Please enter a valid Lebanese phone number."
                );

                phoneInput.reportValidity();

                return;
            }

            phoneInput.setCustomValidity("");

            // Frontend-only confirmation.
            // No message is transmitted or stored.

            const successTitle =
                successMessage.querySelector("strong");

            const successText =
                successMessage.querySelector("p");

            if (successTitle) {
                successTitle.textContent =
                    "Thank You!";
            }

            if (successText) {
                successText.textContent =
                    "Your form has been completed successfully.";
            }

            successMessage.hidden = false;

            form.reset();

            successMessage.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        });

    }

    /* =====================================
       SCROLL REVEAL ANIMATION
    ===================================== */

    const elements = section.querySelectorAll(
        ".contact-form-intro, .contact-form-panel"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    section.classList.add("is-animated");

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");

                currentObserver.unobserve(entry.target);

            });

        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -20px 0px"
        }
    );

    elements.forEach((element, index) => {

        element.style.transitionDelay =
            `${index * 150}ms`;

        observer.observe(element);

    });

});



/* =========================================
   THERMOVA - TOOLS ACCORDION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const toolButtons = document.querySelectorAll(
        ".thermova-tools .tool-accordion-toggle"
    );

    toolButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const contentId = button.getAttribute(
                "aria-controls"
            );

            const content = document.getElementById(
                contentId
            );

            if (!content) return;

            const isExpanded =
                button.getAttribute("aria-expanded") === "true";

            // Close other tool descriptions
            toolButtons.forEach((otherButton) => {

                if (otherButton === button) return;

                const otherContent = document.getElementById(
                    otherButton.getAttribute("aria-controls")
                );

                otherButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                if (otherContent) {
                    otherContent.hidden = true;
                }

            });

            // Toggle selected description
            button.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            content.hidden = isExpanded;

        });

    });

});



/* =========================================
   THERMOVA - PLANNING ACCORDION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const planningButtons = document.querySelectorAll(
        ".thermova-planning .planning-accordion-toggle"
    );

    planningButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const contentId = button.getAttribute(
                "aria-controls"
            );

            const content = document.getElementById(
                contentId
            );

            if (!content) return;

            const isExpanded =
                button.getAttribute("aria-expanded") === "true";

            // Close other expanded cards
            planningButtons.forEach((otherButton) => {

                if (otherButton === button) return;

                const otherContent = document.getElementById(
                    otherButton.getAttribute("aria-controls")
                );

                otherButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                if (otherContent) {
                    otherContent.hidden = true;
                }

            });

            // Toggle selected card
            button.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            content.hidden = isExpanded;

        });

    });

});



/* =========================================
   THERMOVA - FAQ FUNCTIONALITY
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const faqSection = document.querySelector(".thermova-faq");

    if (!faqSection) return;

    const searchInput = faqSection.querySelector("#faq-search");

    const filterButtons = faqSection.querySelectorAll(
        ".faq-filter"
    );

    const faqItems = faqSection.querySelectorAll(
        ".faq-item"
    );

    const emptyState = faqSection.querySelector(".faq-empty");
    const resultCount = faqSection.querySelector(".faq-count");

    let activeCategory = "all";

    /* FILTER QUESTIONS */

    function filterFAQs() {

        const searchTerm = searchInput.value
            .toLowerCase()
            .trim();

        let visibleCount = 0;

        faqItems.forEach((item) => {

            const itemCategory = item.dataset.category;

            const question = item.querySelector(
                ".faq-question"
            ).textContent.toLowerCase();

            const answer = item.querySelector(
                ".faq-answer"
            ).textContent.toLowerCase();

            const matchesCategory =
                activeCategory === "all" ||
                itemCategory === activeCategory;

            const matchesSearch =
                question.includes(searchTerm) ||
                answer.includes(searchTerm);

            const isVisible =
                matchesCategory && matchesSearch;

            item.hidden = !isVisible;

            if (!isVisible) {
                item.open = false;
            }

            if (isVisible) {
                visibleCount++;
            }

        });

        emptyState.hidden = visibleCount !== 0;

        resultCount.textContent =
            `Showing ${visibleCount} of ${faqItems.length} questions`;

    }

    /* SEARCH */

    searchInput.addEventListener("input", filterFAQs);

    /* CATEGORY BUTTONS */

    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            activeCategory = button.dataset.category;

            filterButtons.forEach((filter) => {

                const isActive = filter === button;

                filter.classList.toggle(
                    "active",
                    isActive
                );

                filter.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });

            filterFAQs();

        });

    });

    /* ONLY ONE QUESTION OPEN AT A TIME */

    faqItems.forEach((item) => {

        item.addEventListener("toggle", () => {

            if (!item.open) return;

            faqItems.forEach((otherItem) => {

                if (otherItem !== item && otherItem.open) {
                    otherItem.open = false;
                }

            });

        });

    });

    /* INITIALIZE */

    filterFAQs();

});
