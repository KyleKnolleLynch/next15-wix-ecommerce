import { products } from '@wix/stores'
import { ButtonProps } from './ui/button'
import { addToCart } from '@/wix-api/cart'
import { wixBrowserClient } from '@/lib/wix.client.browser'
import LoadingButton from './loading-button'
import { useAddItemToCart } from '@/hooks/cart'
import { cn } from '@/lib/utils'
import { ShoppingCartIcon } from 'lucide-react'

interface AddToCartButtonProps extends ButtonProps {
  product: products.Product
  selectedOptions: Record<string, string>
  quantity: number
}

export default function AddToCartButton({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: AddToCartButtonProps) {
  const mutation = useAddItemToCart()

  return (
    <LoadingButton
      onClick={() =>
        mutation.mutate({
          product,
          selectedOptions,
          quantity,
        })
      }
      loading={mutation.isPending}
      className={cn('flex gap-3', className)}
      {...props}
    >
      Add to cart
      <ShoppingCartIcon className='size-5' />
    </LoadingButton>
  )
}
