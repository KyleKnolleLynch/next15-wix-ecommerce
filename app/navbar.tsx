import { getWixClient } from '@/lib/wix-client.base'
import Link from 'next/link'
import Logo from '@/assets/logo.png'
import Image from 'next/image'

async function getCart() {
  const wixClient = getWixClient()

  try {
    return await wixClient.currentCart.getCurrentCart()
  } catch (error) {
    if (
      (error as any).details.applicationError.code === 'OWNED_CART_NOT_FOUND'
    ) {
      return null
    } else {
      throw error
    }
  }
}

export default async function Navbar() {
  const cart = await getCart()

  const totalCartQuantity = cart?.lineItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0,
  ) || 0

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
        {totalCartQuantity} items in your cart
      </div>
    </header>
  )
}

// 2:39
