'use client'

import { products } from '@wix/stores'
import Badge from '@/components/ui/badge'
import WixImage from '@/components/wix-image'
import ProductOptions from './product-options'
import { useState } from 'react'
import { checkInStock, findVariant } from '@/lib/utils'
import ProductPrice from './product-price'

interface ProductDetailsProps {
  product: products.Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(
    product.productOptions
      ?.map(option => ({
        [option.name || '']: option.choices?.[0].description || '',
      }))
      .reduce((acc, cur) => ({ ...acc, ...cur }), {}) || {},
  )

  const selectedVariant = findVariant(product, selectedOptions)

  const inStock = checkInStock(product, selectedOptions)

  return (
    <div className='flex flex-col gap-10 md:flex-row lg:gap-20'>
      <div className='basis-2/5'>
        <WixImage
          mediaIdentifier={product.media?.mainMedia?.image?.url}
          alt={product.media?.mainMedia?.image?.altText}
          width={1000}
          height={1000}
          className='sticky top-0'
        />
      </div>
      <div className='basis-3/5 space-y-5'>
        <div className='space-y-2.5'>
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          {product.brand && (
            <div className='text-muted-foreground'>{product.brand}</div>
          )}
          {product.ribbon && <Badge className='block'>{product.ribbon}</Badge>}
        </div>
        {product.description && (
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className='prose dark:prose-invert'
          />
        )}
        <ProductPrice product={product} selectedVariant={selectedVariant} />
        <ProductOptions
          product={product}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <div>
          Selected Options:
          {JSON.stringify(selectedOptions)}
        </div>
        <div>
          Variant:
          {JSON.stringify(selectedVariant?.choices)}
        </div>
      </div>
    </div>
  )
}

// 3:43:44