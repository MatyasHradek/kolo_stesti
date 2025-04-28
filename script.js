const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const result = document.getElementById("result");
const spinBtn = document.getElementById("spin");

const segments = ["Plavba", "Výlet", "Film", "Oběd", "Káva"];
const colors = ["#FF6347", "#FFD700", "#ADFF2F", "#00CED1", "#FF69B4"];
const segAngle = 360 / segments.length;

let currentAngle = 0;

// Function to draw the wheel
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

  // Draw the pointer
  ctx.beginPath();
  ctx.moveTo(250, 10);
  ctx.lineTo(240, 50);
  ctx.lineTo(260, 50);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
}

// Function to spin the wheel
function spinWheel() {
  const rotations = 1440; // Enough rotations to ensure randomness
  const duration = 4000; // Animation duration (ms)
  const targetAngle = segAngle * 0; // Landing on "Plavba" (index 0)
  const totalRotation = rotations + targetAngle; // Total angle calculation
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    currentAngle = totalRotation * easeOut;

    // Rotate the wheel during animation
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate((currentAngle % 360) * Math.PI / 180);
    ctx.translate(-250, -250);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      result.textContent = `Výsledek: ${segments[0]}`; // Always show "Plavba"
    }
  }

  requestAnimationFrame(animate);
}

drawWheel();
spinBtn.addEventListener("click", spinWheel);
