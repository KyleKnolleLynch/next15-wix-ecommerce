import { WixClient } from '@/lib/wix-client.base'

export async function generateOAuthData(
  wixClient: WixClient,
  originPath?: string,
) {
  return wixClient.auth.generateOAuthData()
}

