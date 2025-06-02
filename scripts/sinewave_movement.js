import gsap from "https://esm.sh/gsap@3.13.0";


document.addEventListener('DOMContentLoaded', () => {
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
    svg.style.opacity = "0.25"; // Make it subtle
    
    // Add to the existing background container
    const bg = document.getElementById('bg');
    bg.appendChild(svg);

    // Wave parameters
    const amplitude = 75;
    const frequency = 0.005;
    const points = [];
    const height = window.innerHeight;
    const width = window.innerWidth * 2; // Extra width for seamless looping

    // Generate wave points
    for (let x = 0; x <= width; x += 20) {
        const y = height/2 + Math.sin(x * frequency) * amplitude;
        points.push(`${x},${y}`);
    }

    // Create the path
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${points.join(" L")}`);
    path.setAttribute("stroke", "#EAE4D5");
    path.setAttribute("stroke-width", "5");
    path.setAttribute("fill", "none");
    svg.appendChild(path);

    // Animation - infinite horizontal loop
    gsap.fromTo(path, 
        { x: 0 },
        {
            x: -width/2,
            duration: 20,
            repeat: -1,
            ease: "none",
            yoyo: true
        }
    );

    // Responsive adjustments
    window.addEventListener('resize', () => {
        svg.setAttribute("width", window.innerWidth);
        svg.setAttribute("height", window.innerHeight);
    });
});
