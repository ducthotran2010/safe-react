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

const AXS_ADDRESS = '0x3C4e17b9056272Ce1b49F6900d8cFD6171a1869d'.toLowerCase()
const SLP_ADDRESS = '0x82f5483623D636BC3deBA8Ae67E1751b6CF2Bad2'.toLowerCase()
const USDC_ADDRESS = '0x0a20CB59AF750dDE695264Fd1a3709066a065c18'.toLowerCase()
const WETH_ADDRESS = '0x29C6F8349A028E1bdfC68BFa08BDee7bC5D47E16'.toLowerCase()
const WRON_ADDRESS = '0xA959726154953bAe111746E265E6d754F48570E6'.toLowerCase()
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

        const ronPrice = new BigNumber(exchangeRate.ron.usd)
        const ethPrice = new BigNumber(exchangeRate.eth.usd)
        const slpPrice = new BigNumber(exchangeRate.slp.usd)
        const axsPrice = new BigNumber(exchangeRate.axs.usd)
        const usdPrice = new BigNumber(exchangeRate.usd.usd)

        const ronInfo = prices.items.find((item) => item.tokenInfo.address == NATIVE_ADDRESS)
        const ronAmount = new BigNumber(ronInfo?.balance || '0')
        const ronFiatBalance = ronPrice.multipliedBy(ronAmount).div(new BigNumber(10).pow(18))

        return {
          fiatTotal: ronFiatBalance.toString(),
          items: prices.items.map((item) => {
            const address = item.tokenInfo.address.toLowerCase()
            const balance = new BigNumber(item.balance)
            const mask = new BigNumber(10).pow(item.tokenInfo.decimals)

            let fiatBalance = item.fiatBalance
            let fiatConversion = item.fiatConversion
            let logoUri = item.tokenInfo.logoUri
            if (address == NATIVE_ADDRESS || address == WRON_ADDRESS) {
              fiatBalance = ronFiatBalance.toString()
              fiatConversion = ronPrice.toString()
            }

            if (address == AXS_ADDRESS) {
              fiatBalance = axsPrice.multipliedBy(balance).div(mask).toString()
              fiatConversion = axsPrice.toString()
              logoUri = getLogoUri('axs')
            }

            if (address == SLP_ADDRESS) {
              fiatBalance = slpPrice.multipliedBy(balance).div(mask).toString()
              fiatConversion = slpPrice.toString()
              logoUri = getLogoUri('slp')
            }

            if (address == WETH_ADDRESS) {
              fiatBalance = ethPrice.multipliedBy(balance).div(mask).toString()
              fiatConversion = ethPrice.toString()
              logoUri = getLogoUri('eth')
            }

            if (address == USDC_ADDRESS) {
              fiatBalance = usdPrice.multipliedBy(balance).div(mask).toString()
              fiatConversion = usdPrice.toString()
              logoUri = getLogoUri('usdc')
            }

            return {
              ...item,
              fiatBalance,
              fiatConversion,
              tokenInfo: {
                ...item.tokenInfo,
                logoUri: logoUri || item.tokenInfo.logoUri,
              },
            }
          }),
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
