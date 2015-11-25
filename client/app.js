// Set up of SVG
var viewerWidth = $(document).width() - 25;
var viewerHeight = $(document).height() - 60;

window.onresize  = function() {
  var viewerWidth = $(document).width() - 25;
  var viewerHeight = $(document).height() - 60;
  svg.attr("width", viewerWidth).attr("heigh", viewerHeight);
  resizeSidebarImages();
}

$(".infomation").hide();

var zoom = d3.behavior.zoom()
  .scaleExtent([.1, 10])
  .on("zoom", zoomed);
function zoomed() {
  baseSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
svg = d3.select("#vdisplay").append("svg")
  .attr("width", viewerWidth)
  .attr("height", viewerHeight)
  .attr("class", "overlay")
  .call(zoom)
baseSvg = svg.append("g")

devices = {};
connecting = 'stop';
deleting = false;
function addDevice(device) {
  devices[device.id] = device;
  drawConnections();
}
var lines = baseSvg.append("g");
function drawConnections() {
  lines.selectAll("line").remove();
  for(var key in devices) {
    var d = devices[key];
    d.connections.forEach(function(c) {
      if(devices[c]) {
        lines.append("svg:line")
        .attr("x1", d.pos.x + 25)
        .attr("y1", d.pos.y + 25)
        .attr("x2", devices[c].pos.x + 25)
        .attr("y2", devices[c].pos.y + 25)
        .style("stroke", "rgb(0,0,0)");
      }
    })
  }
}

function updateApp() {
  drawConnections(self);
  for(var key in devices) {
    devices[key].update();
  }
}

function loadDevices() {
  console.log("Loading...")
  var load = JSON.parse(window.localStorage.getItem("data"));
  for(var key in load) {

    loadDevice(load[key]);
  }
  console.log("Loaded.")
}
function loadDevice(obj) {
  var func = this[obj.type];
  addDevice(new Device(obj.id, obj.name, obj.ip, obj.pos, obj.image,  obj.connections, obj.services))
}
loadDevices();
updateApp();
$(this).ready(function() {
  $("#save").on("click", function() {
    console.log("saving...")
    var save = {};
    for(var key in devices) {
      save[key] = devices[key].save({});
    }
    window.localStorage.setItem("data", JSON.stringify(save))
    console.log("Saved.")
  });
  $("#connection").on("click", function() {
    $(this).text("Adding")
    connecting = 'start'
  })
  $("#delete").on('click', function() {
    deleting = true;
  });
  
})




