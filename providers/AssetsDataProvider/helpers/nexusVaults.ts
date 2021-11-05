import { convertToFloatValue } from '../../../utils/convertFloat';

export const getNexusVaultData = (nexus) => {
	
  if (!nexus.nexusVault) return {};

  const bLunaData =
    nexus?.nexusVault?.bLunaDeposit === '0' && nexus?.nexusVault?.bLunaReward === '0'
      ? null
      : [
          { name: 'bLuna Vault' },
          { apr: nexus?.nexusVault?.bLunaVaultApr },
          {
            balance: {
              token: convertToFloatValue(nexus?.nexusVault?.bLunaDeposit) + ' bLuna',
              tokenValue: '$' + convertToFloatValue(nexus?.nexusVault?.bLunaDepositValue),
            },
          },

          {
            reward: {
              token: convertToFloatValue(nexus?.nexusVault?.bLunaReward) + ' Psi',
              tokenValue:
                '$' +
                convertToFloatValue(
                  (parseFloat(nexus?.nexusVault?.bLunaReward) * parseFloat(nexus?.nexusPool?.price)).toString(),
                ),
            },
          },
        ];

  const bEthData =
    nexus?.nexusVault?.bEthDeposit === '0' && nexus?.nexusVault?.bEthReward === '0'
      ? null
      : [
          { name: 'bEth Vault' },
          { apr: nexus?.nexusVault?.bEthVaultApr },
          {
            balance: {
              token: convertToFloatValue(nexus?.nexusVault?.bEthDeposit) + ' bEth',
              tokenValue: '$' + convertToFloatValue(nexus?.nexusVault?.bEthDepositValue),
            },
          },

          {
            reward: {
              token: convertToFloatValue(nexus?.nexusVault?.bEthReward) + ' Psi',
              tokenValue:
                '$' +
                convertToFloatValue(
                  (parseFloat(nexus?.nexusVault?.bEthReward) * parseFloat(nexus?.nexusPool?.price)).toString(),
                ),
            },
          },
        ];

  const myData = [];
  if (bLunaData) myData.push(bLunaData);
  if (bEthData) myData.push(bEthData);

  const totalDeposit =
    parseFloat(nexus?.nexusVault?.bEthDepositValue) + parseFloat(nexus?.nexusVault?.bEthDepositValue);
  const totalReward =
    (parseFloat(nexus?.nexusVault?.bLunaReward) + parseFloat(nexus?.nexusVault?.bEthReward)) *
    parseFloat(nexus?.nexusPool?.price);

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
