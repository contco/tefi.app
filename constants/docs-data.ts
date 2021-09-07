export const CODE_EXAMPLE = `{
    assets(
      address: "terra...74e6"
    ) {
        address
        core {
          coins {
            balance
            value
            price
            symbol
            name
            denom 
            contract
          }
          staking {
            balance
            rewards
            stakedValue
            rewardsValue
            totalValue
            validator
            state
          }
          total {
            assetsSum
            stakedSum
            unstakedSum
          }
        }
        mirror {
          mirrorStaking {
            symbol1
            symbol2
            lpName
            stakedLp
            stakedLpUstValue
            stakeableLp
            stakeableLpUstValue
            token1UnStaked
            token1Staked
            token2UnStaked
            token2Staked
            totalLpUstValue
            rewards
            rewardsValue
            rewardsSymbol
            apr
          }
          mirrorHoldings {
            name
            symbol
            price
            balance
            value
            contract
          }
          airdrops {
            name
            symbol
            quantity
            value
            round
            proof
            contract
          }
          gov {
            name
            symbol
            staked
            value
            rewards
            price
            apr
          }
          total {
            mirrorHoldingsSum
            mirrorPoolRewardsSum
            mirrorPoolSum
            mirrorAirdropSum
          }
          mirrorShortFarm {
            assetInfo {
              name
              symbol
              price
              idx
            }
  
            borrowInfo {
              amount
              shortApr
              amountValue
            }
  
            collateralInfo {
              collateral
              collateralValue
              collateralRatio
              csymbol
            }
            lockedInfo {
              locked_amount
              unlocked_amount
              unlock_time
              reward
              rewardValue
              shorted
            }
          }
        }
        anchor {
          assets {
            name
            symbol
            price
            balance
            value
            contract
          }
          debt {
            reward {
              name
              apy
              staked
              reward
            }
            collaterals {
              collateral
              balance
              price
              value
              symbol
            }
            totalCollateralValue
            value
            percentage
            lunaprice
            ancprice
            netApy
          }
          burn {
            requestData {
              amount {
                amount
                amountValue
              }
              time {
                requestedTime
                claimableTime
              }
            } 
            withdrawableAmount
            totalBurnAmount
            totalBurnAmountValue
	}
          earn {
            reward {
              name
              staked
              apy
              reward
            }
          }
  
          pool {
            symbol1
            symbol2
            lpName
            stakedLp
            stakedLpUstValue
            stakeableLp
            stakeableLpUstValue
            token1UnStaked
            token1Staked
            token2UnStaked
            token2Staked
            totalLpUstValue
            rewards
            rewardsValue
            rewardsSymbol
            apr
          }
          gov {
            name
            symbol
            staked
            value
            rewards
            price
            apr
          }
          airdrops {
            name
            symbol
            quantity
            value
            round
            proof
            contract
          }
          total {
            airdropSum
            anchorRewardsSum
            anchorPoolSum
            anchorHoldingsSum
          }
          totalReward
        }
        pylon {
          pylonHoldings {
            symbol
            name
            price
            balance
            value
            contract
          }
          pylonPool {
            symbol1
            symbol2
            lpName
            stakedLp
            stakedLpUstValue
            stakeableLp
            stakeableLpUstValue
            token1UnStaked
            token1Staked
            token2UnStaked
            token2Staked
            totalLpUstValue
            rewards
            rewardsValue
            rewardsSymbol
            apr
          }
          gov {
            name
            symbol
            staked
            value
            rewards
            price
            apy
            rewards
            rewardsValue
            totalValue
          }
          pylonAirdrops {
            name
            symbol
            value
            quantity
            round
            proof
            contract
          }
          pylonSum {
            pylonHoldingsSum
            pylonPoolSum
            pylonPoolRewardsSum
            pylonAirdropSum
            gatewayRewardsSum
            gatewayDepositsSum
          }
          pylonGateway {
            symbol
            apy
            poolName
            totalDeposit
            rewards
            rewardsValue
            depositLogs {
              deposit
              depositDate
              depositReleaseDate
              rewardReleaseDate
            }
          }
        }
        terraSwapPool{
          list{
            symbol1
            symbol2
            lpName
            price  
            stakedLp
            stakedLpUstValue
            stakeableLp
            stakeableLpUstValue
            token1UnStaked
            token1Staked
            token2UnStaked
            token2Staked
            totalLpUstValue
          }
          total
        }
        spectrum {
          farms {
            symbol
            lpName
            stakedLp
            stakedLpUstValue
            tokenStaked
            ustStaked
            farm
            stakedSpec
            stakedSpecValue
            tokenRewardsStaked
            tokenRewardsStakedValue
            tokenRewardsStakedSymbol
            apy
          }
          specGov {
            name
            symbol
            staked
            value
            rewards
            price
            apr
          }
          specHoldings {
            symbol
            name
            price
            balance
            value
            contract
          }
          spectrumTotal {
            farmsTotal
            holdingsTotal
            rewardsTotal
          }
        }
        loterra {
          loterraDraw {
            combinations
            drawTime
            ticketCounts
            ticketPrice
            jackpot
          }
          lotaGov {
            name
            symbol
            staked
            value
            rewards
            rewardsValue
            apr
            price
          }
        }
        starterra {
          stakedData {
            lpname
            faction
            stakedLp
            stakedLpUstValue
            token1Staked
            token2Staked
            rewards
            rewardsValue
          } 
          stakableLp
          symbol1
          symbol2
          token1UnStaked
          token2UnStaked
          totalStakedLp
          totalStakedLpUstValue
          totalRewards
          totalRewardsValue
        }
      }
  }`;
