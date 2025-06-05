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
  svg.style.zIndex = "-2"; // Behind everything but above gradient bg
  svg.style.opacity = "0.25";

  bg.appendChild(svg);

  const amplitude = 75;
  const frequency = 0.005;
  const step = 20;
  let width, height, group, animation;

  function createWave() {
    // Clear previous content and animations
    gsap.killTweensOf(svg);
    svg.innerHTML = '';

    width = window.innerWidth;
    height = window.innerHeight;

    svg.setAttribute("width", width * 2);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width * 2} ${height}`);

    // Create group <g> that holds two identical paths side by side
    group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Function to generate wave path string
    function generateWavePath(xOffset = 0) {
      const points = [];
      for (let x = 0; x <= width; x += step) {
        const y = height / 2 + Math.sin((x + xOffset) * frequency) * amplitude;
        points.push(`${x},${y}`);
      }
      return `M${points.join(" L")}`;
    }

    // Create two paths, second shifted by width on x axis
    for (let i = 0; i < 2; i++) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", generateWavePath(i * width));
      path.setAttribute("stroke", "#EAE4D5");
      path.setAttribute("stroke-width", "5");
      path.setAttribute("fill", "none");
      path.setAttribute("transform", `translate(${i * width}, 0)`);
      group.appendChild(path);
    }

    svg.appendChild(group);

    // Animate group to slide left by width, then repeat infinitely
    animation = gsap.to(group, {
      x: -width,
      duration: 20,
      ease: "linear",
      repeat: -1,
      overwrite: "auto"
    });
  }

  createWave();

  window.addEventListener('resize', () => {
    createWave();
  });
});
