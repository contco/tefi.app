import { AddressMap, AddressProvider, AddressProviderFromJson } from '@anchor-protocol/anchor.js';
import {
  AnchorContants,
  createAnchorContractAddress,
  DEFAULT_ADDESS_MAP,
  DEFAULT_ANCHOR_TX_CONSTANTS,
} from '@anchor-protocol/webapp-fns';

export const addressContract = () => {
  const key = 'gov';
  const addr = 'terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76';
  const draftAddressProvider = new AddressProviderFromJson(DEFAULT_ADDESS_MAP['mainnet']);
  const draftContractAddress = createAnchorContractAddress(draftAddressProvider, DEFAULT_ADDESS_MAP['mainnet']);
  return {
    addressProvider: draftAddressProvider,
    contractAddress: draftContractAddress,
  };
};
