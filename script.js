const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const result = document.getElementById("result");
const spinBtn = document.getElementById("spin");

const segments = ["NIC!!", "Výhra", "Plavba", "Prostě něco", "Výhra 2x", "Nejedeš na tábor", "Sleva 20%"];
const colors = ["#FF6347", "#FFD700", "#ADFF2F", "#00CED1", "#FF69B4", "#9370DB", "#32CD32"];
const segAngle = 360 / segments.length;

let currentAngle = 0;
let confetti = []; // Array for confetti
let confettiTimeout;

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
}

// Function to draw the fixed pointer
function drawFixedPointer() {
  ctx.beginPath();
  ctx.moveTo(250, 10);
  ctx.lineTo(240, 50);
  ctx.lineTo(260, 50);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
}

// Function to draw the rotating wheel
function drawRotatedWheel(angle) {
  ctx.clearRect(0, 0, 500, 500); // Clear the canvas
  ctx.save();
  ctx.translate(250, 250); // Move to the center
  ctx.rotate(angle * Math.PI / 180); // Rotate the wheel
  ctx.translate(-250, -250);
  drawWheel(); // Draw the wheel
  ctx.restore();
  drawFixedPointer(); // Draw the pointer
  drawConfetti(); // Draw confetti continuously during animation
}

// Function to draw and animate confetti
function drawConfetti() {
  for (let i = 0; i < confetti.length; i++) {
    const particle = confetti[i];
    // Move the confetti
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.size *= 0.98; // Shrink the confetti (fade effect)

    // Draw the confetti
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();

    // Remove the confetti if it's too small
    if (particle.size < 1) {
      confetti.splice(i, 1);
      i--;
    }
  }
}

// Function to generate random confetti
function generateConfetti() {
  const confettiCount = 100; // Number of confetti particles
  for (let i = 0; i < confettiCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    confetti.push({
      x: 250, // Initial position in the center
      y: 250,
      size: Math.random() * 5 + 5, // Size of the confetti
      speedX: Math.cos(angle) * speed, // Speed in X direction
      speedY: Math.sin(angle) * speed, // Speed in Y direction
      color: `hsl(${Math.random() * 360}, 100%, 50%)` // Random color
    });
  }
}

// Function to spin the wheel
function spinWheel() {
  const duration = 4000; // Duration of the animation in milliseconds
  const start = performance.now();

  // Always want the result to be "Plavba" (index 2)
  const targetSegmentIndex = 2; // Index of "Plavba"
  const targetAngle = segAngle * targetSegmentIndex + segAngle / 2; // Target angle for "Plavba"
  const totalRotation = 1440 + targetAngle; // 4 full rotations + correct angle for "Plavba"

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3); // Ease out for smooth slowing down
    currentAngle = totalRotation * easeOut; // Animation with slowdown
    drawRotatedWheel(currentAngle % 360); // Rotate the wheel

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      result.textContent = "Výsledek: Plavba"; // Show the result after animation
      generateConfetti(); // Generate confetti when animation ends
      // Clear confetti after a few seconds
      clearTimeout(confettiTimeout); // Ensure no previous timeout interferes
      confettiTimeout = setTimeout(() => {
        confetti = []; // Clear confetti after 3 seconds
      }, 3000);
    }
  }

  requestAnimationFrame(animate); // Start the animation
}

drawRotatedWheel(currentAngle); // Draw the initial state of the wheel
spinBtn.addEventListener("click", spinWheel);
