var app = require('express')();
var fs= require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;



app.get('/', function(req, res){
  res.sendFile(__dirname + '/gyro.html');
});


io.on('connection', function(socket){	
	console.log("Connecting.....");
    
    socket.on('device', function(obj){
      
     var data=[obj.accelerationX,obj.accelerationY,obj.accelerationZ,obj.alpha,obj.beta,obj.gamma];

     var file = Convertjson(data);
     var jsonText = JSON.stringify(file[1]," "," ");//only first data
      
     console.log(jsonText);
     fs.appendFile("./result/_result_.json",jsonText);

  });

    socket.on('disconnect', function(){
    console.log('Disconnected');
  });
});

 


http.listen(port, function(){
  console.log('listening on *:' + port);
});

//-----------------------sub function------------------------------------------------------

 
function Convertjson(Array){

  var file =[];
  for(var k=0;k<Array.length;k++){
    file[k]={
        accelerationX:Array[0],
        accelerationY:Array[1],
        accelerationZ:Array[2],
        alpha:Array[3],
        beta:Array[4],
        gamma:Array[5],
    }
  }
   return file ;
}

