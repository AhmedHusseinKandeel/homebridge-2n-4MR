import {
  API,
  Service,
  Logger,
  AccessoryPlugin,
  CharacteristicValue,
} from 'homebridge';
import { IntercomApi } from './intercomApi';
import { Config } from './config';

import { HomebridgePlatform } from './platform';
import { HttpServer } from './server';

export class HeliosSwitchAccessory implements AccessoryPlugin {
  // This property must be existent!!
  public name: string;

  private intercomApi: IntercomApi;
  private switchService: Service;

  constructor(
    private readonly platform: HomebridgePlatform,
    private readonly log: Logger,
    private readonly config: Config,
    private readonly api: API,
  ) {
    this.intercomApi = new IntercomApi(
      log,
      config.intercomHost,
      config.switchId,
      config.username,
      config.password,
    );

    new HttpServer(log, config.httpPort, () => this.setSwitch(true), () => this.setSwitch(false));

    this.name = this.config.name ?? 'Switch';

    this.switchService = new this.platform.Service.LockMechanism(this.name);
    this.switchService
      .getCharacteristic(this.platform.Characteristic.LockCurrentState)
      .onGet(this.getLockCurrentState.bind(this));

    this.switchService
      .getCharacteristic(this.platform.Characteristic.LockTargetState)
      .onGet(this.getLockTargetState.bind(this))
      .onSet(this.setLockTargetState.bind(this));
  }

  getServices = (): Service[] => {
    return [this.switchService];
  };

  private getLockCurrentState = async () => {
    this.log.debug('Getting lock current state');

    const switchState = await this.intercomApi.getSwitch();

    return switchState ? 0 : 1; // 0=open, 1=closed
  };

  private getLockTargetState = async () => {
    this.log.debug('Getting lock target state');

    const switchState = await this.intercomApi.getSwitch();

    return switchState ? 0 : 1; // 0=open, 1=closed
  };

  private setLockTargetState = async (value: CharacteristicValue) => {
    this.log.debug(`Setting lock target state: ${value}`);

    const switchState = value === 0; // 0=open, 1=closed

    await this.intercomApi.setSwitch(switchState);
  };

  private setSwitch = (value: boolean) => {
    const switchValue = value ? 0 : 1; // 0=open, 1=closed

    this.switchService
      .getCharacteristic(this.platform.Characteristic.LockCurrentState)
      .updateValue(switchValue);

    this.switchService
      .getCharacteristic(this.platform.Characteristic.LockTargetState)
      .updateValue(switchValue);
  };
}
