'use strict'

class ServiceManager {

  constructor() {
    this.services = {};
  }

  add(name, service) {
    this.services[name] = service;
  }

  get(id, device) {
    if(!this.services[id]) {
      return {};
    }
    var service = new this.services[id](device);
    setTimeout(service.start.bind(service))
    return service;
  }

}


class Service {
  constructor(id, device) {
    this.get = function() {
      return device;
    }
    this.id = id;
    this.buttonLabel = "Lanuch";
    this.fields = {};
    this.d3Render = {};
  }
  launch() {
  }

  start() {
  }

  setField(name, value) {
    var div = $("#"+this.get().id);
    div = div.find("#"+this.id);
    $(div.find("#"+name)[0]).val(value);
  }

  end() {

  }
}
