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
    var a = document.getElementById('a');
    a.crossOrigin = "anonymous";

    return audioContext.createMediaElementSource(a);
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

    var src = getAudioSource(audioContext);

    src.connect(an);
    src.connect(audioContext.destination);

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        an.getByteFrequencyData(fqData);
        drawEqualizer(canvasContext, c.width, c.height, fqData);
    }

    renderFrame();
};
