import Image from 'next/image'
import banner from '@/assets/banner.jpg'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { delay } from '@/lib/utils'
import { Suspense } from 'react'
import { getWixClient } from '@/lib/wix-client.base'
import Product from '@/components/product'
import { Skeleton } from '@/components/ui/skeleton'
import { getCollectionBySlug } from '@/wix-api/collections'
import { queryProducts } from '@/wix-api/products'

export default function Home() {
  return (
    <main className='mx-auto max-w-7xl space-y-10 px-5 py-10'>
      <section className='flex items-center bg-secondary md:h-96'>
        <div className='space-y-7 p-10 text-center md:w-1/2'>
          <h1 className='text-3xl font-bold md:text-4xl'>
            Lorem ipsum dolor sit amet.
          </h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae vel
            in similique? Consectetur, rem culpa?
          </p>
          <Button asChild>
            <Link href='/shop'>
              Shop Now <ArrowRightIcon className='ml-2 h-5 w-5' />
            </Link>
          </Button>
        </div>
        <div className='relative hidden h-full w-1/2 md:block'>
          <Image
            src={banner}
            alt='Modern Wearables banner'
            className='h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent' />
        </div>
      </section>
      <Suspense fallback={<LoadingSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  )
}

async function FeaturedProducts() {
  // await delay(1000)

  const collection = await getCollectionBySlug('featured-products')

  if (!collection?._id) return null

  const featuredProducts = await queryProducts({
    collectionIds: collection._id,
  })

  if (!featuredProducts.items.length) return null

  return (
    <section className='space-y-5'>
      <h2 className='text-2xl font-bold'>Featured Products</h2>
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {featuredProducts.items.map(product => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </section>
  )
}

function LoadingSkeleton() {
  return (
    <div className='grid gap-4 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className='h-[30rem] w-full rounded-none' />
      ))}
    </div>
  )
}
