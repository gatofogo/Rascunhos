let

/*
// 1. Inicializa o contexto de áudio
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// 2. Pega a tag de áudio do HTML
const audioElement = document.getElementById('meu-audio');

// 3. Cria a "ponte" que conecta a tag HTML à Web Audio API
const track = audioCtx.createMediaElementSource(audioElement);

// 4. Cria um controle de volume (GainNode) para usarmos de exemplo
const gainNode = audioCtx.createGain();
gainNode.gain.value = 0.5; // Volume a 50%

// 5. Faz o encanamento: Tag HTML -> Controle de Volume -> Caixa de Som
track.connect(gainNode);
gainNode.connect(audioCtx.destination);


window.addEventListener('click', () => {
    // Garante que o contexto de áudio acordou
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // Toca o áudio usando o método padrão do HTML5
    audioElement.play();
});
*/