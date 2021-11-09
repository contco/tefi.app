import { convertToFloatValue } from '../../../utils/convertFloat';

export const getNexusVaultData = (nexus) => {
  if (!nexus.nexusVault) return {};

  const bLunaData =
    nexus?.nexusVault?.bLunaDeposit === '0' && nexus?.nexusVault?.bLunaRewards === '0'
      ? null
      : [
          { name: 'bLuna Vault' },
          { apr: parseFloat(nexus?.nexusVault?.bLunaVaultApr).toFixed(2) + '%' },
          {
            balance: {
              token: convertToFloatValue(nexus?.nexusVault?.bLunaDeposit) + ' bLuna',
              tokenValue: '$' + convertToFloatValue(nexus?.nexusVault?.bLunaDepositValue),
            },
          },

          {
            reward: {
              token: convertToFloatValue(nexus?.nexusVault?.bLunaRewards) + ' Psi',
              tokenValue:
                '$' +
                convertToFloatValue(
                  (parseFloat(nexus?.nexusVault?.bLunaRewards) * parseFloat(nexus?.nexusHoldings?.price)).toString(),
                ),
            },
          },
        ];

  const bEthData =
    nexus?.nexusVault?.bEthDeposit === '0' && nexus?.nexusVault?.bEthRewards === '0'
      ? null
      : [
          { name: 'bEth Vault' },
          { apr: parseFloat(nexus?.nexusVault?.bEthVaultApr).toFixed(2) + '%' },
          {
            balance: {
              token: convertToFloatValue(nexus?.nexusVault?.bEthDeposit) + ' bEth',
              tokenValue: '$' + convertToFloatValue(nexus?.nexusVault?.bEthDepositValue),
            },
          },

          {
            reward: {
              token: convertToFloatValue(nexus?.nexusVault?.bEthRewards) + ' Psi',
              tokenValue:
                '$' +
                convertToFloatValue(
                  (parseFloat(nexus?.nexusVault?.bEthRewards) * parseFloat(nexus?.nexusHoldings?.price)).toString(),
                ),
            },
          },
        ];

  const myData = [];
  if (bLunaData) myData.push(bLunaData);
  if (bEthData) myData.push(bEthData);

  const totalDeposit =
    parseFloat(nexus?.nexusVault?.bLunaDepositValue) + parseFloat(nexus?.nexusVault?.bEthDepositValue);

  const totalReward =
    (parseFloat(nexus?.nexusVault?.bLunaRewards) + parseFloat(nexus?.nexusVault?.bEthRewards)) *
    parseFloat(nexus?.nexusHoldings?.price);

  return {
    titles: ['Vault', 'APR', 'Deposit', 'Reward'],
    data: myData,
    total: [
      { name: 'Total Deposit', value: '$' + convertToFloatValue(totalDeposit.toString()) },
      { name: 'Total Reward', value: '$' + convertToFloatValue(totalReward.toString()) },
    ],
    totalReward: totalReward,
    totalValue: totalDeposit,
  };
};
