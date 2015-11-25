var settings = require('./setting');
//var db = require('./db');
var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
// //looking for server unit
// app.get('*/unit/*',function(req, res) {
//   res.send('found Unit')
// });

// //looking for entire cabinet of data
// app.get('/*', function(req, res) {
//   res.send('returing cabinet')
// });

//Serve webpage
app.use(express.static(path.resolve(__dirname +"/../client")))
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname +"/../client/index.html"))
})

app.get("/getImages", function(req, res) {
  fs.readdir("client/assests", function(err,data) {
    for(var i = 0; i < data.length; i++) {
      if(fs.lstatSync("client/assests/"+data[i]).isDirectory()) {
        data.splice(i,1);
      }
    }
    res.send(data);
  })
})
app.get('', function(req, res) {
  res.send('serving webpage')
})

app.listen(settings.port, function() {
  console.log('listening on port ' + settings.port)
});