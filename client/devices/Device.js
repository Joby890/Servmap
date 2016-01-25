'use strict'
class Device {
  constructor(id, name, ip, pos, image, connections, services) {
    this.id = id;
    this.name = name;
    this.ip = ip;
    this.pos = pos;
    this.setupD3(image);
    this.connections = connections || [];
    this.info = null;
    this.image = image;
    this.services = {};
    this.tosave = true;
    for(var key in services) {
      this.services[key] = serviceManager.get(key, this);
      this.services[key].fields = services[key].fields;
    }

  }


  setupD3(image) {
    var self = this;
    var drag = d3.behavior.drag()
      .on("dragstart", function(event) {
        d3.event.sourceEvent.stopPropagation();
      })
      .on('drag', function(event) {
      self.pos.x += d3.event.dx;
      self.pos.y += d3.event.dy;
      d3.select(".id"+self.id).attr("x", self.pos.x);
      d3.select(".id"+self.id).attr("y", self.pos.y);
      updateApp();

    });

    baseSvg.selectAll("img").data([this.id]).enter().append("svg:image").attr("xlink:href", "assests/"+image)
    .attr('class', "id"+this.id)
    .attr("width", 50)
    .attr("height", 50)
    .attr("x", this.pos.x)
    .attr('y', this.pos.y)
    .on('dblclick', function(e) {
      d3.event.stopPropagation();
      self.openInfomation();
    })

    //Handle Adding Connections and removing devices
    .on('click', function() {
      //For adding connections to other systems
      if(connecting === 'start') {
        connecting = self.id;
      } else if(connecting !== 'start' && connecting !== 'stop') {
        self.connections.push(connecting);
        devices[connecting].connections.push(self.id);
        connecting = 'stop';
        $('#connection').text("Add Connection")
        updateApp();
      }
      //To delete
      if(deleting) {
        deleting = false;
        d3.select(".id" + self.id).remove();
        devices[self.id] = null;
        delete devices[self.id];
        if(self.info) {
          self.info.remove();
        }
        updateApp();
      }
    })
    .call(drag);

  }

  openInfomation() {
    var self = this;
    var current = self.save({});
    var infomation = $(".infomation");
    infomation.attr("id", this.id)
    infomation.show();
    infomation.children().empty();
    for(var key in current) {
      console.log(key)
      if(typeof current[key] === "string" || typeof current[key] === "number" || current[key] === undefined) {
        var div = $('<div class="">'+key+'<input type="text" class="'+key+'"></div>');
        infomation.append(div)
        $("."+key).val(current[key]);
      }
    }
    for(var x in self.services) {
      var service = self.services[x];
      window.launch = function(div) {
        var sericeId = $($(div).parent()[0]).attr('id');
        self.services[sericeId].launch();

      }
      var div = $('<div class="infomation-inner" id="'+service.id+'">'+service.id+' <input type="button" onclick="launch(this)" value="'+service.buttonLabel+'"></input></div>')
      var jdiv = $(div);
      for(var key in service.fields) {
        var inner = $("<div class='child-right'> "+key+" <input id='"+key+"'value='"+service.fields[key]+"'> </div>");
        jdiv.append(inner);
      }
      jdiv.append('<input type="button" onclick="removeMe(this)" value="Remove"></input>')
      window.removeMe = function(div) {
        var sericeId = $($(div).parent()[0]).attr('id');
        delete self.services[sericeId];
        infomation.empty();
        self.openInfomation();
      }
      infomation.append(div);
    }
    infomation.append($("<button id='add'> Add </button>"))
    $("#add").on('click', function() {
      showAddServices(self)
    });
    infomation.append($("<button id='save'> Save </button>"))
    $("#save").on('click', function() {
      for(var i = 0; i < infomation.children().length; i++) {
        var div = $(infomation.children()[i]);
        if(div.children().length === 1) {
          var item = $(div.children()[0]);
          self[item.attr('class')] = item.val();
        } else {
          var id = div.attr('id');
          if(self.services[id] !== undefined) {
            for(var key = 0; key < div.children().length; key++) {
              var theDiv = $(div.children()[key]).children()[0];
              if(theDiv !== undefined) {
                theDiv = $(theDiv);

                self.services[id].fields[theDiv.attr('id')] = $(theDiv).val();
              }
            }
          }
        }
      }
      infomation.empty();
      infomation.hide();
    });
  }

  update() {


    if(this.info) {
      this.info.remove();
    }
    var text = [];
    _.each(this.services, function(service) {
      text.push(service.d3Render);
    });
    this.info = baseSvg.append("g")
    .attr("x",this.pos.x)
    .attr("y", this.pos.y)
    .style("visibility", function(d) {
      return this.group ? "hidden" : "visible";
    });
    this.info.append("text").attr('fill', 'black').html(this.name)
    .attr("x",this.pos.x)
    .attr("y", this.pos.y)
    .style("visibility", function(d) {
      return this.group ? "hidden" : "visible";
    });;
    var self = this;
    for(var i = 0; i < text.length; i++) {
      var current = text[i];
      if(current.type === "image") {
        self.info.append("svg:image").attr("xlink:href",current.value)
          .attr("top", 0)
          .attr("x", self.pos.x + (i * 10))
          .attr("y", self.pos.y + 50)
          .attr("width", current.width)
          .attr("height", current.height)
          .style("visibility", function(d) {
            return self.group ? "hidden" : "visible";
          });
      } else if(current.type) {
        self.info.append(current.type).text(current.value)
        .attr("top", 0)
        .attr("x",self.pos.x + (i * 10))
        .attr("y", self.pos.y + 60)
        .style("visibility", function(d) {
          return self.group ? "hidden" : "visible";
        });

      }
    }


  }


  shouldSave() {
    return this.tosave;
  }

  save(obj) {
    obj.id = this.id;
    obj.pos = this.pos;
    obj.name = this.name;
    obj.connections = this.connections;
    obj.image = this.image;
    obj.ip = this.ip;
    console.log(this.constructor.name);
    obj.loadType = this.constructor.name;
    obj.services = this.services;
    return obj;
  }

}

function showAddServices(device) {
  var list = serviceManager.services;
  var div = $("<div></div>");
  for(var key in list) {
    var inner = $("<button class='"+key+"' > " + key + "</button>")
    div.append(inner)
  }

  $(".infomation").append(div);

  for(var key in list) {
    (function (newKey) {
      $("."+newKey).on("click", function() {
        device.services[newKey] = serviceManager.get(newKey, device);
        div.empty();
        $(".infomation").empty();
        device.openInfomation();

      });
    })(key);


  }


}

window.Device = Device;

Device.load = function(obj) {
  return new Device(obj.id, obj.name, obj.ip, obj.pos, obj.image,  obj.connections, obj.services);
};
