let context = null;
const noteBuffers = {};

// URLs das amostras de áudio (substitua pelos caminhos reais dos seus arquivos)
const noteFiles = {
    'C4': 'path/to/piano_samples/C4.wav',
    'C#4': 'path/to/piano_samples/Csharp4.wav',
    'D4': 'path/to/piano_samples/D4.wav',
    'D#4': 'path/to/piano_samples/Dsharp4.wav',
    'E4': 'path/to/piano_samples/E4.wav',
    'F4': 'path/to/piano_samples/F4.wav',
    'F#4': 'path/to/piano_samples/Fsharp4.wav',
    'G4': 'path/to/piano_samples/G4.wav',
    'G#4': 'path/to/piano_samples/Gsharp4.wav',
    'A4': 'path/to/piano_samples/A4.wav',
    'A#4': 'path/to/piano_samples/Asharp4.wav',
    'B4': 'path/to/piano_samples/B4.wav',
    'C5': 'path/to/piano_samples/C5.wav'
};

// Inicializa o AudioContext na primeira interação
document.addEventListener('click', () => {
    if (!context) {
        context = new (window.AudioContext || window.webkitAudioContext)();
        loadPianoSamples();
    }
}, { once: true });

// Carrega as amostras de áudio
async function loadPianoSamples() {
    for (const [note, url] of Object.entries(noteFiles)) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            noteBuffers[note] = await context.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error(`Erro ao carregar áudio para ${note}:`, error);
        }
    }
}

// Toca uma nota usando amostra de áudio
function playNote(note) {
    if (!context || !noteBuffers[note]) {
        console.warn(`Nota ${note} não carregada ou AudioContext não inicializado.`);
        return;
    }
    const source = context.createBufferSource();
    source.buffer = noteBuffers[note];
    source.connect(context.destination);
    source.start();
}

// Configura cliques nas teclas visuais
const keys = document.querySelectorAll('.key');
keys.forEach(key => {
    key.addEventListener('click', () => {
        const note = key.dataset.note;
        playNote(note);
        key.classList.add('active');
        setTimeout(() => key.classList.remove('active'), 100);
    });
});

// Configura teclas do teclado físico
document.addEventListener('keydown', (event) => {
    const keyMap = {
        'a': 'C4',
        'w': 'C#4',
        's': 'D4',
        'e': 'D#4',
        'd': 'E4',
        'f': 'F4',
        't': 'F#4',
        'g': 'G4',
        'y': 'G#4',
        'h': 'A4',
        'u': 'A#4',
        'j': 'B4',
        'k': 'C5'
    };
    const note = keyMap[event.key.toLowerCase()];
    if (note) {
        playNote(note);
        const keyElement = document.querySelector(`.key[data-note="${note}"]`);
        if (keyElement) {
            keyElement.classList.add('active');
            setTimeout(() => keyElement.classList.remove('active'), 100);
        }
    }
});
