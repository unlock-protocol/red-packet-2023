import type { NextApiRequest, NextApiResponse } from 'next'
import {ethers} from 'ethers'


export default async function  handler(req: NextApiRequest, res: NextApiResponse) {
  if(!process.env.PRIVATE_KEY) {
    return   res.status(500).json('Missing private key')
  }
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.unlock-protocol.com/137')
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider)
  res.status(200).json({ address: signer.address })
}