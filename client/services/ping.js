'use strict'
class Ping extends Service {
  constructor(device) {
    super("ping", device);
    this.url = "http://10.0.0.41"
    this.fields.status = "Pending";
    this.d3Render = {type: "image", value: "assests/status/yellow.png", width: 20, height: 20}
  }
  launch() {
    window.location.href = this.url;
  }

  start() {
    console.log(this)
    var self = this;
    setInterval(function() {
      $.ajax({
        url: self.url + "/status/" + self.get().ip,

      }).then(function(data) {
        if(data.error) {
          self.setField("status", data.error);
          self.d3Render.value = "assests/status/red.png"
        } else { 
          self.setField("status", data.status.message);
          self.d3Render.value = "assests/status/green.png"
        }
        updateApp();
      })
    }, 10000);
  }
}
serviceManager.add("ping", Ping);