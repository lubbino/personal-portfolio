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

  if (tl) tl.kill();

  tl = gsap.timeline({ repeat: -1 });

  tl.fromTo(element, 
    { x: startX }, 
    { x: endX, duration: duration, ease: "none" }
  );
    tl.progress(parseFloat(localStorage.getItem("tickerProgress")) || 0);
}

window.addEventListener("load", createTicker);

window.addEventListener("resize", () => {
  localStorage.setItem("tickerProgress", tl ? tl.progress() : 0);
  createTicker();
});
