const stage = document.getElementById('stage');
const bulb = document.getElementById('bulbContainer');
const ropePath = document.getElementById('ropePath');
const lightCircle = document.getElementById('lightCircle');
const textGlowOverlay = document.getElementById('textGlowOverlay');

let bulbX, bulbY;
let velocityX = 0, velocityY = 0;
const stiffness = 0.07;
const damping = 0.92;

let dragging = false;
let lastX = null, lastY = null;

let bulbOn = true; // 🔥 start ON

// Rope anchor
function getRopeTopX() { return window.innerWidth / 2; }
const ropeTopY = 0;

function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

// Reset bulb starting position (slightly offset to create swing)
function resetBulbPosition() {
    bulbX = getRopeTopX() - 100;
    bulbY = window.innerHeight * 0.2;
    velocityX = 4;
    velocityY = 0;
    bulb.style.left = (bulbX - bulb.offsetWidth / 2) + "px";
    bulb.style.top = (bulbY - bulb.offsetHeight / 2) + "px";
}

// Glow radius
function updateSizes() {
    return Math.max(window.innerWidth, window.innerHeight) / 5;
}

// Update bulb appearance based on ON/OFF state
function applyBulbState(glowRadius) {
    if (bulbOn) {
        // ON — bright glow
        bulb.style.background = "radial-gradient(circle at 30% 30%, #fff 0%, #ffeb99 30%, #ffcc33 60%, transparent 100%)";
        bulb.style.boxShadow = `0 0 ${glowRadius * 0.5}px #ffe599, 0 0 ${glowRadius * 0.9}px #ffcc33`;
        lightCircle.style.display = "block";
    } else {
        // OFF — dim bulb
        bulb.style.background = "radial-gradient(circle at 30% 30%, #444 0%, #222 40%, #111 80%, transparent 100%)";
        bulb.style.boxShadow = "none";
        lightCircle.style.display = "none";
        textGlowOverlay.style.opacity = 0; // disable text glow
    }
}

// Main loop
function update() {
    const ropeTopX = getRopeTopX();
    const ropeRestY = window.innerHeight * 0.25;

    if (!dragging) {
        let forceX = (ropeTopX - bulbX) * stiffness;
        let forceY = (ropeRestY - bulbY) * stiffness;

        velocityX = (velocityX + forceX) * damping;
        velocityY = (velocityY + forceY) * damping;

        bulbX += velocityX;
        bulbY += velocityY;
    }

    bulbX = clamp(bulbX, 0, window.innerWidth);
    bulbY = clamp(bulbY, 0, window.innerHeight);

    bulb.style.left = (bulbX - bulb.offsetWidth / 2) + "px";
    bulb.style.top = (bulbY - bulb.offsetHeight / 2) + "px";

    // Rope always visible
    const bulbAttachX = bulbX;
    const bulbAttachY = bulbY - bulb.offsetHeight / 2 + 5;
    const midX = (ropeTopX + bulbAttachX) / 2 + (bulbAttachX - ropeTopX) * 0.1;
    const midY = (ropeTopY + bulbAttachY) / 2;
    ropePath.style.display = "block";
    ropePath.setAttribute("d", `M ${ropeTopX},${ropeTopY} Q ${midX},${midY} ${bulbAttachX},${bulbAttachY}`);

    // Bulb + glow state
    const glowRadius = updateSizes();
    applyBulbState(glowRadius);

    if (bulbOn) {
        // Update light circle
        lightCircle.setAttribute("cx", bulbX);
        lightCircle.setAttribute("cy", bulbY);
        lightCircle.setAttribute("r", glowRadius);

        // Text glow — very tight falloff
        const textCenterY = window.innerHeight * 0.6;
        const textCenterX = window.innerWidth / 2;
        const dx = bulbX - textCenterX;
        const dy = bulbY - textCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let glowStrength = 1 / (1 + (dist * dist) / (glowRadius * glowRadius * 0.25));
        glowStrength = Math.min(0.35, glowStrength);
        textGlowOverlay.style.opacity = glowStrength;
    }

    requestAnimationFrame(update);
}

// --- Drag events with inertia ---
stage.addEventListener("mousedown", e => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    bulbX = e.clientX;
    bulbY = e.clientY;
});
stage.addEventListener("mousemove", e => {
    if (dragging) {
        velocityX = e.clientX - lastX;
        velocityY = e.clientY - lastY;
        bulbX = e.clientX;
        bulbY = e.clientY;
        lastX = e.clientX;
        lastY = e.clientY;
    }
});
stage.addEventListener("mouseup", () => { dragging = false; });

stage.addEventListener("touchstart", e => {
    dragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    bulbX = lastX;
    bulbY = lastY;
}, { passive: true });

stage.addEventListener("touchmove", e => {
    if (dragging) {
        velocityX = e.touches[0].clientX - lastX;
        velocityY = e.touches[0].clientY - lastY;
        bulbX = e.touches[0].clientX;
        bulbY = e.touches[0].clientY;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    }
}, { passive: true });

stage.addEventListener("touchend", () => { dragging = false; });

// --- Toggle ON/OFF ---
stage.addEventListener("click", () => { bulbOn = !bulbOn; });
window.addEventListener("keydown", e => {
    if (e.code === "Space") {
        bulbOn = !bulbOn;
    }
});

// Init
resetBulbPosition();
window.addEventListener("resize", resetBulbPosition);
update();
