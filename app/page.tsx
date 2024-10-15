import Image from 'next/image'
import banner from '@/assets/banner.jpg'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRightIcon } from '@radix-ui/react-icons'

export default function Home() {
  return (
    <main className='mx-auto max-w-7xl space-y-10 px-5 py-10'>
      <div className='flex items-center bg-secondary md:h-96'>
        <div className='space-y-7 p-10 text-center md:w-1/2'>
          <h1 className='text-3xl font-bold md:text-4xl'>
            Lorem ipsum dolor sit amet.
          </h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae vel
            in similique? Consectetur, rem culpa?
          </p>
          <Button asChild>
            <Link href='/shop'>
              Shop Now <ArrowRightIcon className='ml-2 h-5 w-5' />
            </Link>
          </Button>
        </div>
        <div className='hidden h-full w-1/2 md:block'>
          <Image
            src={banner}
            alt='Modern Wearables banner'
            className='h-full object-cover'
          />
        </div>
      </div>
    </main>
  )
}

