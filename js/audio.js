function log(message) {
	var out = document.getElementById('output');
	var msg = document.createElement('div');
	msg.textContent = message;
	out.appendChild(msg);
}

window.AudioContext = window.AudioContext||window.webkitAudioContext;

window.onload = function() {
	log('Hello there!');	
    var c = document.getElementById('c');
    var canvasContext = c.getContext('2d');
    var audioContext = new AudioContext();
    var a = document.getElementById('a');
    a.crossOrigin = "anonymous";
    var src = audioContext.createMediaElementSource(a);
    var an = audioContext.createAnalyser();
    an.fftSize = 2048;
    src.connect(an);
    src.connect(audioContext.destination);
    var fqData = new Uint8Array(an.frequencyBinCount);
    log('Frequency bin count: ' + an.frequencyBinCount);
    
    canvasContext.fillStyle = "green";
    canvasContext.lineWidth = 1;
    var gradient = canvasContext.createLinearGradient(0,0,1,256);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.35, "orange");
    gradient.addColorStop(0.5, "green");
    gradient.addColorStop(0.65, "orange");
    gradient.addColorStop(1, "red");
    canvasContext.strokeStyle = gradient;

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        an.getByteFrequencyData(fqData);
        canvasContext.clearRect(0, 0, c.width, c.height);
        for (var i = 0; i < fqData.length ; i++) {
            //c.fillRect(i, (255-fqData[i])/2, 1, fqData[i]);
            canvasContext.strokeRect(i, (255-fqData[i])/2, 1, fqData[i]);
        }
    }

    a.play();
    renderFrame();
};
