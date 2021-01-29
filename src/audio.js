import theme from "./assets/audio/theme.mp3";
import mid from "./assets/audio/mid.mp3";
import ambient from "./assets/audio/ambient.mp3";
import ambient2 from "./assets/audio/ambient2.mp3";

const tracks = [
  { name: "Main Theme", src: theme },
  { name: "Spaced Out", src: mid },
  { name: "Alone", src: ambient },
];

var audioApp = new Vue({
  el: "#audio__player",
  data: {
    playing: false,
    audioPlayer: new Audio(),
    fading: false,
    trackName: null,
  },
  methods: {
    setTrack: function (track) {
      this.audioPlayer.src = track.src;
      this.trackName = track.name;
      this.setPlayerTime(0);
      if (this.playing) {
        this.play();
      }
    },
    setPlayerTime: function (time) {
      this.audioPlayer.currentTime = time;
    },
    getCurrentTrackIndex: function () {
      let currentTrack;

      for (let t = 0; t < tracks.length; t++) {
        const trackSrc = tracks[t].src;
        const audioSrc = this.audioPlayer.src.substring(
          this.audioPlayer.src.lastIndexOf("/")
        );
        if (trackSrc === audioSrc) {
          currentTrack = t;

          break;
        }
      }
      return currentTrack;
    },
    next: function () {
      // this.pause();

      const currentTrack = this.getCurrentTrackIndex();

      let nextTrack;
      nextTrack = currentTrack + 1;
      if (nextTrack > tracks.length - 1) {
        nextTrack = 0;
      }

      this.setTrack(tracks[nextTrack]);
    },
    previous: function () {
      // this.pause();

      const currentTrack = this.getCurrentTrackIndex();

      let nextTrack;
      nextTrack = currentTrack - 1;
      if (nextTrack < 0) {
        nextTrack = tracks.length - 1;
      }

      this.setTrack(tracks[nextTrack]);
    },
    play: function () {
      this.playing = true;
      this.audioPlayer.play();
    },
    pause: function () {
      this.playing = false;
      this.audioPlayer.pause();
    },
    setVolume: function (volume) {
      this.audioPlayer.volume = volume;
    },
  },
  mounted: function () {
    // const audioPlayer = new Audio();
    // const audioPlayer = document.createElement("audio");

    // this.audioPlayer.controls = true;
    this.audioPlayer.volume = 0.5;

    this.setTrack(tracks[0]);
    // this.play();
    // this.fadeUp();

    this.audioPlayer.addEventListener("timeupdate", (ev) => {
      const timeLeft = ev.target.duration - ev.target.currentTime;
      if (timeLeft <= 0) {
        this.next();
      }
    });
  },
});

// fadeUp: function (startingVolume = 0) {
//   this.fading = true;
//   this.setVolume(startingVolume);
//   const volumeFader = window.setInterval(() => {
//     const newVolume = this.audioPlayer.volume + 5 / 1000;
//     if (newVolume >= 0.5) {
//       this.setVolume(0.5);
//       window.clearInterval(volumeFader);
//       this.fading = false;
//     } else {
//       this.setVolume(newVolume);
//     }
//   }, 100);
// },
// export default () => {
//   const previousButton = document.getElementById("audioPrevious");
//   const playButton = document.getElementById("audioPlay");
//   const nextButton = document.getElementById("audioNext");
//   const audioWrapper = document.getElementById("audio__player");
//   const progressIndicator = document.getElementById(
//     "audio__progress__indicator"
//   );
//
//   const audioPlayer = new Audio();
//   // const audioPlayer = document.createElement("audio");
//
//   audioPlayer.controls = true;
//   audioPlayer.volume = 0.0;
//   // document.body.appendChild(audioPlayer);
//

//

//
//   function setTrack(src) {
//     audioPlayer.src = src;
//   }
//
//   function setVolume(volume) {
//     audioPlayer.volume = volume;
//   }
//
//   // PLAYBACK
//   function play() {
//     audioPlayer.play();
//   }
//

//
//   function pause() {
//     audioPlayer.pause();
//   }
//

//
//   let fading = false;
//   function fadeUp(startingVolume = 0) {
//     fading = true;
//     setVolume(startingVolume);
//     const volumeFader = window.setInterval(() => {
//       const newVolume = audioPlayer.volume + 5 / 1000;
//       if (newVolume >= 0.5) {
//         setVolume(0.5);
//         window.clearInterval(volumeFader);
//         fading = false;
//       } else {
//         setVolume(newVolume);
//       }
//     }, 100);
//   }
//
//   function fadeDown() {
//     fading = true;
//     const volumeFader = window.setInterval(() => {
//       const newVolume = audioPlayer.volume - 10 / 1000;
//       if (newVolume <= 0) {
//         setVolume(0);
//         window.clearInterval(volumeFader);
//         next();
//       } else {
//         setVolume(newVolume);
//       }
//     }, 100);
//   }
//
//   // CONTROLS
//   previousButton.addEventListener("click", previous);
//   playButton.addEventListener("click", play);
//   nextButton.addEventListener("click", next);
//
//   // AUTOMATION
//   // audioPlayer.addEventListener("ended", next);

//
//   // INIT
//   function initialPlay() {
//     setTrack(tracks[0].src);
//     play();
//     fadeUp();
//
//     // audioWrapper.style.opacity = 1;
//     document.body.removeEventListener("click", initialPlay);
//   }
//   document.body.addEventListener("click", initialPlay);
// };
