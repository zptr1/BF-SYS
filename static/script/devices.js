const display = {
  /** @type {CanvasRenderingContext2D} */
  ctx: null,
  buffer: new Uint8Array(DISPLAY_SIZE),
  init () {
    this.ctx = _screen.getContext("2d");
    _screen.width = DISPLAY_WIDTH * 16;
    _screen.height = DISPLAY_HEIGHT * 16;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(16, 16);
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, _screen.width, _screen.height);
  },
  draw (x, y, c) {
    this.ctx.fillStyle = COLORS[c] || "#000";
    this.ctx.fillRect(x, y, 1, 1);
    this.buffer[x * DISPLAY_WIDTH + y] = c;
  },
  clear () {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, _screen.width, _screen.height);
    for (let i = 0; i < this.buffer.length; i++)
      this.buffer[i] = 0;
  }
}

const createSpeaker = (freq) => ({
  ctx: new AudioContext(), freq,
  timer: 0,
  init() {
    this.gain = this.ctx.createGain();
    this.gain.connect(this.ctx.destination);
    return this;
  },
  play() {
    if (this.oscillator) return;
    this.gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.oscillator = this.ctx.createOscillator();
    this.oscillator.frequency.setValueAtTime(freq, this.ctx.currentTime);
    this.oscillator.type = "square";
    this.oscillator.connect(this.gain);
    this.oscillator.start();
  },
  stop() {
    if (!this.oscillator) return;
    this.oscillator.stop();
    this.oscillator = null;
  }
}).init();

const speakers = Array.from(
  { length: 32 },
  (_, i) => createSpeaker((i + 1) * 10)
);

setInterval(() => {
  speakers.forEach((x) => {
    if (x.timer && !--x.timer)
      x.stop();
  });
}, 16);

display.init();
