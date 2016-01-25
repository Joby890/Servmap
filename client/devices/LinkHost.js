'use strict';
class LinkHost extends Device {
  constructor(id, name, pos, connections, services, type, port) {
    super(id, name, null, pos, "links/link.png", null, null);
    this.type = type || "Client";
    this.port = port || 1;
    var self = this;
    if(this.type !== "Client") {
      console.log("Loading new map from link!!!");
      getRemoteMap(this.type).then(function(result) {
        result = JSON.parse(result);
        var offset;
        _.each(result, function(obj) {
          //Check if we have a link to a clinet port
          if(obj.type === "Client" && obj.port === self.port) {
            //We need to get a new positions for all items mapped to the links
            offset = {x: self.pos.x - obj.pos.x, y: self.pos.y - obj.pos.y};
            console.log(offset);
          }
        });
        _.each(result, function(obj) {
          var objtype = window[obj.loadType].load;
          obj.pos.x = obj.pos.x + offset.x;
          obj.pos.y = obj.pos.y + offset.y;
          var instance = objtype(obj);
          instance.tosave = false;
          addDevice(instance);
        });
        updateApp();
      });
    }
  }

  save(obj) {
    super.save(obj);
    obj.type = this.type;
    obj.port = this.port;
    return obj;
  }


}


window.LinkHost = LinkHost;
LinkHost.load = function(data) {
  return new LinkHost(data.id, data.name, data.pos, data.connections, data.services, data.type, data.port);
};
