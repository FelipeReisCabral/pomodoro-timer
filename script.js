let intervalo;
let foco = 25;
let tempo = foco * 60;

function iniciar() {
  let timer = document.querySelector("#contador");

  intervalo = setInterval(function () {
    if (tempo > 0) {
      tempo--;
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
    } else {
      clearInterval(intervalo);
      timer.textContent = "00:00:00";
    }
  }, 1000);
}

function pausar() {
  clearInterval(intervalo);
}

function reset() {
  clearInterval(intervalo);
  intervalo = null;
  tempo = foco * 60;

  const timer = document.querySelector("#contador");
  timer.textContent = "00:25:00";
}
