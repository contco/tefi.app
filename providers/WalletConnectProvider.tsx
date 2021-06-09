import dynamic from 'next/dynamic'
import { NetworkInfo } from "@terra-money/wallet-provider"
import { FC } from "react"
import networks from "../utils/networks";

const DynamicWalletProvider = dynamic(() => import('@terra-money/wallet-provider').then((module) => {
  return module.WalletProvider
}), { ssr: false });


const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: networks.testnet,
  1: networks.mainnet,
}

const WalletConnectProvider: FC = ({ children }) => {
console.log(DynamicWalletProvider); 
return (
  <DynamicWalletProvider
    defaultNetwork={networks.mainnet}
    walletConnectChainIds={walletConnectChainIds}
    connectorOpts={{ bridge: "https://walletconnect.terra.dev/" }}
  >
    {children}
  </DynamicWalletProvider>
)
}

export default WalletConnectProvider