_exec.addEventListener("click", () => {
  if (paused) _pause.click();
  if (running) halt();
  else start();
});

_pause.addEventListener("click", () => {
  if (paused) resume();
  else if (running) pause();
});

_step.addEventListener("click", () => step());

_src.addEventListener("keydown", (e) => {
  if (e.keyCode == 9) {
    e.preventDefault();
    const start = _src.selectionStart;
    const end = _src.selectionEnd;
    
    _src.value = _src.value.slice(0, start) + "    " + _src.value.slice(end);
    _src.selectionStart = _src.selectionEnd = start + 4;
  }

  _examples.value = "";
});

_src.addEventListener("input", () => localStorage.setItem("src", _src.value));

_examples.addEventListener("input", async () => {
  if (running || paused) halt();

  const req = await fetch(`/examples/${_examples.value}`);
  if (req.status != 200) {
    return alert(`Something went wrong... (${req.status} ${req.statusText})`);
  }

  _src.value = await req.text();
});

_speed.addEventListener("input", () => {
  speed = ~~(_speed.value / 10) * 10 || 1;
  _speed_label.textContent = `${speed}kHz`;
});

_debug.addEventListener("click", () => {
  if (debug) {
    debug = false;
    _debug.style = null;
    _mem.innerHTML = "";
  } else {
    debug = true;
    memory.forEach((x, i) => {
      const li = document.createElement("li");
      const [addr, val, hex, char, color] = Array.from(
        { length: 5 }, () => document.createElement("span")
      );

      addr.textContent = i;
      val.textContent = x;
      hex.textContent = `0x${x.toString(16).padStart(2, "0")}`;
      char.textContent = JSON.stringify(String.fromCharCode(x));
      color.style.backgroundColor = COLORS[x] || "#000";
      
      li.appendChild(addr);
      li.appendChild(val);
      li.appendChild(hex);
      li.appendChild(char);
      li.appendChild(color);
      _mem.appendChild(li);
    });

    _debug.style.borderColor = "#f33";
  }
})

document.body.addEventListener("keydown", (e) => {
  if (e.target.id != "_src") {
    key = e.keyCode;
  }
});

document.body.addEventListener("keyup", () => key = 0);

if (localStorage.getItem("src")) {
  _src.value = localStorage.getItem("src");
}