const mainContent = document.getElementById('main-content');
const navLinks = document.querySelectorAll('.nav-link');

const basketGameMarkup = `
  <aside class="sidebar">
    <div class="card panel">
      <p class="label">Featured</p>
      <h2>Basket Bros</h2>
      <p>
        A fast arcade-style basketball challenge built for quick rounds and
        flashy saves.
      </p>
      <ul class="feature-list">
        <li>Move: A / D or Arrow Keys</li>
        <li>Jump: W / Space</li>
        <li>Throw: E or Click</li>
      </ul>
    </div>

    <div class="card stats">
      <div class="stat-row">
        <span>Score</span>
        <strong id="score">0</strong>
      </div>
      <div class="stat-row">
        <span>Best</span>
        <strong id="best">0</strong>
      </div>
      <div class="stat-row">
        <span>Time</span>
        <strong id="timer">60</strong>
      </div>
    </div>

    <div class="card actions">
      <button id="start-btn">Start Round</button>
      <button id="reset-btn" class="secondary">Reset</button>
    </div>
  </aside>

  <section class="game-panel card">
    <div class="game-header">
      <div>
        <p class="label">Arena</p>
        <h2>Basket Bros Court</h2>
      </div>
      <span class="status-badge" id="status-badge">Ready</span>
    </div>

    <canvas id="gameCanvas" width="960" height="540" aria-label="Basket Bros game canvas"></canvas>
  </section>
`;

const webDashersMarkup = `
  <section class="game-panel card" style="grid-column: 1 / -1;">
    <div class="game-header">
      <div>
        <p class="label">Game</p>
        <h2>Web Dashers</h2>
      </div>
      <span class="status-badge" style="color:#73d3ff; background: rgba(115,211,255,0.12); border-color: rgba(115,211,255,0.2);">Loaded</span>
    </div>

    <div class="game-frame-wrap">
      <iframe
        src="https://rawcdn.githack.com/web-dashers/web-dashers.github.io/refs/heads/main/index.html"
        title="Web Dashers game"
        allowfullscreen
      ></iframe>
    </div>
  </section>
`;

const homeMarkup = `
  <div class="home-grid">
    <article class="game-card card">
      <h3>Basket Bros</h3>
      <p>Arcade basketball action with quick rounds, jumping, and fast shooting.</p>
      <button data-game="basket-bros">Play Now</button>
    </article>

    <article class="game-card card">
      <h3>Web Dashers</h3>
      <p>A full browser runner game embedded directly into the hub.</p>
      <button data-game="web-dashers">Play Now</button>
    </article>
  </div>
`;

function setActiveNavigation(gameName) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.game === gameName;
    link.classList.toggle('active', isActive);
  });
}

function renderHome() {
  mainContent.innerHTML = homeMarkup;
  setActiveNavigation('home');
  document.querySelectorAll('[data-game]').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const gameName = button.dataset.game;
      if (gameName === 'basket-bros') renderBasketBros();
      if (gameName === 'web-dashers') renderWebDashers();
      if (gameName === 'home') renderHome();
    });
  });
}

function renderBasketBros() {
  mainContent.innerHTML = basketGameMarkup;
  setActiveNavigation('basket-bros');
  initBasketBrosGame();
}

function initBasketBrosGame() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const timerEl = document.getElementById('timer');
  const statusBadge = document.getElementById('status-badge');
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const GRAVITY = 0.7;
  const FLOOR_Y = HEIGHT - 80;

  const keys = {};
  const game = {
    running: false,
    score: 0,
    best: Number(localStorage.getItem('basketBrosBest') || 0),
    timeLeft: 60,
    timerHandle: null,
    lastTimestamp: 0,
  };

  const player = {
    x: 110,
    y: FLOOR_Y - 64,
    w: 42,
    h: 64,
    vx: 0,
    vy: 0,
    speed: 5.2,
    jumpForce: 13.8,
    onGround: true,
    facing: 1,
  };

  const ball = {
    x: 190,
    y: 360,
    r: 16,
    vx: 0,
    vy: 0,
    held: true,
    canPickup: true,
  };

  const hoop = {
    x: 770,
    y: 155,
    width: 120,
    height: 116,
    rimY: 170,
  };

  function resetBest() {
    bestEl.textContent = game.best;
  }

  function resetBall() {
    ball.x = player.x + 20;
    ball.y = player.y - 18;
    ball.vx = 0;
    ball.vy = 0;
    ball.held = true;
    ball.canPickup = true;
  }

  function resetPlayer() {
    player.x = 110;
    player.y = FLOOR_Y - player.h;
    player.vx = 0;
    player.vy = 0;
    player.onGround = true;
    player.facing = 1;
  }

  function resetGame() {
    game.score = 0;
    game.timeLeft = 60;
    scoreEl.textContent = game.score;
    timerEl.textContent = game.timeLeft;
    statusBadge.textContent = 'Ready';
    statusBadge.style.color = '#73ffb5';
    statusBadge.style.background = 'rgba(115, 255, 181, 0.12)';
    clearInterval(game.timerHandle);
    resetPlayer();
    resetBall();
    resetBest();
  }

  function startRound() {
    resetGame();
    game.running = true;
    statusBadge.textContent = 'Live';
    statusBadge.style.color = '#ffce52';
    statusBadge.style.background = 'rgba(255, 206, 82, 0.12)';

    game.timerHandle = setInterval(() => {
      if (!game.running) return;
      game.timeLeft -= 1;
      timerEl.textContent = Math.max(0, game.timeLeft);
      if (game.timeLeft <= 0) endRound();
    }, 1000);
  }

  function endRound() {
    game.running = false;
    clearInterval(game.timerHandle);
    if (game.score > game.best) {
      game.best = game.score;
      localStorage.setItem('basketBrosBest', String(game.best));
      bestEl.textContent = game.best;
    }
    statusBadge.textContent = 'Round Over';
    statusBadge.style.color = '#ff7d7d';
    statusBadge.style.background = 'rgba(255, 125, 125, 0.12)';
  }

  function handleInput() {
    if (!game.running) return;

    if (keys.ArrowLeft || keys.a) {
      player.vx = -player.speed;
      player.facing = -1;
    } else if (keys.ArrowRight || keys.d) {
      player.vx = player.speed;
      player.facing = 1;
    } else {
      player.vx *= 0.72;
      if (Math.abs(player.vx) < 0.2) player.vx = 0;
    }

    if ((keys.ArrowUp || keys.w || keys[' ']) && player.onGround) {
      player.vy = -player.jumpForce;
      player.onGround = false;
    }

    if (keys.e && ball.canPickup) {
      if (ball.held) {
        ball.held = false;
        ball.vx = player.facing * 12;
        ball.vy = -8;
        ball.canPickup = false;
        setTimeout(() => {
          ball.canPickup = true;
        }, 200);
      }
    }
  }

  function updatePlayer() {
    player.x += player.vx;
    player.y += player.vy;

    if (player.y + player.h >= FLOOR_Y) {
      player.y = FLOOR_Y - player.h;
      player.vy = 0;
      player.onGround = true;
    } else {
      player.vy += GRAVITY;
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.w > WIDTH) player.x = WIDTH - player.w;
  }

  function updateBall() {
    if (ball.held) {
      ball.x = player.x + player.w / 2;
      ball.y = player.y - 16;
      return;
    }

    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += GRAVITY * 0.8;

    if (ball.y + ball.r >= FLOOR_Y) {
      ball.y = FLOOR_Y - ball.r;
      ball.vy *= -0.65;
      ball.vx *= 0.9;
    }

    if (ball.x - ball.r < 0) {
      ball.x = ball.r;
      ball.vx *= -0.8;
    }

    if (ball.x + ball.r > WIDTH) {
      ball.x = WIDTH - ball.r;
      ball.vx *= -0.8;
    }

    const nearPlayer = Math.abs(ball.x - (player.x + player.w / 2)) < 50 && Math.abs(ball.y - (player.y + 10)) < 50;
    if (nearPlayer && ball.vy > 0 && ball.y > FLOOR_Y - 100 && ball.canPickup) {
      ball.held = true;
      ball.vx = 0;
      ball.vy = 0;
    }

    const hoopLeft = hoop.x;
    const hoopRight = hoop.x + hoop.width;
    const hoopTop = hoop.rimY;
    const hoopBottom = hoop.rimY + 22;

    if (
      ball.x + ball.r > hoopLeft &&
      ball.x - ball.r < hoopRight &&
      ball.y + ball.r > hoopTop &&
      ball.y - ball.r < hoopBottom &&
      ball.vy > 2
    ) {
      game.score += 1;
      scoreEl.textContent = game.score;
      ball.held = true;
      ball.vx = 0;
      ball.vy = 0;
      ball.x = player.x + player.w / 2;
      ball.y = player.y - 16;
    }
  }

  function drawCourt() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#69c6ff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#f2d58d';
    ctx.fillRect(0, 0, WIDTH, 260);
    ctx.fillStyle = '#4fb96f';
    ctx.fillRect(0, 260, WIDTH, HEIGHT - 260);
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, FLOOR_Y, WIDTH, HEIGHT - FLOOR_Y);
    ctx.fillStyle = '#d3d8df';
    ctx.fillRect(0, FLOOR_Y - 14, WIDTH, 10);
    ctx.fillStyle = '#2a3d4d';
    ctx.fillRect(hoop.x + 8, hoop.y, 8, hoop.height);
    ctx.fillStyle = '#f8f9fb';
    ctx.fillRect(hoop.x + 25, hoop.y - 12, 80, 10);
    ctx.strokeStyle = '#e9f4ff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(hoop.x + 35, hoop.y + 12);
    ctx.lineTo(hoop.x + 100, hoop.y + 12);
    ctx.stroke();
    ctx.fillStyle = '#eef2f7';
    ctx.fillRect(hoop.x + 14, hoop.y + 12, 12, 90);
    ctx.fillStyle = '#f8f9fb';
    ctx.fillRect(hoop.x + 86, hoop.y + 12, 12, 50);
  }

  function drawPlayer() {
    ctx.fillStyle = '#fe7e4f';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = '#1f2833';
    ctx.fillRect(player.x + (player.facing === 1 ? player.w - 8 : -2), player.y + 14, 8, 18);
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x + 8, player.y + 10, 10, 10);
    ctx.fillRect(player.x + player.w - 18, player.y + 10, 10, 10);
  }

  function drawBall() {
    ctx.beginPath();
    ctx.fillStyle = '#ffb703';
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = '#5b3f00';
    ctx.lineWidth = 2;
    ctx.moveTo(ball.x - 6, ball.y - 3);
    ctx.lineTo(ball.x + 6, ball.y + 3);
    ctx.moveTo(ball.x - 6, ball.y + 3);
    ctx.lineTo(ball.x + 6, ball.y - 3);
    ctx.stroke();
  }

  function drawHUD() {
    ctx.fillStyle = 'rgba(9, 19, 29, 0.52)';
    ctx.fillRect(18, 18, 160, 52);
    ctx.fillStyle = '#edf7ff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`Score: ${game.score}`, 28, 44);
    ctx.fillText(`Time: ${Math.max(0, game.timeLeft)}`, 28, 60);
  }

  function update() {
    if (game.running) {
      handleInput();
      updatePlayer();
      updateBall();
    }
  }

  function draw() {
    drawCourt();
    drawHUD();
    drawPlayer();
    drawBall();
  }

  function gameLoop(timestamp) {
    const delta = timestamp - game.lastTimestamp;
    if (delta > 0) {
      update();
      draw();
      game.lastTimestamp = timestamp;
    }
    requestAnimationFrame(gameLoop);
  }

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    keys[event.key] = true;
    keys[key] = true;
    if (event.key === ' ') event.preventDefault();
  });

  window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    keys[event.key] = false;
    keys[key] = false;
  });

  canvas.addEventListener('pointerdown', () => {
    if (!game.running) return;
    if (ball.held) {
      ball.held = false;
      ball.vx = player.facing * 12;
      ball.vy = -8;
    }
  });

  startBtn.addEventListener('click', startRound);
  resetBtn.addEventListener('click', resetGame);

  resetGame();
  requestAnimationFrame(gameLoop);
  window.addEventListener('blur', () => {
    Object.keys(keys).forEach((key) => {
      keys[key] = false;
    });
  });
}

function renderWebDashers() {
  mainContent.innerHTML = webDashersMarkup;
  setActiveNavigation('web-dashers');
}

renderHome();

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const game = link.dataset.game;
    if (!game) return;
    if (game === 'home') renderHome();
    if (game === 'basket-bros') renderBasketBros();
    if (game === 'web-dashers') renderWebDashers();
  });
});
