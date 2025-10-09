const context = new (window.AudioContext || window.webkitAudioContext)();
const activeOscillators = {}; 
const activeKeyElements = {};
// Seleciona o container para aplicar a "onda"
const container = document.querySelector('.container'); 

// Frequências das notas (as mesmas, que estão corretas)
const noteFrequencies = {
    'C4': 261.63,   
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,   
    'A#4': 466.16,
    'B4': 493.88,
    'C5': 523.25
};

// Mapeamento de teclas do teclado para notas
const keyMap = {
    'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4', 'f': 'F4', 
    't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4', 'k': 'C5'
};


// Função para INICIAR a nota 
function startNote(note) {
    if (activeOscillators[note]) {
        return; 
    }

    const frequency = noteFrequencies[note];
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    // Configurações de som aprimoradas
    oscillator.type = 'triangle'; // Som mais suave
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    const maxVolume = 0.4;
    const attackTime = 0.005; 

    gainNode.gain.setValueAtTime(0, context.currentTime); 
    gainNode.gain.linearRampToValueAtTime(maxVolume, context.currentTime + attackTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(context.currentTime); 
    
    activeOscillators[note] = { oscillator, gainNode };

    // EFEITO VISUAL: Adiciona a classe 'wave' para ligar as paredes azuis
    container.classList.add('wave');
}

// Função para PARAR a nota (RECONSTRUÍDA)
function stopNote(note) {
    const noteData = activeOscillators[note];
    if (!noteData) {
        return; // Nada para parar
    }
    
    const { oscillator, gainNode } = noteData;
    const releaseTime = 0.5; // Tempo de 'release' (soltar o pedal)

    // Release (R): Queda de volume para zero
    gainNode.gain.cancelScheduledValues(context.currentTime); // Limpa agendamentos anteriores
    gainNode.gain.setValueAtTime(gainNode.gain.value, context.currentTime); // Começa do volume atual
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + releaseTime);

    // Para o oscilador um pouco depois que o som se esvaiu
    oscillator.stop(context.currentTime + releaseTime + 0.1);

    // Remove do rastreamento de osciladores ativos
    delete activeOscillators[note];
    
    // EFEITO VISUAL: Remove a classe 'wave' do container
    setTimeout(() => {
        // Verifica se mais nenhuma nota está ativa antes de remover o efeito
        if (Object.keys(activeOscillators).length === 0) {
            container.classList.remove('wave');
        }
    }, 100); 
}

// =======================================================
// Ações de Mouse (Clique)
// =======================================================

const keys = document.querySelectorAll('.key');

keys.forEach(key => {
    const note = key.dataset.note;

    key.addEventListener('mousedown', () => {
        startNote(note);
        key.classList.add('active');
        activeKeyElements[note] = key;
    });

    key.addEventListener('mouseup', () => {
        stopNote(note);
        key.classList.remove('active');
        delete activeKeyElements[note];
    });

    key.addEventListener('mouseleave', (event) => {
        if (event.buttons === 1) { 
            stopNote(note);
            key.classList.remove('active');
            delete activeKeyElements[note];
        }
    });
});

// =======================================================
// Ações de Teclado
// =======================================================

const pressedKeys = {}; 

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const note = keyMap[key];

    if (note && !pressedKeys[key]) {
        event.preventDefault();
        startNote(note);
        pressedKeys[key] = true;

        const keyElement = document.querySelector(`.key[data-note="${note}"]`);
        if (keyElement) {
            keyElement.classList.add('active');
            activeKeyElements[note] = keyElement;
        }
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    const note = keyMap[key];

    if (note) {
        stopNote(note);
        pressedKeys[key] = false;

        const keyElement = activeKeyElements[note];
        if (keyElement) {
            keyElement.classList.remove('active');
            delete activeKeyElements[note];
        }
    }
});