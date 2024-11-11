import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getWixServerClient } from '@/lib/wix-client.server'
import { getCollectionBySlug } from '@/wix-api/collections'
import { delay } from '@/lib/utils'
import { queryProducts } from '@/wix-api/products'
import Product from '@/components/product'
import { Skeleton } from '@/components/ui/skeleton'

interface CollectionPageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params: { slug },
}: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollectionBySlug(getWixServerClient(), slug)

  if (!collection) notFound()

  const banner = collection.media?.mainMedia?.image

  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      images: banner ? [{ url: banner.url }] : [],
    },
  }
}

export default async function CollectionPage({
  params: { slug },
}: CollectionPageProps) {
  const collection = await getCollectionBySlug(getWixServerClient(), slug)

  if (!collection?._id) notFound()

  return (
    <div className='space-y-5'>
      <h2 className='text-2xl font-bold'>Products</h2>
      <Suspense fallback={<LoadingSkeleton />}>
        <Products collectionId={collection._id} />
      </Suspense>
    </div>
  )
}

interface ProductsProps {
  collectionId: string
}

async function Products({ collectionId }: ProductsProps) {
  await delay(3000)

  const collectionProducts = await queryProducts(getWixServerClient(), {
    collectionIds: collectionId,
  })

  if (!collectionProducts.length) notFound()

  return (
    <div className='grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {collectionProducts.items.map(product => (
        <Product key={product._id} product={product} />
      ))}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className='grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className='h-96 w-full' />
      ))}
    </div>
  )
}

