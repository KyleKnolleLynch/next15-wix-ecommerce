import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductsSort, queryProducts } from '@/wix-api/products'
import { getWixServerClient } from '@/lib/wix-client.server'
import PaginationBar from '@/components/pagination-bar'
import Product from '@/components/product'
import { Skeleton } from '@/components/ui/skeleton'

interface PageProps {
  searchParams: {
    q?: string
    page?: string
    collection?: string[]
    price_min?: string
    price_max?: string
    sort?: string
  }
}

export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
  return {
    title: q ? `Results for "${q}"` : 'Products',
  }
}

export default async function Page({
  searchParams: {
    q,
    page = '1',
    collection: collectionIds,
    price_min,
    price_max,
    sort,
  },
}: PageProps) {
  const title = q ? `Results for "${q}"` : 'Products'
  return (
    <div className='space-y-10'>
      <h1 className='text-center text-3xl font-bold md:text-4xl'>{title}</h1>
      <Suspense fallback={<LoadingSkeleton />} key={`${q}-${page}`}>
        <ProductResults
          q={q}
          page={parseInt(page)}
          collectionIds={collectionIds}
          priceMin={price_min ? parseInt(price_min) : undefined}
          priceMax={price_max ? parseInt(price_max) : undefined}
          sort={sort as ProductsSort}
        />
      </Suspense>
    </div>
  )
}

interface ProductResultProps {
  q?: string
  page: number
  collectionIds?: string[]
  priceMin?: number
  priceMax?: number
  sort?: ProductsSort
}

async function ProductResults({
  q,
  page,
  collectionIds,
  priceMin,
  priceMax,
  sort,
}: ProductResultProps) {
  const pageSize = 8

  const products = await queryProducts(getWixServerClient(), {
    q,
    limit: pageSize,
    skip: (page - 1) * pageSize,
    collectionIds,
    priceMin,
    priceMax,
    sort,
  })

  if (page > (products.totalPages || 1)) notFound()

  return (
    <div className='space-y-10 group-has-[[data-pending]]:animate-pulse'>
      <p className='text-center text-xl'>
        {products.totalCount} product{products.totalCount === 1 ? '' : 's'}{' '}
        found
      </p>
      <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {products.items.map(product => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <PaginationBar currentPage={page} totalPages={products.totalPages || 1} />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className='space-y-10'>
      <Skeleton className='mx-auto h-9 w-52' />
      <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className='h-96' />
        ))}
      </div>
    </div>
  )
}
