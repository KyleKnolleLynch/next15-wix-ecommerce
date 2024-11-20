import { products } from '@wix/stores'
import { ButtonProps } from './ui/button'
import { useBuyNow } from '@/hooks/checkout'
import LoadingButton from './loading-button'
import { CreditCardIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BuyNowButtonProps extends ButtonProps {
  product: products.Product
  quantity: number
  selectedOptions: Record<string, string>
}

export default function BuyNowButton({
  product,
  quantity,
  selectedOptions,
  className,
  ...props
}: BuyNowButtonProps) {
  const { startCheckoutFlow, pending } = useBuyNow()

  return (
    <LoadingButton
      onClick={() => startCheckoutFlow({ product, quantity, selectedOptions })}
      loading={pending}
      variant='secondary'
      className={cn('flex gap-3', className)}
      {...props}
    >
      <CreditCardIcon />
      Buy Now
    </LoadingButton>
  )
}
