const memory = new Uint8Array(4096);
const rom = new Uint8Array(8192);
const stack = new Uint16Array(256);

let running = false;
let paused = false;
let debug = false;
let speed = 100;
let key = 0;

let clockT = null;

let IP = 0;
let MP = 0;
let SP = 0;
let OP = 0;

function reset(buf) {
  for (let i = 0; i < buf.length; i++) buf[i] = 0;
}

function start() {
  running = true;
  IP = 0; MP = 0; OP = 0; SP = 0;

  console.clear();
  display.clear();
  reset(memory);
  reset(rom);
  reset(stack);

  const src = _src.value.replace(/[^+\-<>,.\[\]]/g, "");
  for (let i = 0; i < src.length; i++)
    rom[i] = src.charCodeAt(i);
  
  _exec.textContent = "stop";
  _exec.style.borderColor = "#f33";
  _pause.textContent = "pause";
  _pause.disabled = false;

  if (debug) {
    _mem.childNodes.forEach((x) => {
      if (x.childNodes[1].textContent != "0") {
        x.childNodes[1].textContent = 0;
        x.childNodes[2].textContent = "0x00";
        x.childNodes[3].textContent = '"\\u0000"';
        x.childNodes[4].style.backgroundColor = "#000";
      }
    });
  }

  runInstrLoop();
}

function halt() {
  running = false;
  paused = false;

  _exec.textContent = "start";
  _exec.style = null;
  _pause.textContent = "pause";
  _pause.disabled = true;
  _step.style.display = "none";
}

async function runInstrLoop() {
  for (let i = 0; i < speed && running; i++)
    if (!await runInstr()) break;
  if (running) setTimeout(runInstrLoop);
}

async function runInstr() {
  if (!running && !paused) return;
  const instr = rom[IP++];

  if (!instr)
    return halt();
  else if (instr == Instr.ADD) {
    memory[MP]++;
    debug && updateMem();
  } else if (instr == Instr.SUB) {
    memory[MP]--;
    debug && updateMem();
  } else if (instr == Instr.MEM_RIGHT) {
    MP++;
    if (MP >= memory.length) MP = 0;
    debug && updateMemCursor();
  } else if (instr == Instr.MEM_LEFT) {
    MP--;
    if (MP < 0) MP = memory.length - 1;
    debug && updateMemCursor();
  } else if (instr == Instr.OUTPUT) {
    if (++OP > DISPLAY_SIZE + 32) OP = 1;

    if (OP % 33 == 0) {
      const speaker = speakers[~~(OP / 33) - 1];
      if (speaker.timer && !memory[MP]) {
        speaker.timer = 0;
        speaker.stop();
      } else if (memory[MP]) {
        speaker.timer = memory[MP];
        speaker.play();
      }
    } else {
      display.draw(OP % 33 - 1, ~~(OP / 33), memory[MP]);
    }
  } else if (instr == Instr.INPUT) {
    await (new Promise((res) => clockT = res));
    memory[MP] = key;
    debug && updateMem();
    return;
  } else if (instr == Instr.LOOP_START) {
    if (memory[MP]) {
      stack[SP++] = IP - 1;
      if (SP >= stack.length)
        return panic();
    } else {
      let d = 1;
      while (d) {
        const c = rom[IP++];
        if (!c) return halt();
        else if (c == Instr.LOOP_START) d++;
        else if (c == Instr.LOOP_END) d--;
      }
    }
  } else if (instr == Instr.LOOP_END) {
    SP--;    
    if (memory[MP]) IP = stack[SP];
    if (SP < 0) return panic();
  }

  return true;
}

function updateMem() {
  const li = _mem.childNodes[MP];
  const val = memory[MP];
  li.childNodes[1].textContent = val;
  li.childNodes[2].textContent = `0x${val.toString(16).padStart(2, "0")}`;
  li.childNodes[3].textContent = JSON.stringify(String.fromCharCode(val));
  li.childNodes[4].style.backgroundColor = COLORS[val] || "#000";
}

function updateMemCursor() {
  const a = document.querySelector("#_mem li.active");
  if (a) a.classList.remove("active");
  _mem.childNodes[MP].classList.add("active");
}

function pause() {
  paused = true;
  running = false;
  _step.style = null;
  _pause.textContent = "resume";
  _pause.style.borderColor = "#3f3";
}

async function step() {
  for (let i = 0; i < speed && paused; i++)
    await runInstr();
  if (getKeypress) paused = true;
}

function resume() {
  paused = false;
  running = true;
  _step.style.display = "none";
  _pause.textContent = "pause";
  _pause.style = null;
  runInstrLoop();
}

function panic() {
  halt();
  speakers[0].timer += 5;
  speakers[0].play();
  for (let x = 0; x < DISPLAY_WIDTH; x++)
  for (let y = 0; y < DISPLAY_HEIGHT; y++) {
    display.draw(x, y, ~~(Math.random() * 255));
  }
}

setInterval(() => {
  if (clockT) {
    clockT();
    clockT = null;
  }
}, 1);