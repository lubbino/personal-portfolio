import gsap from "https://esm.sh/gsap@3.13.0";

const container = document.querySelector(".cards-container");
const cards = Array.from(container.querySelectorAll(".project-card"));

let isAnimating = false;
let activeCard = null;
let originalRects = new Map(); // Store each card's original bounding rect

// Utility to update all cards' original bounding rects relative to viewport
function updateOriginalRects() {
  originalRects.clear();
  cards.forEach(card => {
    originalRects.set(card, card.getBoundingClientRect());
  });
}

// Calculate horizontal shift amount for other cards to move aside
function getShiftAmount(expandedCardRect, cardRect) {
  const expandedCenterX = expandedCardRect.left + expandedCardRect.width / 2;
  const cardCenterX = cardRect.left + cardRect.width / 2;

  if (cardCenterX > expandedCenterX) {
    return expandedCardRect.width / 2 + 20; // Shift right by half expanded card width + buffer
  } else if (cardCenterX < expandedCenterX) {
    return -(expandedCardRect.width / 2 + 20); // Shift left
  }
  return 0;
}

// Collapse card if clicking outside active card and no animation in progress
document.addEventListener("click", (event) => {
  if (activeCard && !activeCard.contains(event.target) && !isAnimating) {
    collapseCard(activeCard);
  }
});

// Add click listeners to cards for expansion/collapse toggle
cards.forEach(card => {
  card.addEventListener("click", (event) => {
    event.stopPropagation();
    if (isAnimating || card === activeCard) return;

    updateOriginalRects();

    if (activeCard) {
      collapseCard(activeCard, () => expandCard(card));
    } else {
      expandCard(card);
    }
  });
});

// Add close button event listeners inside cards
cards.forEach(card => {
  const closeBtn = card.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isAnimating && card === activeCard) {
        collapseCard(card);
      }
    });
  }
});

function expandCard(card) {
  isAnimating = true;
  activeCard = card;

  // Capture original rect BEFORE adding .expanded
  updateOriginalRects();
  const cardRect = originalRects.get(card);

  // Add classes AFTER getting rect
  card.classList.add("expanded");
  container.classList.add("expanded-active");

  const scrollY = window.scrollY || window.pageYOffset;
  const scrollX = window.scrollX || window.pageXOffset;

  // Fix card position & size exactly at its original place on screen
  gsap.set(card, {
    position: "fixed",
    top: cardRect.top + scrollY,
    left: cardRect.left + scrollX,
    width: cardRect.width,
    height: cardRect.height,
    margin: 0,
    zIndex: 1000,
    boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
    borderRadius: "12px",
    overflow: "hidden",
    willChange: "transform, top, left, width, height"
  });

  const timeline = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
      document.body.classList.add("no-scroll");
    }
  });

  // Animate other cards aside
  cards.forEach(otherCard => {
    if (otherCard === card) return;
    const otherRect = originalRects.get(otherCard);
    const shiftX = getShiftAmount(cardRect, otherRect);

    timeline.to(otherCard, {
      x: shiftX,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
      willChange: "transform"
    }, 0);
  });

  const viewportWidth = window.innerWidth;
  const targetWidthRem = 25;
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const targetWidthPx = targetWidthRem * rootFontSize;

  if (viewportWidth < 600) {
    // Fullscreen mode on small screens
    timeline.to(card, {
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      duration: 0.6,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(card, { overflowY: "auto" });
      }
    }, ">");

  } else {
    // Normal expand mode on larger screens

    // Temporarily set width to targetWidthPx and height auto to measure final expanded height
    gsap.set(card, { width: targetWidthPx, height: "auto" });
    const expandedHeight = card.getBoundingClientRect().height;

    // Reset width and height to original so we animate from original to expanded
    gsap.set(card, { width: cardRect.width, height: cardRect.height });

    // Calculate centered top and left for expanded card
    const targetTop = (window.innerHeight - expandedHeight) / 2;
    const targetLeft = (window.innerWidth - targetWidthPx) / 2;

    timeline.to(card, {
      top: targetTop,
      left: targetLeft,
      width: targetWidthPx,
      height: expandedHeight,
      borderRadius: "12px",
      duration: 0.6,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(card, { height: "auto", overflowY: "auto", maxHeight: "90vh" });
      }
    }, ">");
  }
}

function collapseCard(card, callback) {
  if (!originalRects.has(card)) return;

  isAnimating = true;
  document.body.classList.remove("no-scroll");

  // Animate other cards back to original position
  cards.forEach(otherCard => {
    if (otherCard === card) return;
    gsap.to(otherCard, {
      x: 0,
      duration: 0.6,
      ease: "power3.inOut",
      overwrite: "auto",
      willChange: "transform"
    });
  });

  // Animate card back to original position and size
  const cardRect = originalRects.get(card);
  const scrollY = window.scrollY || window.pageYOffset;
  const scrollX = window.scrollX || window.pageXOffset;

  // Fix current height before animating back to avoid jump
  const currentHeight = card.getBoundingClientRect().height;
  gsap.set(card, { height: currentHeight, overflow: "hidden" });

  gsap.to(card, {
    top: cardRect.top + scrollY,
    left: cardRect.left + scrollX,
    width: cardRect.width,
    height: cardRect.height,
    duration: 0.6,
    ease: "power3.inOut",
    onComplete: () => {
      gsap.set(card, {
        clearProps: "all",
        overflow: ""
      });
      card.classList.remove("expanded");
      container.classList.remove("expanded-active");
      activeCard = null;
      isAnimating = false;
      if (typeof callback === "function") callback();
    }
  });
}
