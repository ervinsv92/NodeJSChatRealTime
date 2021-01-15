var form = document.getElementById("form");
var txtMensaje = document.getElementById("txtMensaje")
var ulMensajes = document.getElementById('ulMensajes')
var ulUsuarios = document.getElementById('ulUsuarios')
var lblNombreUsuario = document.getElementById('lblNombreUsuario')
var audioAlert = document.getElementById('audioAlert')
var socket = io.connect('http://10.7.13.161:3000');
var nombreUsuario = ""

//console.log(txtMensaje)

//ulMensajes.appendChild("<li>Chat Iniciado</li>")

while (nombreUsuario.trim() == "") {
    nombreUsuario = prompt("Ingrese un nombre de usuario")

    if (nombreUsuario.trim() == "") {
        alert("Debe ingresar un nombre de usuario")
    }
}

socket.emit("inicioSesion", nombreUsuario);

lblNombreUsuario.textContent = "Nombre de Usuario: " + nombreUsuario

socket.on('mensaje', function(mensaje) {
    var li = document.createElement("li");
    li.innerHTML = mensaje;
    ulMensajes.appendChild(li)
    audioAlert.play()
});

socket.on('inicioSesion', function(mensaje) {

    ulUsuarios.innerHTML = ""

    var usuarios = JSON.parse(mensaje)

    usuarios.forEach(usuario => {
        var li = document.createElement("li");
        li.innerHTML = usuario;
        ulUsuarios.appendChild(li)
    });
});

socket.on('cerrarSesion', function(mensaje) {
    ulUsuarios.innerHTML = ""

    var usuarios = JSON.parse(mensaje)

    usuarios.forEach(usuario => {
        var li = document.createElement("li");
        li.innerHTML = usuario;
        ulUsuarios.appendChild(li)
    });
});

form.addEventListener("submit", function(e) {
    e.preventDefault()

    socket.emit("mensaje", new Date().toLocaleString("es-ES") + " - " + "<span style='color:blue;'>" + nombreUsuario + "</span>: " + txtMensaje.value);
    txtMensaje.value = ""

    return false;
}, false);

function cerrarSesion() {
    socket.emit("cerrarSesion", nombreUsuario);
}