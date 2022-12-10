# homebridge-2n-4MR
 Homebridge plugin for controlling 2N Intercom switches to open gates/doors and push notification
 
- Adds a Homekit lock mechanism
  - Unlock - switch state on
  - Lock - switch state off
- Requires 2N intercom with "Enhanced Integration" license for HTTP API access
- Requires "Switch API" authentication configured to "Basic" (username/password access)
- Create and enable "HTTP API" account with "control" user priviledges to "Switch Access"

## Install

```
npm i -g homebridge-2n-4MR@latest
```

## Homebridge config

```javascript
    "platforms": [
        {
            "platform": "2N-4MR",
            "name": "Intercom switch",
            "intercomHost": "http://192.168.1.3", // set to the IP of your 2N intercom
            "username": "admin", // HTTP API account username
            "password": "password", // HTTP API account password
            "httpPort": 9010 // HTTP web server port to receive switch-on/off commands from the 2N intercom
        }
```

## HTTP listening server
This plugin uses a HTTP listening web server to receive switch on/off commands from 2N Intercom to update the switch status immediately. (It does not poll for status)

In the 2N intercom web UI, go to `Hardware` > `Switches` > expand `HTTP Commands`.

Set the "Switch-On Command" to `http://[homebridge_ip]:[config_httpPort]/on`
Set the "Switch-Off Command" to `http://[homebridge_ip]:[config_httpPort]/off`
