import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { AbstractProvider } from 'web3-core/types'
import { adjustV } from './utils'

const ETH_SIGN_NOT_SUPPORTED_ERROR_MSG = 'ETH_SIGN_NOT_SUPPORTED'

type EthSignerArgs = {
  safeTxHash: string
  sender: string
}

export const ethSigner = async ({ safeTxHash, sender }: EthSignerArgs): Promise<string> => {
  const web3 = getWeb3()

  console.log(
    'ethSigner',
    JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_sign',
      params: [sender, safeTxHash],
      id: new Date().getTime(),
    }),
  )

  return new Promise(function (resolve, reject) {
    const provider = web3.currentProvider as AbstractProvider
    provider.sendAsync(
      {
        jsonrpc: '2.0',
        method: 'eth_sign',
        params: [sender, safeTxHash],
        id: new Date().getTime(),
      },
      async function (err, signature) {
        console.log('ress', err, signature)

        if (err) {
          return reject(err)
        }

        if (signature?.result == null) {
          reject(new Error(ETH_SIGN_NOT_SUPPORTED_ERROR_MSG))
          return
        }

        const sig = adjustV('eth_sign', signature.result, safeTxHash, sender)
        console.log(`before=${signature.result}`, `after=${sig.replace(EMPTY_DATA, '')}`)

        resolve(sig.replace(EMPTY_DATA, ''))
      },
    )
  })
}
