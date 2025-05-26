import gsap from "https://esm.sh/gsap@3.13.0";

let progress = parseFloat(localStorage.getItem("scrollingTextProgress")) || 0;

const tl = gsap.timeline({
  repeat: -1,
  onUpdate: () => {
    localStorage.setItem("scrollingTextProgress", tl.progress());
  }
});

tl.fromTo(".scrolling-text-inner",
  { x: "100%" },
  { duration: 15, x: "-100%", ease: "none" }
);

tl.progress(progress);
