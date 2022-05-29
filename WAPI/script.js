//NOTE - this will only work through a server as it uses fetch request.  

const actx = new AudioContext();

function audioHandler(pathway, volume){
    fetch(pathway)
    .then(data =>data.arrayBuffer())
    .then(arrayBuffer => actx.decodeAudioData(arrayBuffer))
    .then(decodedAudio => {
        let sample = decodedAudio;
        let playSound = actx.createBufferSource();
        let gainNode = actx.createGain();
        playSound.buffer = sample;
        playSound.connect(gainNode);
        gainNode.connect(actx.destination);
        gainNode.gain.value = volume;
        playSound.start(actx.currentTime);
    });
} 

    const button1 = document.getElementById("button1");
    button1.addEventListener('mousedown', e => {
        audioHandler('shot.wav');
    });

