var http = require("http");
var fs = require("fs");
var index = fs.readFileSync("index.html");

const { pipeline } = require("serialport");
let SerialPort = require("serialport");

const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
  delimiter: "\r\n",
});

const portName = "COM9";
let myPort = new SerialPort(portName, {
  buadRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

myPort.pipe(parser);

var app = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(index);
});

var io = require("socket.io")(app);

io.on("connection", function (socket) {
  socket.on("output", function (data) {
    console.log(data);
    myPort.write(data.pedalConfig);
  });
});

app.listen(3000);
