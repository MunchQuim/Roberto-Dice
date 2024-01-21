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

let caraCentral = document.getElementById("cara");
let cara = true;
let esDerrota = true;

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
document.getElementById("centralBtn").addEventListener("click", async function () {
    if (!empiezaPartida) {
        await arpegio();
        idle(0);
        reinicio();
        empiezaPartida = true;
        document.getElementById("centralBtn").style.backgroundColor = "green";
        await esperar(1000);
        Tone.Transport.stop();
        partida();
    }

});

async function partida() {
    pulsarIsEnabled = false;
    turnoJugador = false;
    codigoJugador = [];
    document.getElementById("centralBtn").style.backgroundColor = "silver";
    await esperar(gameTimeout);
    cara = false;

    //fase1
    while (!turnoJugador) {
        cara = false;
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
            caraCentral.src = "./sprites/reactions/reactions" + (myNum + 1) + ".png";
            await esperar(gameTimeout);
            apagar(myNum);
            await esperar(esperaTrasApagado);
        }
        secuencia = 2;
        codigoCopia = codigo;
        codigoJugadorPosicion = 0;
        pulsarIsEnabled = true;
        turnoJugador = true;
    }
    document.getElementById("centralBtn").style.backgroundColor = "silver";
    cara = true;
    idle(5);


}

function esperar(tiempo) {
    return new Promise(resolve => {
        setTimeout(resolve, tiempo);
    });
}


async function pulsa(myNum) {

    if (pulsarIsEnabled) {
        pulsarIsEnabled = false;
        cara = false;
        codigoJugador.push(myNum);
        encender(myNum);
        comprueba(codigoJugadorPosicion);

        await esperar(timeout);
        apagar(myNum);
        if (!esDerrota) {
            cara = true;
        }
        idle(5);
        await esperar(esperaTrasApagado);
        codigoJugadorPosicion++;

        if (codigoJugador.length == codigo.length && codigoJugador[codigoJugador.length-1] == codigo[codigo.length-1] ) {
            pulsarIsEnabled = false;
            if (gameTimeout > timeout) {
                gameTimeout -= 50;
            }
            cara = false;
            caraCentral.src = "./sprites/reactions/reactions" + (5) + ".png";
            document.getElementById("centralBtn").style.backgroundColor = "green";
            await esperar(1000);
            document.getElementById("centralBtn").style.backgroundColor = "silver";
            cara = true;
            idle(5);
            partida();
        }
    }
}
async function comprueba(posicion) {
    if (codigoJugador[posicion] != codigo[posicion]) {
        pulsarIsEnabled = false;
        derrota();
    } else {
        pulsarIsEnabled = true;
    }
}
async function encender(num) {
    let boton = document.getElementById("boton" + num + "");
    caraCentral.src = "./sprites/reactions/reactions" + (num + 1) + ".png";
    document.getElementById("centralBtn").style.backgroundColor = window.getComputedStyle(boton, null).getPropertyValue('background-color');
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

async function derrota() {
    esDerrota = true;
    document.getElementById("centralBtn").style.backgroundColor = "red";
    cara = false;
    caraCentral.src = "./sprites/reactions/reactions" + (6) + ".png";
    Tone.loaded().then(() => {
        sampler.triggerAttackRelease(SONIDOS, 1);
    })

    await esperar(2000);
    caraCentral.src = "./sprites/idle/idle0.png";
    caraCentral.style.height = "14%";
    caraCentral.style.width = "80%";
    /// final de fallo
    reinicio();

}
function reinicio() {
    
    esDerrota = false;
    document.getElementById("centralBtn").style.backgroundColor = "silver";
    cara = true;
    empiezaPartida = false;
    secuencia = 3;
    codigo = [];
    codigoCopia = [];
}

//
function playNote(num) {
    synth.triggerAttackRelease(SONIDOS[num], '1s');
}

async function idle(posicion) {
    let idlePosition = posicion;
    caraCentral.style.height = "10rem";
    caraCentral.style.width = "10rem";
    while (cara) {
        idlePosition++;
        document.getElementById("cara").src = "./sprites/idle/idle" + idlePosition + ".png";
        await esperar(200);
        if (idlePosition == 7) {
            idlePosition = 5;
        }
    }

}
async function arpegio() {
    /*for (let num = 0; num < SONIDOS.length; num++) {
        let boton = document.getElementById("boton" + num + "");
        playNote(num);
        boton.style.opacity = MAXOPACITY;
        await esperar(500);
        apagar(num);
    }*/
    console.log("arpegio");
    const syntho = new Tone.Synth().toDestination();
    const notaso = ['Eb3', 'Ab3', 'Db4', 'F4'];

    const arpegio = new Tone.Pattern((time, nota) => {
        // Reproduce la nota en el tiempo especificado
        syntho.triggerAttackRelease(nota, '8n', time);
    }, notaso);
    arpegio.start(0);
    arpegio.interval = '8n';
    arpegio.iterations = notaso.length;
    Tone.Transport.start();
}
async function arpegioMal() {
    /*for (let num = 0; num < SONIDOS.length; num++) {
        let boton = document.getElementById("boton" + num + "");
        playNote(num);
        boton.style.opacity = MAXOPACITY;
        await esperar(500);
        apagar(num);
    }*/
    const syntho = new Tone.Synth().toDestination();
    const notaso = ['F4', 'Db4', 'Ab3', 'Eb3'];

    const arpegio = new Tone.Pattern((time, nota) => {
        // Reproduce la nota en el tiempo especificado
        syntho.triggerAttackRelease(nota, '8n', time);
    }, notaso);
    arpegio.start(0);
    arpegio.interval = '8n';
    arpegio.iterations = notaso.length;
    Tone.Transport.start();
}