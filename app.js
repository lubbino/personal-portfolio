import gsap from "https://esm.sh/gsap@3.13.0";

let bright = "rgb(222, 176, 39)";
let dark = "rgb(130, 108, 36)";

let savedProgress = parseFloat(localStorage.getItem("bgProgress")) || 0;

let tl = gsap.timeline({
  repeat: -1,
  onUpdate: () => {
    localStorage.setItem("bgProgress", tl.progress());
  }
});

tl.fromTo("#bg", 
  {
    background: `linear-gradient(0deg, ${dark}, ${bright} 100%, ${bright})`
  },
  {
    duration: 30,
    background: `linear-gradient(0deg, ${bright}, ${bright} 0%, ${dark})`,
    ease: "none",
  })
.fromTo("#bg",
  {
    background: `linear-gradient(0deg, ${bright}, ${dark} 100%, ${dark})`,
  },
  {
    duration: 30,
    background: `linear-gradient(0deg, ${dark}, ${dark} 0%, ${bright})`,
    ease: "none",
  });

tl.progress(savedProgress);