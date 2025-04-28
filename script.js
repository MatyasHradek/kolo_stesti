const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const result = document.getElementById("result");
const spinBtn = document.getElementById("spin");

const segments = ["Plavba", "Výhra", "Zkus to znovu", "Sleva 10%", "Výhra 2x", "Nic", "Sleva 20%"];
const colors = ["#FF6347", "#FFD700", "#ADFF2F", "#00CED1", "#FF69B4", "#9370DB", "#32CD32"];
const segAngle = 360 / segments.length; // Úhel každého segmentu

let currentAngle = 0; // Kolo začne od úhlu 0, kde je "Plavba" nahoře

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
    ctx.fillText(segments[i], 150, 10); // Správné umístění textu
    ctx.restore();
  }
}

function drawFixedPointer() {
  // Vykreslení pevného ukazatele
  ctx.beginPath();
  ctx.moveTo(250, 10);
  ctx.lineTo(240, 50);
  ctx.lineTo(260, 50);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
}

function drawRotatedWheel(angle) {
  ctx.clearRect(0, 0, 500, 500);
  ctx.save();
  ctx.translate(250, 250);
  ctx.rotate(angle * Math.PI / 180);
  ctx.translate(-250, -250);
  drawWheel();
  ctx.restore();

  // Přidání pevného ukazatele
  drawFixedPointer();
}

function spinWheel() {
  const rotation = 1440; // Přesně 4 celé otočky (4 * 360°)
  const duration = 4000; // Délka animace v milisekundách
  const start = performance.now();

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3); // Plynulé zpomalení
    currentAngle = rotation * easeOut;
    drawRotatedWheel(currentAngle % 360);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      result.textContent = Výsledek: Plavba; // Výsledek bude vždy "Plavba"
    }
  }

  requestAnimationFrame(animate);
}

// Inicializace kola s pevnou ukazatelkou
drawRotatedWheel(currentAngle);
spinBtn.addEventListener("click", spinWheel);
