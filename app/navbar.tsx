import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/assets/logo.png'
import { getCart } from '@/wix-api/cart'
import { getWixServerClient } from '@/lib/wix-client.server'
import ShoppingCartButton from './shopping-cart-button'

export default async function Navbar() {
  const cart = await getCart(getWixServerClient())

  const totalCartQuantity =
    cart?.lineItems.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0

  return (
    <header className='bg-background shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-2'>
        <Link href='/' className='flex items-center gap-4'>
          <Image
            src={Logo}
            alt='Modern Wearables logo'
            width={40}
            height={40}
          />
          <span className='text-xl font-bold'>Modern Wearables</span>
        </Link>
        <ShoppingCartButton initialData={cart} />
      </div>
    </header>
  )
}
