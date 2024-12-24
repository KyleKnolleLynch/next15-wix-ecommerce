import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getWixServerClient } from '@/lib/wix-client.server'
import { getCollectionBySlug } from '@/wix-api/collections'
import { queryProducts } from '@/wix-api/products'
import Product from '@/components/product'
import { Skeleton } from '@/components/ui/skeleton'
import PaginationBar from '@/components/pagination-bar'

interface CollectionPageProps {
  params: { slug: string }
  searchParams: { page?: string }
}

export async function generateMetadata({
  params: { slug },
  searchParams: { page },
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
  searchParams: { page = '1' },
}: CollectionPageProps) {
  const collection = await getCollectionBySlug(getWixServerClient(), slug)

  if (!collection?._id) notFound()

  return (
    <div className='space-y-5'>
      <h2 className='text-2xl font-bold'>Products</h2>
      <Suspense fallback={<LoadingSkeleton />} key={page}>
        <Products collectionId={collection._id} page={parseInt(page)} />
      </Suspense>
    </div>
  )
}

interface ProductsProps {
  collectionId: string
  page: number
}

async function Products({ collectionId, page }: ProductsProps) {
  const pageSize = 8

  const collectionProducts = await queryProducts(getWixServerClient(), {
    collectionIds: collectionId,
    limit: pageSize,
    skip: (page - 1) * pageSize,
  })

  if (!collectionProducts.length) notFound()

  if (page > (collectionProducts.totalPages || 1)) notFound()

  return (
    <div className='space-y-10'>
      <div className='grid gap-5 motion-translate-y-in-25 motion-blur-in-md motion-opacity-in-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {collectionProducts.items.map(product => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <PaginationBar
        currentPage={page}
        totalPages={collectionProducts.totalPages || 1}
      />
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
