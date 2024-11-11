import { WixClient } from '@/lib/wix-client.base'
import { collections } from '@wix/stores'
import { cache } from 'react'

export const getCollectionBySlug = cache(
  async (wixClient: WixClient, slug: string) => {
    const { collection } = await wixClient.collections.getCollectionBySlug(slug)

    return collection || null
  },
)

export const getCollections = cache(
  async (wixClient: WixClient): Promise<collections.Collection[]> => {
    const collections = await wixClient.collections
      .queryCollections()
      .ne('_id', '00000000-000000-000000-000000000001') // filter out all products category
      .ne('_id', 'fe9b4452-c31a-1405-da33-815d6f678a80') // filter out featured products category
      .find()

    return collections.items
  },
)
