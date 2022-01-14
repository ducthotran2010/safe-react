import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { getBalances, GatewayDefinitions, TokenType } from '@gnosis.pm/safe-react-gateway-sdk'
import { getClientGatewayUrl, getExchangeRatePriceUrl, getIconUrl, getNetworkId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import BigNumber from 'bignumber.js'

export type TokenBalance = {
  tokenInfo: GatewayDefinitions['TokenInfo']
  balance: string
  fiatBalance: string
  fiatConversion: string
}

export type BalanceEndpoint = GatewayDefinitions['SafeBalanceResponse']

type FetchTokenCurrenciesBalancesProps = {
  safeAddress: string
  selectedCurrency: string
  excludeSpamTokens?: boolean
  trustedTokens?: boolean
}

interface Currency {
  usd: number
}

interface AxieExchangeRate {
  eth: Currency
  slp: Currency
  usd: Currency
  usdc: Currency
  ron: Currency
  axs: Currency
}

export const getExchangeRatePrice = async () => {
  const url = getExchangeRatePriceUrl()
  if (url) {
    const res = await fetch(url)
    if (res.ok) {
      return res.json() as Promise<AxieExchangeRate>
    }
  }
}

const AXS_ADDRESS = '0x97a9107c1793bc407d6f527b77e7fff4d812bece'.toLowerCase()
const SLP_ADDRESS = '0xa8754b9fa15fc18bb59458815510e40a12cd2014'.toLowerCase()
const USDC_ADDRESS = '0x0b7007c13325c48911f73a2dad5fa5dcbf808adc'.toLowerCase()
const WETH_ADDRESS = '0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5'.toLowerCase()
const WRON_ADDRESS = '0xe514d9deb7966c8be0ca922de8a064264ea6bcd4'.toLowerCase()
const NATIVE_ADDRESS = '0x0000000000000000000000000000000000000000'.toLowerCase()

const getLogoUri = (icon: string) => {
  const url = getIconUrl()
  if (url) {
    return `${url}/${icon}.png`
  }
  return null
}

const updatePrice = async (prices: {
  fiatTotal: string
  items: {
    tokenInfo: {
      type: TokenType
      address: string
      decimals: number
      symbol: string
      name: string
      logoUri: string | null
    }
    balance: string
    fiatBalance: string
    fiatConversion: string
  }[]
}) => {
  const networkId = getNetworkId()
  if (networkId == ETHEREUM_NETWORK.RONIN) {
    const url = getExchangeRatePriceUrl()
    if (url) {
      const response = await fetch(url)
      if (response.ok) {
        const exchangeRate = (await response.json()) as AxieExchangeRate

        let fiatTotal = new BigNumber(0)
        const ronPrice = new BigNumber(exchangeRate.ron.usd)
        const ethPrice = new BigNumber(exchangeRate.eth.usd)
        const slpPrice = new BigNumber(exchangeRate.slp.usd)
        const axsPrice = new BigNumber(exchangeRate.axs.usd)
        const usdcPrice = new BigNumber(exchangeRate.usdc.usd)

        const items = prices.items.map((item) => {
          const address = item.tokenInfo.address.toLowerCase()
          const balance = new BigNumber(item.balance)
          const mask = new BigNumber(10).pow(item.tokenInfo.decimals)

          let fiatBalance = new BigNumber(item.fiatBalance)
          let fiatConversion = new BigNumber(item.fiatConversion)
          let logoUri = item.tokenInfo.logoUri
          if (address == NATIVE_ADDRESS || address == WRON_ADDRESS) {
            fiatBalance = ronPrice.multipliedBy(balance).div(mask)
            fiatConversion = ronPrice
            logoUri = getLogoUri('ron')
          }

          if (address == AXS_ADDRESS) {
            fiatBalance = axsPrice.multipliedBy(balance).div(mask)
            fiatConversion = axsPrice
            logoUri = getLogoUri('axs')
          }

          if (address == SLP_ADDRESS) {
            fiatBalance = slpPrice.multipliedBy(balance).div(mask)
            fiatConversion = slpPrice
            logoUri = getLogoUri('slp')
          }

          if (address == WETH_ADDRESS) {
            fiatBalance = ethPrice.multipliedBy(balance).div(mask)
            fiatConversion = ethPrice
            logoUri = getLogoUri('eth')
          }

          if (address == USDC_ADDRESS) {
            fiatBalance = usdcPrice.multipliedBy(balance).div(mask)
            fiatConversion = usdcPrice
            logoUri = getLogoUri('usdc-48')
          }

          fiatTotal = fiatTotal.plus(fiatBalance)

          return {
            ...item,
            fiatBalance: fiatBalance.toString(),
            fiatConversion: fiatConversion.toString(),
            tokenInfo: {
              ...item.tokenInfo,
              logoUri: logoUri || item.tokenInfo.logoUri,
            },
          }
        })

        return {
          fiatTotal: fiatTotal.toString(),
          items,
        }
      }
    }

    return {
      fiatTotal: '0',
      items: prices.items.map((item) => ({
        ...item,
        fiatBalance: '0',
        fiatConversion: '0',
      })),
    }
  }

  return prices
}

export const fetchTokenCurrenciesBalances = async ({
  safeAddress,
  selectedCurrency,
  excludeSpamTokens = true,
  trustedTokens = false,
}: FetchTokenCurrenciesBalancesProps): Promise<BalanceEndpoint> => {
  const address = checksumAddress(safeAddress)
  const res = await getBalances(getClientGatewayUrl(), getNetworkId().toString(), address, selectedCurrency, {
    exclude_spam: excludeSpamTokens,
    trusted: trustedTokens,
  })
  return updatePrice(res)
}
