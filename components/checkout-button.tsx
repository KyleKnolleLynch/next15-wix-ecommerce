import { useCartCheckout } from '@/hooks/checkout'
import { ButtonProps } from './ui/button'
import LoadingButton from './loading-button'

export default function CheckoutButton(props: ButtonProps) {
  const { startCheckoutFlow, pending } = useCartCheckout()
  return (
    <LoadingButton
      loading={pending}
      onClick={startCheckoutFlow}
      {...props}
    >Checkout</LoadingButton>
  )
}
