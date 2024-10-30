'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/cart'
import { currentCart } from '@wix/ecom'
import { ShoppingCartIcon } from 'lucide-react'
import { useState } from 'react'

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
    <div className='relative'>
      <Button size='icon' variant='ghost' onClick={() => setSheetOpen(true)}>
        <ShoppingCartIcon />
        <span className='absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-primary text-xs text-primary-foreground'>
          {totalCartQuantity < 10 ? totalCartQuantity : '9+'}
        </span>
      </Button>
    </div>
  )
}

