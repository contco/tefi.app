export const CODE_EXAMPLE = `{
    assets(
      address: "terra...74e6"
    ) {
        address
        altered {
          altePool {
            apr
            lpName
            price
            rewards
            rewardsSymbol
            rewardsValue
            stakeableLp
            stakeableLpUstValue
            stakedLp
            stakedLpUstValue
            symbol1
            symbol2
            token1Staked
            token1UnStaked
            token2Staked
            token2UnStaked
            totalLpUstValue
            totalStaked
          }
        }
        core {
          coins {
            balance
            contract
            denom
            name
            price
            symbol
            value
          }
          staking {
            balance
            rewards
            rewardsValue
            stakedValue
            state
            totalValue
            validator
          }
          total {
            assetsSum
            stakedSum
            unstakedSum
          }
        }
        anchor {
          airdrops {
            contract
            name
            proof
            quantity
            round
            symbol
            value
          }
          assets {
            balance
            contract
            name
            price
            symbol
            value
          }
          burn {
            requestData {
              amount {
                amount
                amountValue
              }
              time {
                claimableTime
                requestedTime
              }
            }
            totalBurnAmount
            totalBurnAmountValue
            withdrawableValue
            withdrawableAmount
          }
          debt {
            ancprice
            collaterals {
              balance
              collateral
              price
              symbol
              value
            }
            limit
            lunaprice
            netApy
            percentage
            reward {
              apy
              name
              reward
              staked
            }
            totalCollateralValue
            value
          }
          earn {
            reward {
              apy
              name
              reward
              staked
            }
          }
          gov {
            apr
            name
            price
            rewards
            staked
            symbol
            value
          }
          pool {
            apr
            lpName
            rewards
            rewardsSymbol
            rewardsValue
            stakeableLp
            stakedLpUstValue
            stakedLp
            stakedLpUstValue
            symbol1
            symbol2
            token1Staked
            token2Staked
            token1UnStaked
            token2UnStaked
            totalLpUstValue
          }
          total {
            airdropSum
            anchorHoldingsSum
            anchorRewardsSum
            anchorPoolSum
          }
          totalReward
        }
        apolloDao {
          total
          vaults {
            lpName
            stakedLp
            stakedLpUstValue
            symbol1
            symbol2
            token1Staked
            token2Staked
          }
        }
        loterra {
          lotaGov {
            apr
            name
            price
            rewards
            rewardsValue
            staked
            symbol
            value
          }
          lotaPool {
            apy
            lpName
            price
            rewards
            rewardsSymbol
            rewardsValue
            stakeableLp
            stakedLpUstValue
            stakedLp
            stakedLpUstValue
            symbol1
            symbol2
            token1Staked
            token1UnStaked
            token2Staked
            token2UnStaked
            totalLpUstValue
            totalStaked
          }
          loterraDraw {
            combinations
            drawTime
            jackpot
            ticketCounts
            ticketPrice
          }
        }
        pylon {
          gov {
            apy
            name
            price
            rewards
            rewardsValue
            staked
            symbol
            totalValue
            value
          }
          pylonAirdrops {
            contract
            name
            proof
            quantity
            round
            symbol
            value
          }
          pylonGateway {
            apy
            depositLogs {
              deposit
              depositDate
              depositReleaseDate
              rewardReleaseDate
            }
            poolName
            rewards
            rewardsValue
            symbol
            totalDeposit
          }
          pylonHoldings {
            balance
            contract
            name
            price
            symbol
            value
          }
          pylonPool {
            apr
            lpName
            rewards
            rewardsSymbol
            rewardsValue
            stakeableLp
            stakeableLpUstValue
            stakedLp
            stakedLpUstValue
            symbol1
            symbol2
            token1Staked
            token1UnStaked
            token2Staked
            token2UnStaked
            totalLpUstValue
          }
          pylonSum {
            gatewayRewardsSum
            gatewayDepositsSum
            pylonAirdropSum
            pylonHoldingsSum
            pylonPoolRewardsSum
            pylonPoolSum
          }
        }
        spectrum {
          farms {
            apy
            farm
            lpName
            stakedLp
            stakedLpUstValue
            stakedSpec
            stakedSpecValue
            symbol
            tokenRewardsStaked
            tokenRewardsStakedSymbol
            tokenRewardsStakedValue
            tokenStaked
            ustStaked
          }
          specGov {
            apr
            name
            price
            rewards
            staked
            symbol
            value
          }
          specHoldings {
            balance
            contract
            name
            price
            symbol
            value
          }
          spectrumTotal {
            farmsTotal
            holdingsTotal
            rewardsTotal
          }
        }
        starterra {
          govRewardsTotal
          govStakedTotal
          starTerraGov {
            apr
            faction
            name
            rewards
            rewardsValue
            staked
            symbol
            value
          }
          starTerraPools {
            stakeableLp
            stakeableLpUstValue
            stakedData {
              bondedLp
              bondedLpUstValue
              faction
              lpName
              rewards
              rewardsValue
              stakedLp
              stakedLpUstValue
              token1Staked
              token1Bonded
              token2Staked
              token2Bonded
              unbondingTime
            }
            symbol1
            symbol2
            token1UnStaked
            token2UnStaked
            totalBondedLp
            totalBondedLpUstValue
            totalRewards
            totalRewardsValue
            totalStakedLp
            totalStakedLpUstValue
          }
        }
        terraSwapPool {
          list {
            lpName
            price
            stakeableLp
            stakeableLpUstValue
            stakedLp
            stakedLpUstValue
            symbol1
            symbol2
            token1Staked
            token1UnStaked
            token2Staked
            token2UnStaked
            totalLpUstValue
          }
          total
        }
        terraworld {
          twdGov {
            apy
            name
            price
            rewards
            rewardsValue
            staked
            symbol
            value
          }
          twdHoldings {
            balance
            contract
            name
            price
            symbol
            value
          }
          twdPool {
            lpName
            price
            rewards
            rewardsSymbol
            rewardsValue
            stakeableLp
            stakeableLpUstValue
            stakedLp
            stakedLpUstValue
            symbol1
            symbol2
            apr
            token1Staked
            token1UnStaked
            token2Staked
            token2UnStaked
            totalLpUstValue
          }
        }
        mirror {
          airdrops {
            contract
            name
            proof
            quantity
            round
            symbol
            value
          }
          gov {
            apr
            name
            price
            rewards
            staked
            symbol
            value
          }
          mirrorHoldings {
            balance
            contract
            name
            price
            symbol
            value
          }
          mirrorShortFarm {
            assetInfo {
              idx
              name
              price
              symbol
            }
            borrowInfo {
              amount
              amountValue
              shortApr
            }
            collateralInfo {
              collateral
              collateralRatio
              collateralValue
              csymbol
            }
            lockedInfo {
              locked_amount
              rewardValue
              reward
              shorted
              unlock_time
              unlocked_amount
            }
          }
          mirrorStaking {
            apr
            lpName
            rewards
            rewardsSymbol
            rewardsValue
            stakeableLp
            stakeableLpUstValue
            stakedLp
            stakedLpUstValue
            symbol1
            symbol2
            token1Staked
            token1UnStaked
            token2Staked
            token2UnStaked
            totalLpUstValue
          }
          total {
            mirrorAirdropSum
            mirrorPoolSum
            mirrorHoldingsSum
            mirrorPoolRewardsSum
          }
        }
        tfloki {
          tflokiHoldings {
            name
            price
            symbol
            balance
            value
            contract
          }
          flokiPool {
            apr
            lpName
            rewards
            rewardsSymbol
            rewardsValue
            stakeableLp
            stakeableLpUstValue
            stakedLp
            stakedLpUstValue
            symbol1
            symbol2
            token1Staked
            token1UnStaked
            token2Staked
            token2UnStaked
            totalLpUstValue
          }
        }
        nexus {
          nexusHoldings {
            name
            price
            symbol
            balance
            value
            contract
          }
          nexusPool {
            apr
            lpName
            rewards
            rewardsSymbol
            rewardsValue
            stakeableLp
            stakeableLpUstValue
            stakedLp
            stakedLpUstValue
            symbol1
            symbol2
            token1Staked
            token1UnStaked
            token2Staked
            token2UnStaked
            totalLpUstValue
          }
        }
      }    
  }`;
