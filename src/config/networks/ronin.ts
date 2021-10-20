import RoninLogo from 'src/config/assets/token_ron.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  FEATURES,
  NetworkConfig,
  WALLETS,
} from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'http://gnosis.axieinfinity.co/cgw/v1',
  txServiceUrl: 'http://gnosis.axieinfinity.co/txs/api/v1',
  safeUrl: 'http://gnosis.axieinfinity.co/app',
  gasPrice: 1e9, // 1 Gwei
  rpcServiceUrl: 'https://testnet.skymavis.one/rpc',
  safeAppsRpcServiceUrl: 'https://testnet.skymavis.one/rpc',
  networkExplorerName: 'Ronin Explorer',
  networkExplorerUrl: 'https://testnet-explorer.skymavis.one',
  networkExplorerApiUrl: 'https://testnet-explorer.skymavis.one/api',
}

const testnet: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
    },
    staging: {
      ...baseConfig,
    },
    production: {
      ...baseConfig,
    },
  },
  network: {
    id: ETHEREUM_NETWORK.RONIN,
    backgroundColor: '#1c94f4',
    textColor: '#ffffff',
    label: 'Ronin',
    isTestNet: true,
    ethereumLayer: ETHEREUM_LAYER.L2,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ronin',
      symbol: 'RON',
      decimals: 18,
      logoUri: RoninLogo,
    },
  },
  disabledWallets: [
    WALLETS.TREZOR,
    WALLETS.LEDGER,
    WALLETS.COINBASE,
    WALLETS.FORTMATIC,
    WALLETS.OPERA,
    WALLETS.OPERA_TOUCH,
    WALLETS.PORTIS,
    WALLETS.TORUS,
    WALLETS.TRUST,
    WALLETS.WALLET_LINK,
    WALLETS.AUTHEREUM,
    WALLETS.LATTICE,
    WALLETS.KEYSTONE,
    WALLETS.WALLET_CONNECT,
  ],
  disabledFeatures: [FEATURES.DOMAIN_LOOKUP, FEATURES.SPENDING_LIMIT],
}

export default testnet
