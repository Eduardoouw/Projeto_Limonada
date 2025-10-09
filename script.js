const context = new (window.AudioContext || window.webkitAudioContext)();

function playNote(frequency) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    // Use a sawtooth wave for a brighter, more piano-like sound
    oscillator.type = 'sawtooth'; // Changed from 'sine' to add harmonics
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    
    // Create a piano-like envelope: quick attack, gradual decay
    gainNode.gain.setValueAtTime(0, context.currentTime); // Start at 0
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1.5); // Longer decay
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 1.5); // Match decay time
}

// Corrected note frequencies for C4 to C5 (A4 = 440 Hz standard tuning)
const noteFrequencies = {
    'C4': 261.63,   // Middle C
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,   // Reference pitch
    'A#4': 466.16,
    'B4': 493.88,
    'C5': 523.25
};

const keys = document.querySelectorAll('.key');
keys.forEach(key => {
    key.addEventListener('click', () => {
        const note = key.dataset.note;
        playNote(noteFrequencies[note]);
        key.classList.add('active');
        setTimeout(() => key.classList.remove('active'), 100);
    });
});

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
        playNote(noteFrequencies[note]);
        const keyElement = document.querySelector(`.key[data-note="${note}"]`);
        keyElement.classList.add('active');
        setTimeout(() => keyElement.classList.remove('active'), 100);
    }
});
