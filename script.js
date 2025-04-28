const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const result = document.getElementById("result");
const spinBtn = document.getElementById("spin");

const segments = ["Plavba", "Výlet", "Film", "Oběd", "Káva"];
const colors = ["#FF6347", "#FFD700", "#ADFF2F", "#00CED1", "#FF69B4"];
const segAngle = 360 / segments.length;

let currentAngle = 0;

// Funkce pro vykreslení kola štěstí
function drawWheel() {
  for (let i = 0; i < segments.length; i++) {
    const angle = segAngle * i * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 240, angle, angle + segAngle * Math.PI / 180);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(angle + segAngle * Math.PI / 360);
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(segments[i], 150, 10); // Zajištění správného umístění textu
    ctx.restore();
  }

  // Přidání ukazatele
  ctx.beginPath();
  ctx.moveTo(250, 10);
  ctx.lineTo(240, 50);
  ctx.lineTo(260, 50);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
}

// Funkce pro otočení kola
function spinWheel() {
  const rotation = 1440; // Minimálně 1440° pro několik otáček (můžeme to zvyšovat, aby bylo točení zajímavější)
  const duration = 4000; // Délka animace (4 sekundy)
  const start = performance.now();

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    currentAngle = rotation * easeOut;

    // Kreslení kola s otáčením
    ctx.clearRect(0, 0, 500, 500);
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(currentAngle * Math.PI / 180);
    ctx.translate(-250, -250);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Po skončení animace vždy ukázat "Plavba"
      result.textContent = `Výsledek: Plavba`;
    }
  }

  requestAnimationFrame(animate);
}

drawWheel();
spinBtn.addEventListener("click", spinWheel);
