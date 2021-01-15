var form = document.getElementById("form");
var txtMensaje = document.getElementById("txtMensaje");
var ulMensajes = document.getElementById("ulMensajes");
var ulUsuarios = document.getElementById("ulUsuarios");
var lblNombreUsuario = document.getElementById("lblNombreUsuario");
var socket = io.connect("localhost:3000");
var nombreUsuario = "";

// ulMensajes.appendChild("<li>Chat Iniciado</li>");

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
  li.innerHTML = mensaje;
  ulMensajes.appendChild(li);
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
    li.innerHTML = usuario;
    ulUsuarios.appendChild(li).autocapitalize;
  });
});

form.addEventListener(
  "submit",
  function (e) {
    e.preventDefault();

    socket.emit(
      "mensaje",
      new Date().toLocaleString("es-ES") +
        " - " +
        "<span style='color:blue;'>" +
        nombreUsuario +
        "</span>: " +
        txtMensaje.value
    );
    txtMensaje.value = "";

    return false;
  },
  false
);

function cerrarSesion() {
  socket.emit("cerrarSesion", nombreUsuario);
}
