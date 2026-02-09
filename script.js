const player = document.getElementById("player");
const heart = document.getElementById("heart");
const message = document.getElementById("message");
const game = document.getElementById("game");

let x = 10;
let y = 10;
let score = 0;
const step = 10;

// Időzítés a "try again" üzenethez
let lastCatchTime = Date.now();

// Kezdő pozíció
player.style.left = x + "px";
player.style.top = y + "px";

// Szív új helyre mozgatása
function moveHeart() {
  const maxX = game.clientWidth - 30;
  const maxY = game.clientHeight - 30;

  heart.style.left = Math.random() * maxX + "px";
  heart.style.top = Math.random() * maxY + "px";
}

// Ütközés ellenőrzése
function checkCollision() {
  const p = player.getBoundingClientRect();
  const h = heart.getBoundingClientRect();

  const hit = !(
    p.right < h.left ||
    p.left > h.right ||
    p.bottom < h.top ||
    p.top > h.bottom
  );

  if (hit) {
    score++;
    lastCatchTime = Date.now();
    message.textContent = `Zsófi caught the heart ❤️ (${score})`;
    moveHeart();
    confetti();
  }
}

// Billentyűzetes irányítás
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") y -= step;
  if (e.key === "ArrowDown") y += step;
  if (e.key === "ArrowLeft") x -= step;
  if (e.key === "ArrowRight") x += step;

  // Határok
  x = Math.max(0, Math.min(x, game.clientWidth - 30));
  y = Math.max(0, Math.min(y, game.clientHeight - 60));

  player.style.left = x + "px";
  player.style.top = y + "px";

  checkCollision();
});

// 5 mp után bátorító üzenet
setInterval(() => {
  const now = Date.now();
  if (now - lastCatchTime > 5000) {
    message.textContent = "Dont worry, try again, I'm worth it!";
  }
}, 1000);

// 🎉 Konfetti effekt
function confetti() {
  for (let i = 0; i < 20; i++) {
    const dot = document.createElement("div");
    dot.style.position = "absolute";
    dot.style.width = "6px";
    dot.style.height = "6px";
    dot.style.borderRadius = "50%";
    dot.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
    dot.style.left = heart.style.left;
    dot.style.top = heart.style.top;

    game.appendChild(dot);

    const dx = (Math.random() - 0.5) * 120;
    const dy = (Math.random() - 0.5) * 120;

    dot.animate(
      [
        { transform: "translate(0,0)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
      ],
      {
        duration: 700,
        easing: "ease-out"
      }
    );

    setTimeout(() => dot.remove(), 700);
  }
}

// Indítás
moveHeart();
message.textContent = "Catch my heart ❤️";
