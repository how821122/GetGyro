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
      
   // var time =[date,hour,min,sec,millsec];
     
     var time=obj.year+"年"+obj.month+"月"+obj.date+"日"+obj.hours+"點"+obj.minutes+"分"+obj.seconds+"秒"+obj.msec+"毫秒";
     


     var data=[obj.accelerationX,obj.accelerationY,obj.accelerationZ,obj.alpha,obj.beta,obj.gamma,time];



     var file = Convertjson(data);
    
     var jsonText = JSON.stringify(file,","," ");//only first data
     /* 
     console.log(jsonText);
  */  
     fs.appendFile("./result/_result_"+obj.year+"y"+obj.month+"m"+obj.date+"d"+obj.hours+"h"+obj.minutes+"m"+".json",jsonText);
     console.log(jsonText);

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
        time:Array[6]
    }
  }
   return file ;
}

