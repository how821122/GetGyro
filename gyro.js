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
     var time=(obj.minutes*60000)+ (obj.seconds*1000)+ obj.msec ;
     var data=[ obj.accelerationX,obj.accelerationY,obj.accelerationZ,obj.alpha,obj.beta,obj.gamma,obj.year,obj.month,obj.date,obj.hours,obj.minutes,obj.sec,obj.msec,obj.CollectionName];

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
           minutes:data[10],
           sec:data[11],
           msec:data[12],
           CollectionName:data[13]
      };
//use the Mongodb

    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      //console.log("Connected successfully to server");

      const db = client.db(dbName);

      var inp_colName = "Gait_"+data[13];//-----------------------------------------------------------------------------------------

      const col_input =  db.collection(inp_colName);
//insert data
      col_input.insert(file,function(err,result){
        assert.equal(err,null);
        console.log("data is inserting");
        client.close();
      });
 
    });

 });
 

//alert system

 socket.on('result', function(CollectionName){

  setInterval(function(){
    
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      //console.log("Connected successfully to server");
      const db = client.db(dbName);

      var otp_colName = "Fall_"+CollectionName;//-----------------------------------------------------------------------------------------

      const col_output =  db.collection(otp_colName);

      col_output.find({}).sort({_id:-1}).limit(1).toArray(function(err, results){ 
         
         var sortdata = results[0].flag; //the flag name is flag
          //console.log(sortdata);
         socket.emit('message',{'data':sortdata});
         client.close();
       });
    });
  },1000);//per 1s
});

//------------------------------------------------------------
  //disconnect
  socket.on('disconnect', function(){
      console.log('Disconnected');
  });
});

 
http.listen(port, function(){
  console.log('listening on *:' + port);
});









 