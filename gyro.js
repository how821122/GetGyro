var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/gyro.html');
});


io.on('connection', function(socket){	
	console.log("Connecting.....");
    
    socket.on('device', function(obj){
     console.log("accelerationX:"+ obj.accelerationX+"  accelerationY:"+obj.accelerationY+"  accelerationZ:"+obj.accelerationZ);
     console.log("alpha:"+ obj.alpha+"  beta:"+obj.beta+"  gamma:"+obj.gamma);
     console.log("==================================================================================");

  });

    socket.on('disconnect', function(){
    console.log('Disconnected');
  });
});

 
http.listen(port, function(){
  console.log('listening on *:' + port);
});