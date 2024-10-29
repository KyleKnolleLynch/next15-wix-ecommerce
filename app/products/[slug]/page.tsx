import { getProductBySlug } from '@/wix-api/products'
import { notFound } from 'next/navigation'
import ProductDetails from './product-details'
import { Metadata } from 'next'
import { delay } from '@/lib/utils'
import { getWixServerClient } from '@/lib/wix-client.server'

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
    </main>
  )
}
