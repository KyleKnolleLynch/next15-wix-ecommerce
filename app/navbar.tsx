import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/assets/logo.png'
import { getCart } from '@/wix-api/cart'
import { getWixServerClient } from '@/lib/wix-client.server'
import ShoppingCartButton from './shopping-cart-button'
import UserButton from '@/components/user-button'
import { getLoggedInMember } from '@/wix-api/members'
import { getCollections } from '@/wix-api/collections'
import MainNavigation from './main-navigation'
import SearchField from '@/components/search-field'

export default async function Navbar() {
  const wixClient = getWixServerClient()
  const [cart, loggedInMember, collections] = await Promise.all([
    getCart(wixClient),
    getLoggedInMember(wixClient),
    getCollections(wixClient),
  ])

  const totalCartQuantity =
    cart?.lineItems.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0

  return (
    <header className='bg-background shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-2'>
        <div className='flex flex-wrap items-center gap-5'>
          <Link href='/' className='flex items-center gap-4'>
            <Image
              src={Logo}
              alt='Modern Wearables logo'
              width={40}
              height={40}
            />
            <span className='text-xl font-bold'>Modern Wearables</span>
          </Link>
          <MainNavigation collections={collections} />
        </div>
        <SearchField className='max-w-96' />
        <div className='flex items-center justify-center gap-5'>
          <UserButton loggedInMember={loggedInMember} />
          <ShoppingCartButton initialData={cart} />
        </div>
      </div>
    </header>
  )
}
