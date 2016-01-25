var images = [];
window.resizeSidebarImages = function() {
  for(var i = 0; i < images.length; i++) {
    var current = images[i];
    current.attr("x", window.innerWidth - 75);
  }
};

var defaultClick = function(image) {
  loadDevice({
    id: guid(),
    image: image,
    pos: {x: window.innerWidth / 2, y: window.innerHeight / 2},
    name: prompt("What is the name?"),
    loadType: "Device",
  });
};




$.ajax({
  url: "/getImages"
}).then(function(data) {
  for(var i = 0; i < data.length; i++) {
    add(data[i], i, defaultClick);
  }
  add("links/link.png",data.length, function(image) {
    addDevice(new LinkHost(guid(), prompt("What is it name?"), {x: window.innerWidth / 2, y: window.innerHeight / 2}))
  });
});



function add(image, x, clickcb) {
 var added =  svg.selectAll("img").data([this.id]).enter().append("svg:image").attr("xlink:href", "assests/"+image)
    .attr('class', "id"+this.id)
    .attr("width", 50)
    .attr("height", 50)
    .attr("x", window.innerWidth - 75)
    .attr('y', 0 + (x * 50))
    .on('click', function() {
      clickcb(image);
    });
  images.push(added);
}
