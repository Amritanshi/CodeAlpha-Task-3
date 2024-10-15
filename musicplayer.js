// musicplayer.js
const audio = document.getElementById('audio');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const stopButton = document.getElementById('stop');
const backwardButton = document.getElementById('backward');
const forwardButton = document.getElementById('forward');
const muteButton = document.getElementById('mute');
const repeatButton = document.getElementById('repeat');
const shuffleButton = document.getElementById('shuffle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const volumeControl = document.getElementById('volume-control');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const visualizer = document.getElementById('visualizer');
const canvasCtx = visualizer.getContext('2d');
let isRepeating = false;
let isShuffling = false;

// Event Listeners
playButton.addEventListener('click', () => audio.play());
pauseButton.addEventListener('click', () => audio.pause());
stopButton.addEventListener('click', () => { audio.pause(); audio.currentTime = 0; updateProgressBar(); });
backwardButton.addEventListener('click', () => audio.currentTime -= 10);
forwardButton.addEventListener('click', () => audio.currentTime += 10);
muteButton.addEventListener('click', () => audio.muted = !audio.muted);
repeatButton.addEventListener('click', () => isRepeating = !isRepeating);
shuffleButton.addEventListener('click', () => isShuffling = !isShuffling);
darkModeToggle.addEventListener('click', toggleDarkMode);
volumeControl.addEventListener('input', (e) => audio.volume = e.target.value);

// Update progress bar and time display
audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('ended', () => { if (isRepeating) audio.play(); });

function updateProgressBar() {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progress + '%';
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    durationDisplay.textContent = formatTime(audio.duration);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return minutes + ':' + (secs < 10 ? '0' : '') + secs;
}

// Visualizer effect
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 512;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function renderFrame() {
    requestAnimationFrame(renderFrame);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, visualizer.width, visualizer.height);
    dataArray.forEach((item, index) => {
        const barHeight = item * 0.5;
        const x = index * 3;
        canvasCtx.fillStyle = 'rgb(' + (item + 50) + ',50,150)';
        canvasCtx.fillRect(x, visualizer.height - barHeight, 2, barHeight);
    });
}
renderFrame();

function toggleDarkMode() {
    document.body.style.backgroundColor = document.body.style.backgroundColor === '#fff' ? '#121212' : '#fff';
}