import gsap from "https://esm.sh/gsap@3.13.0";

let isAnimating = false;
let activeCard = null;
let originalState = null;

document.addEventListener("click", (event) => {
  if (activeCard && !activeCard.contains(event.target) && !isAnimating) {
    collapseCard(activeCard);
  }
});

document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("click", (event) => {
    event.stopPropagation();
    if (isAnimating || card === activeCard) return;

    if (activeCard) collapseCard(activeCard);
    expandCard(card);
  });
});

function expandCard(card) {
  const rect = card.getBoundingClientRect();
  const scrollY = window.scrollY || window.pageYOffset;
  const scrollX = window.scrollX || window.pageXOffset;

  originalState = {
    top: rect.top + scrollY,
    left: rect.left + scrollX,
    width: rect.width,
    height: rect.height
  };

  isAnimating = true;
  activeCard = card;

  gsap.set(card, {
    position: "fixed",
    top: originalState.top,
    left: originalState.left,
    width: originalState.width,
    height: originalState.height,
    margin: 0,
    zIndex: 999
  });

  card.classList.add("expanded");

  const cardWidth = 25 * parseFloat(getComputedStyle(document.documentElement).fontSize);
  const leftPos = (window.innerWidth / 2) - (cardWidth / 2);
  const centerY = (window.innerHeight / 2) - ((rect.height + scrollY) / 2); 

  gsap.to(card, {
    top: centerY,
    left: leftPos,
    width: "25em",
    height: "auto",
    duration: 0.6,
    ease: "power3.out",
    onComplete: () => {
      isAnimating = false;
    }
  });
}

function collapseCard(card) {
  if (!originalState) return;

  isAnimating = true;

  gsap.to(card, {
    top: originalState.top,
    left: originalState.left,
    width: originalState.width,
    height: originalState.height,
    duration: 0.6,
    ease: "power3.in",
    onComplete: () => {
      gsap.set(card, { clearProps: "all" });
      card.classList.remove("expanded");
      activeCard = null;
      originalState = null;
      isAnimating = false;
    }
  });
}
