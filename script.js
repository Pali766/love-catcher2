const game = document.getElementById("game");
const player = document.getElementById("player");
const heart = document.getElementById("heart");
const message = document.getElementById("message");
const controls = document.getElementById("controls");
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");

let x = 10, y = 10;
let gameActive = true;
let obstacles = [];
let dialogState = 0;
const step = 10;

let startTime = Date.now(); // 15 mp időkorlát

function rect(el){ return el.getBoundingClientRect(); }
function hit(a,b){
  return !(a.right<b.left||a.left>b.right||a.bottom<b.top||a.top>b.bottom);
}
function random(min,max){ return Math.floor(Math.random()*(max-min)+min); }

/* RENDEZETT AKADÁLYOK */
// előre definiált útvonalak (10-15 db)
const predefinedPaths = [
  ["0-0","1-0","2-0","3-0","4-1","5-2","6-3","7-4","7-5","7-6","7-7"],
  ["0-0","0-1","0-2","1-2","2-2","3-2","4-3","5-4","6-5","7-6","7-7"],
  ["0-0","1-0","2-1","3-2","4-2","5-3","6-4","7-5","7-6","7-7"],
  ["0-0","0-1","1-2","2-3","3-4","4-5","5-6","6-6","7-7"],
  ["0-0","1-0","2-0","3-1","4-2","5-3","6-4","7-5","7-6","7-7"],
  ["0-0","0-1","1-1","2-2","3-3","4-4","5-5","6-6","7-7"],
  ["0-0","1-0","2-1","3-2","4-3","5-4","6-5","7-6","7-7"],
  ["0-0","0-1","1-2","2-3","3-4","4-5","5-6","6-6","7-7"],
  ["0-0","1-0","2-1","3-1","4-2","5-3","6-4","7-5","7-6","7-7"],
  ["0-0","0-1","1-1","2-2","3-3","4-4","5-5","6-6","7-7"],
  ["0-0","1-0","2-0","3-1","4-2","5-3","6-4","7-5","7-6","7-7"],
  ["0-0","0-1","1-2","2-3","3-4","4-5","5-6","6-6","7-7"],
  ["0-0","1-0","2-1","3-2","4-3","5-4","6-5","7-6","7-7"],
  ["0-0","0-1","1-1","2-2","3-3","4-4","5-5","6-6","7-7"],
  ["0-0","1-0","2-0","3-1","4-2","5-3","6-4","7-5","7-6","7-7"]
];

function generateObstacles(){
  obstacles.forEach(o => o.remove());
  obstacles = [];

  const cellSize = 40; // rács mérete
  const cols = 8;
  const rows = 8;

  // Biztonsági zóna a karakter körül (2x2 cella)
  const safeZone = ["0-0","1-0","0-1","1-1"];

  // Véletlenszerű akadályok
  for(let y=0; y<rows; y++){
    for(let x=0; x<cols; x++){
      const key = x + "-" + y;

      if(safeZone.includes(key)) continue; // ne legyen a karakternél fal

      if(Math.random() < 0.3){ // fal valószínűsége
        const o = document.createElement("div");
        o.className = "obstacle";
        o.style.width = cellSize + "px";
        o.style.height = "12px";
        o.style.left = (x * cellSize + 10) + "px";
        o.style.top = (y * cellSize + 20) + "px";
        game.appendChild(o);
        obstacles.push(o);
      }
    }
  }
}

// Szív elhelyezése mindig a karaktertől távol
function moveHeart() {
  const maxX = game.clientWidth - 30;
  const maxY = game.clientHeight - 30;

  let valid = false;
  let hx, hy;

  while(!valid){
    hx = Math.floor(Math.random() * maxX);
    hy = Math.floor(Math.random() * maxY);

    // legalább 2 cellányi távolság a kiindulási ponttól
    if(hx > 80 || hy > 80){
      valid = true;

      // ellenőrzés, hogy nem akadály alatt van
      for(const o of obstacles){
        const rect = o.getBoundingClientRect();
        if(hx >= rect.left && hx <= rect.right && hy >= rect.top && hy <= rect.bottom){
          valid = false;
          break;
        }
      }
    }
  }

  heart.style.left = hx + "px";
  heart.style.top = hy + "px";
}


  // Véletlenszerű útvonal kiválasztása
  const path = predefinedPaths[Math.floor(Math.random()*predefinedPaths.length)];

  // falak generálása az útvonalon kívül
  for(let y=0; y<rows; y++){
    for(let x=0; x<cols; x++){
      const key = x + "-" + y;
      // mindig szabad a kezdőpont (0-0 és közeli cellák)
      if(path.includes(key) || (x<=1 && y<=1)) continue;

      if(Math.random()<0.35){ // fal valószínűsége
        const o = document.createElement("div");
        o.className = "obstacle";
        o.style.width = cellSize + "px";
        o.style.height = "12px";
        o.style.left = (x * cellSize + 10) + "px";
        o.style.top = (y * cellSize + 20) + "px";
        game.appendChild(o);
        obstacles.push(o);
      }
    }
  }
}


  // falak generálása, most nagyobb távolság
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const key = x + "-" + y;

      if (path.includes(key)) continue; // útvonal szabad

      // csak minden második oszlop/mező lehet akadály, hogy ne legyen túl szűk
      if (Math.random() < 0.35 && (x%2===0 || y%2===0)) {
        const o = document.createElement("div");
        o.className = "obstacle";
        o.style.width = cellSize + "px";
        o.style.height = "12px";
        o.style.left = (x * cellSize + 10) + "px";
        o.style.top = (y * cellSize + 20) + "px";
        game.appendChild(o);
        obstacles.push(o);
      }
    }
  }
}


  // falak generálása
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const key = x + "-" + y;

      if (path.includes(key)) continue; // útvonal szabad

      if (Math.random() < 0.35) {
        const o = document.createElement("div");
        o.className = "obstacle";
        o.style.width = cellSize + "px";
        o.style.height = "12px";
        o.style.left = (x * cellSize + 10) + "px";
        o.style.top = (y * cellSize + 20) + "px";
        game.appendChild(o);
        obstacles.push(o);
      }
    }
  }
}



/* SZÍV MOZGÁS */
function moveHeart(){
  heart.style.left=random(260,310)+"px";
  heart.style.top=random(260,310)+"px";
}

/* KARAKTER POZÍCIÓ RESET */
function resetPosition(){
  x=10; y=10;
  player.style.left=x+"px";
  player.style.top=y+"px";
  startTime=Date.now();
}

/* 15 MP IDŐKORLÁT */
function failTime(){
  message.textContent="Túl sokáig tart, életem… ennyire nem akarod a szívemet? 😞";
  resetPosition();
}

/* JÁTÉK VÉGE, DIALÓGUS */
function endGame(){
  gameActive=false;
  controls.classList.remove("hidden");
  dialogState=0;
  message.textContent="Akarsz még játszani?";
}

function handleDialog(answer){
  if(dialogState===0){
    if(answer){
      message.textContent="Biztos, hogy a szívemmel akarsz játszani?";
      dialogState++;
    } else {
      message.textContent="Csak vicceltem, hercegnőm, játsz nyugodtan 😄";
      controls.classList.add("hidden");
      setTimeout(restart,3500);
    }
  } else if(dialogState===1){
    if(answer){
      message.textContent="Hát jó… most megsértődtem, de túl sokat jelentesz, szóval itt a szívem 💗";
    } else {
      message.textContent="Csak vicceltem, hercegnőm, játsz nyugodtan 😄";
    }
    controls.classList.add("hidden");
    setTimeout(restart,3500);
  }
}

yesBtn.onclick=()=>handleDialog(true);
noBtn.onclick=()=>handleDialog(false);

/* BILLENTYŰ MOZGÁS */
document.addEventListener("keydown", e=>{
  if(!gameActive) return;
  if(e.key==="ArrowUp") y-=step;
  if(e.key==="ArrowDown") y+=step;
  if(e.key==="ArrowLeft") x-=step;
  if(e.key==="ArrowRight") x+=step;
  move();
});

/* EGÉR / TOUCH MOZGÁS */
let dragging=false;
let offsetX=0, offsetY=0;

player.addEventListener("mousedown", e=>{
  dragging=true;
  const rectPlayer=player.getBoundingClientRect();
  offsetX = e.clientX - rectPlayer.left;
  offsetY = e.clientY - rectPlayer.top;
});
document.addEventListener("mouseup", ()=>dragging=false);
document.addEventListener("mousemove", e=>{
  if(!dragging || !gameActive) return;
  const r=game.getBoundingClientRect();
  x=e.clientX - r.left - offsetX;
  y=e.clientY - r.top - offsetY;
  move();
});

player.addEventListener("touchstart", e=>{
  dragging=true;
  const rectPlayer=player.getBoundingClientRect();
  const touch=e.touches[0];
  offsetX = touch.clientX - rectPlayer.left;
  offsetY = touch.clientY - rectPlayer.top;
});
document.addEventListener("touchend", ()=>dragging=false);
document.addEventListener("touchmove", e=>{
  if(!dragging || !gameActive) return;
  e.preventDefault();
  const r=game.getBoundingClientRect();
  const touch=e.touches[0];
  x=touch.clientX - r.left - offsetX;
  y=touch.clientY - r.top - offsetY;
  move();
},{passive:false});

/* MOZGÁS LOGIKA */
function move(){
  if(x<0||y<0||x>330||y>300){ failTime(); return; }
  player.style.left=x+"px";
  player.style.top=y+"px";

  const p=rect(player);
  for(const o of obstacles){
    if(hit(p,rect(o))){ failTime(); return; }
  }

  if(hit(p,rect(heart))) endGame();
}

/* IDŐ FIGYELÉS */
setInterval(()=>{
  if(!gameActive) return;
  if(Date.now()-startTime>15000) failTime();
},500);

/* ÚJRAINDÍTÁS */
function restart(){
  gameActive=true;
  generateObstacles();
  moveHeart();
  resetPosition();
  message.textContent="Kapj el engem 💕";
}

/* INDÍTÁS */
generateObstacles();
moveHeart();
resetPosition();
message.textContent="Kapj el engem 💕";
