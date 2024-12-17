import { Suspense } from 'react'
import { products } from '@wix/stores'
import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/wix-api/products'
import ProductDetails from './product-details'
import { Metadata } from 'next'
import { delay } from '@/lib/utils'
import { getWixServerClient } from '@/lib/wix-client.server'
import Product from '@/components/product'
import { Skeleton } from '@/components/ui/skeleton'
import { getLoggedInMember } from '@/wix-api/members'
import CreateProductReviewButton from '@/components/reviews/create-product-review-button'
import ProductReviews, {
  ProductReviewsLoadingSkeleton,
} from './product-reviews'
import { getProductReviews } from '@/wix-api/reviews'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(getWixServerClient(), slug)

  if (!product?._id) notFound()

  const mainImage = product.media?.mainMedia?.image

  return {
    title: product.name,
    description: 'Buy this item on Modern Wearables',
    openGraph: {
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width,
              height: mainImage.height,
              alt: mainImage.altText || '',
            },
          ]
        : undefined,
    },
  }
}

export default async function ProductPage({ params: { slug } }: PageProps) {
  await delay(2000)
  const product = await getProductBySlug(getWixServerClient(), slug)

  if (!product?._id) notFound()

  return (
    <main className='mx-auto max-w-7xl space-y-10 px-5 py-10'>
      <ProductDetails product={product} />
      <hr />
      <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
        <RelatedProducts productId={product._id} />
      </Suspense>
      <hr />
      <div className='space-y-5'>
        <h2 className='text-2xl font-bold'>Buyer reviews</h2>
        <Suspense fallback={<ProductReviewsLoadingSkeleton />}>
          <ProductReviewsSection product={product} />
        </Suspense>
      </div>
    </main>
  )
}

interface RelatedProductsProps {
  productId: string
}

async function RelatedProducts({ productId }: RelatedProductsProps) {
  await delay(2000)

  const relatedProducts = await getRelatedProducts(
    getWixServerClient(),
    productId,
  )

  if (!relatedProducts.length) return null

  return (
    <div className='space-y-5'>
      <h2 className='text-2xl font-bold'>Related Products</h2>
      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {relatedProducts.map(product => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

function RelatedProductsLoadingSkeleton() {
  return (
    <div className='grid gap-5 pt-12 sm:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className='h-96 w-full' />
      ))}
    </div>
  )
}

interface ProductReviewsSectionProps {
  product: products.Product
}

async function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  if (!product._id) return null

  const wixClient = getWixServerClient()

  const loggedInMember = await getLoggedInMember(wixClient)

  const existingReview = loggedInMember?.contactId
    ? (await getProductReviews(wixClient, {
        contactId: loggedInMember.contactId,
        productId: product._id,
      })
    ).items[0]
    : null

  await delay(5000)

  return (
    <div className='space-y-5'>
      <CreateProductReviewButton
        product={product}
        loggedInMember={loggedInMember}
        hasExistingReview={!!existingReview}
      />
      <ProductReviews product={product} />
    </div>
  )
}
