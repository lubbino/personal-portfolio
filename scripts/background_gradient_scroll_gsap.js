import gsap from "https://esm.sh/gsap@3.13.0";

const bright = "#332B2B";
const dark = "#000000";

// Load saved progress, ensure it's between 0 and 1
const savedProgress = Math.min(Math.max(parseFloat(localStorage.getItem("bgProgress")) || 0, 0), 1);

const tl = gsap.timeline({
  repeat: -1,
  onUpdate: () => {
    localStorage.setItem("bgProgress", tl.progress());
  }
});

tl.fromTo(
  "#bg",
  {
    background: `linear-gradient(45deg, ${dark}, ${bright} 100%, ${bright})`
  },
  {
    duration: 30,
    background: `linear-gradient(45deg, ${bright}, ${bright} 0%, ${dark})`,
    ease: "none",
  }
)
.fromTo(
  "#bg",
  {
    background: `linear-gradient(45deg, ${bright}, ${dark} 100%, ${dark})`
  },
  {
    duration: 30,
    background: `linear-gradient(45deg, ${dark}, ${dark} 0%, ${bright})`,
    ease: "none",
  }
);

// Start animation from saved progress so it picks up seamlessly
tl.progress(savedProgress);
