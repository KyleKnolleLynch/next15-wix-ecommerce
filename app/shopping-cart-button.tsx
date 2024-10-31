'use client'

import { useState } from 'react'
import { currentCart } from '@wix/ecom'
import { Loader2, ShoppingCartIcon } from 'lucide-react'
import { useCart, useUpdateCartItemQuantity } from '@/hooks/cart'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import Link from 'next/link'
import WixImage from '@/components/wix-image'

interface ShoppingCartButtonProps {
  initialData: currentCart.Cart | null
}

export default function ShoppingCartButton({
  initialData,
}: ShoppingCartButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const cartQuery = useCart(initialData)

  const totalCartQuantity =
    cartQuery.data?.lineItems?.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0,
    ) || 0

  return (
    <>
      <div className='relative'>
        <Button size='icon' variant='ghost' onClick={() => setSheetOpen(true)}>
          <ShoppingCartIcon />
          <span className='absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-primary text-xs text-primary-foreground'>
            {totalCartQuantity < 10 ? totalCartQuantity : '9+'}
          </span>
        </Button>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className='flex flex-col sm:max-w-lg'>
          <SheetHeader>
            <SheetTitle>
              Your cart{' '}
              <span className='text-base'>
                ({totalCartQuantity}{' '}
                {totalCartQuantity === 1 ? 'item' : 'items'})
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className='flex grow flex-col space-y-5 overflow-y-auto'>
            <ul className='space-y-5'>
              {cartQuery.data?.lineItems?.map(item => (
                <ShoppingCartItem key={item._id} item={item} />
              ))}
            </ul>
            {cartQuery.isPending && (
              <Loader2 className='mx-auto animate-spin' />
            )}
            {cartQuery.error && (
              <p className='text-destructive'>{cartQuery.error.message}</p>
            )}
            {!cartQuery.isPending && !cartQuery.data?.lineItems?.length && (
              <div className='grid grow place-items-center text-center'>
                <div className='space-y-1.5'>
                  <p className='text-lg font-semibold'>Your cart is empty</p>
                  <Link
                    href='/shop'
                    className='text-primary hover:underline'
                    onClick={() => setSheetOpen(false)}
                  >
                    Start shopping
                  </Link>
                </div>
              </div>
            )}
            <pre>{JSON.stringify(cartQuery.data, null, 2)}</pre>
          </div>
          <div className='flex items-center justify-between gap-5'>
            <div className='space-y-0.5'>
              <p className='text-sm'>Subtotal</p>
              <p className='font-bold'>
                {/* @ts-expect-error */}
                {cartQuery.data?.subtotal?.formattedConvertedAmount}
              </p>
              <p className='text-xs text-muted-foreground'>
                Shipping and taxes calculated at checkout
              </p>
            </div>
            <Button
              size='lg'
              disabled={!totalCartQuantity || cartQuery.isFetching}
            >
              Checkout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

interface ShoppingCartItemProps {
  item: currentCart.LineItem
}

function ShoppingCartItem({ item }: ShoppingCartItemProps) {
  const updateQuantityMutation = useUpdateCartItemQuantity()

  const productId = item._id

  if (!productId) return null

  const slug = item.url?.split('/').pop()

  const quantityLimitReached =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity >= item.availability.quantityAvailable

  return (
    <li className='flex items-center gap-3'>
      <Link href={`/products/${slug}`}>
        <WixImage
          mediaIdentifier={item.image}
          width={110}
          height={110}
          alt={item.productName?.translated || 'Product image'}
          className='flex-none bg-secondary'
        />
      </Link>
      <div className='space-y-1.5 text-sm'>
        <Link href={`/products/${slug}`}>
          <p className='font-bold'>{item.productName?.translated || 'item'}</p>
        </Link>
        {!!item.descriptionLines?.length && (
          <p>
            {item.descriptionLines
              .map(
                line =>
                  line.colorInfo?.translated || line.plainText?.translated,
              )
              .join(', ')}
          </p>
        )}
        <div className='flex items-center gap-2'>
          {item.quantity} x {item.price?.formattedConvertedAmount}
          {item.fullPrice && item.fullPrice.amount !== item.price?.amount && (
            <span className='text-muted-foreground line-through'>
              {item.fullPrice.formattedConvertedAmount}
            </span>
          )}
        </div>
        <div className='flex items-center gap-1.5'>
          <Button
            variant='outline'
            size='sm'
            disabled={item.quantity === 1}
            onClick={() =>
              updateQuantityMutation.mutate({
                productId,
                newQuantity: !item.quantity ? 0 : item.quantity - 1,
              })
            }
          >
            -
          </Button>
          <span>{item.quantity}</span>
          <Button
            variant='outline'
            size='sm'
            disabled={quantityLimitReached}
            onClick={() =>
              updateQuantityMutation.mutate({
                productId,
                newQuantity: !item.quantity ? 1 : item.quantity + 1,
              })
            }
          >
            +
          </Button>
          {quantityLimitReached && <span>Quantity limit reached</span>}
        </div>
      </div>
    </li>
  )
}
