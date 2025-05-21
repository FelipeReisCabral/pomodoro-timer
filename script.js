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

  intervalo = setInterval(function () {
    if (tempo > 0) {
      tempo--;
      atualizarDisplay();
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

  atualizarCicloModo();
  atualizarDisplay();

  document.querySelector("#contador").textContent = "00:25:00";
  document.querySelector("#body").style.backgroundColor = null;
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

  if (emFoco) {
    fundo.style.backgroundColor = "lightgreen";
  } else {
    fundo.style.backgroundColor = "lightblue";
  }
}
