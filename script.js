const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const result = document.getElementById("result");

let isFloating = false;

function getViewportBox() {
  // En iPhone Safari, visualViewport suele ser más fiel al área visible real.
  const vv = window.visualViewport;
  if (vv) {
    return {
      left: vv.offsetLeft,
      top: vv.offsetTop,
      width: vv.width,
      height: vv.height,
    };
  }
  return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function detachNoWithoutJump() {
  if (isFloating) return;

  const rect = noBtn.getBoundingClientRect();
  noBtn.classList.add("floating-no");

  // IMPORTANTE: setear la posición inicial y luego medir de nuevo
  noBtn.style.left = `${rect.left}px`;
  noBtn.style.top  = `${rect.top}px`;

  isFloating = true;
}

function moveNoAnywhere() {
  detachNoWithoutJump();

  // Forzar reflow para que el tamaño sea el correcto (móvil)
  // eslint-disable-next-line no-unused-expressions
  noBtn.offsetHeight;

  const margin = 12;
  const vp = getViewportBox();

  const btnW = noBtn.getBoundingClientRect().width;
  const btnH = noBtn.getBoundingClientRect().height;

  const minX = vp.left + margin;
  const minY = vp.top  + margin;
  const maxX = vp.left + vp.width  - btnW - margin;
  const maxY = vp.top  + vp.height - btnH - margin;

  // Si por cualquier motivo max < min, evitamos valores inválidos
  const safeMaxX = Math.max(minX, maxX);
  const safeMaxY = Math.max(minY, maxY);

  const x = minX + Math.random() * (safeMaxX - minX);
  const y = minY + Math.random() * (safeMaxY - minY);

  // Clamp extra por seguridad
  const finalX = clamp(x, minX, safeMaxX);
  const finalY = clamp(y, minY, safeMaxY);

  noBtn.style.left = `${finalX}px`;
  noBtn.style.top  = `${finalY}px`;
}

// Desktop
noBtn.addEventListener("mouseenter", moveNoAnywhere);

// Mobile
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoAnywhere();
}, { passive: false });

noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoAnywhere();
});

yesBtn.addEventListener("click", () => {
  result.hidden = false;
  yesBtn.disabled = true;
  noBtn.style.display = "none";
});

// Si cambia el viewport (rotación / barra safari), recolocamos el botón dentro
window.addEventListener("resize", () => {
  if (isFloating && noBtn.style.display !== "none") {
    moveNoAnywhere();
  }
});
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () => {
    if (isFloating && noBtn.style.display !== "none") {
      moveNoAnywhere();
    }
  });
}
