import { LEVELS } from './levels.js';
import { drawScene } from './scene.js';
import { createHarborAudio } from './audio.js';

const canvases = [document.getElementById('picture-0'), document.getElementById('picture-1')];
const boards = [document.getElementById('board-0'), document.getElementById('board-1')];
const ui = {
  overlay: document.getElementById('overlay'), kicker: document.getElementById('dialog-kicker'),
  title: document.getElementById('dialog-title'), copy: document.getElementById('dialog-copy'),
  foot: document.getElementById('dialog-foot'), action: document.getElementById('dialog-action'),
  levelKicker: document.getElementById('level-kicker'), sceneTitle: document.getElementById('scene-title'),
  scenePlace: document.getElementById('scene-place'), found: document.getElementById('found'),
  timer: document.getElementById('timer'), levelCount: document.getElementById('level-count'),
  notice: document.getElementById('notice'), announcement: document.getElementById('announcement'),
  mute: document.getElementById('mute'), muteLabel: document.getElementById('mute-label'), soundIcon: document.getElementById('sound-icon'),
};
const audio = createHarborAudio();
const state = {
  phase: 'intro', level: 0, found: new Set(), elapsed: 0, penaltyUntil: 0,
  cursor: { x: 360, y: 220 }, activeBoard: 0, wrongUntil: 0,
  lastTick: performance.now(), noticeTimeout: 0, transitionTimeout: 0,
};

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(total / 60)).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`;
}
function setBoard(index) {
  state.activeBoard = (index + 2) % 2;
  boards.forEach((board, i) => board.classList.toggle('is-active', i === state.activeBoard));
}
function draw() {
  const found = [...state.found];
  const pulse = state.wrongUntil > performance.now() ? (state.wrongUntil-performance.now()) / 650 : 0;
  canvases.forEach((canvas, i) => drawScene(canvas, state.level, i, found,
    state.phase === 'playing' && i === state.activeBoard ? state.cursor : null, pulse));
}
function updateHud() {
  const level = LEVELS[state.level];
  ui.levelKicker.textContent = `Evening ${level.number}  ·  ${level.place}`;
  ui.sceneTitle.textContent = level.name;
  ui.scenePlace.textContent = level.note;
  ui.found.innerHTML = `${state.found.size} <span style="color:#718880">/ 8</span>`;
  ui.levelCount.textContent = `${state.level + 1}/3`;
  ui.timer.textContent = formatTime(state.elapsed);
  canvases.forEach((canvas, i) => {
    canvas.setAttribute('aria-label', `${i ? 'Second' : 'First'} harbor picture, ${level.name}. ${state.found.size} of 8 found. Click a difference, or use arrow keys to move the cursor.`);
  });
  draw();
}
function showOverlay({ kicker, title, copy, button, foot }) {
  ui.kicker.textContent = kicker;
  ui.title.innerHTML = title;
  ui.copy.textContent = copy;
  ui.action.querySelector('span').textContent = button;
  ui.foot.textContent = foot;
  ui.overlay.classList.remove('hidden');
  ui.action.focus({ preventScroll: true });
}
function hideOverlay() {
  ui.overlay.classList.add('hidden');
}
function startLevel(index) {
  state.level = index;
  state.found.clear();
  state.cursor = { x: 360, y: 220 };
  state.phase = 'playing';
  state.lastTick = performance.now();
  state.penaltyUntil = 0;
  setBoard(0);
  audio.start(index);
  hideOverlay();
  updateHud();
  canvases[0].focus({ preventScroll: true });
  ui.announcement.textContent = `Evening ${index + 1}: ${LEVELS[index].name}. Find eight differences.`;
}
function beginGame() {
  state.elapsed = 0;
  startLevel(0);
}
function finishLevel() {
  state.phase = 'between';
  const next = state.level + 1;
  ui.announcement.textContent = state.level === LEVELS.length - 1 ? 'All three harbors found. You win.' : `${LEVELS[state.level].name} complete. Eight differences found.`;
  if (state.level === LEVELS.length - 1) {
    state.phase = 'won';
    audio.complete();
    showOverlay({ kicker: 'All the little things, found', title: 'The harbor<br>is whole.', copy: `Three evenings, twenty-four differences, and one very attentive visitor. You took ${formatTime(state.elapsed)}.`, button: 'Wander again', foot: 'A new quiet evening is waiting.' });
  } else {
    audio.complete();
    const following = LEVELS[next];
    showOverlay({ kicker: 'Scene complete', title: 'Lovely<br>looking.', copy: `You found all eight in ${LEVELS[state.level].name}. ${following.note}`, button: `Visit ${following.name}`, foot: `Evening ${following.number}  ·  ${following.place}` });
  }
}
function toggleSound() {
  const muted = audio.toggle();
  ui.mute.setAttribute('aria-pressed', String(muted));
  ui.mute.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
  ui.mute.title = muted ? 'Unmute sound (M)' : 'Mute sound (M)';
  ui.muteLabel.textContent = muted ? 'Sound off' : 'Sound on';
  ui.soundIcon.innerHTML = muted
    ? '<path d="M3 8v4h3l4 3V5L6 8H3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="m14 8 4 4m0-4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'
    : '<path d="M3 8v4h3l4 3V5L6 8H3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M13 7a4 4 0 0 1 0 6m2-8a7 7 0 0 1 0 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>';
}
function restart() {
  window.clearTimeout(state.noticeTimeout);
  window.clearTimeout(state.transitionTimeout);
  state.phase = 'intro'; state.level = 0; state.elapsed = 0; state.penaltyUntil = 0; state.wrongUntil = 0; state.found.clear();
  ui.notice.classList.remove('show');
  setBoard(0);
  updateHud();
  showOverlay({ kicker: 'A quiet harbor mystery', title: 'Harbor,<br>Twice', copy: 'Three dusky harbors, painted twice. Find eight small changes in each scene — and take your time looking.', button: 'Begin the evening', foot: '3 scenes  ·  24 quiet little changes' });
  ui.announcement.textContent = 'Game restarted. Begin the evening when you are ready.';
}
function announceWrong() {
  state.elapsed += 5;
  state.wrongUntil = performance.now() + 650;
  audio.wrong();
  ui.notice.classList.add('show');
  window.clearTimeout(state.noticeTimeout);
  state.noticeTimeout = window.setTimeout(() => ui.notice.classList.remove('show'), 1050);
  ui.announcement.textContent = 'Not quite. Five seconds have been added to your harbor time.';
}
function markAt(x, y) {
  if (state.phase !== 'playing') return;
  state.cursor = { x, y };
  setBoard(state.activeBoard);
  const level = LEVELS[state.level];
  const target = level.differences.find(diff => {
    const dx = x - diff.x, dy = y - diff.y;
    return Math.hypot(dx,dy) <= Math.max(24, diff.r + 7);
  });
  if (!target) {
    announceWrong(); draw(); return;
  }
  if (state.found.has(target.id)) { draw(); return; }
  state.found.add(target.id);
  audio.found();
  ui.announcement.textContent = `Found: ${target.label}. ${8-state.found.size} remaining.`;
  if (state.found.size === level.differences.length) finishLevel();
  updateHud();
}

canvases.forEach((canvas, index) => {
  canvas.addEventListener('pointerdown', event => {
    if (state.phase !== 'playing') return;
    const rect = canvas.getBoundingClientRect();
    setBoard(index);
    markAt((event.clientX - rect.left) * 720 / rect.width, (event.clientY - rect.top) * 440 / rect.height);
    canvas.focus({ preventScroll: true });
  });
  canvas.addEventListener('focus', () => { if (state.phase === 'playing') setBoard(index); });
});

function moveCursor(dx, dy) {
  state.cursor.x = Math.max(12, Math.min(708, state.cursor.x + dx));
  state.cursor.y = Math.max(12, Math.min(428, state.cursor.y + dy));
  setBoard(state.activeBoard); draw();
}
window.addEventListener('keydown', event => {
  if (event.code === 'KeyM') { event.preventDefault(); toggleSound(); return; }
  if (event.code === 'KeyR') { event.preventDefault(); restart(); return; }
  if (state.phase !== 'playing') return;
  if (event.code === 'Tab') {
    event.preventDefault(); setBoard(state.activeBoard + (event.shiftKey ? -1 : 1));
    canvases[state.activeBoard].focus({ preventScroll: true }); return;
  }
  const step = event.shiftKey ? 40 : 20;
  if (event.code === 'ArrowLeft') { event.preventDefault(); moveCursor(-step,0); }
  else if (event.code === 'ArrowRight') { event.preventDefault(); moveCursor(step,0); }
  else if (event.code === 'ArrowUp') { event.preventDefault(); moveCursor(0,-step); }
  else if (event.code === 'ArrowDown') { event.preventDefault(); moveCursor(0,step); }
  else if (event.code === 'Space' || event.code === 'Enter') { event.preventDefault(); markAt(state.cursor.x,state.cursor.y); }
});
ui.action.addEventListener('click', () => {
  if (state.phase === 'intro') beginGame();
  else if (state.phase === 'between') startLevel(state.level + 1);
  else if (state.phase === 'won') beginGame();
});
document.getElementById('restart').addEventListener('click', restart);
ui.mute.addEventListener('click', toggleSound);

function frame(now) {
  const dt = Math.min(.1, Math.max(0, (now - state.lastTick) / 1000));
  state.lastTick = now;
  if (state.phase === 'playing') {
    state.elapsed += dt;
    ui.timer.textContent = formatTime(state.elapsed);
    if (state.wrongUntil > now || state.wrongUntil > now - 650) draw();
  }
  requestAnimationFrame(frame);
}
window.addEventListener('blur', () => { state.lastTick = performance.now(); });
updateHud();
requestAnimationFrame(frame);
