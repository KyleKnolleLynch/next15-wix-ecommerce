'use client'

import { products } from '@wix/stores'
import { useState } from 'react'
import { InfoIcon } from 'lucide-react'
import { checkInStock, findVariant } from '@/lib/utils'
import ProductOptions from './product-options'
import ProductPrice from './product-price'
import ProductMedia from './product-media'
import Badge from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import AddToCartButton from '@/components/add-to-cart-button'

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

  const availableQuantity =
    selectedVariant?.stock?.quantity ?? product.stock?.quantity

  const availableQuantityExceeded =
    !!availableQuantity && quantity > availableQuantity

  const selectedOptionsMedia = product.productOptions?.flatMap(option => {
    const selectedChoice = option.choices?.find(
      choice => choice.description === selectedOptions[option.name || ''],
    )

    return selectedChoice?.media?.items ?? []
  })

  return (
    <div className='flex flex-col gap-10 md:flex-row lg:gap-20'>
      <ProductMedia
        media={
          !!selectedOptionsMedia?.length
            ? selectedOptionsMedia
            : product.media?.items
        }
      />
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
        <div className='5 space-y-1'>
          <Label htmlFor='quantity'>Quantity</Label>
          <div className='flex items-center gap-2.5'>
            <Input
              name='quantity'
              type='number'
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className='w-24'
              disabled={!inStock}
            />
            {!!availableQuantity &&
              (availableQuantityExceeded || availableQuantity < 10) && (
                <span className='text-destructive'>
                  Only {availableQuantity} left in stock
                </span>
              )}
          </div>
        </div>
        {inStock ? (
          <AddToCartButton
            product={product}
            selectedOptions={selectedOptions}
            quantity={quantity}
            disabled={availableQuantityExceeded || quantity < 1}
            className='w-full font-bold'
          />
        ) : (
          <span>Out of stock</span>
        )}
        {!!product.additionalInfoSections?.length && (
          <div className='space-y-1.5 text-sm text-muted-foreground'>
            <span className='flex items-center gap-2'>
              <InfoIcon className='size-5' />
              <span>Additional product information</span>
            </span>
            <Accordion type='multiple'>
              {product.additionalInfoSections.map(section => (
                <AccordionItem key={section.title} value={section.title || ''}>
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  <AccordionContent>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: section.description || '',
                      }}
                      className='prose text-sm text-muted-foreground dark:prose-invert'
                    ></div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  )
}
