let intervalo;
let foco = 25;
let pausa = 5;
let pausaLonga = false;
let periodo = "foco";
let tempo = foco * 60;
let ciclo = 1;
let emFoco = true;
let cycleCount = 0;
let longBreakDuration = 15 * 60;
const alerta = new Audio("sounds/beep.mp3");
document.addEventListener("DOMContentLoaded", () => {
  alerta.load();
});

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
        cycleCount++;
        if (cycleCount % 4 === 0) {
          periodo = "pausa";
          emFoco = false;
          tempo = longBreakDuration;
          pausaLonga = true;
        } else {
          periodo = "pausa";
          emFoco = false;
          tempo = pausa * 60;
        }
      } else {
        emFoco = true;
        periodo = "foco";
        tempo = foco * 60;
        ciclo++;
      }
      atualizarCicloModo();
      atualizarDisplay();
      salvarEstado();
      setTimeout(() => iniciar(), 1000);
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
  cycleCount = 0;
  pausaLonga = false;

  atualizarDisplay();
  atualizarCicloModo();

  const fundo = document.querySelector("#body");
  fundo.classList.remove("focus", "pause");

  const status = document.querySelector("#status");
  status.textContent = "Ciclo: N/A Modo: N/A";
  localStorage.removeItem("pomodoroEstado");
}

function atualizarDisplay() {
  let timer = document.querySelector("#contador");
  let min = Math.floor(tempo / 60);
  let seg = tempo % 60;
  let contadorFormatado =
    (min < 10 ? "0" + min : min) + ":" + (seg < 10 ? "0" + seg : seg);
  timer.textContent = contadorFormatado;
}

function atualizarCicloModo() {
  const status = document.querySelector("#status");
  const fundo = document.querySelector("#body");

  if (pausaLonga) {
    status.textContent = "PAUSA LONGA";
  } else {
    let modoTexto = emFoco ? "FOCO" : "PAUSA";
    status.textContent = `Ciclo: ${ciclo} Modo: ${modoTexto}`;
  }

  fundo.classList.remove("focus", "pause");
  fundo.classList.add(emFoco ? "focus" : "pause");
}

function aplicarTema() {
  const themeIcon = document.querySelector("#theme-icon");
  const toggleBtn = document.querySelector("#toggle-theme");
  const tema = localStorage.getItem("tema") || "light";

  if (tema === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.src = "./img/light.png";
    themeIcon.alt = "modo claro";
  } else {
    document.body.classList.remove("dark-mode");
    themeIcon.src = "./img/dark.png";
    themeIcon.alt = "modo escuro";
  }
  toggleBtn.setAttribute("aria-pressed", tema === "dark");
}

document.querySelector("#toggle-theme").addEventListener("click", () => {
  const body = document.body;
  const toggleBtn = document.querySelector("#toggle-theme");
  const themeIcon = document.querySelector("#theme-icon");

  toggleBtn.classList.add("animando");

  setTimeout(() => {
    body.classList.toggle("dark-mode");
    const novoTema = body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("tema", novoTema);

    themeIcon.src = novoTema === "dark" ? "./img/light.png" : "./img/dark.png";
    themeIcon.alt = novoTema === "dark" ? "modo claro" : "modo escuro";

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
    cycleCount,
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
      cycleCount: cc,
    } = JSON.parse(estadoSalvo);
    ciclo = c;
    periodo = p;
    tempo = t;
    emFoco = f;
    cycleCount = cc || 0;
    pausaLonga = periodo === "pausa" && cycleCount % 4 === 0;
    atualizarCicloModo();
    atualizarDisplay();
  }
}

const helpButton = document.querySelector("#help-button");

helpButton.addEventListener("click", () => {
  if (document.querySelector("#help-popup")) return;

  const popup = document.createElement("div");
  popup.id = "help-popup";
  popup.className = "popup";

  popup.innerHTML = `
  <h2>O que é o método Pomodoro?</h2>

    <p>
      O método Pomodoro é uma técnica de gestão de tempo criada para melhorar seu foco e produtividade. Ele funciona em ciclos de trabalho e pausa que ajudam o cérebro a manter a concentração e evitar a fadiga.
    </p>

    <h3>⏱️ Como usar:</h3>
    <ol>
      <li>Escolha uma tarefa para estudar ou trabalhar.</li>
      <li>Inicie o cronômetro e foque por <strong>25 minutos</strong> (um "Pomodoro").</li>
      <li>Faça uma <strong>pausa curta de 5 minutos</strong> quando o tempo acabar.</li>
      <li>A cada 4 Pomodoros, faça uma <strong>pausa maior de 15 a 30 minutos</strong>.</li>
    </ol>

    <h3>💡 Por que funciona?</h3>
    <ul>
      <li>Melhora a <strong>concentração</strong> e reduz distrações.</li>
      <li>Incentiva o uso consciente do tempo.</li>
      <li>Divide tarefas grandes em partes menores.</li>
      <li>Reduz o cansaço mental com pausas frequentes.</li>
    </ul>

    <button id="close-help" aria-label="Fechar ajuda"></button>
  `;
  document.body.appendChild(popup);

  const closeButton = document.querySelector("#close-help");
  closeButton.addEventListener("click", () => {
    popup.remove();
  });
});

const configButton = document.querySelector("#config-button");

configButton.addEventListener("click", () => {
  if (document.querySelector("#config-popup")) return;

  const popup = document.createElement("div");
  popup.id = "config-popup";
  popup.className = "popup";

  popup.innerHTML = `
  <h2> ⚙️ Configuração dos Periodos. </h2>
  <h3>
  <label for="focus-time">⌛ Tempo de foco (minutos):</label>
  <input id="focus-time" type="number" min="1" max="60" value="${foco}" /></br>

  <label for="pause-time">⌛ Tempo de pausa (minutos):</label>
  <input id="pause-time" type="number" min="1" max="60" value="${pausa}" /></br>

  <label for="long-break-time">⌛ Tempo da pausa longa (minutos):</label>
  <input id="long-break-time" type="number" min="1" max="60" value="${
    longBreakDuration / 60
  }" /></br></h3>

  <button id="save-config" aria-label="salvar configurações"></button>
  <button id="close-config" aria-label="fechar configurações"></button>
  `;

  document.body.appendChild(popup);

  const closeBtn = popup.querySelector("#close-config");
  const saveBtn = popup.querySelector("#save-config");
  const focusInput = popup.querySelector("#focus-time");
  const pauseInput = popup.querySelector("#pause-time");
  const longBreakInput = popup.querySelector("#long-break-time");

  closeBtn.addEventListener("click", () => {
    popup.remove();
  });

  saveBtn.addEventListener("click", () => {
    const novoFoco = parseInt(focusInput.value);
    const novoPausa = parseInt(pauseInput.value);
    const novoLongBreak = parseInt(longBreakInput.value);

    if (
      isNaN(novoFoco) ||
      novoFoco < 1 ||
      novoFoco > 60 ||
      isNaN(novoPausa) ||
      novoPausa < 1 ||
      novoPausa > 60 ||
      isNaN(novoLongBreak) ||
      novoLongBreak < 1 ||
      novoLongBreak > 60
    ) {
      alert("Valores inválidos. Informe números entre 1 e 60.");
      return;
    }

    foco = novoFoco;
    pausa = novoPausa;
    longBreakDuration = novoLongBreak * 60;

    reset();
    popup.remove();
    alert("Configurações Atualizadas com sucesso!");
  });
});

aplicarTema();
restaurarEstado();
