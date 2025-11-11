let context = null;
let baseNoteBuffer = null;
const BASE_NOTE = 'C4';
const BASE_NOTE_FILE_PATH = 'sons/69.ogg';
let baseNoteFrequency = 0;

// === USUÁRIOS (LOGIN SIMULADO) ===
const USERS = [
    { email: "ana@piano.com", password: "1234", name: "Ana Silva" },
    { email: "lucas@piano.com", password: "dev2025", name: "Lucas Mendes" },
    { email: "bea@piano.com", password: "musica123", name: "Beatriz Costa" }
];

// === MÚSICAS ===
const MUSICAS = [
    { nome: "Música 1 - Original", seq: "[IP] - O [QY] - [QEI] -- [IP] - O [QY] - T [IP] - O [QY] - [EI] -- [IP] - O [QY] I T E [IP] - T [QY] - [EI] - [TO] [IP] - O [QYP] E [TS] [IP] - [OS] [QD] - [EOS] P O [IP] - O [QYP] - I [T] -- [QY] - [EI] -- [TO] - P [QI] TO" },
    { nome: "Música 2 - f D f D...", seq: "f - D - f - D - f - a - d - s - [6ep] - 0 - e - t - u - p - [3a] - 0 - W - u - O - a - [6s] - 0 - e - u - f - D - f - D - f - a - d - s - [6ep] - 0 - e - t - u - p - [3a] - 0 - W - u - s - a - [6p] - 0 - e - a - s - d - [8f] - w - t - o - g - f - [5d] - w - r - i - f - d - [6s] - 0 - e - u - d - s - [3a] - 0 - u - u - f - u - f - f - x - D - f - D - f - D - f - D - f - D - f - D - f - D - f - a - d - s - [6p] - 0 - e - t - u - p - [3a] - 0 - W - u - O - a - [6s] - 0 - e - u - f - D - f - D - f - a - d - s - [6p] - 0 - e - t - u - p - [3a] - 0 - W - u - s - a - [6p] - 0 - e - a - s - d - [8f] - w - t - o - g - f - [5d] - w - r - i - f - d - [6s] - 0 - e - u - d - s - [3a] - 0 - u - s - a - [pe6]" },
    { nome: "Música 3 - pe6...", seq: "f D f D f a d s [6ep] 0 e t u p [3a] 0 W u O a [6s] 0 e u f D f D f a d s [6ep] 0 e t u p [3a] 0 W u s a [6p] 0 e a s d [8f] w t o g f [5d] w r i f d [6s] 0 e u d s [3a] 0 u s a [pe6]" }
];

// === MAPEAMENTO DE TECLAS ===
const noteLabelMap = { /* ... mesmo do original ... */ };
const keyMap = { /* ... mesmo do original ... */ };
const noteToKey = {};
for (const [note, key] of Object.entries(noteLabelMap)) noteToKey[note] = key;

// === ÁUDIO ===
document.addEventListener('click', () => {
    if (!context) {
        context = new (window.AudioContext || window.webkitAudioContext)();
        loadBaseSound(); 
    }
}, { once: true });

function getFrequency(note) { /* ... mesmo ... */ }
function updateDisplay(note) { /* ... mesmo ... */ }
function loadBaseSound() { /* ... mesmo ... */ }
function playNote(note) { /* ... mesmo ... */ }

// === PIANO ===
function renderPiano() { /* ... mesmo ... */ }
function createSpark(keyElement) { /* ... mesmo ... */ }

// === GRAVAÇÃO ===
let isRecording = false, recording = [], recordingStartTime = 0;
let currentSequence = [], isPlayingMusic = false;

function toggleRecording() { /* ... mesmo ... */ }
function playRecording() { /* ... mesmo ... */ }
function downloadRecording() { /* ... mesmo ... */ }

// === LEITOR VISUAL ===
function updateVisualSequence() { /* ... mesmo ... */ }
function scrollToCurrentNote(index) { /* ... mesmo ... */ }
function highlightKeyInSequence(index) { /* ... mesmo ... */ }

// === MÚSICA ===
function parseToken(token) { /* ... mesmo ... */ }
function parseSequenceString(str) { /* ... mesmo ... */ }
function playSequenceFromList(seq) { /* ... mesmo ... */ }

function setupMusicControls() {
    const musicSelect = document.getElementById('musicSelect');
    const playMusicButton = document.getElementById('playMusicButton');
    const clearSequence = document.getElementById('clearSequence');

    MUSICAS.forEach((musica, i) => {
        const opt = document.createElement('option');
        opt.value = i + 1;
        opt.textContent = musica.nome;
        musicSelect.appendChild(opt);
    });

    playMusicButton.addEventListener('click', () => {
        const idx = parseInt(musicSelect.value);
        if (idx > 0) playSequenceFromList(parseSequenceString(MUSICAS[idx - 1].seq));
        else alert("Selecione uma música primeiro.");
    });

    clearSequence.addEventListener('click', () => {
        currentSequence = []; recording = [];
        updateVisualSequence();
        musicSelect.value = "";
        document.getElementById('playButton').disabled = true;
        document.getElementById('downloadButton').disabled = true;
    });
}

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
    renderPiano();
    updateDisplay('C1');
    setupMusicControls();

    // LOGIN
    document.getElementById('loginModal').classList.add('open');
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const user = USERS.find(u => u.email === email && u.password === password);
        if (user) {
            document.getElementById('loginModal').classList.remove('open');
            document.getElementById('userInfo').style.display = 'flex';
            document.getElementById('userEmailDisplay').textContent = user.name;
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('loginModal').classList.add('open');
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginError').style.display = 'none';
    });

    // MENU
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        menuButton.classList.toggle('open');
        sidebarOverlay.classList.toggle('open');
    });

    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('open');
        menuButton.classList.remove('open');
        sidebarOverlay.classList.remove('open');
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        menuButton.classList.remove('open');
        sidebarOverlay.classList.remove('open');
    });

    // MODAIS
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => closeBtn.closest('.modal').classList.remove('open'));
    });

    document.querySelectorAll('.sidebar-menu button[data-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.modal;
            document.getElementById(modalId)?.classList.add('open');
            sidebar.classList.remove('open');
            menuButton.classList.remove('open');
            sidebarOverlay.classList.remove('open');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) e.target.classList.remove('open');
    });

    // CONTROLES
    document.getElementById('recordButton').addEventListener('click', toggleRecording);
    document.getElementById('playButton').addEventListener('click', playRecording);
    document.getElementById('downloadButton').addEventListener('click', downloadRecording);
});
