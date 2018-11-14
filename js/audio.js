function log(message) {
    var out = document.getElementById('output');
    var msg = document.createElement('div');
    msg.textContent = message;
    out.appendChild(msg);
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;

function setupCanvas(canvasContext) {
    canvasContext.fillStyle = "green";
    canvasContext.lineWidth = 1;
    var gradient = canvasContext.createLinearGradient(0, 0, 1, 256);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.35, "orange");
    gradient.addColorStop(0.5, "green");
    gradient.addColorStop(0.65, "orange");
    gradient.addColorStop(1, "red");
    canvasContext.strokeStyle = gradient;
}

function getAnalyser(audioContext) {
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    log('Frequency bin count: ' + analyser.frequencyBinCount);

    return analyser;
}

function getAudioSource(audioContext) {
    var a = document.getElementById('a');
    a.crossOrigin = "anonymous";

    return audioContext.createMediaElementSource(a);
}

function getGeneratedSource(audioContext) {
    var oscillator = audioContext.createOscillator();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // value in hertz
    oscillator.frequency.setValueAtTime(440 * 2, audioContext.currentTime + 2);
    oscillator.frequency.setValueAtTime(440 * 4, audioContext.currentTime + 4);
    oscillator.frequency.setValueAtTime(440 * 8, audioContext.currentTime + 6);
    oscillator.frequency.setValueAtTime(440 * 16, audioContext.currentTime + 8);
    oscillator.frequency.setValueAtTime(440 * 32, audioContext.currentTime + 10);

    var gain = audioContext.createGain();
    gain.gain.value = 0.5;

    return oscillator;
}

function getMicSource(audioContext) {
    return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => audioContext.createMediaStreamSource(stream));
}

function drawEqualizer(canvasContext, width, height, fqData) {
    canvasContext.clearRect(0, 0, width, height);
    for (var i = 0; i < fqData.length; i++) {
        //c.fillRect(i, (255-fqData[i])/2, 1, fqData[i]);
        canvasContext.strokeRect(i, (255 - fqData[i]) / 2, 1, fqData[i]);
    }
}

window.onload = function () {
    log('Hello there!');
    var c = document.getElementById('c');
    var canvasContext = c.getContext('2d');
    setupCanvas(canvasContext);

    var audioContext = new AudioContext();

    var an = getAnalyser(audioContext);
    var fqData = new Uint8Array(an.frequencyBinCount);

    /*
    // sync
    var src = getGeneratedSource(audioContext);
    src.connect(an);
    src.connect(audioContext.destination);
*/
    var gen = getGeneratedSource(audioContext);
    gen.connect(audioContext.destination);

    // async
    getMicSource(audioContext).then(src => {
        src.connect(an);
        gen.start();
        // src.connect(audioContext.destination);
    });

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        an.getByteFrequencyData(fqData);
        drawEqualizer(canvasContext, c.width, c.height, fqData);
    }

    // src.start();
    renderFrame();
};
