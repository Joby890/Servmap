var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var port = process.env.PORT || 3000;
var mongourl = process.env.MONGOLAB_URI || "localhost";

var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect(mongourl, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + mongourl + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + mongourl);
  }
});
var Share = require('./share');
var ObjectId = mongoose.Types.ObjectId;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Serve webpage
app.use(express.static(path.resolve(__dirname +"/../client")));
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname +"/../client/index.html"));
});

app.get("/getImages", function(req, res) {
  fs.readdir("client/assests", function(err,data) {
    for(var i = 0; i < data.length; i++) {
      if(fs.lstatSync("client/assests/"+data[i]).isDirectory()) {
        data.splice(i,1);
      }
    }
    res.send(data);
  });
});

app.post('/share', function(req, res) {
  var id = req.body.id || genID();
  //try to find one at id;
  Share.findOne({"id": req.body.id}, function(err, result) {
    var shared;
    //Check to see if we find one
    if(result) {
      //Update
      shared = result;
    } else {
      //Create a new one
      shared = new Share();
    }
    shared.net = req.body.net;
    shared.id = id;
    console.log(shared.id);
    shared.save().then(function(result) {
      res.send({id: result.id});
    });

  });

});
app.post('/get', function(req, res) {
  Share.findOne({"id": req.body.id}, function(err, result) {
    if(err) {
      console.log(err);
    }
    res.send(result.net);
  });
});

app.get('/*', function(req, res) {
  res.sendFile(path.resolve(__dirname +"/../client/index.html"));
});

app.listen(port, function() {
  console.log('listening on port ' + port);
});


function genID() {
  return "xxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, function(char) {
    var keys = "abcdefghijklmnopqrstuvwxyz1234567890";
    return char === "x" ? keys[Math.floor(Math.random() * keys.length)] : char;
  });

}
