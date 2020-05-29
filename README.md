**This is a fork of [`homebridge-http-lock-mechanism`](https://github.com/Tommrodrigues/homebridge-http-lock-mechanism) specifically for integrating the switch functionality on the 2N Helios intercom.**

## Configuration

```javascript
"accessories": [
     {
       "accessory": "HTTPLock",
       "name": "Lock",
       "intercomUrl": "http://192.168.0.200", // URL of the 2N Helios intercom
       "username": "admin", // HTTP API account username
       "password": "password", // HTTP API account password
       "pollInterval": 1 // how frequently (in seconds) to poll for switch status
     }
]
```

- Requires 2N intercom with "Enhanced Integration" license for HTTP API access
- Requires "Switch API" authentication configured to "Basic"
- Enable "HTTP API" account with access to "Switch Access"
