import gsap from "https://esm.sh/gsap@3.13.0";

let savedProgress = parseFloat(localStorage.getItem("h1Progress")) || 0;

let tl = gsap.timeline({
  repeat: -1,
  onUpdate: () => {
    localStorage.setItem("h1Progress", tl.progress());
  }
});

tl.fromTo("h1",
  {
    color: "rgb(210, 210, 210)",
    textShadow: "0px 0px 10px #000"
  },
  {
    duration: 4,
    color: "rgb(255, 255, 255)",
    textShadow: "0px 0px 10px #000",
    ease: "none",
})
.fromTo("h1",
    {
      color: "rgb(255, 255, 255)",
      textShadow: "0px 0px 10px #000"
    },
    {
    duration: 4,
    color: "rgb(210, 210, 210)",
    textShadow: "0px 0px 10px #000",
    ease: "none",
});

tl.progress(savedProgress);