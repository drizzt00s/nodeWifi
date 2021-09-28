const net =require('net');
/*
tcp import
 */

var wifi = require('node-wifi');

// Initialize wifi module
// Absolutely necessary even to set interface to null
wifi.init({
    iface: null // network interface, choose a random wifi interface if set to null
});
// Scan networks
wifi.scan((error, networks) => {
    if (error) {
        console.log(error);
    } else {
        // console.log('networks:');
        // console.log(JSON.stringify(networks));
        //these are all wifi connections which can be used.
        /*
            networks = [
                {
                  ssid: '...',
                  bssid: '...',
                  mac: '...', // equals to bssid (for retrocompatibility)
                  channel: <number>,
                  frequency: <number>, // in MHz
                  signal_level: <number>, // in dB
                  quality: <number>, // same as signal level but in %
                  security: 'WPA WPA2' // format depending on locale for open networks in Windows
                  security_flags: '...' // encryption protocols (format currently depending of the OS)
                  mode: '...' // network mode like Infra (format currently depending of the OS)
                },
                ...
            ];
            */
    }
});

// Connect to a network
wifi.connect({ ssid: 'mu hai', password: 'muhai0914' }, error => {
    if (error) {
        console.log(error);
    }
    console.log('Connected');
});

// Disconnect from a network
// not available on all os for now
// wifi.disconnect(error => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Disconnected');
//     }
// });

// Delete a saved network
// not available on all os for now
//     wifi.deleteConnection({ ssid: 'ssid' }, error => {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Deleted');
//         }
//     });

// List the current wifi connections
wifi.getCurrentConnections((error, currentConnections) => {
    if (error) {
        console.log(error);
    } else {
        // console.log('currentConnections:' + currentConnections);
        // console.log(currentConnections);
        // which wifi connection now being used.
        /*
        // you may have several connections
        [
            {
                iface: '...', // network interface used for the connection, not available on macOS
                ssid: '...',
                bssid: '...',
                mac: '...', // equals to bssid (for retrocompatibility)
                channel: <number>,
                frequency: <number>, // in MHz
                signal_level: <number>, // in dB
                quality: <number>, // same as signal level but in %
                security: '...' //
                security_flags: '...' // encryption protocols (format currently depending of the OS)
                mode: '...' // network mode like Infra (format currently depending of the OS)
            }
        ]
        */
    }
});

// All functions also return promise if there is no callback given
wifi
    .scan()
    .then(networks => {
        // networks

    })
    .catch(error => {
        // error
    });

/*
wifi
 */


const express = require('express');
const path = require("path");
const app = express();

app.set('views', [
    path.join(__dirname, 'views')
]);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const server = require('http').createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    //currently consider there is only one socket
    socket.on('handshake', function (data) {
        console.log(data.msg);
    });
    global.sTcpMsg = function (data){
        socket.emit('tcpMsg',{
            msg:data
        });
    };
});


app.get('/',function (req,res) {
    res.render('index');
});

server.listen(3000,function (){
    console.log("socket running on 3000...");
});

/*
tcp server
 */

net.createServer(function(socket){

    socket.on('data', function(data){
        console.log(data);
        data = data.toString();
        console.log(data);
        global.sTcpMsg(data);
    });
    socket.on('end', function(data){
        // console.log(data.toString());
    });
    socket.write('some string');
}).listen(4001,function () {
    console.log('tcp server running on port 4001')
});
