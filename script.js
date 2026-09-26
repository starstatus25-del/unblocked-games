:root {
  --bg-dark: #09131d;
  --bg-mid: #102133;
  --panel: rgba(12, 27, 38, 0.9);
  --panel-border: rgba(139, 181, 255, 0.18);
  --accent: #73d3ff;
  --accent-2: #ffce52;
  --success: #73ffb5;
  --danger: #ff7d7d;
  --text: #edf7ff;
  --muted: #abc6d9;
  --shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: Inter, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top, rgba(118, 191, 255, 0.28), transparent 25%),
    linear-gradient(135deg, #07111a 0%, #0d1a2b 50%, #09131d 100%);
  color: var(--text);
}

body {
  display: flex;
  justify-content: center;
  padding: 32px 18px 48px;
}

.page-shell {
  width: min(1200px, 100%);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0 26px;
  gap: 20px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent), #7cffd6);
  color: #07141d;
  box-shadow: var(--shadow);
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.66rem;
  color: var(--muted);
  margin: 0 0 4px;
}

h1, h2, p {
  margin: 0;
}

h1 {
  font-size: clamp(1.4rem, 1.8vw, 2rem);
}

.topnav {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.topnav a {
  text-decoration: none;
  color: var(--muted);
  font-weight: 600;
  transition: color 0.2s ease;
}

.topnav a:hover {
  color: var(--text);
}

.game-layout {
  display: grid;
  grid-template-columns: minmax(240px, 300px) minmax(0, 1fr);
  gap: 26px;
  align-items: start;
}

.card {
  background: rgba(13, 25, 35, 0.82);
  border: 1px solid var(--panel-border);
  border-radius: 22px;
  box-shadow: var(--shadow);
}

.sidebar {
  display: grid;
  gap: 20px;
}

.panel,
.stats,
.actions {
  padding: 22px 20px;
}

.label {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--accent);
  font-size: 0.68rem;
  margin-bottom: 10px;
}

.panel h2 {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.panel p {
  line-height: 1.5;
  color: var(--muted);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 18px 0 0;
  display: grid;
  gap: 10px;
  color: var(--text);
  font-size: 0.95rem;
}

.feature-list li::before {
  content: "•";
  color: var(--accent-2);
  margin-right: 8px;
}

.stats {
  display: grid;
  gap: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.05rem;
  color: var(--muted);
}

.stat-row strong {
  color: var(--text);
  font-size: 1.4rem;
}

.actions {
  display: grid;
  gap: 14px;
}

button {
  appearance: none;
  border: none;
  border-radius: 12px;
  padding: 0.9rem 1.1rem;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

button:active {
  transform: translateY(1px);
}

#start-btn {
  background: linear-gradient(135deg, var(--accent), #7cf0ff);
  color: #081821;
}

.secondary {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.game-panel {
  padding: 18px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin: 4px 4px 16px;
}

.game-header h2 {
  font-size: clamp(1.2rem, 2vw, 1.8rem);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: rgba(115, 255, 181, 0.12);
  color: var(--success);
  border: 1px solid rgba(115, 255, 181, 0.2);
  font-weight: 700;
}

canvas {
  width: 100%;
  max-width: 960px;
  height: auto;
  display: block;
  border-radius: 18px;
  background: linear-gradient(180deg, #7ad8ff 0%, #5ea9e4 28%, #2d6b9f 28%, #1d3d5c 100%);
  border: 2px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.1);
}

@media (max-width: 900px) {
  .game-layout {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
