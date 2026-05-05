/**
 * Puissance 4 — Démo jouable (vanilla JS)
 * Logique inspirée du puissance4.py / puissance4_graphique.py de Divin Kimia.
 * 2 joueurs en local, survol aperçu, annulation du dernier coup, sons simples.
 */

(function () {
    'use strict';

    const ROWS = 6;
    const COLS = 7;

    const state = {
        grid: [],
        current: 1,
        finished: false,
        history: [],
        scores: { 1: 0, 2: 0 },
        round: 1,
        sound: true,
        winningCells: [],
        swapped: false,
    };

    const DOM = {
        board: document.getElementById('board'),
        p1Card: document.getElementById('p1Card'),
        p2Card: document.getElementById('p2Card'),
        p1Score: document.getElementById('p1Score'),
        p2Score: document.getElementById('p2Score'),
        p1Name: document.getElementById('p1Name'),
        p2Name: document.getElementById('p2Name'),
        turnName: document.getElementById('turnName'),
        roundInfo: document.getElementById('roundInfo'),
        overlay: document.getElementById('overlay'),
        overlayBadge: document.getElementById('overlayBadge'),
        overlayTitle: document.getElementById('overlayTitle'),
        overlaySub: document.getElementById('overlaySub'),
        btnNew: document.getElementById('btnNew'),
        btnUndo: document.getElementById('btnUndo'),
        btnSwap: document.getElementById('btnSwap'),
        btnPlayAgain: document.getElementById('btnPlayAgain'),
        btnSound: document.getElementById('btnSound'),
    };

    function createGrid() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    function buildBoard() {
        DOM.board.innerHTML = '';
        DOM.board.dataset.turn = state.current;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.setAttribute('role', 'gridcell');
                DOM.board.appendChild(cell);
            }
        }
        bindBoardEvents();
    }

    function bindBoardEvents() {
        DOM.board.addEventListener('click', onBoardClick);
        DOM.board.addEventListener('mousemove', onBoardMove);
        DOM.board.addEventListener('mouseleave', clearHover);
    }

    function onBoardClick(e) {
        if (state.finished) return;
        const cell = e.target.closest('.cell');
        if (!cell) return;
        const col = parseInt(cell.dataset.col, 10);
        playMove(col);
    }

    function onBoardMove(e) {
        if (state.finished) return;
        const cell = e.target.closest('.cell');
        if (!cell) { clearHover(); return; }
        const col = parseInt(cell.dataset.col, 10);
        setHoverColumn(col);
    }

    function clearHover() {
        DOM.board.querySelectorAll('.cell.hovered').forEach((c) => c.classList.remove('hovered'));
    }

    function setHoverColumn(col) {
        clearHover();
        DOM.board.querySelectorAll(`.cell[data-col="${col}"]`).forEach((c) => c.classList.add('hovered'));
    }

    function playMove(col) {
        let row = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (state.grid[r][col] === 0) { row = r; break; }
        }
        if (row < 0) return;

        state.grid[row][col] = state.current;
        state.history.push({ row, col, player: state.current });

        const cell = DOM.board.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const token = document.createElement('div');
        token.className = `token p${state.current}`;
        cell.appendChild(token);

        playDropSound();

        const win = checkWin(row, col, state.current);
        if (win) {
            state.finished = true;
            state.winningCells = win;
            state.scores[state.current] += 1;
            highlightWin(win);
            updateScores();
            showOverlay('win');
            return;
        }

        if (isFull()) {
            state.finished = true;
            showOverlay('draw');
            return;
        }

        state.current = state.current === 1 ? 2 : 1;
        DOM.board.dataset.turn = state.current;
        updateTurnUI();
    }

    function checkWin(row, col, player) {
        const dirs = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonale \
            [1, -1],  // diagonale /
        ];
        for (const [dR, dC] of dirs) {
            const line = [{ r: row, c: col }];
            for (let s = 1; s < 4; s++) {
                const r = row + dR * s, c = col + dC * s;
                if (r < 0 || r >= ROWS || c < 0 || c >= COLS) break;
                if (state.grid[r][c] !== player) break;
                line.push({ r, c });
            }
            for (let s = 1; s < 4; s++) {
                const r = row - dR * s, c = col - dC * s;
                if (r < 0 || r >= ROWS || c < 0 || c >= COLS) break;
                if (state.grid[r][c] !== player) break;
                line.unshift({ r, c });
            }
            if (line.length >= 4) return line.slice(0, 4);
        }
        return null;
    }

    function isFull() {
        for (let c = 0; c < COLS; c++) {
            if (state.grid[0][c] === 0) return false;
        }
        return true;
    }

    function highlightWin(cells) {
        cells.forEach(({ r, c }) => {
            const cell = DOM.board.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
            if (!cell) return;
            const token = cell.querySelector('.token');
            if (token) token.classList.add('winner');
        });
    }

    function updateTurnUI() {
        DOM.p1Card.classList.toggle('is-turn', state.current === 1);
        DOM.p2Card.classList.toggle('is-turn', state.current === 2);
        DOM.p2Card.classList.toggle('p2', true);
        DOM.turnName.textContent = state.current === 1 ? DOM.p1Name.textContent : DOM.p2Name.textContent;
    }

    function updateScores() {
        DOM.p1Score.textContent = state.scores[1];
        DOM.p2Score.textContent = state.scores[2];
        DOM.roundInfo.textContent = `Tour ${state.round} · ${state.scores[1]} – ${state.scores[2]}`;
    }

    function resetBoard(incrementRound) {
        state.grid = createGrid();
        state.current = incrementRound && state.round % 2 === 0 ? 1 : (state.current === 1 ? 2 : 1);
        state.current = 1;
        state.finished = false;
        state.history = [];
        state.winningCells = [];
        if (incrementRound) state.round += 1;
        DOM.board.dataset.turn = state.current;
        buildBoard();
        clearHover();
        updateTurnUI();
        updateScores();
        hideOverlay();
    }

    function undoLastMove() {
        if (state.finished) return;
        const last = state.history.pop();
        if (!last) return;
        state.grid[last.row][last.col] = 0;
        const cell = DOM.board.querySelector(`.cell[data-row="${last.row}"][data-col="${last.col}"]`);
        const token = cell && cell.querySelector('.token');
        if (token) cell.removeChild(token);
        state.current = last.player;
        DOM.board.dataset.turn = state.current;
        updateTurnUI();
    }

    function swapColors() {
        state.swapped = !state.swapped;
        const newP1Class = state.swapped ? 'p2' : 'p1';
        const newP2Class = state.swapped ? 'p1' : 'p2';

        // Basculer visuellement les tokens des joueurs (sans toucher à la logique 1/2)
        DOM.board.querySelectorAll('.token').forEach((t) => {
            if (t.classList.contains('p1')) {
                t.classList.remove('p1');
                t.classList.add(newP1Class);
            } else if (t.classList.contains('p2')) {
                t.classList.remove('p2');
                t.classList.add(newP2Class);
            }
        });

        DOM.p1Card.querySelector('.player-token').className = `player-token ${newP1Class}`;
        DOM.p2Card.querySelector('.player-token').className = `player-token ${newP2Class}`;
    }

    function showOverlay(type) {
        DOM.overlay.classList.add('is-open');
        DOM.overlay.setAttribute('aria-hidden', 'false');

        if (type === 'draw') {
            DOM.overlayBadge.className = 'overlay-badge draw';
            DOM.overlayBadge.innerHTML = '=';
            DOM.overlayTitle.textContent = 'Match nul';
            DOM.overlaySub.textContent = 'La grille est pleine, personne n\'aligne quatre jetons.';
            return;
        }

        const winnerClass = `p${state.current}`;
        DOM.overlayBadge.className = `overlay-badge ${winnerClass}`;
        DOM.overlayBadge.innerHTML = state.current === 1 ? '1' : '2';
        const winnerName = state.current === 1 ? DOM.p1Name.textContent : DOM.p2Name.textContent;
        DOM.overlayTitle.textContent = `Victoire de ${winnerName}`;
        DOM.overlaySub.textContent = 'Quatre jetons alignés, bien joué.';
    }

    function hideOverlay() {
        DOM.overlay.classList.remove('is-open');
        DOM.overlay.setAttribute('aria-hidden', 'true');
    }

    /* ===== Audio (WebAudio léger, sans asset) ===== */
    let audioCtx = null;
    function ensureAudio() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) { audioCtx = null; }
        }
        return audioCtx;
    }
    function playDropSound() {
        if (!state.sound) return;
        const ctx = ensureAudio();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
    }

    /* ===== Init ===== */
    state.grid = createGrid();
    buildBoard();
    updateTurnUI();
    updateScores();

    DOM.btnNew.addEventListener('click', () => resetBoard(true));
    DOM.btnPlayAgain.addEventListener('click', () => resetBoard(true));
    DOM.btnUndo.addEventListener('click', undoLastMove);
    DOM.btnSwap.addEventListener('click', swapColors);
    DOM.btnSound.addEventListener('click', () => {
        state.sound = !state.sound;
        DOM.btnSound.innerHTML = state.sound
            ? '<i class="fas fa-volume-high"></i>'
            : '<i class="fas fa-volume-xmark"></i>';
    });

    // Raccourcis clavier : 1-7 pour jouer la colonne, U pour annuler, R pour reset
    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '7') {
            playMove(parseInt(e.key, 10) - 1);
        } else if (e.key.toLowerCase() === 'u') {
            undoLastMove();
        } else if (e.key.toLowerCase() === 'r') {
            resetBoard(true);
        }
    });
})();
