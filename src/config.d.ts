import { PlatformConfig } from 'homebridge';

export type Config = {
  intercomHost: string;
  switchId?: number;
  username?: string;
  password?: string;
  httpPort: number;
} & Pick<PlatformConfig, 'platform' | 'name' | 'bridge'>;
