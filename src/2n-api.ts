import { Logger } from 'homebridge';
import axios, { AxiosInstance } from 'axios';

export class IntercomApi {
  private readonly http: AxiosInstance;
  private readonly intercomHost: string;
  private readonly switchId: number;
  private readonly username?: string;
  private readonly password?: string;
  private readonly log: Logger;

  constructor(
    log: Logger,
    intercomHost: string,
    switchId: number,
    username?: string,
    password?: string,
  ) {
    this.log = log;
    this.intercomHost = intercomHost;
    this.switchId = switchId;
    this.username = username;
    this.password = password;

    this.http = axios.create({
      timeout: 2000,
      auth:
        this.username && this.password
          ? { username: this.username, password: this.password }
          : undefined,
    });
  }

  getSwitch = async () => {
    const url = `${this.intercomHost}/api/switch/status?switch=${this.switchId}`;

    const response = await this.http.get(url);

    if (response.status !== 200) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = JSON.parse(response.data as string);

    const switchActive = json.result.switches[0].active as boolean;

    return switchActive;
  };

  setSwitch = async (value: boolean) => {
    const url = `${this.intercomHost}/api/switch/ctrl?switch=${
      this.switchId
    }&action=${value ? 'on' : 'off'}`;

    const response = await this.http.get(url);

    return response.status === 200;
  };
}
