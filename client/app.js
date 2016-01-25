// Set up of SVG
var viewerWidth = $(document).width() - 25;
var viewerHeight = $(document).height() - 60;

window.onresize  = function() {
  var viewerWidth = $(document).width() - 25;
  var viewerHeight = $(document).height() - 60;
  svg.attr("width", viewerWidth).attr("heigh", viewerHeight);
  resizeSidebarImages();
};

$(".infomation").hide();

var zoom = d3.behavior.zoom()
  .scaleExtent([0.1, 10])
  .on("zoom", zoomed);
function zoomed() {
  baseSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
svg = d3.select("#vdisplay").append("svg")
  .attr("width", viewerWidth)
  .attr("height", viewerHeight)
  .attr("class", "overlay")
  .call(zoom);
baseSvg = svg.append("g");

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
    });
  }
}

function updateApp() {
  drawConnections(self);
  for(var key in devices) {
    devices[key].update();
  }
}

function loadDevices(json) {
  console.log("Loading...");
  var load = JSON.parse(json);
  for(var key in load) {
    loadDevice(load[key]);
  }
  console.log("Loaded.");
}
function loadDevice(obj) {
  var objtype = this[obj.loadType].load;

  addDevice(objtype(obj));
}
console.log(window.location);
if(window.location.pathname === "/") {
  loadDevices(window.localStorage.getItem("data"));
  updateApp();
} else {
  var id = window.location.pathname.substring(1, window.location.pathname.length);
  getRemoteMap(id).then(function(result) {
    loadDevices(result);
    updateApp();
  });
}

function getRemoteMap(id) {
  var dfd = new $.Deferred();
  $.ajax({
    url: "/get",
    method: "post",
    data: {id: id},
  }).then(function(result) {
    dfd.resolve(result);
  });
  return dfd.promise();
}



$(this).ready(function() {
  $("#save").on("click", function() {
    console.log("saving...");
    var save = {};
    for(var key in devices) {
      if(devices[key].shouldSave()) {
        save[key] = devices[key].save({});
      }
    }
    window.localStorage.setItem("data", JSON.stringify(save));
    console.log("Saved.");
  });
  $("#share").on("click", function() {
    console.log("sharing...");
    var save = {};
    for(var key in devices) {
      if(devices[key].shouldSave()) {
        save[key] = devices[key].save({});
      }
    }
    var id = window.location.pathname.substring(1, window.location.pathname.length);
    $.ajax({
      url: "/share",
      method: "post",
      data: {net: JSON.stringify(save), id: id},
    }).then(function(result) {
      alert("Shared at: " + result.id);
      console.log("Shared at: " + result.id);
    });
    console.log("Sharing.");
  });

  $("#connection").on("click", function() {
    $(this).text("Adding");
    connecting = 'start';
  });
  $("#delete").on('click', function() {
    deleting = true;
  });

});
