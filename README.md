**This is a fork of [`homebridge-http-lock-mechanism`](https://github.com/Tommrodrigues/homebridge-http-lock-mechanism) specifically for integrating the switch functionality on [2N intercoms](https://www.2n.cz/en_GB/products/intercoms).**

## Configuration

```javascript
"accessories": [
     {
       "accessory": "HeliosSwitch",
       "name": "Front gate",
       "intercomUrl": "http://192.168.0.200", // URL of the 2N intercom
       "username": "admin", // HTTP API account username
       "password": "password", // HTTP API account password
       "pollInterval": 1 // how frequently (in seconds) to poll for switch status
     }
]
```

- Requires 2N intercom with "Enhanced Integration" license for HTTP API access
- Requires "Switch API" authentication configured to "Basic"
- Enable "HTTP API" account with access to "Switch Access"
