let intervalo;
let foco = 25;
let pausa = 5;
let periodo = "foco";
let tempo = foco * 60;

function iniciar() {
  if (intervalo) return;

  intervalo = setInterval(function () {
    if (tempo > 0) {
      tempo--;
      atualizarDisplay(intervalo);
    } else {
      clearInterval(intervalo);
      intervalo = null;

      if (periodo === "foco") {
        periodo = "pausa";
        tempo = pausa * 60;
      } else {
        periodo = "foco";
        tempo = foco * 60;
      }

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

  document.querySelector("#contador").textContent = "00:25:00";
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
