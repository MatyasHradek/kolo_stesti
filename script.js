const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const result = document.getElementById("result");
const spinBtn = document.getElementById("spin");

const segments = ["NIC!!", "Pytel cementu", "Plavba", "Prostě něco", "Matfyz je super", "Nejedeš na tábor", "vstupní bonus 300"];
const colors = ["#FF6347", "#FFD700", "#ADFF2F", "#00CED1", "#FF69B4", "#9370DB", "#32CD32"];
const segAngle = 360 / segments.length;

let currentAngle = 0;
let confetti = [];
let confettiTimeout;

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
  drawConfetti();
}

function drawConfetti() {
  for (let i = 0; i < confetti.length; i++) {
    const particle = confetti[i];
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.size *= 0.98;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();
    if (particle.size < 1) {
      confetti.splice(i, 1);
      i--;
    }
  }
}

function generateConfetti() {
  const confettiCount = 100;
  for (let i = 0; i < confettiCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    confetti.push({
      x: 250,
      y: 250,
      size: Math.random() * 5 + 5,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }
}

function spinWheel() {
  const duration = 4000;
  const start = performance.now();
  const targetSegmentIndex = 2;
  const targetAngle = segAngle * targetSegmentIndex + segAngle / 2;
  const totalRotation = 1440 + targetAngle;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    currentAngle = totalRotation * easeOut;
    drawRotatedWheel(currentAngle % 360);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      result.textContent = `Výsledek: ${segments[targetSegmentIndex]}`;
      generateConfetti();
      confettiTimeout = setTimeout(() => {
        confetti = [];
      }, 3000);
    }
  }

  requestAnimationFrame(animate);
}

drawRotatedWheel(currentAngle);
spinBtn.addEventListener("click", spinWheel);
