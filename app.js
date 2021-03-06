// web server library
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');
const path = require('path');

const SERVER_PORT = 3000;

const publicPathDirectory = path.join(__dirname, '/public');

// Arduino Library
const five = require('johnny-five');
const board = new five.Board();

app.use(bodyParser.urlencoded({extended: true }));
app.use(express.json());

app.use(express.static(publicPathDirectory));
//
// app.get('/', (req, res) => {
//   res.sendFile('index.html');
// });

app.use((req, res) => {
  res.status(404).json({
    message: 'Resource not found'
  });
});

io.on('connection', (socket) => {
  console.log('Connection has been established with browser.');
  socket.on('disconnect', () => {
    console.log('Browser client disconnected from the connection.');
  });
});

// dweetio.listen_for(dweetThing, (dweet) => {
//   const data = {
//     sensorData: dweet.content,
//     time: moment().format('HH:mm:ss')
//   };
//   io.emit('sensor-data', data);
// });

http.listen(process.env.PORT || SERVER_PORT, () => {
  console.log(`Server started on the http://localhost:${SERVER_PORT}`);
});

board.on('ready', () => {
  const pulseSensor = new five.Sensor({
    pin: 'A0',
    freq: 10
    // threshold: 4
  });

  pulseSensor.scale([0.100]).on('change', function(value) {
      // console.log(value)
      const data = {
        sensorData: value,
        time: moment().format('HH:mm:ss')
      };
      io.emit('pulse-data', data)
  });

});