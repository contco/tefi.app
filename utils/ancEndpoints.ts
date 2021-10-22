import { TEFI_API } from '../constants';

export const DEFAULT_MANTLE_ENDPOINTS = {
  mainnet: TEFI_API + 'https://mantle.terra.dev',
  testnet: 'https://tequila-mantle.anchorprotocol.com',
} as const;
