import gsap from "https://esm.sh/gsap@3.13.0";

let tl;

function createTicker() {
  const element = document.querySelector(".scrolling-text-inner");
  if (!element) return;

  const textWidth = element.offsetWidth;
  const viewportWidth = window.innerWidth;

  const startX = viewportWidth;
  const endX = -textWidth;

  const duration = 25;

  // Kill previous timeline if exists
  if (tl) {
    // Save progress before killing so it isn't lost during resize
    localStorage.setItem("tickerProgress", tl.progress());
    tl.kill();
  }

  tl = gsap.timeline({ repeat: -1 });

  tl.fromTo(
    element,
    { x: startX },
    { x: endX, duration: duration, ease: "none" }
  );

  // Restore progress if available, else start at 0
  const savedProgress = parseFloat(localStorage.getItem("tickerProgress"));
  if (!isNaN(savedProgress)) {
    tl.progress(savedProgress);
  }
}

window.addEventListener("load", createTicker);

window.addEventListener("resize", () => {
  if (tl) {
    // Save progress before recreating timeline
    localStorage.setItem("tickerProgress", tl.progress());
  }
  createTicker();
});
