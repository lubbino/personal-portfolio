import gsap from "https://esm.sh/gsap@3.13.0";

let bright = "#332B2B";
let dark = "#000000";

let savedProgress = parseFloat(localStorage.getItem("bgProgress")) || 0;

let tl = gsap.timeline({
  repeat: -1,
  onUpdate: () => {
    localStorage.setItem("bgProgress", tl.progress());
  }
});

tl.fromTo("#bg", 
  {
    background: `linear-gradient(45deg, ${dark}, ${bright} 100%, ${bright})`
  },
  {
    duration: 30,
    background: `linear-gradient(45deg, ${bright}, ${bright} 0%, ${dark})`,
    ease: "none",
  })
.fromTo("#bg",
  {
    background: `linear-gradient(45deg, ${bright}, ${dark} 100%, ${dark})`,
  },
  {
    duration: 30,
    background: `linear-gradient(45deg, ${dark}, ${dark} 0%, ${bright})`,
    ease: "none",
  });

tl.progress(savedProgress);