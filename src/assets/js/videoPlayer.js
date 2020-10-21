import getBlobDuration from "get-blob-duration";

const videoContainer = document.getElementById("jsVideoPlayer");
let videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeBtn")
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const vid = document.getElementById("myVideo");
const volumeRange = document.getElementById("jsVolume");
const videoControls = document.getElementById("controls");
let timeout;

const registerView = () => {
    const videoId = window.location.href.split("/videos/")[1];
    fetch(`/api/${videoId}/view`, {
        method: "POST"
    });
};

function handlePlayClick() {
    if(videoPlayer.paused) {
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function handleVolumeClick() {
    if(videoPlayer.muted) {
        videoPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>'; 
        volumeRange.value = videoPlayer.volume;
    } else {
        volumeRange.value = 0;   
        videoPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

function exitFullScreen() {
    fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullScrnBtn.addEventListener("click", goFullScreen);
    document.exitFullscreen();
}
  
function goFullScreen() {
    videoContainer.webkitRequestFullscreen();
    fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
    fullScrnBtn.removeEventListener("click", goFullScreen);
    fullScrnBtn.addEventListener("click", exitFullScreen);
}

const formatDate = seconds => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;
  
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }
    return `${hours}:${minutes}:${totalSeconds}`;
};
  

async function setTotalTime() {
    const blob = await fetch(videoPlayer.src).then(response => response.blob());
    const duration = await getBlobDuration(blob);
    const totalTimeString = formatDate(duration);
    totalTime.innerHTML = "&nbsp;" + totalTimeString;
}

function getCurrentTime() {
    currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}

function handleEnded() {
    registerView();
    videoPlayer.currentTime = 0;
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
}

function handleDrag(event) {
    const {
        target: { value }
    } = event;
    videoPlayer.volume = value;
    if(value >= 0.6) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>'; 
    } else if(value >= 0.3) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>'; 
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>'; 
    }
}

function showControls() {
    videoControls.style.opacity = "1";
}

function init() {
    videoPlayer.volume = 0.5;
    playBtn.addEventListener("click", handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    fullScrnBtn.addEventListener("click", goFullScreen);
    setInterval(getCurrentTime, 1000);
    videoPlayer.addEventListener("ended", handleEnded);
    volumeRange.addEventListener("input", handleDrag)
    videoContainer.addEventListener("mousemove", showControls);
    videoPlayer.addEventListener("loadedmetadata", setTotalTime);
    videoPlayer.addEventListener("mousemove", function() {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(mouseStop, 3000);
    });
}




  
function mouseStop() {
    videoControls.style.opacity = "0";
}

if(videoContainer) {
    init();
}