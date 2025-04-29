const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const result = document.getElementById("result");
const spinBtn = document.getElementById("spin");

const segments = ["Plavba", "Výhra", "Zkus to znovu", "Prostě něco", "Výhra 2x", "Nejedeš na tábor", "Sleva 20%"];
const colors = ["#FF6347", "#FFD700", "#ADFF2F", "#00CED1", "#FF69B4", "#9370DB", "#32CD32"];
const segAngle = 360 / segments.length;

let currentAngle = 0;

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
    ctx.fillText(segments[i], 150, 10);
    ctx.restore();
  }
}

function drawFixedPointer() {
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
  drawFixedPointer();
}

function spinWheel() {
  const duration = 4000; // Délka animace v milisekundách
  const start = performance.now();

  // Vždy chceme, aby výsledek byl "Plavba" (index 5)
  const targetSegmentIndex = 0; // Index segmentu "Plavba"
const targetAngle = segAngle * targetSegmentIndex + segAngle / 2; // Cílový úhel pro "Plavba"
const totalRotation = 1440 + targetAngle;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    currentAngle = totalRotation * easeOut; // Animace zpomalení
    drawRotatedWheel(currentAngle % 360);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      result.textContent = "Výsledek: Plavba"; // Po dokončení animace zobrazíme "Plavba"
    }
  }

  requestAnimationFrame(animate);
}

drawRotatedWheel(currentAngle);
spinBtn.addEventListener("click", spinWheel);
