// === VARIÁVEIS GLOBAIS ===
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

// === MÚSICAS PRÉ-CARREGADAS ===
const MUSICAS = [
    { nome: "Música 1 - Original", seq: "[IP] - O [QY] - [QEI] -- [IP] - O [QY] - T [IP] - O [QY] - [EI] -- [IP] - O [QY] I T E [IP] - T [QY] - [EI] - [TO] [IP] - O [QYP] E [TS] [IP] - [OS] [QD] - [EOS] P O [IP] - O [QYP] - I [T] -- [QY] - [EI] -- [TO] - P [QI] TO" },
    { nome: "Música 2 - f D f D...", seq: "f - D - f - D - f - a - d - s - [6ep] - 0 - e - t - u - p - [3a] - 0 - W - u - O - a - [6s] - 0 - e - u - f - D - f - D - f - a - d - s - [6ep] - 0 - e - t - u - p - [3a] - 0 - W - u - s - a - [6p] - 0 - e - a - s - d - [8f] - w - t - o - g - f - [5d] - w - r - i - f - d - [6s] - 0 - e - u - d - s - [3a] - 0 - u - u - f - u - f - f - x - D - f - D - f - D - f - D - f - D - f - D - f - D - f - a - d - s - [6p] - 0 - e - t - u - p - [3a] - 0 - W - u - O - a - [6s] - 0 - e - u - f - D - f - D - f - a - d - s - [6p] - 0 - e - t - u - p - [3a] - 0 - W - u - s - a - [6p] - 0 - e - a - s - d - [8f] - w - t - o - g - f - [5d] - w - r - i - f - d - [6s] - 0 - e - u - d - s - [3a] - 0 - u - s - a - [pe6]" },
    { nome: "Música 3 - pe6...", seq: "f D f D f a d s [6ep] 0 e t u p [3a] 0 W u O a [6s] 0 e u f D f D f a d s [6ep] 0 e t u p [3a] 0 W u s a [6p] 0 e a s d [8f] w t o g f [5d] w r i f d [6s] 0 e u d s [3a] 0 u s a [pe6]" }
];

// === MAPEAMENTO VISUAL (rótulos nas teclas) ===
const noteLabelMap = {
    'C1':'1', 'D1':'2', 'E1':'3', 'F1':'4', 'G1':'5', 'A1':'6', 'B1':'7',
    'C2':'8', 'D2':'9', 'E2':'0', 'F2':'q', 'G2':'w', 'A2':'e', 'B2':'r',
    'C3':'t', 'D3':'y', 'E3':'u', 'F3':'i', 'G3':'o', 'A3':'p', 'B3':'a',
    'C4':'s', 'D4':'d', 'E4':'f', 'F4':'g', 'G4':'h', 'A4':'j', 'B4':'k',
    'C5':'l', 'D5':'z', 'E5':'x', 'F5':'c', 'G5':'v', 'A5':'b', 'B5':'n', 'C6':'m',
    'C#1':'!', 'D#1':'@', 'F#1':'$', 'G#1':'%', 'A#1':'*',
    'C#2':'(', 'D#2':'Q', 'F#2':'W', 'G#2':'E', 'A#2':'T',
    'C#3':'Y', 'D#3':'I', 'F#3':'O', 'G#3':'P', 'A#3':'S',
    'C#4':'D', 'D#4':'G', 'F#4':'H', 'G#4':'J', 'A#4':'L',
    'C#5':'Z', 'D#5':'C', 'F#5':'V', 'G#5':'B'
};

// === MAPEAMENTO TECLADO → NOTA ===
const keyMap = {
    '1':'C1', '2':'D1', '3':'E1', '4':'F1', '5':'G1', '6':'A1', '7':'B1',
    '8':'C2', '9':'D2', '0':'E2', 'q':'F2', 'w':'G2', 'e':'A2', 'r':'B2',
    't':'C3', 'y':'D3', 'u':'E3', 'i':'F3', 'o':'G3', 'p':'A3', 'a':'B3',
    's':'C4', 'd':'D4', 'f':'E4', 'g':'F4', 'h':'G4', 'j':'A4', 'k':'B4',
    'l':'C5', 'z':'D5', 'x':'E5', 'c':'F5', 'v':'G5', 'b':'A5', 'n':'B5', 'm':'C6',
    '!':'C#1', '@':'D#1', '$':'F#1', '%':'G#1', '*':'A#1',
    '(':'C#2', 'Q':'D#2', 'W':'F#2', 'E':'G#2', 'T':'A#2',
    'Y':'C#3', 'I':'D#3', 'O':'F#3', 'P':'G#3', 'S':'A#3',
    'D':'C#4', 'G':'D#4', 'H':'F#4', 'J':'G#4', 'L':'A#4',
    'Z':'C#5', 'C':'D#5', 'V':'F#5', 'B':'G#5'
};

// === MAPEAMENTO INVERSO (para o leitor visual) ===
const noteToKey = {};
for (const [note, key] of Object.entries(noteLabelMap)) {
    noteToKey[note] = key;
}

// === GRAVAÇÃO E SEQUÊNCIA ===
let isRecording = false;
let recording = [];
let recordingStartTime = 0;
let currentSequence = [];
let isPlayingMusic = false;

// === INICIALIZAÇÃO DO ÁUDIO ===
document.addEventListener('click', () => {
    if (!context) {
        context = new (window.AudioContext || window.webkitAudioContext)();
        loadBaseSound();
    }
}, { once: true });

// === FUNÇÕES DE ÁUDIO ===
function getFrequency(note) {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
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
    if (!context) return Promise.reject("AudioContext não inicializado");
    baseNoteFrequency = getFrequency(BASE_NOTE);
    return fetch(BASE_NOTE_FILE_PATH)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            baseNoteBuffer = audioBuffer;
            console.log("Som base (C4) carregado com sucesso!");
            return audioBuffer;
        })
        .catch(error => {
            console.error("Falha ao carregar o som base:", error);
            alert("Erro: Não foi possível carregar 'sons/69.ogg'.");
        });
}

function playNote(note) {
    if (!context || !baseNoteBuffer) return;
    const targetFrequency = getFrequency(note);
    const playbackRate = targetFrequency / baseNoteFrequency;

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

    if (isRecording) {
        const timeOffset = performance.now() - recordingStartTime;
        recording.push({ note: note, time: timeOffset });
    }

    gainNode.gain.setValueAtTime(startVolume, now);
    gainNode.gain.linearRampToValueAtTime(0.0, endTime);

    source.start(now);
    source.stop(endTime);
}

// === RENDERIZAÇÃO DO PIANO ===
function renderPiano() {
    const piano = document.getElementById('piano');
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    let whiteIndex = 0;
    const maxWhiteKeys = 36;

    for (let octave = 1; octave <= 6; octave++) {
        for (let i = 0; i < notes.length; i++) {
            const note = notes[i] + octave;
            if (notes[i].length === 1 && whiteIndex < maxWhiteKeys) {
                const white = document.createElement('div');
                white.className = 'key white-key';
                white.dataset.note = note;
                const label = noteLabelMap[note] || '';
                white.innerHTML = `<span class="note-label">${label}</span>`;
                white.style.left = `${whiteIndex * 36}px`;
                piano.appendChild(white);

                if (notes[i + 1] && notes[i + 1].includes('#')) {
                    const blackNote = notes[i + 1] + octave;
                    if (noteLabelMap[blackNote]) {
                        const black = document.createElement('div');
                        black.className = 'key black-key';
                        black.dataset.note = blackNote;
                        black.innerHTML = `<span class="note-label">${noteLabelMap[blackNote]}</span>`;
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
            createSpark(key);

            if (!isRecording && !isPlayingMusic) {
                const keyLabel = noteToKey[note];
                const isBlack = note.includes('#');
                currentSequence.push({ notes: note, display: keyLabel, isChord: false, isBlack: isBlack });
                updateVisualSequence();
            }
        });
        key.addEventListener('mouseup', () => key.classList.remove('active'));
        key.addEventListener('mouseleave', () => key.classList.remove('active'));
    });
}

// === EVENTOS DO TECLADO ===
document.addEventListener('keydown', e => {
    const note = keyMap[e.key];
    if (note && !e.repeat) {
        const keyEl = document.querySelector(`[data-note="${note}"]`);
        if (keyEl) {
            keyEl.classList.add('active');
            playNote(note);
            updateDisplay(note);
            createSpark(keyEl);

            if (!isRecording && !isPlayingMusic) {
                const keyLabel = noteToKey[note];
                const isBlack = note.includes('#');
                currentSequence.push({ notes: note, display: keyLabel, isChord: false, isBlack: isBlack });
                updateVisualSequence();
            }
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

// === EFEITO DE FAÍSCA ===
function createSpark(keyElement) {
    const oldSpark = keyElement.querySelector('.spark-effect');
    if (oldSpark) oldSpark.remove();
    const spark = document.createElement('div');
    spark.className = 'spark-effect';
    keyElement.appendChild(spark);
    spark.addEventListener('animationend', () => spark.remove());
}

// === GRAVAÇÃO ===
function toggleRecording() {
    const recordButton = document.getElementById('recordButton');
    const playButton = document.getElementById('playButton');
    const downloadButton = document.getElementById('downloadButton');

    isRecording = !isRecording;
    if (isRecording) {
        recording = [];
        currentSequence = [];
        updateVisualSequence();
        recordingStartTime = performance.now();
        recordButton.textContent = 'Stop Parar';
        recordButton.classList.add('recording');
        playButton.disabled = true;
        downloadButton.disabled = true;
    } else {
        recordButton.textContent = 'Record Gravar';
        recordButton.classList.remove('recording');
        if (recording.length > 0) {
            playButton.disabled = false;
            downloadButton.disabled = false;
        }
    }
}

function playRecording() {
    if (recording.length === 0) return;

    const recordButton = document.getElementById('recordButton');
    const playButton = document.getElementById('playButton');
    const downloadButton = document.getElementById('downloadButton');

    recordButton.disabled = true;
    playButton.disabled = true;
    downloadButton.disabled = true;

    currentSequence = recording.map(item => {
        const note = item.note;
        const keyLabel = noteToKey[note];
        return { notes: note, display: keyLabel, isChord: false, isBlack: note.includes('#') };
    });
    updateVisualSequence();

    const promises = [];
    recording.forEach((event, index) => {
        const promise = new Promise(resolve => {
            setTimeout(() => {
                playNote(event.note);
                highlightKeyInSequence(index);

                const keyEl = document.querySelector(`[data-note="${event.note}"]`);
                if (keyEl) {
                    keyEl.classList.add('active');
                    setTimeout(() => keyEl.classList.remove('active'), 100);
                }
                resolve();
            }, event.time);
        });
        promises.push(promise);
    });

    const totalDuration = recording[recording.length - 1].time;
    setTimeout(() => {
        recordButton.disabled = false;
        playButton.disabled = false;
        downloadButton.disabled = false;
        highlightKeyInSequence(-1);
    }, totalDuration + 1500);
}

function downloadRecording() {
    if (recording.length === 0) return;
    const jsonString = JSON.stringify(recording, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minha-gravacao.json';
    a.click();
    URL.revokeObjectURL(url);
}

// === LEITOR VISUAL ===
const sequenceTrack = document.getElementById('sequenceTrack');
const sequenceReader = document.getElementById('sequenceReader');

function updateVisualSequence() {
    if (!sequenceTrack || isPlayingMusic) return;
    sequenceTrack.innerHTML = '';
    currentSequence.forEach((item, i) => {
        const span = document.createElement('span');
        span.className = 'sequence-item';
        span.textContent = item.display;
        if (item.isBlack) span.classList.add('black');
        else if (item.isChord) span.classList.add('chord');
        else span.classList.add('white');
        span.dataset.index = i;
        sequenceTrack.appendChild(span);
    });
    scrollToCurrentNote(-1);
}

function scrollToCurrentNote(index) {
    if (!sequenceReader || !sequenceTrack) return;
    const item = sequenceTrack.querySelector(`.sequence-item[data-index="${index - 2}"]`);
    if (item) {
        const newTransformX = -item.offsetLeft + (sequenceReader.offsetWidth / 2) - (item.offsetWidth / 2) - 25;
        sequenceTrack.style.transform = `translateX(${newTransformX}px)`;
    } else {
        sequenceTrack.style.transform = `translateX(0px)`;
    }
}

function highlightKeyInSequence(index) {
    if (!sequenceTrack) return;
    sequenceTrack.querySelectorAll('.sequence-item').forEach((el, i) => {
        el.classList.toggle('playing', i === index);
    });
    scrollToCurrentNote(index);
}

// === REPRODUÇÃO DE MÚSICA ===
function parseToken(token) {
    const isChord = token.startsWith('[') && token.endsWith(']');
    const clean = token.replace(/[\[\]]/g, '').trim();
    if (!clean) return [];
    const keys = clean.split('');
    const notes = keys.map(k => keyMap[k.toUpperCase()] || keyMap[k]).filter(Boolean);
    if (notes.length === 0) return [];
    return [{
        notes: notes.join(','),
        display: keys.join(''),
        isChord: isChord || notes.length > 1,
        isBlack: notes[0].includes('#')
    }];
}

function parseSequenceString(str) {
    const parts = str.split(/\s+/);
    const result = [];
    let buffer = '';
    for (let t of parts) {
        if (t === '-' || t === '--') {
            if (buffer) result.push(...parseToken(buffer));
            buffer = '';
            result.push({ isPause: true, duration: t === '--' ? 400 : 200 });
        } else {
            buffer += (buffer ? ' ' : '') + t;
        }
    }
    if (buffer) result.push(...parseToken(buffer));
    return result.filter(x => x);
}

function playSequenceFromList(seq) {
    if (isPlayingMusic) return;
    isPlayingMusic = true;
    currentSequence = seq;

    const recordButton = document.getElementById('recordButton');
    const playButton = document.getElementById('playButton');
    const playMusicButton = document.getElementById('playMusicButton');
    recordButton.disabled = playButton.disabled = playMusicButton.disabled = true;

    sequenceTrack.innerHTML = '';
    currentSequence.forEach((item, i) => {
        if (item.isPause) return;
        const span = document.createElement('span');
        span.className = 'sequence-item';
        span.textContent = item.display;
        if (item.isBlack) span.classList.add('black');
        else if (item.isChord) span.classList.add('chord');
        else span.classList.add('white');
        span.dataset.index = i;
        sequenceTrack.appendChild(span);
    });
    scrollToCurrentNote(-1);

    let time = 0;
    const noteDuration = 200;
    const playPromises = [];

    seq.forEach((item, index) => {
        if (item.isPause) {
            time += item.duration;
        } else {
            const notesToPlay = item.notes.split(',');
            notesToPlay.forEach(note => {
                playPromises.push(new Promise(resolve => {
                    setTimeout(() => {
                        playNote(note);
                        const keyEl = document.querySelector(`[data-note="${note}"]`);
                        if (keyEl) {
                            keyEl.classList.add('active');
                            setTimeout(() => keyEl.classList.remove('active'), noteDuration - 50);
                        }
                        resolve();
                    }, time);
                }));
            });
            playPromises.push(new Promise(resolve => {
                setTimeout(() => {
                    highlightKeyInSequence(index);
                    resolve();
                }, time);
            }));
            time += noteDuration;
        }
    });

    Promise.all(playPromises).then(() => {
        highlightKeyInSequence(-1);
        setTimeout(() => {
            recordButton.disabled = playButton.disabled = playMusicButton.disabled = false;
            isPlayingMusic = false;
        }, noteDuration + 1500);
    });
}

// === CONTROLES DE MÚSICA ===
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
        if (idx > 0) {
            playSequenceFromList(parseSequenceString(MUSICAS[idx - 1].seq));
        } else {
            alert("Selecione uma música primeiro.");
        }
    });

    clearSequence.addEventListener('click', () => {
        currentSequence = [];
        recording = [];
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

    // BOTÕES
    document.getElementById('recordButton').addEventListener('click', toggleRecording);
    document.getElementById('playButton').addEventListener('click', playRecording);
    document.getElementById('downloadButton').addEventListener('click', downloadRecording);
});
function loadBaseSound() {
    if (!context) return Promise.reject("AudioContext não inicializado");
    baseNoteFrequency = getFrequency(BASE_NOTE);

    const localPath = 'sons/69.ogg';
    const onlinePath = 'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/piano-ogg/C4.ogg';

    return fetch(localPath)
        .then(response => {
            if (response.ok) return response.arrayBuffer();
            console.warn("Arquivo local não encontrado. Usando som online...");
            return fetch(onlinePath).then(r => r.arrayBuffer());
        })
        .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            baseNoteBuffer = audioBuffer;
            console.log("Som base carregado com sucesso!");
            renderPiano(); // ← FORÇA O PIANO A APARECER
            return audioBuffer;
        })
        .catch(error => {
            console.error("Falha total ao carregar som:", error);
            alert("Erro crítico: não foi possível carregar o som do piano.");
        });
}
