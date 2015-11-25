'use strict'
class Http extends Service {
  constructor(device) {
    super("http", device);
    this.fields.port = 80;
    this.fields.username = 'admin';
    this.fields.password = 'password';
    //this.d3Render = {type: "text", value: "test"}
  }
  launch() {
    window.location.href = "http://" + this.get().ip + ":" + this.fields.port;
  }
}
serviceManager.add("http", Http);