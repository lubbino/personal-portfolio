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

function expandCard(card) {
  isAnimating = true;
  activeCard = card;

  const cardRect = originalRects.get(card);
  const scrollY = window.scrollY || window.pageYOffset;
  const scrollX = window.scrollX || window.pageXOffset;

  // Set card to fixed position matching original position/size
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
      overwrite: "auto"
    }, 0);
  });

  // Calculate target width (25rem approx) and height after setting width
  const targetWidth = 25 * parseFloat(getComputedStyle(document.documentElement).fontSize);
  gsap.set(card, { width: targetWidth, height: "auto" });
  const expandedHeight = card.getBoundingClientRect().height;

  const targetTop = (window.innerHeight - expandedHeight) / 2;
  const targetLeft = (window.innerWidth - targetWidth) / 2;

  // Animate the card to center and expand
  timeline.to(card, {
    top: targetTop,
    left: targetLeft,
    width: targetWidth,
    height: expandedHeight,
    duration: 0.6,
    ease: "power3.out",
    onComplete: () => {
      // Fix height to auto after animation so content can flow naturally
      gsap.set(card, { height: "auto" });
    }
  }, ">"); // start after previous animations finish
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
      overwrite: "auto"
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
      activeCard = null;
      isAnimating = false;
      if (typeof callback === "function") callback();
    }
  });
}
