var form = document.getElementById("form");
var txtMensaje = document.getElementById("txtMensaje");
var ulMensajes = document.getElementById("ulMensajes");
var ulUsuarios = document.getElementById("ulUsuarios");
var lblNombreUsuario = document.getElementById("lblNombreUsuario");
var audioAlert = document.getElementById("audioAlert");
var socket = io.connect("10.7.13.169:3000");
var nombreUsuario = "";

while (nombreUsuario.trim() == "") {
  nombreUsuario = prompt("Ingrese un nombre de usuario");

  if (nombreUsuario.trim() == "") {
    alert("Debe ingresar un nombre de usuario");
  }
}

socket.emit("inicioSesion", nombreUsuario);

lblNombreUsuario.textContent = nombreUsuario;

socket.on("mensaje", function (mensaje) {
  var li = document.createElement("li");
  if (mensaje.usuario === nombreUsuario) {
    li.classList.add("message-right");
  }
  li.innerHTML = mensaje.mensaje;
  ulMensajes.appendChild(li);
  audioAlert.play();
  ulMensajes.scrollTop = ulMensajes.scrollHeight;
});

socket.on("inicioSesion", function (mensaje) {
  ulUsuarios.innerHTML = "";

  var usuarios = JSON.parse(mensaje);

  usuarios.forEach((usuario) => {
    var li = document.createElement("li");
    li.innerHTML = usuario;
    ulUsuarios.appendChild(li);
  });
});

socket.on("cerrarSesion", function (mensaje) {
  ulUsuarios.innerHTML = "";

  var usuarios = JSON.parse(mensaje);

  usuarios.forEach((usuario) => {
    var li = document.createElement("li");
    li.innerHTML = usuario.charAt(0);
    ulUsuarios.appendChild(li);
  });
});

form.addEventListener(
  "submit",
  function (e) {
    e.preventDefault();

    if (txtMensaje.value.trim().length == 0) return;
    let today = new Date();

    let mensaje = {
      mensaje: `${today.getHours()}:${today.getMinutes()} <span style='color:blue;'>${nombreUsuario}</span>: ${
        txtMensaje.value
      }`,
      usuario: nombreUsuario,
    };

    socket.emit("mensaje", mensaje);
    txtMensaje.value = "";

    return false;
  },
  false
);

function cerrarSesion() {
  socket.emit("cerrarSesion", nombreUsuario);
}
