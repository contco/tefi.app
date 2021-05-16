import { LCDClient } from '@terra-money/terra.js';
import { Mirror, DEFAULT_MIRROR_OPTIONS } from '@mirror-protocol/mirror.js';
import { IS_TEST, TERRA_TEST_NET, TERRA_MAIN_NET } from '../../../constants';

const lcd = new LCDClient(IS_TEST ? TERRA_TEST_NET : TERRA_MAIN_NET);

const mirror = new Mirror({ ...DEFAULT_MIRROR_OPTIONS });
// mirror.lcd = lcd;


export const getMirrorAssets = async (address: string) => {
    console.log(address);
    console.log(await mirror.gov.getStaker(address));

    return [{ symbol: 'MIR', amount: '1' }]
};