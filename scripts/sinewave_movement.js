import gsap from "https://esm.sh/gsap@3.13.0";

document.addEventListener('DOMContentLoaded', () => {
  const bg = document.getElementById('bg');

  // Create SVG container for the wave
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", "sine-wave");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.style.position = "fixed";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.zIndex = "-2"; // Behind everything but above the gradient bg
  svg.style.opacity = "0.25"; // Subtle wave

  bg.appendChild(svg);

  const amplitude = 75;
  const frequency = 0.005;
  const step = 20;
  let width, height, path, animation;

  function createWave() {
    // Clear previous path if any
    if (path) {
      svg.removeChild(path);
      gsap.killTweensOf(path);
    }

    width = window.innerWidth * 2; // double width for smooth looping
    height = window.innerHeight;

    // Set SVG attributes
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    // Generate points for the wave path
    const points = [];
    for (let x = 0; x <= width; x += step) {
      const y = height / 2 + Math.sin(x * frequency) * amplitude;
      points.push(`${x},${y}`);
    }

    // Create path element
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${points.join(" L")}`);
    path.setAttribute("stroke", "#EAE4D5");
    path.setAttribute("stroke-width", "5");
    path.setAttribute("fill", "none");
    svg.appendChild(path);

    // Animate path sliding horizontally in infinite loop
    animation = gsap.fromTo(path, 
      { x: 0 },
      {
        x: -width / 2,
        duration: 20,
        repeat: -1,
        ease: "linear", // smooth constant speed
        overwrite: "auto"
      }
    );
  }

  createWave();

  window.addEventListener('resize', () => {
    createWave();
  });
});
