var express = require("express");
var app = express();
var server = require("http").Server(app);
var port = process.env.PORT || 3000;
var io = require("socket.io")(server, { origins: "*:*" });
var usuariosConectados = [];
var cors = require("cors");
app.use(cors());

app.use(express.static("public"));

app.get("/", function (req, res) {
  console.log("Server iniciado");
});

server.listen(port, function () {
  console.log("Escuchando en el puerto (socket): " + port);
});

io.on("connection", function (socket) {
  socket.on("inicioSesion", function (mensaje) {
    usuariosConectados.push(mensaje);
    io.emit("inicioSesion", JSON.stringify(usuariosConectados));
    console.log("Usuario Conectado: " + mensaje);
  });

  socket.on("cerrarSesion", function (mensaje) {
    for (contador = 0; contador < usuariosConectados.length; contador++) {
      if (usuariosConectados[contador] == mensaje) {
        console.log("Usuario Desconectado: " + usuariosConectados[contador]);
        usuariosConectados.splice(contador, 1);
        contador = usuariosConectados.length;
      }
    }

    io.emit("cerrarSesion", JSON.stringify(usuariosConectados));
  });

  socket.on("mensaje", function (mensaje) {
    io.emit("mensaje", mensaje);
  });

  socket.on("disconnect", function () {
    console.log("Usuario desconectado");
  });
});
