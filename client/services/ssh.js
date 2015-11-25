'use strict'
class Ssh extends Service {
  constructor(device) {
    super("ssh", device);
    this.fields.port = 22;
    this.fields.username = 'admin';
    this.fields.password = 'password';
  }
  launch() {
    window.location.href = "ssh://" + this.get().ip + ":" + this.fields.port;
  }
}
serviceManager.add("ssh", Ssh);