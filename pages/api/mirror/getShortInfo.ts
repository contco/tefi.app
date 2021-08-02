import axios from 'axios';

const MANTLE_URL = 'https://mantle.terra.dev/';

const LOCK_POSITION_INFO_QUERY = (idx: number) => `
  query lockPositionInfo {
    position${idx}: WasmContractsContractAddressStore(
      ContractAddress: "terra169urmlm8wcltyjsrn7gedheh7dker69ujmerv2"
      QueryMsg: "{\\"position_lock_info\\":{\\"position_idx\\":\\"${idx}\\"}}"
    ) {
      Height
      Result
    },
  }
`;

const MINT_POSITIONS_QUERY = `
  query WasmContractsContractAddressStore($contract: String, $msg: String) {
    WasmContractsContractAddressStore(
      ContractAddress: $contract
      QueryMsg: $msg
    ) {
      Height
      Result
    }
  }
`;
export const getMintInfo = async (address: string) => {
  try {
    const mintInfo = await axios.get(MANTLE_URL + `?mintPositions`, {
      params: {
        query: MINT_POSITIONS_QUERY,
        variables: {
          contract: 'terra1wfz7h3aqf4cjmjcvc6s8lxdhh7k30nkczyf0mj',
          msg: JSON.stringify({ positions: { owner_addr: address, limit: 30 } }),
        },
      },
    });

    return mintInfo;
  } catch (err) {
    getMintInfo(address);
  }
};

export const getLockInfo = async (address: string) => {
  try {
    const mintInfo = await getMintInfo(address);
    const positions = JSON.parse(mintInfo?.data?.data?.WasmContractsContractAddressStore?.Result).positions;
    const totalShortInfo = [];

    if (positions) {
      positions.forEach(async (position) => {
        const { asset, collateral, idx } = position;
        const lockInfo = await axios.get(MANTLE_URL + `?lockPositionInfo`, {
          params: {
            query: LOCK_POSITION_INFO_QUERY(idx),
          },
        });

        const lockedInfo = JSON.parse(lockInfo?.data.data[`position${idx}`].Result);

        const shortInfo = {
          lockedInfo,
          asset: {
            amount: asset.amount,
            token: asset.info.token.contract_addr,
          },
          collateral: collateral.amount,
        };

        totalShortInfo.push(shortInfo);
      });
    }
    return { totalShortInfo };
  } catch (err) {
    getLockInfo(address);
  }
};

export default async (address: string) => {
  const shortInfo = await getLockInfo(address);

  if (shortInfo) {
    return shortInfo;
  }

  return null;
};
