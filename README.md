**This is a fork of `[homebridge-http-lock-mechanism](https://github.com/Tommrodrigues/homebridge-http-lock-mechanism)` specifically for integrating the switch functionality on the 2N Helios intercom.**

## Configuration

```json
"accessories": [
     {
       "accessory": "HTTPLock",
       "name": "Lock",
       "intercomUrl": "http://192.168.0.200",
       "username": "admin",
       "password": "password",
       "pollInterval": 1
     }
]
```

- Requires 2N intercom with Enhanced Integration license for HTTP API access
- Requires "Switch API" authentication configured to "Basic"
