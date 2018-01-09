var app = require('express')();
var fs= require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
 
const url = 'mongodb://localhost:27017';
const dbName = 'test';


app.get('/', function(req, res){
  res.sendFile(__dirname + '/gyro.html');
});


io.on('connection', function(socket){ 
  console.log("Connecting.....");
    

// use socket.io to get data from device
  socket.on('device', function(obj){

  //build data
     var time=(obj.minutes*100000)+ (obj.seconds*1000)+ obj.msec ;
     var data=[obj.accelerationX,obj.accelerationY,obj.accelerationZ,obj.alpha,obj.beta,obj.gamma,obj.year,obj.month,obj.date,obj.hours,time];

     var file = {
           accelerationX:data[0],
           accelerationY:data[1],
           accelerationZ:data[2],

           alpha:data[3],
           beta:data[4],
           gamma:data[5],


           year:data[6],
           month:data[7],
           date:data[8],
           hours:data[9],
           sec:data[10] 
      };

    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      const db = client.db(dbName);

      insertDocuments(db,function() {
        client.close();
      });
    });

    const insertDocuments = function(db,callback){
      const collection = db.collection('gait');
      
      collection.insert(file,function(err,result){
        assert.equal(err,null);
        console.log("資料已新增");
        callback(result);
      });
    }

  });
  //disconnect
    socket.on('disconnect', function(){
      console.log('Disconnected');
  });
});

 
http.listen(port, function(){
  console.log('listening on *:' + port);
});










