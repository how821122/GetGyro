var app = require('express')();
var fs= require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
 
var url = 'mongodb://127.0.0.1:27017/test';


app.get('/', function(req, res){
  res.sendFile(__dirname + '/gyro.html');
});


io.on('connection', function(socket){ 
  console.log("Connecting.....");
    

// use socket.io to get data from device
    socket.on('device', function(obj){

  //build data
     var total_data=[obj.accelerationX,obj.accelerationY,obj.accelerationZ,obj.alpha,obj.beta,obj.gamma,obj.year,obj.month,obj.date,obj.hours,obj.minutes,obj.seconds,obj.msec];
     var jsonText = JSON.stringify(total_data,","," "); 
 
  //connect Mongodb    
    MongoClient.connect(url, function (err,db) { 
    assert.equal(null, err); 
    console.log("Connected correctly to server"); 
    //create a collection
    var data = db.collection("data_2"); //data、data_2
    
      var file ={
          accelerationX:total_data[0],
          accelerationY:total_data[1],
          accelerationZ:total_data[2],

          alpha:total_data[3],
          beta:total_data[4],
          gamma:total_data[5],


          year:total_data[6],
          month:total_data[7],
          date:total_data[8],
          hours:total_data[9],
          minutes:total_data[10],
          seconds:total_data[11],
          msec:total_data[12]
      };
   //insert file
    data.insert(file, function (err, doc) { 
        if (err) { 
            db.close(); 
            return console.error(err); 
        } 
        console.log("資料已新增 : " + jsonText); 
    }); 
 
    });

    /// fs.appendFile("./result/_result_"+obj.year+"y"+obj.month +1 +"m"+obj.date+"d"+obj.hours+"h"+obj.minutes+"m"+".json",jsonText);

  });
  //disconnect
    socket.on('disconnect', function(){
     console.log('Disconnected');
  });
});

 
http.listen(port, function(){
  console.log('listening on *:' + port);
});









