import { env } from '@/env'
import { createClient, OAuthStrategy } from '@wix/sdk'
import { products, collections } from '@wix/stores'
import {
  orders,
  checkout,
  currentCart,
  backInStockNotifications,
  recommendations,
} from '@wix/ecom'
import { files } from '@wix/media'
import { members } from '@wix/members'
import { redirects } from '@wix/redirects'
import { reviews } from '@wix/reviews'

export function getWixClient() {
  return createClient({
    modules: {
      products,
      collections,
      orders,
      checkout,
      currentCart,
      backInStockNotifications,
      recommendations,
      files,
      members,
      redirects,
      reviews,
    },
    auth: OAuthStrategy({
      clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID,
    }),
  })
}