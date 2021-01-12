import theme from "./assets/audio/theme.mp3";
import mid from "./assets/audio/mid.mp3";
import ambient from "./assets/audio/ambient.mp3";
import ambient2 from "./assets/audio/ambient2.mp3";

const tracks = [
  { name: "theme", src: theme },
  { name: "mid", src: mid },
  { name: "ambient", src: ambient },
  { name: "ambient", src: ambient2 },
];

export default () => {
  const previousButton = document.getElementById("audioPrevious");
  const playButton = document.getElementById("audioPlay");
  const nextButton = document.getElementById("audioNext");
  const audioWrapper = document.getElementById("audio__player");

  const audioPlayer = new Audio();
  // const audioPlayer = document.createElement("audio");

  audioPlayer.controls = true;
  audioPlayer.volume = 0.0;
  // document.body.appendChild(audioPlayer);

  function getCurrentTrackIndex() {
    let currentTrack;

    for (let t = 0; t < tracks.length; t++) {
      const trackSrc = tracks[t].src;
      const audioSrc = audioPlayer.src.substring(
        audioPlayer.src.lastIndexOf("/")
      );
      if (trackSrc === audioSrc) {
        currentTrack = t;

        break;
      }
    }
    return currentTrack;
  }

  function setPlayerTime(time) {
    audioPlayer.currentTime = time;
  }

  function setTrack(src) {
    audioPlayer.src = src;
  }

  function setVolume(volume) {
    audioPlayer.volume = volume;
  }

  // PLAYBACK
  function play() {
    audioPlayer.play();
  }

  function next() {
    pause();
    setPlayerTime(0);
    const currentTrack = getCurrentTrackIndex();

    let nextTrack;
    nextTrack = currentTrack + 1;
    if (nextTrack > tracks.length - 1) {
      nextTrack = 0;
    }

    setTrack(tracks[nextTrack].src);
    fadeUp(1);
    play();
  }

  function pause() {
    audioPlayer.pause();
  }

  function previous() {
    pause();
    setPlayerTime(0);
    const currentTrack = getCurrentTrackIndex();

    let nextTrack;
    nextTrack = currentTrack - 1;
    if (nextTrack < 0) {
      nextTrack = tracks.length - 1;
    }

    setTrack(tracks[nextTrack].src);

    play();
  }

  let fading = false;
  function fadeUp(startingVolume = 0) {
    console.log("fade up");
    fading = true;
    setVolume(startingVolume);
    const volumeFader = window.setInterval(() => {
      const newVolume = audioPlayer.volume + 5 / 1000;
      if (newVolume >= 1) {
        console.log("max!");
        setVolume(1);
        window.clearInterval(volumeFader);
        fading = false;
      } else {
        setVolume(newVolume);
      }
    }, 100);
  }

  function fadeDown() {
    console.log("fade down");
    fading = true;
    const volumeFader = window.setInterval(() => {
      const newVolume = audioPlayer.volume - 5 / 1000;
      if (newVolume <= 0) {
        console.log("min!");
        setVolume(0);
        window.clearInterval(volumeFader);
        next();
      } else {
        setVolume(newVolume);
      }
    }, 100);
  }

  // CONTROLS
  previousButton.addEventListener("click", previous);
  playButton.addEventListener("click", play);
  nextButton.addEventListener("click", next);

  // AUTOMATION
  // audioPlayer.addEventListener("ended", next);
  audioPlayer.addEventListener("timeupdate", (ev) => {
    const timeLeft = ev.target.duration - ev.target.currentTime;
    if (timeLeft <= 20 && !fading) {
      console.log("track ending");
      fadeDown();
    }
  });

  // INIT
  function initialPlay() {
    setTrack(tracks[0].src);
    play();
    fadeUp();

    // audioWrapper.style.opacity = 1;
    document.body.removeEventListener("click", initialPlay);
  }
  document.body.addEventListener("click", initialPlay);
};
