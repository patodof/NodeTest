//Incluir Modulos a Utilizar
var express = require('express');  

//inicializamos express y el servidor
var app = express();  
var server = require('http').createServer(app);  

//inicializamos socket.io y la asociamos al servidor 
var io = require('socket.io').listen(server);  

users = [] ; 
connections  = [] ; 

//Parametros de configuracion del servidor
var ip_server = '192.168.0.4'; 
//var ip_server = 'localhost'; 
var port = 8080 ; 

//Servir Direcciones Web
app.get('/', function(req, res){
	res.sendFile(__dirname+'/html/index.html'); 
})
app.get('/GamePad', function(req, res){
	res.sendFile(__dirname+'/html/GamePad.html'); 
})
//servir archivos static
app.use(express.static('public'));

//Eventos Conneccion de socket
io.sockets.on('connection', function(socket){
	console.log("ID Socket ");
	console.log(socket.id);
	connections.push(socket); 
	console.log("Connected : %s sockets ", connections.length ); 

	//desconneccion del socket
	socket.on('disconnect', function(data){
		connections.splice(connections.indexOf(socket), 1 ); 
		console.log("Disconnect : %s sockets online", connections.length ); 
		io.sockets.emit('PlayerDisconnect', {
			id : socket.id,
		}); 
	}); 

	//Movimiento del Input
	socket.on('PlayerJoystickMove', function(dataReq){
		console.log("Input Recibido type ->");
		console.log(dataReq);   
		io.sockets.emit('MovePlayer', { req : dataReq }) ;
	}); 
	socket.on('PlayerButtonA', function(data){
		console.log("Player Button A ->");
		io.sockets.emit('ButtonA') ;
	}); 
	socket.on('PlayerSetName', function(data){
		console.log("New Player "+data.nombre+" id->"+data.id);
		io.sockets.emit('NewPlayer', {nombre : data.nombre, id : data.id}) ;
	}); 

})

server.listen(port, ip_server, function(){
	console.log("El servidor esta en ejecucion en el puerto "+ip_server+":"+port); 
})
