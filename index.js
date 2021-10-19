var Service, Characteristic;
const packageJson = require("./package.json");
const request = require("request");

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory(
    "homebridge-2n-helios-switch",
    "HeliosSwitch",
    HeliosSwitch
  );
};

function HeliosSwitch(log, config) {
  this.log = log;

  this.name = config.name;
  this.intercomUrl = config.intercomUrl;
  this.switchId = config.switchId || 1;

  this.manufacturer = config.manufacturer || packageJson.author.name;
  this.serial = config.serial || this.intercomUrl;
  this.model = config.model || packageJson.name;
  this.firmware = config.firmware || packageJson.version;

  this.username = config.username || null;
  this.password = config.password || null;
  this.timeout = config.timeout || 5000;

  this.pollInterval = config.pollInterval || 120;

  if (this.username != null && this.password != null) {
    this.auth = {
      user: this.username,
      pass: this.password,
    };
  }

  this.service = new Service.LockMechanism(this.name);
}

HeliosSwitch.prototype = {
  identify: function (callback) {
    this.log("Identify requested!");
    callback();
  },

  _httpRequest: function (url, body, method, callback) {
    request(
      {
        url: url,
        body: body,
        method: method,
        timeout: this.timeout,
        rejectUnauthorized: false,
        auth: this.auth,
      },
      function (error, response, body) {
        callback(error, response, body);
      }
    );
  },

  _getStatus: function (callback) {
    var url = this.intercomUrl + "/api/switch/status?switch=" + this.switchId;
    this.log.debug("Getting status: %s", url);

    this._httpRequest(
      url,
      "",
      "GET",
      function (error, response, responseBody) {
        if (error) {
          this.log.warn("Error getting status: %s", error.message);
          this.service
            .getCharacteristic(Characteristic.LockCurrentState)
            .updateValue(new Error("Polling failed"));
          callback(error);
        } else {
          this.log.debug("Device response: %s", responseBody);
          var json = JSON.parse(responseBody);
          var switchActive = json.result.switches[0].active ? 0 : 1; // active=true is unlocked, 0=open, 1=closed
          this.service
            .getCharacteristic(Characteristic.LockCurrentState)
            .updateValue(switchActive);
          this.service
            .getCharacteristic(Characteristic.LockTargetState)
            .updateValue(switchActive);
          this.log.debug("Updated state to: %s", switchActive);
          callback();
        }
      }.bind(this)
    );
  },

  setLockTargetState: function (value, callback) {
    var url =
      this.intercomUrl +
      "/api/switch/ctrl?switch=" +
      this.switchId +
      "&action=" +
      (value === 0 ? "on" : "off"); // 0=open, 1=closed
    this.log.debug("Setting state: %s", url);

    this._httpRequest(
      url,
      "",
      "GET",
      function (error, response, responseBody) {
        if (error) {
          this.log.warn("Error setting state: %s", error.message);
          callback(error);
        } else {
          this.log("Set state to %s", value);
          this.service
            .getCharacteristic(Characteristic.LockCurrentState)
            .updateValue(value);
          callback();
        }
      }.bind(this)
    );
  },

  getServices: function () {
    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial)
      .setCharacteristic(Characteristic.FirmwareRevision, this.firmware);

    this.service
      .getCharacteristic(Characteristic.LockTargetState)
      .on("set", this.setLockTargetState.bind(this));

    // update status initially
    this._getStatus(function () {});

    // update estatus on poll interval
    if (this.pollInterval > 0) {
      setInterval(
        function () {
          this._getStatus(function () {});
        }.bind(this),
        this.pollInterval * 1000
      );
    }

    return [this.informationService, this.service];
  },
};
