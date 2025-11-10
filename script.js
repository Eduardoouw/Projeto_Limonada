/* =========================================================
   SIMULADOR DE PIANO – COMPLETO
   • 36 teclas (C1 a C6)
   • Som real com pitch-shifting
   • Boost nas graves + fade-out
   • Bolinha abre menu lateral
   ========================================================= */

let context = null;
let baseNoteBuffer = null;
const BASE_NOTE = 'C4';
const BASE_NOTE_FILE_PATH = 'sons/69.ogg';
let baseNoteFrequency = 0;

/* ---------- INICIALIZAÇÃO DO ÁUDIO ---------- */
document.addEventListener('click', () => {
    if (!context) {
        context = new (window.AudioContext || window.webkitAudioContext)();
        loadBaseSound();
    }
}, { once: true });

/* ---------- MAPEAMENTO DE TECLAS ---------- */
const noteLabelMap = {
    'C1':'1','D1':'2','E1':'3','F1':'4','G1':'5','A1':'6','B1':'7',
    'C2':'8','D2':'9','E2':'0','F2':'q','G2':'w','A2':'e','B2':'r',
    'C3':'t','D3':'y','E3':'u','F3':'i','G3':'o','A3':'p','B3':'a',
    'C4':'s','D4':'d','E4':'f','F4':'g','G4':'h','A4':'j','B4':'k',
    'C5':'l','D5':'z','E5':'x','F5':'c','G5':'v','A5':'b','B5':'n','C6':'m',
    'C#1':'!','D#1':'@','F#1':'$','G#1':'%','A#1':'*',
    'C#2':'(','D#2':'Q','F#2':'W','G#2':'E','A#2':'T',
    'C#3':'Y','D#3':'I','F#3':'O','G#3':'P','A#3':'S',
    'C#4':'D','D#4':'G','F#4':'H','G#4':'J','A#4':'L',
    'C#5':'Z','D#5':'C','F#5':'V','G#5':'B'
};

const keyMap = {
    '1':'C1','2':'D1','3':'E1','4':'F1','5':'G1','6':'A1','7':'B1',
    '8':'C2','9':'D2','0':'E2','q':'F2','w':'G2','e':'A2','r':'B2',
    't':'C3','y':'D3','u':'E3','i':'F3','o':'G3','p':'A3','a':'B3',
    's':'C4','d':'D4','f':'E4','g':'F4','h':'G4','j':'A4','k':'B4',
    'l':'C5','z':'D5','x':'E5','c':'F5','v':'G5','b':'A5','n':'B5','m':'C6',
    '!':'C#1','@':'D#1','$':'F#1','%':'G#1','*':'A#1',
    '(':'C#2','Q':'D#2','W':'F#2','E':'G#2','T':'A#2',
    'Y':'C#3','I':'D#3','O':'F#3','P':'G#3','S':'A#3',
    'D':'C#4','G':'D#4','H':'F#4','J':'G#4','L':'A#4',
    'Z':'C#5','C':'D#5','V':'F#5','B':'G#5'
};

/* ---------- FUNÇÕES DE ÁUDIO ---------- */
function getFrequency(note) {
    const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    const A4Index = 43;
    let noteIndex = -1;
    for (let octave = 0; octave <= 8; octave++) {
        for (let i = 0; i < notes.length; i++) {
            noteIndex++;
            if (notes[i] + octave === note) {
                const n = noteIndex - A4Index;
                return parseFloat((440 * Math.pow(2, n / 12)).toFixed(2));
            }
        }
    }
    return 0;
}

function updateDisplay(note) {
    const freq = getFrequency(note);
    document.getElementById('current-note').textContent = note;
    document.getElementById('current-frequency').textContent = `${freq} Hz`;
}

function loadBaseSound() {
    if (!context) return;
    baseNoteFrequency = getFrequency(BASE_NOTE);
    fetch(BASE_NOTE_FILE_PATH)
        .then(r => r.arrayBuffer())
        .then(buf => context.decodeAudioData(buf))
        .then(audioBuffer => {
            baseNoteBuffer = audioBuffer;
            console.log("Som base carregado!");
        })
        .catch(err => {
            console.error("Erro ao carregar som:", err);
            alert("Erro: Arquivo 'sons/69.ogg' não encontrado.");
        });
}

function playNote(note) {
    if (!context || !baseNoteBuffer) return;
    const targetFreq = getFrequency(note);
    const playbackRate = targetFreq / baseNoteFrequency;

    const source = context.createBufferSource();
    const gainNode = context.createGain();

    source.buffer = baseNoteBuffer;
    source.playbackRate.value = playbackRate;
    source.connect(gainNode);
    gainNode.connect(context.destination);

    const now = context.currentTime;
    const fadeOutTime = 1.5;
    const endTime = now + fadeOutTime;

    const baseVolume = 0.8;
    const boostMultiplier = 0.5;
    let startVolume = baseVolume;

    if (playbackRate < 1.0) {
        const boost = (1.0 - playbackRate) * boostMultiplier;
        startVolume = baseVolume * (1.0 + boost);
    }
    if (startVolume > 1.2) startVolume = 1.2;

    gainNode.gain.setValueAtTime(startVolume, now);
    gainNode.gain.linearRampToValueAtTime(0.0, endTime);

    source.start(now);
    source.stop(endTime);
}

/* ---------- RENDERIZAÇÃO DO PIANO ---------- */
function renderPiano() {
    const piano = document.getElementById('piano');
    piano.innerHTML = '';
    const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    let whiteIndex = 0;
    const maxWhiteKeys = 36;

    for (let octave = 1; octave <= 6; octave++) {
        for (let i = 0; i < notes.length; i++) {
            const note = notes[i] + octave;
            if (whiteIndex >= maxWhiteKeys) break;

            if (notes[i].length === 1) {
                const white = document.createElement('div');
                white.className = 'key white-key';
                white.dataset.note = note;
                const label = noteLabelMap[note] || note;
                white.innerHTML = `<span class="note-label">${label}</span>`;
                white.style.left = `${whiteIndex * 36}px`;
                piano.appendChild(white);

                if (notes[i + 1] && notes[i + 1].length === 2 && whiteIndex < maxWhiteKeys - 1) {
                    const nextNote = notes[i + 1] + octave;
                    if (nextNote !== 'C#6') {
                        const black = document.createElement('div');
                        black.className = 'key black-key';
                        black.dataset.note = nextNote;
                        const label = noteLabelMap[nextNote] || '#';
                        black.innerHTML = `<span class="note-label">${label}</span>`;
                        black.style.left = `${(whiteIndex * 36) + 24}px`;
                        piano.appendChild(black);
                    }
                }
                whiteIndex++;
            }
        }
    }

    document.querySelectorAll('.key').forEach(key => {
        const note = key.dataset.note;
        key.addEventListener('mousedown', () => {
            key.classList.add('active');
            playNote(note);
            updateDisplay(note);
        });
        key.addEventListener('mouseup', () => key.classList.remove('active'));
        key.addEventListener('mouseleave', () => key.classList.remove('active'));
    });
}

/* ---------- EVENTOS DE TECLADO ---------- */
document.addEventListener('keydown', e => {
    const note = keyMap[e.key];
    if (note && !e.repeat) {
        const keyEl = document.querySelector(`[data-note="${note}"]`);
        if (keyEl) {
            keyEl.classList.add('active');
            playNote(note);
            updateDisplay(note);
        }
    }
});

document.addEventListener('keyup', e => {
    const note = keyMap[e.key];
    if (note) {
        const keyEl = document.querySelector(`[data-note="${note}"]`);
        if (keyEl) keyEl.classList.remove('active');
    }
});

/* ---------- MENU LATERAL (Bolinha) ---------- */
const menuButton = document.getElementById('menuButton');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('sidebarOverlay');
const menuButtons = document.querySelectorAll('[data-modal]');

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    menuButton.classList.add('open');
}

function closeSidebarFunc() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    menuButton.classList.remove('open');
}

menuButton.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) closeSidebarFunc();
    else openSidebar();
});

closeSidebar.addEventListener('click', closeSidebarFunc);
overlay.addEventListener('click', closeSidebarFunc);

menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        document.getElementById(modalId).classList.add('open');
        closeSidebarFunc();
    });
});

document.querySelectorAll('.modal .close').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.modal').classList.remove('open'));
});

window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) e.target.classList.remove('open');
});

/* ---------- INICIALIZAÇÃO ---------- */
renderPiano();
updateDisplay('C1');
