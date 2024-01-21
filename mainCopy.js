
let codigo = [];
let codigoCopia = [];
let codigoJugador = [];
let secuencia = 3;
const SONIDOS = ['Db3', 'Eb3', 'F3', 'Ab3'];
const MAXOPACITY = 1;
const MINOPACITY = 0.6;
let pulsarIsEnabled = false;// empezar con false
let turnoJugador = false;// empezar con false
let empiezaPartida = false;// empezar con false
let codigoJugadorPosicion = 0;
let timeout = 200;
let gameTimeout = 500;
let esperaTrasApagado = 100;
let iluminacion = document.getElementById("iluminacion");
iluminacion.style.height = document.getElementById("grid").offsetHeight + "px";
iluminacion.style.width = document.getElementById("grid").offsetWidth + "px";

const synth = new Tone.Synth().toDestination();
const sampler = new Tone.Sampler({
	urls: {
		"C4": "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		"A4": "A4.mp3",
	},
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();


document.getElementById("boton0").addEventListener("click", function () {
    pulsa(0);
});
document.getElementById("boton1").addEventListener("click", function () {
    pulsa(1);
});
document.getElementById("boton2").addEventListener("click", function () {
    pulsa(2);
});
document.getElementById("boton3").addEventListener("click", function () {
    pulsa(3);
});
document.getElementById("centralBtn").addEventListener("click", function () {
    if(!empiezaPartida){
        reinicio();
        empiezaPartida = true;
        partida();
    }

});

async function partida() {
    pulsarIsEnabled = false;
    turnoJugador = false;
    codigoJugador = [];

    document.getElementById("centralBtn").style.backgroundColor = "green";
    await esperar(1000);
    document.getElementById("centralBtn").style.backgroundColor = "silver";
    await esperar(gameTimeout);

    //fase1
    while (!turnoJugador) {
        for (let index = 0; index < codigoCopia.length; index++) { //repite la secuencia existente
            encender(codigoCopia[index]);
            codigo[index] = codigoCopia[index];
            await esperar(gameTimeout);
            apagar(codigoCopia[index]);
            await esperar(esperaTrasApagado);
        }
        for (let index = 0; index < secuencia; index++) { //fabrica una nueva
            let myNum = randomNum();
            codigo.push(myNum);
            encender(myNum);
            await esperar(gameTimeout);
            apagar(myNum);
            await esperar(esperaTrasApagado);
        }
        secuencia = 2;
        codigoCopia = codigo;
        console.log(codigo);
        codigoJugadorPosicion = 0;
        pulsarIsEnabled = true;
        turnoJugador = true;
    }
}

function esperar(tiempo) {
    return new Promise(resolve => {
        setTimeout(resolve, tiempo);
    });
}


async function pulsa(myNum) {
    if (pulsarIsEnabled) {
        codigoJugador.push(myNum);
        encender(myNum);
        console.log(codigoJugador);
        comprueba(codigoJugadorPosicion);
        await esperar(timeout);
        apagar(myNum);
        await esperar(esperaTrasApagado);
        codigoJugadorPosicion++;
    }
}
async function comprueba(posicion) {
    if (codigoJugador[posicion] != codigo[posicion]) {
        derrota();
    } else {
        if (codigoJugador.length == codigo.length) {
            if (gameTimeout > timeout) {
                gameTimeout -= 50;
            }
            await esperar(esperaTrasApagado);
            partida();
        }
    }
}
async function encender(num) {
    let boton = document.getElementById("boton" + num + "");
    playNote(num);
    boton.style.opacity = MAXOPACITY;
}
function apagar(num) {
    let boton = document.getElementById("boton" + num);
    boton.style.opacity = MINOPACITY;
}
function randomNum() {
    let myNum = Math.floor(Math.random() * 4);
    return myNum;
}

function derrota() {
    document.getElementById("centralBtn").style.backgroundColor = "red";
    Tone.loaded().then(() => {
        sampler.triggerAttackRelease(SONIDOS, 1);
    })
    /// final de fallo
    reinicio();

}
function reinicio() {
    empiezaPartida = false;
    secuencia = 3;
    codigo = [];
    codigoCopia = [];
}

//

function playNote(num) {
    synth.triggerAttackRelease(SONIDOS[num], '1s');
}