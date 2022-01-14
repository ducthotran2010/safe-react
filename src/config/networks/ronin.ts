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
  clientGatewayUrl: 'https://gnonis-cgw.roninchain.com/v1',
  txServiceUrl: 'https://gnonis-txs.roninchain.com/api/v1',
  safeUrl: 'https://gnosis-safe.roninchain.com/',
  gasPrice: 1e9,
  rpcServiceUrl: 'https://api.roninchain.com/rpc',
  safeAppsRpcServiceUrl: 'https://api.roninchain.com/rpc',
  networkExplorerName: 'Ronin Explorer',
  networkExplorerUrl: 'http://explorer.roninchain.com',
  networkExplorerApiUrl: 'http://explorer.roninchain.com/api',
  exchangeRatePriceUrl: 'https://exchange-rate.axieinfinity.com/',
  iconUrl: 'https://assets.axieinfinity.com/explorer/images/contract-icon',
}

const mainnet: NetworkConfig = {
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
    isTestNet: false,
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

export default mainnet
