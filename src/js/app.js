document.addEventListener('alpine:init', function () {
  const spotifyAudio = document.querySelector('[x-ref=spotify-audio]')

  function display(seconds) {
    const format = val => `0${Math.floor(val)}`.slice(-2)
    const hours = Math.round(seconds / 3600)
    const minutes = (seconds % 3600) / 60

    return [hours, minutes, seconds % 60].filter(Boolean).map(format).join(':')
  }

  Alpine.store('music', {
    elapsedTimeInterval: null,
    elapsedTime: 0,
    elapsedTimeDisplay: '00:00',
    duration: spotifyAudio.duration,
    durationDisplay: display(spotifyAudio.duration),
    seekSlider: 0,
    isPlay: false,
    togglePlay() {
      this.isPlay = !this.isPlay

      if (this.isPlay) {
        spotifyAudio.play()
        this.startElapsedTime()
      } else {
        spotifyAudio.pause()
        this.stopElapsedTime()
      }
    },
    startElapsedTime() {
      this.elapsedTimeInterval = setInterval(() => {
        this.elapsedTime = this.elapsedTime + 1;
        if (this.elapsedTime >= this.duration) return this.stopElapsedTime()

        this.seekSlider = this.elapsedTime / this.duration * 100
        this.elapsedTimeDisplay = display(this.elapsedTime)
      }, 1000)
    },
    stopElapsedTime() {
      clearInterval(this.elapsedTimeInterval)
    },
    seekTo(val) {
      this.stopElapsedTime()
      const seconds = Math.round(val / 100 * this.duration)

      this.elapsedTime = seconds
      this.elapsedTimeDisplay = display(seconds)
      this.seekSlider = val
      spotifyAudio.currentTime = seconds

      if (this.isPlay) {
        spotifyAudio.play()
        this.startElapsedTime()
      }
    }
  })
})