let intervalo;
let foco = 25;
let pausa = 5;
let periodo = "foco";
let tempo = foco * 60;
let ciclo = 1;
let emFoco = true;
const alerta = new Audio("sounds/beep.mp3");

function iniciar() {
  if (intervalo) return;
  atualizarCicloModo();
  atualizarDisplay();
  salvarEstado();

  intervalo = setInterval(function () {
    if (tempo > 0) {
      tempo--;
      atualizarDisplay();
      salvarEstado();
    } else {
      clearInterval(intervalo);
      intervalo = null;
      alerta.play();

      if (periodo === "foco") {
        periodo = "pausa";
        emFoco = false;
        tempo = pausa * 60;
      } else {
        emFoco = true;
        periodo = "foco";
        tempo = foco * 60;
        ciclo++;
      }
      atualizarCicloModo();
      atualizarDisplay();
      salvarEstado();
      iniciar();
    }
  }, 1000);
}

function pausar() {
  clearInterval(intervalo);
  intervalo = null;
}

function reset() {
  clearInterval(intervalo);
  intervalo = null;
  periodo = "foco";
  tempo = foco * 60;
  ciclo = 1;
  emFoco = true;

  const fundo = document.querySelector("#body");
  fundo.classList.remove("focus", "pause");

  atualizarDisplay();
  document.querySelector("#contador").textContent = "00:25:00";

  const status = document.querySelector("#status");
  status.textContent = "Ciclo: N/A Modo: N/A";
  localStorage.removeItem("pomodoroEstado");
}

function atualizarDisplay() {
  let timer = document.querySelector("#contador");
  let hr = Math.floor(tempo / 3600);
  let min = Math.floor((tempo % 3600) / 60);
  let seg = tempo % 60;
  let contadorFormatado =
    (hr < 10 ? "0" + hr : hr) +
    ":" +
    (min < 10 ? "0" + min : min) +
    ":" +
    (seg < 10 ? "0" + seg : seg);
  timer.textContent = contadorFormatado;
}

function atualizarCicloModo() {
  const status = document.querySelector("#status");
  const fundo = document.querySelector("#body");

  status.textContent = `Ciclo: ${ciclo} Modo: ${emFoco ? "FOCO" : "PAUSA"}`;

  fundo.classList.remove("focus", "pause");
  fundo.classList.add(emFoco ? "focus" : "pause");
}

function aplicarTema() {
  const toggleBtn = document.querySelector("#toggle-theme");
  const tema = localStorage.getItem("tema") || "light";
  if (tema === "dark") {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    toggleBtn.textContent = "🌙";
  }
  toggleBtn.setAttribute("aria-pressed", tema === "dark");
}

document.querySelector("#toggle-theme").addEventListener("click", () => {
  const body = document.body;
  const toggleBtn = document.querySelector("#toggle-theme");

  toggleBtn.classList.add("animando");

  setTimeout(() => {
    body.classList.toggle("dark-mode");
    const novoTema = body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("tema", novoTema);

    toggleBtn.textContent = novoTema === "dark" ? "☀️" : "🌙";
    toggleBtn.setAttribute("aria-pressed", novoTema === "dark");

    toggleBtn.classList.remove("animando");
    toggleBtn.blur();
  }, 200);
});

function salvarEstado() {
  const estado = {
    ciclo,
    periodo,
    tempo,
    emFoco,
  };
  localStorage.setItem("pomodoroEstado", JSON.stringify(estado));
}

function restaurarEstado() {
  const estadoSalvo = localStorage.getItem("pomodoroEstado");
  if (estadoSalvo) {
    const {
      ciclo: c,
      periodo: p,
      tempo: t,
      emFoco: f,
    } = JSON.parse(estadoSalvo);
    ciclo = c;
    periodo = p;
    tempo = t;
    emFoco = f;
    atualizarCicloModo();
    atualizarDisplay();
  }
}

aplicarTema();
restaurarEstado();
