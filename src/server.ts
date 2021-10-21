import { Logger } from 'homebridge';
import { createServer, RequestListener, Server } from 'http';

export class HttpServer {
  private readonly server: Server;
  private readonly log: Logger;

  public switchOn: () => void;
  public switchOff: () => void;

  constructor(
    log: Logger,
    port: number,
    switchOn: () => void,
    switchOff: () => void,
  ) {
    this.log = log;
    this.switchOn = switchOn,
    this.switchOff = switchOff,

    this.server = createServer(this.requestListener);
    this.server.listen(port, '', () => {
      log.debug(`HTTP server listening on port ${port}`);
    });
  }

  private requestListener: RequestListener = (req, res) => {
    this.log.debug(`Received request URL ${req.url}`);

    switch(req.url) {
      case '/on':
        this.switchOn();
        break;
      case '/off':
        this.switchOff();
        break;
    }

    res.writeHead(200);
    return res.end();
  };
}