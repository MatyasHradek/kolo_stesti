const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const result = document.getElementById("result");
const spinBtn = document.getElementById("spin");

const segments = ["NIC!!", "Výhra", "Plavba", "Prostě něco", "Prohral jsi trenky", "Nejedeš na tábor", "Sleva 20%"];
const colors = ["#FF6347", "#FFD700", "#ADFF2F", "#00CED1", "#FF69B4", "#9370DB", "#32CD32"];
const segAngle = 360 / segments.length;

let currentAngle = 0;
let confetti = []; // Pole pro konfety
let confettiTimeout;

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
    ctx.fillText(segments[i], 150, 10);
    ctx.restore();
  }
}

// Funkce pro vykreslení pevnému ukazatele
function drawFixedPointer() {
  ctx.beginPath();
  ctx.moveTo(250, 10);
  ctx.lineTo(240, 50);
  ctx.lineTo(260, 50);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
}

// Funkce pro vykreslení rotujícího kola
function drawRotatedWheel(angle) {
  ctx.clearRect(0, 0, 500, 500); // Vyčistíme canvas
  ctx.save();
  ctx.translate(250, 250); // Přesun na střed
  ctx.rotate(angle * Math.PI / 180); // Rotace kola
  ctx.translate(-250, -250);
  drawWheel(); // Vykreslení kola
  ctx.restore();
  drawFixedPointer(); // Vykreslení ukazatele
}

// Funkce pro vykreslení konfety a jejich animace
function drawConfetti() {
  // Pro každou konfetu
  for (let i = 0; i < confetti.length; i++) {
    const particle = confetti[i];
    // Posuneme konfetu
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.size *= 0.98; // Zmenšení konfety (efekt vyblednutí)
    
    // Pořád se vykresluje konfeta, dokud není příliš malá
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();

    // Pokud je konfeta příliš malá, odstraníme ji
    if (particle.size < 1) {
      confetti.splice(i, 1);
      i--;
    }
  }
}

// Funkce pro generování náhodných konfety
function generateConfetti() {
  const confettiCount = 100; // Počet konfety
  for (let i = 0; i < confettiCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    confetti.push({
      x: 250, // Počáteční pozice na středu
      y: 250,
      size: Math.random() * 5 + 5, // Velikost konfety
      speedX: Math.cos(angle) * speed, // Rychlost pohybu X
      speedY: Math.sin(angle) * speed, // Rychlost pohybu Y
      color: `hsl(${Math.random() * 360}, 100%, 50%)` // Náhodná barva
    });
  }
}

// Funkce pro roztočení kola
function spinWheel() {
  const duration = 4000; // Délka animace v milisekundách
  const start = performance.now();

  // Vždy chceme, aby výsledek byl "Plavba" (index 2)
  const targetSegmentIndex = 2; // Index segmentu "Plavba"
  const targetAngle = segAngle * targetSegmentIndex + segAngle / 2; // Cílový úhel pro "Plavba"
  const totalRotation = 1440 + targetAngle; // 4 otočky + správný úhel k segmentu "Plavba"

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3); // Plynulé zpomalení animace
    currentAngle = totalRotation * easeOut; // Animace zpomalení
    drawRotatedWheel(currentAngle % 360); // Rotace kola

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      result.textContent = "Výsledek: Plavba"; // Po dokončení animace zobrazíme výsledek
      generateConfetti(); // Generování konfety při dokončení animace
      // Spustíme animaci konfety na 3 sekundy
      confettiTimeout = setTimeout(() => {
        confetti = []; // Vymažeme konfety po 3 sekundách
      }, 3000);
    }
  }

  requestAnimationFrame(animate); // Začátek animace
}

function animateConfetti() {
  drawConfetti(); // Vykreslíme konfety na canvas
  if (confetti.length > 0) {
    requestAnimationFrame(animateConfetti); // Pokračuje v animaci konfety, dokud jsou konfety
  }
}

drawRotatedWheel(currentAngle); // Vykreslíme počáteční stav kola
spinBtn.addEventListener("click", function () {
  spinWheel();
  animateConfetti(); // Spustí animaci konfety hned po kliknutí
});
